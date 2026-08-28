import { contextBridge, ipcRenderer } from "electron";
import type { GoliBridge, LinkInput, MaintenanceAction } from "./shared/contracts";

const bridge: GoliBridge = {
  links: {
    list: () => ipcRenderer.invoke("links:list"),
    create: (input: LinkInput) => ipcRenderer.invoke("links:create", input),
    update: (id: string, input: LinkInput) => ipcRenderer.invoke("links:update", id, input),
    remove: (id: string) => ipcRenderer.invoke("links:remove", id),
    export: () => ipcRenderer.invoke("links:export"),
    import: () => ipcRenderer.invoke("links:import"),
  },
  system: { status: () => ipcRenderer.invoke("system:status"), run: (action: MaintenanceAction) => ipcRenderer.invoke("system:run", action) },
  updates: { state: () => ipcRenderer.invoke("updates:state"), check: () => ipcRenderer.invoke("updates:check"), download: () => ipcRenderer.invoke("updates:download") },
};

contextBridge.exposeInMainWorld("goliBridge", bridge);
