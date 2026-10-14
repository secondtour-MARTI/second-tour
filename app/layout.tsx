import type { Metadata, Viewport } from "next";
import { Archivo_Black, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Pied from "@/components/pied";
import "./globals.css";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const source = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Second Tour — Le rappel qui fait revenir tes clients au garage",
  description:
    "Tes clients ne reviennent pas parce qu'ils oublient. Second Tour leur envoie le bon rappel au bon moment, tout seul.",
  openGraph: {
    title: "Le rappel qui fait revenir tes clients au garage, tout seul.",
    description:
      "Vidange, pneus, révision : Second Tour rappelle tes clients au bon moment. Fais le diagnostic gratuit.",
    locale: "fr_FR",
    type: "website",
    siteName: "Second Tour",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f3b2d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${source.variable}`}>
      <body>
        {children}
        <Pied />
        <Analytics />
      </body>
    </html>
  );
}
