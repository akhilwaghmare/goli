import { net } from "electron";
import type { Health, Link, LinkInput } from "./shared/contracts";

const baseUrl = "https://go.li";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Electron's network client uses the macOS trust store, including Goli's
  // locally installed CA. Node's fetch has a separate certificate store.
  const response = await net.fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Goli-Desktop": "1", ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Goli service is unavailable." })) as { error?: string };
    throw new Error(body.error ?? "Goli service is unavailable.");
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const serviceApi = {
  health: () => request<Health>("/api/health"),
  list: () => request<Link[]>("/api/links"),
  create: (input: LinkInput) => request<Link>("/api/links", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: LinkInput) => request<Link>(`/api/links/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) }),
  remove: (id: string) => request<void>(`/api/links/${encodeURIComponent(id)}`, { method: "DELETE" }),
  export: () => request<{ version: number; links: Link[] }>("/api/export"),
  import: (body: unknown) => request<void>("/api/import", { method: "POST", body: JSON.stringify(body) }),
};
