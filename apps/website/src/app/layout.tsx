import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Goli — shortcuts for your Mac", description: "Personal browser shortcuts that stay on your Mac." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
