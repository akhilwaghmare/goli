import LinkForm, { LinkFormSchema } from "@/components/LinkForm";
import { z } from "zod";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-20 p-24">
      <h1 className="font-semibold text-6xl">Akhil&#39;s go shortlinks</h1>
      <LinkForm />
    </main>
  );
}
