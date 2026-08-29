import type { Link } from "../shared/contracts";

export type AnalyticsSummary = {
  linkCount: number;
  totalVisits: number;
  mostVisited: Link | null;
  rankedLinks: Link[];
};

export function deriveAnalytics(links: Link[]): AnalyticsSummary {
  const rankedLinks = [...links].sort((left, right) => right.visits - left.visits || left.slug.localeCompare(right.slug));
  return {
    linkCount: links.length,
    totalVisits: links.reduce((total, link) => total + link.visits, 0),
    mostVisited: rankedLinks[0] ?? null,
    rankedLinks,
  };
}
