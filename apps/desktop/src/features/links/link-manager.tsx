import { Card, CardContent, CardHeader, CardTitle } from "@go-links/ui/components/card";
import { Input } from "@go-links/ui/components/input";
import { LinkEditor } from "./link-editor";
import { LinkList } from "./link-list";
import { useLinks } from "./use-links";

type LinkManagerProps = { onNotice(message: string | null): void; refreshKey: number };

export function LinkManager({ onNotice, refreshKey }: LinkManagerProps) {
  const links = useLinks(onNotice, refreshKey);

  return (
    <Card>
      <CardHeader><CardTitle>{links.editing ? "Edit shortcut" : "New shortcut"}</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <LinkEditor draft={links.draft} editing={links.editing} onCancel={links.cancelEditing} onChange={links.setDraft} onSave={links.save} />
        <Input value={links.query} placeholder="Search shortcuts" aria-label="Search shortcuts" onChange={(event) => links.setQuery(event.target.value)} />
        <LinkList links={links.shownLinks} onCopy={links.copy} onEdit={links.startEditing} onRemove={links.remove} />
      </CardContent>
    </Card>
  );
}
