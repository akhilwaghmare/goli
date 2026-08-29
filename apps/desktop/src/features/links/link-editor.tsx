import type { FormEvent } from "react";
import { Button } from "@go-links/ui/components/button";
import { Input } from "@go-links/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@go-links/ui/components/input-group";
import type { Link, LinkInput } from "../../shared/contracts";

type LinkEditorProps = { draft: LinkInput; editing: Link | null; onCancel(): void; onChange(draft: LinkInput): void; onSave(): Promise<void> };

export function LinkEditor({ draft, editing, onCancel, onChange, onSave }: LinkEditorProps) {
  const submit = (event: FormEvent) => { event.preventDefault(); void onSave(); };
  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-medium">
        Shortcut
        <InputGroup>
          <InputGroupAddon>go.li/</InputGroupAddon>
          <InputGroupInput value={draft.slug} placeholder="resume" aria-label="Shortcut slug" onChange={(event) => onChange({ ...draft, slug: event.target.value })} required autoFocus />
        </InputGroup>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Destination URL
        <Input value={draft.destinationUrl} type="url" placeholder="https://example.com" aria-label="Destination URL" onChange={(event) => onChange({ ...draft, destinationUrl: event.target.value })} required />
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{editing ? "Save changes" : "Create shortcut"}</Button>
      </div>
    </form>
  );
}
