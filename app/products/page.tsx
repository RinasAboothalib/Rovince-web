import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineupWheel from "@/components/LineupWheel";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Rovince Products — Industrial Tire Lineup",
  description:
    "Rovince industrial tire lineup: resilient solid tires, press-on band tires, skid steer tires and port tires — engineered to American standards.",
};

export default function Products() {
  return (
    <>
      <section className="pbanner">
        <div className="wrap">
          <Reveal as="p" className="crumb"><Link href="/">Home</Link> / Products</Reveal>
          <Reveal delay={1}><h1>Our Product <span className="grad">Lineup</span></h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              From forklift tires to port handling tires — every Rovince product is engineered to meet American
              industrial standards for strength, safety and long-lasting performance.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Product lineup wheel */}
      <LineupWheel />

      {/* Detailed grid */}
      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Full Range</span>
            <h2>Engineered for Every Application</h2>
          </Reveal>
          <div className="prod-grid two">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} className="prod two" delay={(i % 2) as 0 | 1}>
                <div className="pimg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="pbody">
                  <div className="psub">{p.sub}</div>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <Link href="/contact" className="arrow">Request specs →</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="cta-band">
            <span className="eyebrow">Need a Spec Sheet?</span>
            <h2>Find the Right Tire for Your Fleet</h2>
            <p>Tell us your equipment and operating conditions — we&apos;ll match you to the right Rovince line, OEM or private-label.</p>
            <Link href="/contact" className="btn btn-primary">Request a Quote →</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
