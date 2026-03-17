import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";

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
  title: "Joshua BROCHOT | Portfolio",
  description:
    "Étudiant en BUT Informatique à l'IUT de Metz, développeur web en recherche de stage.",
  keywords: [
    "Joshua Brochot",
    "développeur",
    "portfolio",
    "BUT Informatique",
    "stage",
    "développeur web",
  ],
  authors: [{ name: "Joshua Brochot" }],
  openGraph: {
    title: "Joshua BROCHOT | Portfolio",
    description:
      "Étudiant en BUT Informatique à l'IUT de Metz, développeur web en recherche de stage.",
    type: "website",
    locale: "fr_FR",
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
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
