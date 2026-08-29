import type { LinkInput, MaintenanceAction } from "./contracts";

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateLinkInput(input: LinkInput): LinkInput {
  const next = { slug: input.slug.trim().toLowerCase(), destinationUrl: validateDestinationUrl(input.destinationUrl) };
  if (!slug.test(next.slug) || next.slug.length > 64 || ["admin", "api", "assets", "health", "favicon.ico"].includes(next.slug)) {
    throw new Error("Slug must be 1–64 lowercase letters, numbers, or hyphens and cannot be reserved.");
  }
  return next;
}

export function validateDestinationUrl(value: unknown): string {
  if (typeof value !== "string") throw new Error("Destination must be a complete http or https URL.");
  const destinationUrl = value.trim();
  let url: URL;
  try {
    url = new URL(destinationUrl);
  } catch {
    throw new Error("Destination must be a complete http or https URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Destination must be a complete http or https URL.");
  return destinationUrl;
}

export function validateMaintenanceAction(value: unknown): MaintenanceAction {
  const actions = ["restart", "repair", "uninstall-keep", "uninstall-delete"] as const;
  if (!actions.includes(value as MaintenanceAction)) throw new Error("Unsupported maintenance action.");
  return value as MaintenanceAction;
}

export function validateLinkID(value: unknown): string {
  if (typeof value !== "string" || !/^[a-f0-9]{32}$/.test(value)) throw new Error("Invalid shortcut identifier.");
  return value;
}
