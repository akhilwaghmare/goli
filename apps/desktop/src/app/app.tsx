import { useState } from "react";
import { AppHeader } from "../components/app-header";
import { Notice } from "../components/notice";
import { LinkManager } from "../features/links/link-manager";
import { SystemPanel } from "../features/system/system-panel";

export function App() {
  const [notice, setNotice] = useState<string | null>(null);
  const [linkRefreshKey, setLinkRefreshKey] = useState(0);

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-5 py-7 text-foreground sm:px-9 sm:py-9">
      <AppHeader onImport={() => setLinkRefreshKey((key) => key + 1)} onNotice={setNotice} />
      {notice && <Notice message={notice} />}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20.625rem]">
        <LinkManager onNotice={setNotice} refreshKey={linkRefreshKey} />
        <SystemPanel onNotice={setNotice} />
      </div>
    </main>
  );
}
