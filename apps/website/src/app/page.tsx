import { Download } from "lucide-react";
import { Button } from "@go-links/ui/components/button";

export default function Home() {
  return (
    <main>
      <nav>
        <a className="brand" href="#top">Goli<span>.</span></a>
      </nav>
      <section id="top" className="hero">
        <h1>Type less.<br /><em>Get there faster.</em></h1>
        <p className="lede">Create personal shortcuts that work in every browser on your Mac. <code>go.li/resume</code> can take you anywhere.</p>
        <div className="actions">
          <Button asChild size="lg" className="download-button">
            <a href="#download"><Download aria-hidden="true" />Download for Mac</a>
          </Button>
        </div>
        <p id="download" className="download-note">The first release package will be available here. Goli supports macOS only.</p>
      </section>
      <section className="example">
        <div className="terminal"><p><span>›</span> go.li/calendar</p><p className="dim">Opening calendar.google.com…</p></div>
        <div><h2>Your shortcuts stay on your computer.</h2><p>Goli runs only on your Mac. Your links, destinations, and visit counts are kept in a local database—not a cloud account.</p></div>
      </section>
      <footer>
        <span>Goli</span>
        <span>Private by default. Local by design.</span>
        <span>Created by <a href="https://github.com/akhilwaghmare">Akhil</a></span>
      </footer>
    </main>
  );
}
