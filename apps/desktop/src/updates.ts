import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import type { UpdateState } from "./shared/contracts";

type Manifest = { version: string; packageUrl: string; sha256: string; notesUrl: string };

const manifestUrl = process.env.GOLI_UPDATE_MANIFEST_URL;
let state: UpdateState = manifestUrl ? { status: "idle" } : { status: "disabled", message: "No internal update feed is configured." };
let available: Manifest | null = null;

function versionParts(version: string): number[] { return version.replace(/^v/, "").split(/[.-]/).map((part) => Number(part) || 0); }
export function isNewer(candidate: string, current: string): boolean {
  const next = versionParts(candidate); const installed = versionParts(current);
  for (let index = 0; index < Math.max(next.length, installed.length); index += 1) {
    const candidatePart = next[index] ?? 0; const currentPart = installed[index] ?? 0;
    if (candidatePart !== currentPart) return candidatePart > currentPart;
  }
  return false;
}

export function updateState(): UpdateState { return state; }

export async function checkForUpdate(currentVersion: string): Promise<UpdateState> {
  if (!manifestUrl) return state;
  state = { status: "checking" };
  try {
    const response = await fetch(manifestUrl);
    const manifest = await response.json() as Manifest;
    if (!response.ok || !manifest.version || !manifest.packageUrl || !/^[a-f0-9]{64}$/i.test(manifest.sha256) || !manifest.notesUrl) throw new Error("Update feed is invalid.");
    available = manifest;
    state = isNewer(manifest.version, currentVersion) ? { status: "available", version: manifest.version, notesUrl: manifest.notesUrl } : { status: "idle" };
  } catch (error) { state = { status: "error", message: error instanceof Error ? error.message : "Unable to check for updates." }; }
  return state;
}

export async function downloadUpdate(): Promise<UpdateState> {
  if (!available) return state = { status: "error", message: "Check for an update before downloading." };
  try {
    const response = await fetch(available.packageUrl);
    if (!response.ok || !response.body) throw new Error("Could not download the update package.");
    const length = Number(response.headers.get("content-length") ?? 0);
    let received = 0;
    const stream = response.body.pipeThrough(new TransformStream({ transform(chunk, controller) { received += chunk.byteLength; state = { status: "downloading", version: available!.version, percent: length ? Math.round(received / length * 100) : 0 }; controller.enqueue(chunk); } }));
    const directory = join(tmpdir(), "goli-updates"); await mkdir(directory, { recursive: true });
    const packagePath = join(directory, `goli-${available.version}.pkg`);
    await pipeline(Readable.fromWeb(stream as never), createWriteStream(packagePath));
    const digest = createHash("sha256").update(await readFile(packagePath)).digest("hex");
    if (digest !== available.sha256.toLowerCase()) throw new Error("Update package checksum did not match the release manifest.");
    state = { status: "verified", version: available.version, packagePath };
  } catch (error) { state = { status: "error", message: error instanceof Error ? error.message : "Unable to download update." }; }
  return state;
}
