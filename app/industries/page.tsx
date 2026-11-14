import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { IMG_BASE } from "@/lib/products";

export const metadata: Metadata = {
  title: "Industries We Serve — Rovince Tire",
  description:
    "Rovince Tires are trusted across construction, warehousing, ports, mining, manufacturing, aviation ground support and recycling industries.",
};

const IND = [
  ["industry_1.webp", "Construction & Infrastructure"],
  ["industry_2.webp", "Warehousing & Logistics"],
  ["industry_3.webp", "Transport & Material Handling"],
  ["industry_4.webp", "Ports, Shipping & Container Yards"],
  ["industry_5.webp", "Mining & Quarrying"],
  ["industry_6.webp", "Manufacturing & Industrial Plants"],
  ["industry_7.webp", "Aviation & Ground Support"],
  ["industry_8.webp", "Scrap & Recycling Yards"],
];

export default function Industries() {
  return (
    <>
      <section className="pbanner">
        <div className="wrap">
          <Reveal as="p" className="crumb"><Link href="/">Home</Link> / Industries</Reveal>
          <Reveal delay={1}><h1>Built for <span className="grad">Every Industry</span></h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              From bustling warehouses to rugged mining fields, Rovince Tires are trusted by industries that
              demand strength, reliability, and non-stop performance.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="ind-grid">
            {IND.map(([img, label], i) => (
              <Reveal key={label} className="ind" delay={(i % 4) as 0 | 1 | 2 | 3}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_BASE + img} alt="" />
                <span>{label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <Reveal>
            <span className="eyebrow">Best Industrial Tires Are From Rovince</span>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: ".3em 0" }}>
              Long-lasting performance, lower cost per hour.
            </h2>
            <p className="lead">
              From warehouses and logistics fleets to ports, quarries, and construction sites, Rovince ensures
              long-lasting performance with reduced downtime and lower cost per hour. Every tire is tested for
              strength and endurance, delivering reliable service for thousands of operating hours.
            </p>
            <p className="lead" style={{ marginTop: "1em" }}>
              With options for OEM and private-label solutions, Rovince is the trusted choice for American
              businesses seeking industrial tires that combine premium quality with competitive pricing.
            </p>
            <Link href="/products" className="btn btn-ghost" style={{ marginTop: "1.6em" }}>
              Explore the lineup →
            </Link>
          </Reveal>
          <Reveal className="media" delay={1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_BASE + "industry_5.webp"} alt="Mining and quarrying tires" />
          </Reveal>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="cta-band">
            <span className="eyebrow">Let&apos;s Roll Together</span>
            <h2>Trusted Where Performance Can&apos;t Stop</h2>
            <p>Tell us about your operation and we&apos;ll recommend the Rovince line built for your conditions.</p>
            <Link href="/contact" className="btn btn-primary">Contact Us →</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
