"use client";

import { useState } from "react";

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const openDashboard = () => {
    setShowHelp(true);
    window.setTimeout(() => { window.location.href = "goli://admin"; }, 100);
  };

  return <main>
    <nav><a className="brand" href="#top">Goli<span>.</span></a><a href="#install">Install</a><button className="quiet" onClick={openDashboard}>Open Goli</button></nav>
    <section id="top" className="hero"><p className="eyebrow">LOCAL LINKS FOR MAC</p><h1>Type less.<br /><em>Get there faster.</em></h1><p className="lede">Create personal shortcuts that work in every browser on your Mac. <code>go.li/resume</code> can take you anywhere.</p><div className="actions"><a className="button" href="#install">Get Goli</a><button className="button secondary" onClick={openDashboard}>Open Goli ↗</button></div>{showHelp && <div className="fallback" role="status"><strong>Opening Goli.</strong> If it did not open, install Goli first. After installation, the dashboard is also available at <code>https://go.li/admin</code>.</div>}</section>
    <section className="example"><div className="terminal"><p><span>›</span> go.li/calendar</p><p className="dim">Opening calendar.google.com…</p></div><div><p className="eyebrow">ONE ADDRESS, EVERY BROWSER</p><h2>Your shortcuts stay on your computer.</h2><p>Goli runs only on your Mac. Your links, destinations, and visit counts are kept in a local database—not a cloud account.</p></div></section>
    <section id="install" className="install"><p className="eyebrow">INSTALL</p><h2>Ready in a minute.</h2><ol><li><b>1</b><div><strong>Download the installer</strong><span>Open the Goli package for macOS.</span></div></li><li><b>2</b><div><strong>Approve the one-time setup</strong><span>macOS reserves <code>go.li</code> for this computer and registers Goli.</span></div></li><li><b>3</b><div><strong>Create your first shortcut</strong><span>Select “Open Goli” or enter <code>go.li/admin</code>.</span></div></li></ol><a className="button" href="#download">Download for macOS</a><p id="download" className="small">The first release package will be available here. Goli supports macOS only.</p></section>
    <section className="troubleshooting"><h2>Need a hand?</h2><p>If Goli does not open, make sure it is installed and running. If another app already uses <code>go.li</code> or ports 80/443, the installer will explain how to resolve it safely.</p><a href="goli://admin">Open Goli →</a><p className="small">Installed users can also use <code>https://go.li/admin</code> directly.</p></section><footer><span>Goli</span><span>Private by default. Local by design.</span></footer>
  </main>;
}
