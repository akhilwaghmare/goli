import { useEffect, useState } from "react";
import type { MaintenanceAction, SystemStatus } from "../../shared/contracts";

export function useSystem(onNotice: (message: string | null) => void) {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  const refresh = async () => {
    try {
      setStatus(await window.goliBridge.system.status());
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not load system status.");
    }
  };

  useEffect(() => { void refresh(); }, []);

  const run = async (action: MaintenanceAction) => {
    if (action.startsWith("uninstall") && !confirm("This removes Goli's system integration. Continue?")) return;
    try {
      onNotice(await window.goliBridge.system.run(action));
      await refresh();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "System action failed.");
    }
  };

  const exportThenDelete = async () => {
    try {
      if (await window.goliBridge.links.export()) await run("uninstall-delete");
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not export shortcuts.");
    }
  };

  return { exportThenDelete, run, status };
}
