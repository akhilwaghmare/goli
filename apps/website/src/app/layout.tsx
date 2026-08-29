import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Goli — shortcuts for your Mac", description: "Personal browser shortcuts that stay on your Mac." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="m-0 bg-[#f7f5ef] font-['DM_Sans'] text-[#17241e]">{children}</body>
    </html>
  );
}
