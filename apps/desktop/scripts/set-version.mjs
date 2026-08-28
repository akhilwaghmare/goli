import { readFile, writeFile } from "node:fs/promises";

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? "")) throw new Error("Expected a semver version.");
const path = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(await readFile(path, "utf8"));
pkg.version = version;
await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`);
