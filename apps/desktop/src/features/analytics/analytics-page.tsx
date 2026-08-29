import { BarChart3, Link as LinkIcon, MousePointerClick } from "lucide-react";
import { deriveAnalytics } from "../../app/analytics";
import { PageShell } from "../../components/page-shell";
import type { Link } from "../../shared/contracts";

export function AnalyticsPage({ links }: { links: Link[] }) {
  const analytics = deriveAnalytics(links);
  const cards = [
    { label: "Total links", value: analytics.linkCount, icon: LinkIcon },
    { label: "All-time visits", value: analytics.totalVisits, icon: MousePointerClick },
    { label: "Most visited", value: analytics.mostVisited ? `go.li/${analytics.mostVisited.slug}` : "—", icon: BarChart3 },
  ];

  return (
    <PageShell title="Analytics">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between text-sm text-muted-foreground"><span>{label}</span><Icon className="size-4" /></div><p className="mt-3 truncate text-2xl font-semibold tracking-tight">{value}</p></article>)}
      </div>
      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4"><h2 className="font-semibold">Most visited links</h2><p className="mt-1 text-sm text-muted-foreground">Lifetime visits across every shortcut.</p></div>
        {analytics.rankedLinks.length === 0 ? <p className="px-5 py-12 text-center text-sm text-muted-foreground">Create a link to start seeing analytics.</p> : <div className="divide-y px-5">{analytics.rankedLinks.map((link, index) => <article key={link.id} className="grid gap-2 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-center"><span className="text-sm tabular-nums text-muted-foreground">{index + 1}</span><div className="min-w-0"><strong className="block text-sm">go.li/{link.slug}</strong><span className="mt-1 block truncate text-sm text-muted-foreground">{link.destinationUrl}</span></div><span className="text-sm font-medium tabular-nums">{link.visits} {link.visits === 1 ? "visit" : "visits"}</span></article>)}</div>}
      </section>
    </PageShell>
  );
}
