import { BarChart3, Download, Link as LinkIcon, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@go-links/ui/components/sidebar";
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
    <Sidebar className="drag-region">
      <SidebarHeader className="px-5 pt-14 pb-8">
        <p className="text-lg font-semibold tracking-tight">Goli</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="no-drag" aria-label="Main navigation">
            {navigation.map(({ id, label, icon: Icon }) => (
              <SidebarMenuItem key={id}>
                <SidebarMenuButton isActive={activePage === id} onClick={() => onNavigate(id)} tooltip={label}>
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <button type="button" onClick={() => onNavigate("settings")} className="no-drag w-full rounded-lg border bg-background p-3 text-left shadow-sm transition-colors hover:bg-sidebar-accent">
          <span className="flex items-center gap-2 text-sm font-medium"><Download className="size-4" />Updates</span>
          <span className="mt-2 block truncate text-xs text-muted-foreground">{updateLabel(updates)}</span>
          <span className="mt-1 block text-xs text-muted-foreground">Goli {appVersion ?? "…"}</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
