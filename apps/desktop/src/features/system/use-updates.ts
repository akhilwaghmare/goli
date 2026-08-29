import { useEffect, useState } from "react";
import type { UpdateState } from "../../shared/contracts";

export type UpdateController = ReturnType<typeof useUpdates>;

export function useUpdates(onNotice: (message: string | null) => void) {
  const [updates, setUpdates] = useState<UpdateState>({ status: "idle" });

  useEffect(() => {
    void window.goliBridge.updates.state().then(setUpdates).catch((error: unknown) => onNotice(error instanceof Error ? error.message : "Could not load update status."));
  }, []);

  const check = async () => {
    try { setUpdates(await window.goliBridge.updates.check()); }
    catch (error) { onNotice(error instanceof Error ? error.message : "Could not check for updates."); }
  };

  const download = async () => {
    try { setUpdates(await window.goliBridge.updates.download()); }
    catch (error) { onNotice(error instanceof Error ? error.message : "Could not download update."); }
  };

  return { check, download, updates };
}
