import { expect, test } from "bun:test";
import { validateLinkID, validateLinkInput, validateMaintenanceAction } from "./validation";

test("validates desktop link input", () => {
  expect(validateLinkInput({ slug: " Resume ", destinationUrl: "https://example.com" })).toEqual({ slug: "resume", destinationUrl: "https://example.com" });
  expect(() => validateLinkInput({ slug: "Admin", destinationUrl: "https://example.com" })).toThrow();
  expect(() => validateLinkInput({ slug: "resume", destinationUrl: "file:///tmp/x" })).toThrow();
});

test("only allows fixed maintenance actions", () => {
  expect(validateMaintenanceAction("repair")).toBe("repair");
  expect(() => validateMaintenanceAction("shell-command")).toThrow();
});

test("does not pass arbitrary values into link routes", () => {
  expect(validateLinkID("0123456789abcdef0123456789abcdef")).toBe("0123456789abcdef0123456789abcdef");
  expect(() => validateLinkID("../links")).toThrow();
});
