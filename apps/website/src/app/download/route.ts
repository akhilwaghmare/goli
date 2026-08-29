import { NextResponse } from "next/server";

const manifestUrl = "https://github.com/akhilwaghmare/goli/releases/latest/download/goli-update.json";
const fallbackUrl = "https://github.com/akhilwaghmare/goli/releases/latest";

type ReleaseManifest = { packageUrl?: unknown };

export async function GET() {
  try {
    const response = await fetch(manifestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load the latest release manifest.");

    const manifest: ReleaseManifest = await response.json();
    if (typeof manifest.packageUrl !== "string") throw new Error("Latest release has no package URL.");

    return NextResponse.redirect(manifest.packageUrl);
  } catch {
    return NextResponse.redirect(fallbackUrl);
  }
}
