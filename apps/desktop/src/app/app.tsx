import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@goli/ui/components/sidebar";
import { AppSidebar, type Page } from "../components/app-sidebar";
import { Notice } from "../components/notice";
import { useAppearance } from "./use-appearance";
import { AnalyticsPage } from "../features/analytics/analytics-page";
import { LinkManager } from "../features/links/link-manager";
import { useLinks } from "../features/links/use-links";
import { SettingsPage } from "../features/settings/settings-page";
import { useSystem } from "../features/system/use-system";
import { useUpdates } from "../features/system/use-updates";

export function App() {
  const [notice, setNotice] = useState<string | null>(null);
  const [page, setPage] = useState<Page>("links");
  const links = useLinks(setNotice);
  const system = useSystem(setNotice);
  const updates = useUpdates(setNotice);
  const { appearance, setAppearance } = useAppearance();

  const exportLinks = async () => {
    try { await window.goliBridge.links.export(); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not export shortcuts."); }
  };

  const importLinks = async () => {
    try { await window.goliBridge.links.import(); await links.refresh(); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not import shortcuts."); }
  };

  return (
    <SidebarProvider className="bg-background text-foreground">
      <AppSidebar activePage={page} onNavigate={setPage} appVersion={system.status?.appVersion} updates={updates.updates} />
      <SidebarInset className="min-w-0">
        <div className="drag-region h-12" />
        <div className="px-6 pb-8 sm:px-10">
          {notice && <Notice message={notice} />}
          {page === "links" && <LinkManager links={links} />}
          {page === "analytics" && <AnalyticsPage links={links.links} />}
          {page === "settings" && <SettingsPage appearance={appearance} onAppearanceChange={setAppearance} onImport={importLinks} onExport={exportLinks} system={system} updates={updates} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
