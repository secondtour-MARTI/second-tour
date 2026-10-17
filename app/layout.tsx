import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Pied from "@/components/pied";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-atkinson",
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
  themeColor: "#1b3faf",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${atkinson.variable}`}>
      <body>
        {children}
        <Pied />
        <Analytics />
      </body>
    </html>
  );
}
