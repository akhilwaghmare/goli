import { Badge } from "@go-links/ui/components/badge";
import { Button } from "@go-links/ui/components/button";
import type { Link } from "../../shared/contracts";

type LinkListProps = { links: Link[]; onCopy(link: Link): Promise<void>; onEdit(link: Link): void; onRemove(link: Link): Promise<void> };

export function LinkList({ links, onCopy, onEdit, onRemove }: LinkListProps) {
  if (links.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">No shortcuts yet.</p>;

  return (
    <div className="divide-y">
      {links.map((link) => (
        <article key={link.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
          <div className="min-w-0">
            <strong className="block text-sm">go.li/{link.slug}</strong>
            <a href={link.destinationUrl} className="mt-1 block truncate text-sm text-primary underline-offset-4 hover:underline" onClick={(event) => { event.preventDefault(); void onCopy(link); }}>{link.destinationUrl}</a>
          </div>
          <Badge variant="secondary" className="w-fit">{link.visits} visits</Badge>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(link)}>Edit</Button>
            <Button variant="destructive" size="sm" onClick={() => void onRemove(link)}>Delete</Button>
          </div>
        </article>
      ))}
    </div>
  );
}
