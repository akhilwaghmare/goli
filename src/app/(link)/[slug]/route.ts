import { db } from "@/db";
import { links } from "@/db/schema/links";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  // Fetch redirect URL mapped to slug
  const storedLink = await db
    .select()
    .from(links)
    .where(eq(links.slug, params.slug))
    .get();

  // If no valid slug is found, redirect to a 404 page
  const redirectURL = storedLink?.redirect_url ?? "/";

  // TODO: Increment the visits count

  redirect(redirectURL);
}
