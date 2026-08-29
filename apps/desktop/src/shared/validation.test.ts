import { expect, test } from "bun:test";
import { validateDestinationUrl, validateLinkID, validateLinkInput, validateMaintenanceAction } from "./validation";

test("validates desktop link input", () => {
  expect(validateLinkInput({ slug: " Resume ", destinationUrl: "https://example.com" })).toEqual({ slug: "resume", destinationUrl: "https://example.com" });
  expect(() => validateLinkInput({ slug: "Admin", destinationUrl: "https://example.com" })).toThrow();
  expect(() => validateLinkInput({ slug: "resume", destinationUrl: "file:///tmp/x" })).toThrow();
});

test("accepts only HTTP(S) destination URLs", () => {
  expect(validateDestinationUrl(" https://example.com/path ")).toBe("https://example.com/path");
  expect(() => validateDestinationUrl("not a URL")).toThrow("Destination must be a complete http or https URL.");
  expect(() => validateDestinationUrl("file:///tmp/example")).toThrow("Destination must be a complete http or https URL.");
  expect(() => validateDestinationUrl("mailto:test@example.com")).toThrow("Destination must be a complete http or https URL.");
  expect(() => validateDestinationUrl({ url: "https://example.com" })).toThrow("Destination must be a complete http or https URL.");
});

test("only allows fixed maintenance actions", () => {
  expect(validateMaintenanceAction("repair")).toBe("repair");
  expect(() => validateMaintenanceAction("shell-command")).toThrow();
});

test("does not pass arbitrary values into link routes", () => {
  expect(validateLinkID("0123456789abcdef0123456789abcdef")).toBe("0123456789abcdef0123456789abcdef");
  expect(() => validateLinkID("../links")).toThrow();
});
