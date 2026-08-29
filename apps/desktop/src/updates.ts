import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { UpdateState } from "./shared/contracts";

export type Manifest = { version: string; packageUrl: string; sha256: string; notesUrl: string };
type FetchFn = (input: string) => Promise<Response>;
type Timers = Pick<typeof globalThis, "setTimeout" | "clearTimeout" | "setInterval" | "clearInterval">;

// Replaced by Vite when packaging. A local development build deliberately has no feed.
declare const __GOLI_UPDATE_REPOSITORY__: string;
const updateRepository = typeof __GOLI_UPDATE_REPOSITORY__ === "string" ? __GOLI_UPDATE_REPOSITORY__ : "";
const startupDelayMs = 15_000;
const pollIntervalMs = 4 * 60_000;

type ParsedVersion = { core: number[]; prerelease: string[] | null };
function parseVersion(version: string): ParsedVersion | null {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) return null;
  return { core: [Number(match[1]), Number(match[2]), Number(match[3])], prerelease: match[4]?.split(".") ?? null };
}
export function isNewer(candidate: string, current: string): boolean {
  const next = parseVersion(candidate); const installed = parseVersion(current);
  if (!next || !installed) return false;
  for (let index = 0; index < next.core.length; index += 1) {
    if (next.core[index] !== installed.core[index]) return next.core[index]! > installed.core[index]!;
  }
  if (!next.prerelease || !installed.prerelease) return !next.prerelease && Boolean(installed.prerelease);
  for (let index = 0; index < Math.max(next.prerelease.length, installed.prerelease.length); index += 1) {
    const candidatePart = next.prerelease[index]; const currentPart = installed.prerelease[index];
    if (candidatePart === undefined || currentPart === undefined) return candidatePart !== undefined;
    if (candidatePart === currentPart) continue;
    const candidateNumber = /^\d+$/.test(candidatePart); const currentNumber = /^\d+$/.test(currentPart);
    if (candidateNumber && currentNumber) return Number(candidatePart) > Number(currentPart);
    if (candidateNumber !== currentNumber) return !candidateNumber;
    return candidatePart > currentPart;
  }
  return false;
}

export function manifestUrlFor(repository: string): string | null {
  return /^[\w.-]+\/[\w.-]+$/.test(repository)
    ? `https://github.com/${repository}/releases/latest/download/goli-update.json`
    : null;
}

function isHttpsUrl(value: string): boolean {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function parseManifest(input: unknown): Manifest | null {
  if (!input || typeof input !== "object") return null;
  const manifest = input as Partial<Manifest>;
  if (
    typeof manifest.version !== "string" || !/^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version)
    || typeof manifest.packageUrl !== "string" || !isHttpsUrl(manifest.packageUrl)
    || typeof manifest.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(manifest.sha256)
    || typeof manifest.notesUrl !== "string" || !isHttpsUrl(manifest.notesUrl)
  ) return null;
  return manifest as Manifest;
}

export function createUpdates(manifestUrl: string | null, fetchFn: FetchFn = (input) => fetch(input), onStateChange: (next: UpdateState) => void = () => {}) {
  let state: UpdateState = manifestUrl ? { status: "idle" } : { status: "disabled", message: "No stable update feed is configured." };
  let available: Manifest | null = null;

  const updateState = (): UpdateState => state;
  const setState = (next: UpdateState): UpdateState => { state = next; onStateChange(state); return state; };
  const checkForUpdate = async (currentVersion: string): Promise<UpdateState> => {
    if (!manifestUrl || state.status === "downloading" || state.status === "checking") return state;
    available = null;
    setState({ status: "checking" });
    try {
      const response = await fetchFn(manifestUrl);
      if (response.status === 404) {
        setState({ status: "idle" });
        return state;
      }
      if (!response.ok) throw new Error(`Update feed returned ${response.status}.`);
      const manifest = parseManifest(await response.json());
      if (!manifest) throw new Error("Update feed is invalid.");
      available = manifest;
      setState(isNewer(manifest.version, currentVersion) ? { status: "available", version: manifest.version, notesUrl: manifest.notesUrl } : { status: "idle" });
    } catch (error) { setState({ status: "error", message: error instanceof Error ? error.message : "Unable to check for updates." }); }
    return state;
  };
  const downloadUpdate = async (): Promise<UpdateState> => {
    if (!available || state.status !== "available") return setState({ status: "error", message: "Check for an update before downloading." });
    try {
      const response = await fetchFn(available.packageUrl);
      if (!response.ok || !response.body) throw new Error("Could not download the update package.");
      const length = Number(response.headers.get("content-length") ?? 0);
      let received = 0;
      const stream = response.body.pipeThrough(new TransformStream({ transform(chunk, controller) { received += chunk.byteLength; setState({ status: "downloading", version: available!.version, percent: length ? Math.min(100, Math.round(received / length * 100)) : 0 }); controller.enqueue(chunk); } }));
      const directory = join(tmpdir(), "goli-updates"); await mkdir(directory, { recursive: true });
      const packagePath = join(directory, `goli-${available.version}.pkg`);
      await pipeline(Readable.fromWeb(stream as never), createWriteStream(packagePath));
      const digest = createHash("sha256").update(await readFile(packagePath)).digest("hex");
      if (digest !== available.sha256.toLowerCase()) throw new Error("Update package checksum did not match the release manifest.");
      setState({ status: "verified", version: available.version, packagePath });
    } catch (error) { setState({ status: "error", message: error instanceof Error ? error.message : "Unable to download update." }); }
    return state;
  };
  const handoffUpdate = (): UpdateState => state.status === "verified"
    ? setState({ status: "handoff", version: state.version })
    : state;
  const reportUpdateError = (message: string): UpdateState => setState({ status: "error", message });
  return { updateState, checkForUpdate, downloadUpdate, handoffUpdate, reportUpdateError };
}

const listeners = new Set<(state: UpdateState) => void>();
const updates = createUpdates(manifestUrlFor(updateRepository), undefined, (state) => { for (const listener of listeners) listener(state); });
export const updateState = updates.updateState;
export const checkForUpdate = updates.checkForUpdate;
export const downloadUpdate = updates.downloadUpdate;
export const handoffUpdate = updates.handoffUpdate;
export const reportUpdateError = updates.reportUpdateError;
export function subscribeUpdates(listener: (state: UpdateState) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function scheduleUpdatePolling(check: (version: string) => Promise<UpdateState> | void, currentVersion: () => string, timers: Timers = globalThis): () => void {
  const initialCheck = timers.setTimeout(() => { void check(currentVersion()); }, startupDelayMs);
  const poll = timers.setInterval(() => { void check(currentVersion()); }, pollIntervalMs);
  return () => { timers.clearTimeout(initialCheck); timers.clearInterval(poll); };
}

export function startUpdatePolling(currentVersion: () => string, timers: Timers = globalThis): () => void {
  return scheduleUpdatePolling(checkForUpdate, currentVersion, timers);
}
