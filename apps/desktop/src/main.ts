import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { serviceApi } from "./api";
import { checkForUpdate, downloadUpdate, updateState } from "./updates";
import { validateDestinationUrl, validateLinkID, validateLinkInput, validateMaintenanceAction } from "./shared/validation";
import type { MaintenanceAction, SystemStatus } from "./shared/contracts";

const execFileAsync = promisify(execFile);
let window: BrowserWindow | null = null;
const maintenancePath = "/usr/local/libexec/goli/goli-maintenance";

function createWindow() {
  if (window) return window.show();
  window = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 880,
    minHeight: 600,
    ...(process.platform === "darwin" ? { titleBarStyle: "hiddenInset" as const, trafficLightPosition: { x: 16, y: 18 } } : {}),
    webPreferences: { preload: join(__dirname, "preload.cjs"), contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  const devUrl = process.env.GOLI_DEV_SERVER_URL;
  if (devUrl) void window.loadURL(devUrl); else void window.loadFile(join(__dirname, "../dist/index.html"));
  window.on("closed", () => { window = null; });
}

function authorize(command: string): Promise<string> {
  const script = `do shell script ${JSON.stringify(`${maintenancePath} ${command}`)} with administrator privileges`;
  return execFileAsync("/usr/bin/osascript", ["-e", script]).then(({ stdout }) => stdout);
}

async function systemStatus(): Promise<SystemStatus> {
  try {
    const health = await serviceApi.health();
    const { stdout } = await execFileAsync(maintenancePath, ["status"]);
    const maintenance = JSON.parse(stdout) as Omit<SystemStatus, "certificates" | "serviceVersion" | "appVersion">;
    // A successful Electron request verifies go.li against macOS's trust store.
    // The certificate files themselves are root-only and cannot be checked here.
    return { ...maintenance, certificates: "valid", serviceVersion: health.version, appVersion: app.getVersion() };
  } catch {
    return { service: "unknown", hostname: "missing", certificates: "missing", ports: "conflict", serviceVersion: null, appVersion: app.getVersion(), logs: ["Goli service is unavailable. Use Repair after checking for port or hostname conflicts."] };
  }
}

if (!app.requestSingleInstanceLock()) app.quit();
app.on("second-instance", () => createWindow());
app.on("open-url", (event) => { event.preventDefault(); createWindow(); });
app.whenReady().then(() => {
  app.setAsDefaultProtocolClient("goli");
  createWindow();
  ipcMain.handle("links:list", () => serviceApi.list());
  ipcMain.handle("links:create", (_event, input) => serviceApi.create(validateLinkInput(input)));
  ipcMain.handle("links:update", (_event, id, input) => serviceApi.update(validateLinkID(id), validateLinkInput(input)));
  ipcMain.handle("links:remove", (_event, id) => serviceApi.remove(validateLinkID(id)));
  ipcMain.handle("links:open-destination", (_event, destinationUrl) => shell.openExternal(validateDestinationUrl(destinationUrl)));
  ipcMain.handle("links:export", async () => { const result = await dialog.showSaveDialog({ defaultPath: "goli-export.json" }); if (result.canceled || !result.filePath) return false; await writeFile(result.filePath, JSON.stringify(await serviceApi.export(), null, 2)); return true; });
  ipcMain.handle("links:import", async () => { const result = await dialog.showOpenDialog({ properties: ["openFile"], filters: [{ name: "Goli exports", extensions: ["json"] }] }); if (!result.canceled && result.filePaths[0]) await serviceApi.import(JSON.parse(await readFile(result.filePaths[0], "utf8"))); });
  ipcMain.handle("system:status", systemStatus);
  ipcMain.handle("system:run", async (_event, requested) => { const action = validateMaintenanceAction(requested) as MaintenanceAction; return authorize(action); });
  ipcMain.handle("updates:state", updateState);
  ipcMain.handle("updates:check", () => checkForUpdate(app.getVersion()));
  ipcMain.handle("updates:download", async () => { const state = await downloadUpdate(); if (state.status === "verified") { await shell.openPath(state.packagePath); return { status: "handoff", version: state.version }; } return state; });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
