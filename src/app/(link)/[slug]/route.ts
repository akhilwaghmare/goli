import { redirect } from "next/navigation";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  // Fetch redirect URL mapped to slug
  const redirectURL = `https://awlabs.tech/${params.slug}`;
  // Redirect
  redirect(redirectURL);
}
