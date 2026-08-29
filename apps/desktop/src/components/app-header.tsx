import { Button } from "@go-links/ui/components/button";

type AppHeaderProps = { onImport(): void; onNotice(message: string | null): void };

export function AppHeader({ onImport, onNotice }: AppHeaderProps) {
  const exportLinks = async () => {
    try {
      await window.goliBridge.links.export();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not export shortcuts.");
    }
  };

  const importLinks = async () => {
    try {
      await window.goliBridge.links.import();
      onImport();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not import shortcuts.");
    }
  };

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-medium tracking-[0.12em] text-muted-foreground">LOCAL SHORTCUTS</p>
        <h1 className="text-4xl font-semibold tracking-tight">Goli</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => void exportLinks()}>Export</Button>
        <Button onClick={() => void importLinks()}>Import</Button>
      </div>
    </header>
  );
}
