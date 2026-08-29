import { useEffect, useState } from "react";
import { appearanceStorageKey, readAppearance, resolveAppearance, type Appearance } from "./appearance";

function storedAppearance(): Appearance {
  try { return readAppearance(window.localStorage.getItem(appearanceStorageKey)); }
  catch { return "system"; }
}

export function useAppearance() {
  const [appearance, setAppearanceState] = useState<Appearance>(storedAppearance);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", resolveAppearance(appearance, media.matches) === "dark");
    apply();
    if (appearance !== "system") return;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [appearance]);

  const setAppearance = (next: Appearance) => {
    setAppearanceState(next);
    try { window.localStorage.setItem(appearanceStorageKey, next); } catch { /* Persistence is optional in restricted renderers. */ }
  };

  return { appearance, setAppearance };
}
