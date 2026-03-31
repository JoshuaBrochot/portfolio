import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/ui/Preloader";
import { LocaleProvider } from "@/context/LocaleContext";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joshua Brochot — Portfolio",
  description:
    "Étudiant BUT3 Informatique à l'IUT de Metz, disponible en stage de février à juin 2026. Spécialisé React, Next.js, TypeScript, Python et SQL.",
  metadataBase: new URL("https://jbrochot.fr"),
  keywords: [
    "Joshua Brochot",
    "développeur",
    "portfolio",
    "BUT Informatique",
    "stage",
    "développeur web",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "SQL",
  ],
  authors: [{ name: "Joshua Brochot" }],
  openGraph: {
    title: "Joshua Brochot — Portfolio",
    description: "Étudiant BUT3 Informatique · Disponible en stage fév–juin 2026",
    url: "https://jbrochot.fr",
    siteName: "Portfolio Joshua Brochot",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshua Brochot — Portfolio",
    description: "Étudiant BUT3 Informatique · Disponible en stage fév–juin 2026",
  },
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${syne.variable} ${ibmPlexMono.variable} antialiased`}>
        <LocaleProvider>
          <Preloader />
          <SmoothScrollProvider>
            <Navbar />
            {children}
          </SmoothScrollProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
