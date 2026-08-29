import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@go-links/ui/components/badge";
import { Button } from "@go-links/ui/components/button";
import type { Link } from "../../shared/contracts";

type LinkListProps = { links: Link[]; onCopy(link: Link): Promise<void>; onEdit(link: Link): void; onOpenDestination(link: Link): Promise<void>; onRemove(link: Link): Promise<void> };

export function LinkList({ links, onCopy, onEdit, onOpenDestination, onRemove }: LinkListProps) {
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedLinkId) return;
    const timeout = window.setTimeout(() => setCopiedLinkId(null), 3_000);
    return () => window.clearTimeout(timeout);
  }, [copiedLinkId]);

  const copyLink = async (link: Link) => {
    try {
      await onCopy(link);
      setCopiedLinkId(link.id);
    } catch {
      // The link store surfaces clipboard failures in the app notice.
    }
  };

  if (links.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">No shortcuts yet.</p>;

  return (
    <div className="divide-y">
      {links.map((link) => (
        <article key={link.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <strong className="text-sm">{link.slug}</strong>
              <Button variant="ghost" size="icon-xs" aria-label={`Copy shortlink for ${link.slug}`} title={copiedLinkId === link.id ? "Copied" : "Copy shortlink"} onClick={() => void copyLink(link)}>{copiedLinkId === link.id ? <Check /> : <Copy />}</Button>
            </div>
            <a href={link.destinationUrl} className="mt-1 block truncate text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline" onClick={(event) => { event.preventDefault(); void onOpenDestination(link); }}>{link.destinationUrl}</a>
          </div>
          <Badge variant="secondary" className="w-fit">{link.visits} visits</Badge>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon-sm" aria-label={`Edit ${link.slug}`} title="Edit link" onClick={() => onEdit(link)}><Pencil /></Button>
            <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${link.slug}`} title="Delete link" onClick={() => void onRemove(link)}><Trash2 /></Button>
          </div>
        </article>
      ))}
    </div>
  );
}
