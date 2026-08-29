import { createHash } from "node:crypto";
import { expect, test } from "bun:test";
import { createUpdates, isNewer, manifestUrlFor, parseManifest, scheduleUpdatePolling } from "./updates";

test("compares semver-like internal release versions", () => {
  expect(isNewer("0.2.0", "0.1.9")).toBe(true);
  expect(isNewer("0.1.0", "0.1.0")).toBe(false);
  expect(isNewer("0.1.0", "0.2.0")).toBe(false);
  expect(isNewer("0.1.0-preview.2", "0.1.0-preview.1")).toBe(true);
  expect(isNewer("0.1.0", "0.1.0-preview.2")).toBe(true);
});

test("uses the stable GitHub release manifest", () => {
  expect(manifestUrlFor("akhilwaghmare/goli")).toBe("https://github.com/akhilwaghmare/goli/releases/latest/download/goli-update.json");
  expect(manifestUrlFor("not a repository")).toBeNull();
});

test("rejects malformed update manifests", () => {
  expect(parseManifest({ version: "0.2.0", packageUrl: "https://example.com/Goli.pkg", sha256: "a".repeat(64), notesUrl: "https://example.com/notes" })).not.toBeNull();
  expect(parseManifest({ version: "nope", packageUrl: "https://example.com/Goli.pkg", sha256: "a".repeat(64), notesUrl: "https://example.com/notes" })).toBeNull();
  expect(parseManifest({ version: "0.2.0", packageUrl: "http://example.com/Goli.pkg", sha256: "a".repeat(64), notesUrl: "https://example.com/notes" })).toBeNull();
});

test("treats a missing latest release as no update", async () => {
  const updates = createUpdates("https://example.com/goli-update.json", async () => new Response("Not Found", { status: 404 }));
  expect(await updates.checkForUpdate("0.1.0")).toEqual({ status: "idle" });
});

test("checks, downloads, and verifies an available package", async () => {
  const packageBytes = "goli package";
  const checksum = createHash("sha256").update(packageBytes).digest("hex");
  const updates = createUpdates("https://example.com/goli-update.json", async (url) => url.endsWith(".json")
    ? new Response(JSON.stringify({ version: "0.2.0", packageUrl: "https://example.com/goli.pkg", sha256: checksum, notesUrl: "https://example.com/releases/0.2.0" }))
    : new Response(packageBytes, { headers: { "content-length": String(packageBytes.length) } }));
  expect(await updates.checkForUpdate("0.1.0")).toMatchObject({ status: "available", version: "0.2.0" });
  expect(await updates.downloadUpdate()).toMatchObject({ status: "verified", version: "0.2.0" });
});

test("reports checksum failures and blocks download before a check", async () => {
  const updates = createUpdates("https://example.com/goli-update.json", async (url) => url.endsWith(".json")
    ? new Response(JSON.stringify({ version: "0.2.0", packageUrl: "https://example.com/goli.pkg", sha256: "a".repeat(64), notesUrl: "https://example.com/releases/0.2.0" }))
    : new Response("unexpected package"));
  expect(await updates.downloadUpdate()).toMatchObject({ status: "error", message: "Check for an update before downloading." });
  await updates.checkForUpdate("0.1.0");
  expect(await updates.downloadUpdate()).toMatchObject({ status: "error", message: "Update package checksum did not match the release manifest." });
});

test("schedules and cancels startup and periodic checks", () => {
  let startup: (() => void) | undefined;
  let poll: (() => void) | undefined;
  let cleared = 0;
  const timers = {
    setTimeout: (callback: () => void) => { startup = callback; return 1 as unknown as ReturnType<typeof setTimeout>; },
    clearTimeout: () => { cleared += 1; },
    setInterval: (callback: () => void) => { poll = callback; return 2 as unknown as ReturnType<typeof setInterval>; },
    clearInterval: () => { cleared += 1; },
  };
  const checked: string[] = [];
  const stop = scheduleUpdatePolling((version) => { checked.push(version); }, () => "0.1.0", timers);
  startup?.(); poll?.(); stop();
  expect(checked).toEqual(["0.1.0", "0.1.0"]);
  expect(cleared).toBe(2);
});
