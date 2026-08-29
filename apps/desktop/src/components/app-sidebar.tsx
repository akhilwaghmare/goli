import { BarChart3, Download, Link as LinkIcon, Settings } from "lucide-react";
import type { UpdateState } from "../shared/contracts";

export type Page = "links" | "analytics" | "settings";

const navigation = [
  { id: "links" as const, label: "Links", icon: LinkIcon },
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

function updateLabel(update: UpdateState) {
  if (update.status === "available") return `Update ${update.version} available`;
  if (update.status === "downloading") return `Downloading ${update.percent}%`;
  if (update.status === "verified") return `Update ${update.version} ready`;
  if (update.status === "handoff") return "Update opened";
  if (update.status === "disabled" || update.status === "error") return update.message;
  return "Up to date";
}

export function AppSidebar({ activePage, appVersion, onNavigate, updates }: { activePage: Page; appVersion: string | undefined; onNavigate(page: Page): void; updates: UpdateState }) {
  return (
    <aside className="drag-region flex min-h-screen w-60 shrink-0 flex-col border-r bg-muted/30 px-3 pt-14 pb-4">
      <div className="px-3 pb-8"><p className="text-lg font-semibold tracking-tight">Goli</p></div>
      <nav className="no-drag space-y-1" aria-label="Main navigation">
        {navigation.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => onNavigate(id)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activePage === id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}><Icon className="size-4" />{label}</button>)}
      </nav>
      <button type="button" onClick={() => onNavigate("settings")} className="no-drag mt-auto w-full rounded-lg border bg-background p-3 text-left shadow-sm transition-colors hover:bg-accent">
        <span className="flex items-center gap-2 text-sm font-medium"><Download className="size-4" />Updates</span>
        <span className="mt-2 block truncate text-xs text-muted-foreground">{updateLabel(updates)}</span>
        <span className="mt-1 block text-xs text-muted-foreground">Goli {appVersion ?? "…"}</span>
      </button>
    </aside>
  );
}
