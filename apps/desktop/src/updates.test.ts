import { expect, test } from "bun:test";
import { isNewer } from "./updates";

test("compares semver-like internal release versions", () => {
  expect(isNewer("0.2.0", "0.1.9")).toBe(true);
  expect(isNewer("0.1.0", "0.1.0")).toBe(false);
  expect(isNewer("0.1.0", "0.2.0")).toBe(false);
  expect(isNewer("0.1.0-preview.2", "0.1.0-preview.1")).toBe(true);
});
