"use client";
/* Premium 3D tire showcase — hero canvas + hotspot panels + spec cards. */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import type { Hotspot } from "./TireScene";

const TireScene = dynamic(() => import("./TireScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const SPECS: [string, string][] = [
  ["Brand / Model", "Rovince RS-500"],
  ["Category", "Resilient Solid — Industrial"],
  ["Tire Width", "165 mm"],
  ["Aspect Ratio", "Solid (no air)"],
  ["Rim Diameter", '10"'],
  ["Load Index", "168 (5,000 kg)"],
  ["Speed Rating", "A8 — 25 km/h"],
  ["Tread Depth", "14.5 mm"],
  ["Working Hours", "4,000+ hours"],
  ["Application", "Forklifts · Ports · Yards"],
];

const PERFORMANCE = [
  ["Puncture-Proof", "Solid three-stage carcass — zero downtime, zero flats."],
  ["Cut Resistance", "Compound engineered against chunking and tearing."],
  ["Stability", "Low deflection under full-rated container loads."],
  ["Longevity", "4,000+ working hours across back-to-back shifts."],
];

export default function Showcase() {
  const [hot, setHot] = useState<Hotspot | null>(null);
  const scrollRef = useRef({ v: 0 });
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* scroll-driven camera feel: rotate the tire as the page scrolls */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#showcase-hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollRef.current.v = self.progress;
        },
      });
      gsap.utils.toArray<HTMLElement>(".spec-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 42, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: (i % 4) * 0.08,
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    }, specsRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#0a0a0b] text-white min-h-screen selection:bg-orange-500/40">
      {/* ---------------- HERO / 3D STAGE ---------------- */}
      <section
        id="showcase-hero"
        className="relative h-[110vh]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 10%, #17171a 0%, #0a0a0b 65%)",
        }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* canvas */}
          <div className="absolute inset-0">
            <TireScene onPick={setHot} scrollRef={scrollRef} />
          </div>

          {/* top bar */}
          <header className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 md:px-12 py-6">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase backdrop-blur-md"
              style={{ color: "#e7e7ea" }}
            >
              <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_#ff7a1a]" />
              Zero Downtime
            </span>
            <Link
              href="/"
              className="text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition"
            >
              Rovince →
            </Link>
          </header>

          {/* hero typography */}
          <div className="pointer-events-none absolute top-[14%] inset-x-0 z-0 text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[13vw] md:text-[7.5vw] font-black uppercase leading-none tracking-tight"
            >
              RS<span className="text-orange-500">–</span>500
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-3 text-sm md:text-base tracking-[0.3em] uppercase text-white/45"
            >
              Resilient Solid · 360° Inspection
            </motion.p>
          </div>

          {/* hotspot info panel */}
          <div className="absolute bottom-24 left-6 md:left-12 z-10 max-w-sm">
            <AnimatePresence mode="wait">
              {hot && (
                <motion.div
                  key={hot.id}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl shadow-2xl"
                >
                  <div className="mb-3 flex items-center justify-between gap-6">
                    <h3 className="text-sm font-bold tracking-[0.18em] uppercase text-orange-400">
                      {hot.title}
                    </h3>
                    <button
                      onClick={() => setHot(null)}
                      className="text-white/40 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {hot.lines.map((l) => (
                      <li key={l} className="text-sm leading-relaxed text-white/70">
                        {l}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* control hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="pointer-events-none absolute bottom-6 inset-x-0 z-10 text-center text-[11px] tracking-[0.25em] uppercase text-white/35"
          >
            Drag to rotate · Scroll to zoom · Tap ● hotspots
          </motion.div>
        </div>
      </section>

      {/* ---------------- SPECIFICATIONS ---------------- */}
      <section ref={specsRef} className="relative px-6 md:px-12 py-28 md:py-40 max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-orange-500">
            Technical Specifications
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black uppercase tracking-tight">
            Built to Spec.
            <br />
            <span className="text-white/40">Rated to Last.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SPECS.map(([k, v]) => (
            <div
              key={k}
              className="spec-card rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-colors hover:border-orange-500/50"
            >
              <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40">
                {k}
              </div>
              <div className="mt-2 text-base md:text-lg font-bold">{v}</div>
            </div>
          ))}
        </div>

        {/* performance */}
        <div className="mt-20 grid md:grid-cols-2 gap-4">
          {PERFORMANCE.map(([k, v]) => (
            <div
              key={k}
              className="spec-card rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-8 backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold text-orange-400">{k}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 rounded-full bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-orange-400"
          >
            Explore the full lineup →
          </Link>
        </div>
      </section>
    </main>
  );
}
