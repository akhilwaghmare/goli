import { Button } from "@go-links/ui/components/button";
import Image from "next/image";
import { AppleIcon } from "../components/apple-icon";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <nav className="mx-auto flex h-[76px] max-w-[1140px] items-center px-7 max-[700px]:px-5">
        <a className="font-['DM_Mono'] text-[26px] font-bold text-[#17241e] no-underline" href="#top">
          Goli<span className="text-[#e2532f]">.</span>
        </a>
      </nav>
      <section
        id="top"
        className="min-h-[600px] bg-[#f7f5ef] bg-[radial-gradient(circle_at_80%_12%,#d8ead3_0,transparent_24%)] px-7 py-[106px] min-[1140px]:px-[calc((100vw-1084px)/2)] max-[700px]:py-20"
      >
        <h1 className="max-w-[700px] font-['Newsreader'] text-[clamp(56px,9vw,112px)] leading-[.88] font-semibold tracking-[-.06em]">
          Private, local shortlinks
        </h1>
        <p className="my-[35px] max-w-[570px] text-xl leading-[1.5] text-[#4b5a51]">Create links with no limits. Use in any browser.</p>
        <div id="download" className="flex items-center">
          <Button
            asChild
            size="lg"
            className="h-auto rounded-full border border-[#17241e] bg-[#17241e] px-[22px] py-[14px] font-['DM_Sans'] text-sm font-medium text-white hover:bg-[#26382f]"
          >
            <a href="#download">
              <AppleIcon aria-hidden="true" className="size-4 fill-current" />
              Download for macOS
            </a>
          </Button>
        </div>
      </section>
      <section className="bg-[#f7f5ef] px-7 pb-[110px] max-[700px]:pb-[70px]">
        <Image
          src="/screenshot.png"
          alt="Goli desktop app showing a list of saved links"
          width={2464}
          height={1744}
          priority
          className="mx-auto w-full max-w-[1084px] rounded-xl shadow-[12px_12px_0_#d8ead3]"
        />
      </section>
      <section className="mx-auto grid max-w-[1084px] grid-cols-2 items-center gap-24 px-7 py-[110px] max-[700px]:grid-cols-1 max-[700px]:gap-12 max-[700px]:py-[70px]">
        <div className="rounded-xl bg-[#17241e] p-7 font-['DM_Mono'] text-base text-[#f8f7f2] shadow-[12px_12px_0_#d8ead3]">
          <p><span className="text-[#a4d79a]">›</span> go.li/calendar</p>
          <p className="text-[13px] text-[#9ca89f]">Opening calendar.google.com…</p>
        </div>
        <div>
          <h2 className="mb-5 font-['Newsreader'] text-5xl leading-none font-semibold tracking-[-.04em] max-[700px]:text-[40px]">
            Your shortcuts stay on your computer.
          </h2>
          <p className="text-[17px] leading-[1.65] text-[#4b5a51]">
            Goli runs only on your Mac. Your links, destinations, and visit counts are kept in a local database—not a cloud account.
          </p>
        </div>
      </section>
      <footer className="mx-auto flex max-w-[1084px] justify-between border-t border-[#dfded6] p-7 text-[13px] text-[#56675a] max-[700px]:flex-col max-[700px]:gap-3">
        <span>Goli</span>
        <span>Private by default. Local by design.</span>
        <span>
          Created by <a className="underline underline-offset-3" href="https://github.com/akhilwaghmare">Akhil</a>
        </span>
      </footer>
    </main>
  );
}
