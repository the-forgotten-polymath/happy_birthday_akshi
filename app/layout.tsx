import type { Metadata, Viewport } from "next";
import { Geist, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import { config } from "@/lib/config";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CursorGlow from "@/components/ui/CursorGlow";
import ParticleField from "@/components/ui/ParticleField";
import MusicPlayerBar from "@/components/ui/MusicPlayerBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `Happy 22nd Birthday, ${config.name} 🎉`,
  description: `Chapter 22 — a website built entirely for ${config.name}.`,
};

export const viewport: Viewport = {
  themeColor: "#06030f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="bg-ink relative min-h-full overflow-x-hidden">
        {/* Full-screen background image with blur overlay */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[-2]">
          <img
            src="/bg.png"
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover"
          />
          {/* 10% blur layer above the background */}
          <div className="absolute inset-0 backdrop-blur-[10px]" />
          {/* Dark blue-tinted overlay so text remains readable */}
          <div className="absolute inset-0 bg-[#0a1628]/50" />
        </div>
        <ParticleField />
        <CursorGlow />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
