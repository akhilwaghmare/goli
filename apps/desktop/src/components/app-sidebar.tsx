import { BarChart3, CircleAlert, Download, ExternalLink, Link as LinkIcon, RefreshCw, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@goli/ui/components/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@goli/ui/components/tooltip";
import type { UpdateController } from "../features/system/use-updates";

export type Page = "links" | "analytics" | "settings";

const navigation = [
  { id: "links" as const, label: "Links", icon: LinkIcon },
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
];

export function AppSidebar({ activePage, onNavigate, updates }: { activePage: Page; onNavigate(page: Page): void; updates: UpdateController }) {
  const update = updates.updates;
  const isBusy = update.status === "checking" || update.status === "downloading";
  const icon = update.status === "available" || update.status === "downloading" ? Download
    : update.status === "handoff" ? ExternalLink
      : update.status === "error" || update.status === "disabled" ? CircleAlert
        : RefreshCw;
  const tooltip = update.status === "available" ? `Download Goli ${update.version}`
    : update.status === "downloading" ? `Downloading Goli ${update.percent}%`
      : update.status === "checking" ? "Checking for updates…"
        : update.status === "handoff" ? "Installer opened"
          : update.status === "error" || update.status === "disabled" ? update.message
            : "Check for updates";
  const Icon = icon;
  const handleUpdate = () => {
    if (isBusy) return;
    if (update.status === "available") { void updates.download(); return; }
    if (update.status === "handoff" || update.status === "disabled" || update.status === "error") { onNavigate("settings"); return; }
    void updates.check();
  };
  return (
    <TooltipProvider>
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
        <div className="flex items-center justify-between gap-1">
          <button type="button" onClick={() => onNavigate("settings")} className={`no-drag inline-flex h-8 items-center gap-2 rounded-md px-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-foreground ${activePage === "settings" ? "bg-sidebar-accent text-foreground" : "text-muted-foreground"}`}><Settings className="size-4" />Settings</button>
          <Tooltip>
            <TooltipTrigger asChild><button type="button" aria-label={tooltip} disabled={isBusy} onClick={handleUpdate} className="no-drag inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground disabled:opacity-60"><Icon className={`size-4 ${isBusy ? "animate-spin" : ""}`} /></button></TooltipTrigger>
            <TooltipContent side="top">{tooltip}</TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
    </TooltipProvider>
  );
}
