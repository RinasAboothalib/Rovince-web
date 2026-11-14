import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });

export const metadata: Metadata = {
  title: "Rovince Tire — Industrial Tires Engineered for Strength",
  description:
    "Rovince — Sri Lanka's first USA-based solid industrial tire manufacturer. Built for strength, safety and 4000+ hours of unmatched performance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body>
        <div className="bg-grid" />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
