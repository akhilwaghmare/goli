import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = { title: "goli — shortcuts for your Mac", description: "Personal browser shortcuts that stay on your Mac." };

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const dmMono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-dm-mono", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${newsreader.variable} scroll-smooth`}>
      <body className="m-0 bg-[#f7f5ef] font-dm-sans text-[#17241e]">{children}</body>
    </html>
  );
}
