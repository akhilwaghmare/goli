export const appearanceValues = ["light", "dark", "system"] as const;
export type Appearance = typeof appearanceValues[number];

export const appearanceStorageKey = "goli.appearance";

export function resolveAppearance(appearance: Appearance, systemPrefersDark: boolean): "light" | "dark" {
  if (appearance === "system") return systemPrefersDark ? "dark" : "light";
  return appearance;
}

export function readAppearance(value: string | null): Appearance {
  return appearanceValues.includes(value as Appearance) ? value as Appearance : "system";
}
