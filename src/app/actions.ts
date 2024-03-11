"use server";

import { db } from "@/db";
import { links } from "@/db/schema/links";
import { v4 as uuid } from "uuid";

export async function createShortlink(slug: string, redirectUrl: string) {
  const id = uuid();

  await db.insert(links).values({
    id,
    slug,
    redirectUrl,
  });

  return { id };
}
