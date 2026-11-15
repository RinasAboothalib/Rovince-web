import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollMotion from "@/components/ScrollMotion";
import { QuoteProvider } from "@/lib/quote";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cond = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-cond",
  display: "swap",
});

const SITE = "https://www.rovincetire.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Rovince Tire — Solid Industrial Tires, Find Your Size",
    template: "%s | Rovince Tire",
  },
  description:
    "Solid tires for forklifts, skid steers and port machines. Find your size, see the load it carries and its stock, and add it to a quote. Made in Sri Lanka, shipped from Compton, California.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rovince Tire",
    url: SITE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Compton",
      addressRegion: "CA",
      addressCountry: "US",
    },
    telephone: "+1-562-555-0143",
  };
  return (
    <html lang="en" className={`${inter.variable} ${cond.variable}`}>
      <body>
        <QuoteProvider>
          <div className="bg-grid" />
          <ScrollMotion />
          <Header />
          <main>{children}</main>
          <Footer />
        </QuoteProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
      </body>
    </html>
  );
}
