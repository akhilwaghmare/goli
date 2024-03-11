"use server";

import { db } from "@/db";
import { links } from "@/db/schema/links";
import { v4 as uuid } from "uuid";

export async function createShortlink(slug: string, redirectUrl: string) {
  console.log("Starting server action");
  const id = uuid();

  console.log("Generating uuid: ", id);

  await db.insert(links).values({
    id,
    slug,
    redirectUrl,
  });

  console.log("Ending server action");
  return { id };
}
