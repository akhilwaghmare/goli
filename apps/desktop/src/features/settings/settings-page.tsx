import { Download, HardDrive, MonitorCog, Moon, RotateCcw, ShieldAlert, Sun, Upload } from "lucide-react";
import { Button } from "@go-links/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@go-links/ui/components/card";
import { Separator } from "@go-links/ui/components/separator";
import type { Appearance } from "../../app/appearance";
import { PageShell } from "../../components/page-shell";
import type { SystemController } from "../system/use-system";
import type { UpdateController } from "../system/use-updates";

type SettingsPageProps = {
  appearance: Appearance;
  onAppearanceChange(appearance: Appearance): void;
  onImport(): Promise<void>;
  onExport(): Promise<void>;
  system: SystemController;
  updates: UpdateController;
};

const appearances = [{ value: "light", label: "Light", icon: Sun }, { value: "dark", label: "Dark", icon: Moon }, { value: "system", label: "System", icon: MonitorCog }] as const;

export function SettingsPage({ appearance, onAppearanceChange, onImport, onExport, system, updates }: SettingsPageProps) {
  const { status } = system;
  const { updates: update } = updates;
  return (
    <PageShell title="Settings">
      <Card><CardHeader><CardTitle>Appearance</CardTitle></CardHeader><CardContent><div className="grid gap-2 sm:grid-cols-3">{appearances.map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={() => onAppearanceChange(value)} className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm font-medium transition-colors ${appearance === value ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}><Icon className="size-4" />{label}</button>)}</div></CardContent></Card>

      <Card><CardHeader><CardTitle>Data</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => void onExport()}><Download />Export shortcuts</Button><Button variant="secondary" onClick={() => void onImport()}><Upload />Import shortcuts</Button></CardContent></Card>

      <Card><CardHeader><CardTitle>System</CardTitle></CardHeader><CardContent className="space-y-5">{status ? <><dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm"><dt className="font-medium">Service</dt><dd>{status.service}</dd><dt className="font-medium">Version</dt><dd>{status.serviceVersion ?? "unavailable"}</dd><dt className="font-medium">Hostname</dt><dd>{status.hostname}</dd><dt className="font-medium">Certificates</dt><dd>{status.certificates}</dd><dt className="font-medium">Ports</dt><dd>{status.ports}</dd></dl><div className="flex flex-wrap gap-2"><Button onClick={() => void system.run("restart")}><RotateCcw />Restart service</Button><Button variant="secondary" onClick={() => void system.run("repair")}><HardDrive />Repair Goli</Button><Button variant="secondary" onClick={() => void system.run("reset-certificates")}>Reset certificates</Button></div><details className="text-sm"><summary className="cursor-pointer font-medium">Recent logs</summary><pre className="mt-3 max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs whitespace-pre-wrap">{status.logs.join("\n") || "No logs available."}</pre></details></> : <p className="text-sm text-muted-foreground">Checking Goli…</p>}</CardContent></Card>

      <Card><CardHeader><CardTitle>Updates</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-sm text-muted-foreground">{update.status === "disabled" || update.status === "error" ? update.message : update.status}</p>{update.status === "available" && <><p className="text-sm">Goli {update.version} is ready.</p><Button onClick={() => void updates.download()}>Download update</Button></>}{update.status === "downloading" && <p className="text-sm">Downloading {update.percent}%…</p>}{update.status === "verified" && <p className="text-sm">Package verified.</p>}{update.status !== "downloading" && <Button variant="secondary" onClick={() => void updates.check()}>Check for updates</Button>}</CardContent></Card>

      <Card className="border-destructive/40"><CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="size-5" />Uninstall</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Choose what happens to your shortcuts when removing Goli.</p><Separator /><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => void system.run("uninstall-keep")}>Keep local data</Button><Button variant="secondary" onClick={() => void system.exportThenDelete()}>Export then delete</Button><Button variant="destructive" onClick={() => void system.run("uninstall-delete")}>Delete local data</Button></div></CardContent></Card>
    </PageShell>
  );
}
