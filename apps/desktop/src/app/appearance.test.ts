import { expect, test } from "bun:test";
import { readAppearance, resolveAppearance } from "./appearance";

test("defaults invalid stored appearance to system", () => {
  expect(readAppearance(null)).toBe("system");
  expect(readAppearance("sepia")).toBe("system");
});

test("resolves explicit and system appearance", () => {
  expect(resolveAppearance("light", true)).toBe("light");
  expect(resolveAppearance("dark", false)).toBe("dark");
  expect(resolveAppearance("system", true)).toBe("dark");
  expect(resolveAppearance("system", false)).toBe("light");
});
