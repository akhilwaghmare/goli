import { expect, test } from "bun:test";
import { deriveAnalytics } from "./analytics";

const link = (slug: string, visits: number) => ({ id: slug.padEnd(32, "0"), slug, destinationUrl: `https://${slug}.example.com`, createdAt: "", updatedAt: "", visits });

test("derives empty analytics", () => {
  expect(deriveAnalytics([])).toEqual({ linkCount: 0, totalVisits: 0, mostVisited: null, rankedLinks: [] });
});

test("derives all-time totals and ranks links", () => {
  const summary = deriveAnalytics([link("docs", 3), link("calendar", 8), link("zero", 0)]);
  expect(summary.linkCount).toBe(3);
  expect(summary.totalVisits).toBe(11);
  expect(summary.mostVisited?.slug).toBe("calendar");
  expect(summary.rankedLinks.map(({ slug }) => slug)).toEqual(["calendar", "docs", "zero"]);
});
