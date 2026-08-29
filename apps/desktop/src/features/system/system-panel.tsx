import { Button } from "@go-links/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@go-links/ui/components/card";
import { Separator } from "@go-links/ui/components/separator";
import { useSystem } from "./use-system";
import { useUpdates } from "./use-updates";

export function SystemPanel({ onNotice }: { onNotice(message: string | null): void }) {
  const system = useSystem(onNotice);
  const update = useUpdates(onNotice);
  const { status } = system;
  const { updates } = update;

  return (
    <Card className="h-fit">
      <CardHeader><CardTitle>System</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {status ? (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
              <dt className="font-medium">Service:</dt><dd>{status.service}</dd>
              <dt className="font-medium">Version:</dt><dd>{status.serviceVersion ?? "unavailable"}</dd>
              <dt className="font-medium">Hostname:</dt><dd>{status.hostname}</dd>
              <dt className="font-medium">Certificates:</dt><dd>{status.certificates}</dd>
              <dt className="font-medium">Ports:</dt><dd>{status.ports}</dd>
            </dl>
            <div className="flex flex-col gap-2">
              <Button onClick={() => void system.run("restart")}>Restart service</Button>
              <Button onClick={() => void system.run("repair")}>Repair Goli</Button>
              <Button variant="secondary" onClick={() => void system.run("reset-certificates")}>Reset certificates</Button>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer font-medium">Recent logs</summary>
              <pre className="mt-3 max-h-36 overflow-auto rounded-md bg-muted p-3 text-xs whitespace-pre-wrap">{status.logs.join("\n") || "No logs available."}</pre>
            </details>
          </>
        ) : <p className="text-sm text-muted-foreground">Checking Goli…</p>}

        <Separator />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Updates</h2>
          <p className="text-sm text-muted-foreground">{updates.status === "disabled" ? updates.message : updates.status}</p>
          {updates.status === "available" && <><p className="text-sm">Goli {updates.version} is ready.</p><Button onClick={() => void update.download()}>Download update</Button></>}
          {updates.status === "verified" && <p className="text-sm">Package verified.</p>}
          {updates.status === "error" && <p className="text-sm text-destructive">{updates.message}</p>}
          {updates.status !== "downloading" && <Button variant="secondary" onClick={() => void update.check()}>Check for updates</Button>}
        </section>

        <Separator />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Uninstall</h2>
          <p className="text-sm text-muted-foreground">Choose what happens to your shortcuts.</p>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={() => void system.run("uninstall-keep")}>Keep local data</Button>
            <Button variant="secondary" onClick={() => void system.exportThenDelete()}>Export then delete</Button>
            <Button variant="destructive" onClick={() => void system.run("uninstall-delete")}>Delete local data</Button>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
