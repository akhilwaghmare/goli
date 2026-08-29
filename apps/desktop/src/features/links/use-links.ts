import { useEffect, useMemo, useState } from "react";
import type { Link, LinkInput } from "../../shared/contracts";

const blankLink: LinkInput = { slug: "", destinationUrl: "" };

export type LinkStore = ReturnType<typeof useLinks>;

export function useLinks(onNotice: (message: string | null) => void) {
  const [links, setLinks] = useState<Link[]>([]);
  const [draft, setDraft] = useState<LinkInput>(blankLink);
  const [editing, setEditing] = useState<Link | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [query, setQuery] = useState("");

  const refresh = async () => {
    try {
      setLinks(await window.goliBridge.links.list());
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not load links.");
    }
  };

  useEffect(() => { void refresh(); }, []);

  const shownLinks = useMemo(
    () => links.filter((link) => `${link.slug} ${link.destinationUrl}`.toLowerCase().includes(query.toLowerCase())),
    [links, query],
  );

  const save = async () => {
    try {
      if (editing) await window.goliBridge.links.update(editing.id, draft);
      else await window.goliBridge.links.create(draft);
      setDraft(blankLink);
      setEditing(null);
      setEditorOpen(false);
      onNotice(null);
      await refresh();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not save shortcut.");
    }
  };

  const startEditing = (link: Link) => {
    setEditing(link);
    setDraft({ slug: link.slug, destinationUrl: link.destinationUrl });
    setEditorOpen(true);
  };

  const startCreating = () => {
    setEditing(null);
    setDraft(blankLink);
    setEditorOpen(true);
  };

  const cancelEditing = () => {
    setEditing(null);
    setDraft(blankLink);
    setEditorOpen(false);
  };

  const remove = async (link: Link) => {
    if (!confirm(`Delete go.li/${link.slug}?`)) return;
    try {
      await window.goliBridge.links.remove(link.id);
      await refresh();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not delete shortcut.");
    }
  };

  const copy = async (link: Link) => {
    try {
      await navigator.clipboard.writeText(`https://go.li/${link.slug}`);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not copy shortcut.");
      throw error;
    }
  };

  const openDestination = async (link: Link) => {
    try {
      await window.goliBridge.links.openDestination(link.destinationUrl);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Could not open destination.");
    }
  };

  return { cancelEditing, copy, draft, editing, editorOpen, links, openDestination, refresh, remove, save, setDraft, setQuery, shownLinks, startCreating, startEditing, query };
}
