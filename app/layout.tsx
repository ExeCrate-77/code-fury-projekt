import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentMkt — Build, Compose, Monetize AI Agents",
  description:
    "A marketplace and builder platform: assemble AI agents from a Model, a Skill and Tools, test them live, and publish them as metered APIs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Nav />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
        <footer className="border-t-2 border-foreground">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:px-8">
            <span>AgentMkt — Build / Compose / Monetize</span>
            <span>Model + Skill + Tools = Agent</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
