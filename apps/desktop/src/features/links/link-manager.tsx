import { Plus, Search } from "lucide-react";
import { Button } from "@go-links/ui/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@go-links/ui/components/dialog";
import { Input } from "@go-links/ui/components/input";
import { PageShell } from "../../components/page-shell";
import { LinkEditor } from "./link-editor";
import { LinkList } from "./link-list";
import type { LinkStore } from "./use-links";

type LinkManagerProps = { links: LinkStore };

export function LinkManager({ links }: LinkManagerProps) {

  return (
    <PageShell title="Links" actions={<Button className="no-drag" onClick={links.startCreating}><Plus />New link</Button>}>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <label className="relative block"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={links.query} placeholder="Search shortcuts" aria-label="Search shortcuts" onChange={(event) => links.setQuery(event.target.value)} /></label>
        </div>
        <div className="px-5"><LinkList links={links.shownLinks} onCopy={links.copy} onEdit={links.startEditing} onOpenDestination={links.openDestination} onRemove={links.remove} /></div>
      </div>
      <Dialog open={links.editorOpen} onOpenChange={(open) => { if (!open) links.cancelEditing(); }}>
        <DialogContent className="text-foreground">
          <DialogHeader>
            <DialogTitle>{links.editing ? "Edit link" : "Create a new link"}</DialogTitle>
          </DialogHeader>
          <div className="mt-6"><LinkEditor draft={links.draft} editing={links.editing} onCancel={links.cancelEditing} onChange={links.setDraft} onSave={links.save} /></div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
