import { Button } from "@go-links/ui/components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@go-links/ui/components/card";
import { Code2, Github, Globe2, HardDrive } from "lucide-react";
import Image from "next/image";
import { AppleIcon } from "../components/apple-icon";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <nav className="mx-auto flex h-[76px] max-w-[1140px] items-center justify-between px-7 max-[700px]:px-5">
        <a className="font-['DM_Mono'] text-[26px] font-bold text-[#17241e] no-underline" href="#top">
          Goli<span className="text-[#e2532f]">.</span>
        </a>
        <Button asChild variant="outline" size="sm" className="rounded-full border-[#17241e] bg-transparent text-[#17241e] hover:bg-[#e9e7df]">
          <a href="https://github.com/akhilwaghmare/goli" target="_blank" rel="noreferrer">
            <Github aria-hidden="true" />
            GitHub
          </a>
        </Button>
      </nav>
      <section
        id="top"
        className="flex min-h-[600px] flex-col items-center bg-[#f7f5ef] bg-[radial-gradient(circle_at_80%_12%,#d8ead3_0,transparent_24%)] px-7 py-[106px] text-center min-[1140px]:px-[calc((100vw-1084px)/2)] max-[700px]:py-20"
      >
        <h1 className="max-w-[700px] font-['Newsreader'] text-[clamp(56px,9vw,112px)] leading-[.88] font-semibold tracking-[-.06em]">
          Private, local shortlinks
        </h1>
        <p className="my-[35px] max-w-[570px] text-xl leading-[1.5] text-[#4b5a51]">Create links with no limits. Use in any browser.</p>
        <div id="download" className="flex items-center justify-center">
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
        <div className="mt-12 w-full max-w-[540px] rounded-xl bg-[#17241e] p-7 text-left font-['DM_Mono'] text-base text-[#f8f7f2] shadow-[12px_12px_0_#d8ead3]">
          <p><span className="text-[#a4d79a]">›</span> go.li/calendar</p>
          <p className="text-[13px] text-[#9ca89f]">Opening calendar.google.com…</p>
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
      <section className="mx-auto grid max-w-[1084px] grid-cols-3 gap-6 px-7 py-[110px] max-[700px]:grid-cols-1 max-[700px]:py-[70px]">
        <Card className="gap-0 border-[#dfded6] bg-[#fdfcf8] py-0 shadow-none">
          <CardHeader className="gap-4 p-7">
            <HardDrive aria-hidden="true" className="size-5 text-[#507b63]" />
            <CardTitle className="font-['Newsreader'] text-[28px] leading-none tracking-[-.03em]">Stays on your computer</CardTitle>
            <CardDescription className="text-[15px] leading-[1.65] text-[#4b5a51]">
              Goli runs only on your Mac. Your links, destinations, and visit counts are kept in a local database—not a cloud account.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="gap-0 border-[#dfded6] bg-[#fdfcf8] py-0 shadow-none">
          <CardHeader className="gap-4 p-7">
            <Globe2 aria-hidden="true" className="size-5 text-[#507b63]" />
            <CardTitle className="font-['Newsreader'] text-[28px] leading-none tracking-[-.03em]">Works in any browser</CardTitle>
            <CardDescription className="text-[15px] leading-[1.65] text-[#4b5a51]">
              Use the same shortlinks in Safari, Chrome, Firefox, or whichever browser you prefer.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="gap-0 border-[#dfded6] bg-[#fdfcf8] py-0 shadow-none">
          <CardHeader className="gap-4 p-7">
            <Code2 aria-hidden="true" className="size-5 text-[#507b63]" />
            <CardTitle className="font-['Newsreader'] text-[28px] leading-none tracking-[-.03em]">Open source</CardTitle>
            <CardDescription className="text-[15px] leading-[1.65] text-[#4b5a51]">
              Inspect the code, make it your own, or help shape what Goli becomes next.
            </CardDescription>
          </CardHeader>
        </Card>
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
