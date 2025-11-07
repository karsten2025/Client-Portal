// app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UnderConstruction from "./components/UnderConstruction";
import { LanguageProvider } from "./lang/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Client portal for offer drafting and collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UnderConstruction />
        {/* Wichtig: useSearchParams im Provider muss unter Suspense hängen */}
        <Suspense fallback={null}>
          <LanguageProvider>{children}</LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
