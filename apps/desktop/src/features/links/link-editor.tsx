import type { FormEvent } from "react";
import { Button } from "@go-links/ui/components/button";
import { Input } from "@go-links/ui/components/input";
import type { Link, LinkInput } from "../../shared/contracts";

type LinkEditorProps = { draft: LinkInput; editing: Link | null; onCancel(): void; onChange(draft: LinkInput): void; onSave(): Promise<void> };

export function LinkEditor({ draft, editing, onCancel, onChange, onSave }: LinkEditorProps) {
  const submit = (event: FormEvent) => { event.preventDefault(); void onSave(); };
  return (
    <form className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto_auto]" onSubmit={submit}>
      <Input value={draft.slug} placeholder="resume" aria-label="Shortcut slug" onChange={(event) => onChange({ ...draft, slug: event.target.value })} required />
      <Input value={draft.destinationUrl} type="url" placeholder="https://example.com" aria-label="Destination URL" onChange={(event) => onChange({ ...draft, destinationUrl: event.target.value })} required />
      <Button type="submit">{editing ? "Save changes" : "Create shortcut"}</Button>
      {editing && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
    </form>
  );
}
