import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Link, LinkInput, SystemStatus, UpdateState } from "./shared/contracts";
import "./styles.css";

const blank: LinkInput = { slug: "", destinationUrl: "" };

function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [draft, setDraft] = useState<LinkInput>(blank);
  const [editing, setEditing] = useState<Link | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [updates, setUpdates] = useState<UpdateState>({ status: "idle" });
  const refresh = async () => { try { setLinks(await window.goliBridge.links.list()); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not load links."); } };
  const refreshStatus = async () => setStatus(await window.goliBridge.system.status());
  useEffect(() => { void refresh(); void refreshStatus(); void window.goliBridge.updates.state().then(setUpdates); }, []);
  const shown = useMemo(() => links.filter((link) => `${link.slug} ${link.destinationUrl}`.toLowerCase().includes(query.toLowerCase())), [links, query]);
  const save = async (event: React.FormEvent) => { event.preventDefault(); try { if (editing) await window.goliBridge.links.update(editing.id, draft); else await window.goliBridge.links.create(draft); setDraft(blank); setEditing(null); setNotice(null); await refresh(); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save shortcut."); } };
  const edit = (link: Link) => { setEditing(link); setDraft({ slug: link.slug, destinationUrl: link.destinationUrl }); };
  const run = async (action: "restart" | "repair" | "reset-certificates" | "uninstall-keep" | "uninstall-delete") => { if (action.startsWith("uninstall") && !confirm("This removes Goli's system integration. Continue?")) return; try { setNotice(await window.goliBridge.system.run(action)); await refreshStatus(); } catch (error) { setNotice(error instanceof Error ? error.message : "System action failed."); } };
  const exportThenDelete = async () => { if (await window.goliBridge.links.export()) await run("uninstall-delete"); };
  const checkUpdates = async () => setUpdates(await window.goliBridge.updates.check());
  const downloadUpdate = async () => setUpdates(await window.goliBridge.updates.download());
  return <main>
    <header><div><p className="eyebrow">LOCAL SHORTCUTS</p><h1>Goli</h1></div><div className="actions"><button onClick={() => void window.goliBridge.links.export()}>Export</button><button onClick={() => void window.goliBridge.links.import().then(refresh)}>Import</button></div></header>
    {notice && <p className="notice" role="status">{notice}</p>}
    <section className="grid">
      <div className="card links"><h2>{editing ? "Edit shortcut" : "New shortcut"}</h2><form onSubmit={save}><input value={draft.slug} placeholder="resume" aria-label="Shortcut slug" onChange={(event) => setDraft({ ...draft, slug: event.target.value })} required /><input value={draft.destinationUrl} type="url" placeholder="https://example.com" aria-label="Destination URL" onChange={(event) => setDraft({ ...draft, destinationUrl: event.target.value })} required /><button type="submit">{editing ? "Save changes" : "Create shortcut"}</button>{editing && <button type="button" className="subtle" onClick={() => { setEditing(null); setDraft(blank); }}>Cancel</button>}</form>
      <div className="search"><input value={query} placeholder="Search shortcuts" onChange={(event) => setQuery(event.target.value)} /></div><div className="list">{shown.map((link) => <article key={link.id}><div><strong>go.li/{link.slug}</strong><a href={link.destinationUrl} onClick={(event) => { event.preventDefault(); void navigator.clipboard.writeText(`https://go.li/${link.slug}`); setNotice("Shortcut copied."); }}>{link.destinationUrl}</a></div><span>{link.visits} visits</span><div className="row-actions"><button className="subtle" onClick={() => edit(link)}>Edit</button><button className="danger" onClick={() => { if (confirm(`Delete go.li/${link.slug}?`)) void window.goliBridge.links.remove(link.id).then(refresh); }}>Delete</button></div></article>)}{shown.length === 0 && <p className="muted">No shortcuts yet.</p>}</div></div>
      <aside className="card"><h2>System</h2>{status ? <><p><b>Service:</b> {status.service}</p><p><b>Version:</b> {status.serviceVersion ?? "unavailable"}</p><p><b>Hostname:</b> {status.hostname}</p><p><b>Certificates:</b> {status.certificates}</p><p><b>Ports:</b> {status.ports}</p><div className="stack"><button onClick={() => void run("restart")}>Restart service</button><button onClick={() => void run("repair")}>Repair Goli</button><button className="subtle" onClick={() => void run("reset-certificates")}>Reset certificates</button></div><details><summary>Recent logs</summary><pre>{status.logs.join("\n") || "No logs available."}</pre></details></> : <p className="muted">Checking Goli…</p>}<hr /><h2>Updates</h2><p className="muted">{updates.status === "disabled" ? updates.message : updates.status}</p>{updates.status === "available" && <><p>Goli {updates.version} is ready.</p><button onClick={() => void downloadUpdate()}>Download update</button></>}{updates.status === "verified" && <p>Package verified.</p>}{updates.status === "error" && <p className="notice">{updates.message}</p>}{updates.status !== "downloading" && <button className="subtle" onClick={() => void checkUpdates()}>Check for updates</button>}<hr /><h2>Uninstall</h2><p className="muted">Choose what happens to your shortcuts.</p><button className="subtle" onClick={() => void run("uninstall-keep")}>Keep local data</button><button className="subtle" onClick={() => void exportThenDelete()}>Export then delete</button><button className="danger" onClick={() => void run("uninstall-delete")}>Delete local data</button></aside>
    </section>
  </main>;
}
createRoot(document.getElementById("root")!).render(<App />);
