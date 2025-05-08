// app/layout.tsx ou app/layout.js
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { DirProvider } from "./context/DirContext";

export const metadata: Metadata = {
  title: "Basketball Scorer",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  description: "Record your basketball games effortlessly! Basketball Scorer lets you manage your players, record scores, and track results and stats in real time on any device.",
  keywords: [
    // 🇧🇷 Português
    "Placar de Basquete",
    "Pontuação de Times",
    "Marcador de Jogos de Basquete",
    "Aplicativo de basquete",
    "Registrar partidas de basquete",

    // 🇺🇸 English
    "Basketball Scorer",
    "Basketball Score Tracker",
    "Basketball Score App",
    "Team Scoreboard",
    "Live Basketball Score Recorder",

    // 🇪🇸 Spanish
    "Marcador de Baloncesto",
    "Puntaje de Equipos",
    "Registrar partidos de baloncesto",

    // 🇫🇷 French
    "Scoreur de Basket",
    "Application de Score Basket",

    // 🇩🇪 German
    "Basketball Punktestand App",

    // 🇮🇹 Italian
    "Punteggio Basket",

    // 🇰🇷 Korean
    "농구 점수 기록 앱",

    // 🇯🇵 Japanese
    "バスケットボールスコア記録",

    // 🇮🇳 Hindi / English
    "Basketball Scoring Hindi",
    "बास्केटबॉल स्कोर ट्रैकर"
  ],
  openGraph: {
    title: "Basketball Scorer",
    description: "Record your basketball games effortlessly! Basketball Scorer lets you manage your players, record scores, and track results and stats in real time on any device.",
    url: "/",
    siteName: "Basketball Scorer - Record your basketball games",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Basketball Scorer",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-zinc-900 flex flex-col min-h-screen">
        <LanguageProvider>
          <DirProvider>
            <main className="flex-grow">{children}</main>
            <Analytics />
            <Footer />
          </DirProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
