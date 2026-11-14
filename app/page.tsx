import Link from "next/link";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import SizeFinder from "@/components/SizeFinder";
import LineupWheel from "@/components/LineupWheel";
import { IMG_BASE } from "@/lib/products";

const FEATURES = [
  ["🏛️", "American Standards, Global Trust", "Decades of industrial tire engineering deliver the precision and reliability industries demand — strength and durability for the most demanding working conditions."],
  ["🌿", "Premium Rubber, Built to Last", "Made with the world's finest natural rubber from Sri Lanka. High-quality compounds mean long-lasting treads, superior damage resistance, and optimal heavy-duty performance."],
  ["⚡", "Built for the Grind 24/7", "Engineered for puncture resistance and high load capacities, Rovince tires keep running through back-to-back shifts. Our zero-downtime promise keeps your business moving."],
  ["⏱️", "4000 Hours of Performance", "Engineered for 4,000+ working hours — reducing replacements, minimizing downtime, and maximizing return on investment for continuous operation."],
  ["🏷️", "Your Brand, Our Craftsmanship", "With our private label manufacturing program, you get world-class tires with your name on them — you own the product, the market, and the profits."],
  ["💰", "Premium Quality, Smart Price", "The best-priced premium tire brand proudly made in Sri Lanka. Big performance, smart investment — no compromise between performance and price."],
];

const IND = [
  ["industry_1.webp", "Construction & Infrastructure"],
  ["industry_2.webp", "Warehousing & Logistics"],
  ["industry_3.webp", "Transport & Material Handling"],
  ["industry_4.webp", "Ports, Shipping & Container Yards"],
];

export default function Home() {
  return (
    <>
      {/* HERO — old-site tire-row banner, restyled (no frame, no glow) */}
      <section className="hero-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-bg" src={IMG_BASE.replace("themes/rovincetire/assets/images/", "") + "uploads/2026/06/banner_1.jpg"} alt="Rovince industrial tire lineup" />
        <div className="hero-banner-shade" />
        <div className="wrap hero-banner-inner">
          <Reveal as="span" className="eyebrow">American Standards · Global Trust</Reveal>
          <Reveal delay={1}>
            <h1>
              Industrial Tires
              <br />
              Engineered for <span className="grad">Strength</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="hero-tagline">Built for Performance</p>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead">
              Sri Lanka&apos;s first and only USA-based solid tire manufacturer. Built from premium natural
              rubber for maximum load-bearing capacity, superior grip, and long-lasting durability — even in the
              most demanding environments.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="hero-cta">
              <Link href="/products" className="btn btn-primary">Explore Our Lineup →</Link>
              <Link href="/about" className="btn btn-ghost">Read More</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRODUCT LINEUP — turnable 3D wheel */}
      <LineupWheel />

      {/* SIZE FINDER — start from the size on the old tire */}
      <SizeFinder />

      {/* ABOUT */}
      <section className="sec">
        <div className="wrap split">
          <Reveal className="media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_BASE + "home_about_1.webp"} alt="Rovince tire manufacturing" />
          </Reveal>
          <Reveal delay={1}>
            <span className="eyebrow">About Us</span>
            <h2 style={{ fontSize: "clamp(1.9rem,4vw,3rem)", margin: ".3em 0" }}>
              We don&apos;t just make tires. We engineer endurance.
            </h2>
            <p className="lead">
              At Rovince, we specialize in industrial tires engineered for reliability, safety, and endurance.
              Each tire is crafted using premium compounds and advanced engineering to meet strict international
              and USA standards — produced from Sri Lankan premium natural rubber.
            </p>
            <p className="lead" style={{ marginTop: "1em" }}>
              From forklifts in warehouses and skid steers on construction sites to heavy machinery in
              manufacturing plants, our tires are proven to perform under pressure.
            </p>
            <Link href="/about" className="btn btn-ghost" style={{ marginTop: "1.6em" }}>
              More about us →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">A Class Apart</span>
            <h2>What Makes Rovince Tires Different</h2>
            <p className="lead">Real-world industrial expertise, built into every product we deliver.</p>
          </Reveal>
          <div className="feat-grid">
            {FEATURES.map(([ic, h, p], i) => (
              <Reveal key={h} className="card" delay={(i % 3) as 0 | 1 | 2}>
                <div className="ic">{ic}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="sec stats">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Tough Tires. Stronger Numbers.</span>
          </div>
          <Stats />
        </div>
      </section>

      {/* INDUSTRIES preview */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Built for Every Industry</span>
            <h2>Trusted Where Performance Can&apos;t Stop</h2>
            <p className="lead">
              From bustling warehouses to rugged mining fields, Rovince Tires are trusted by industries that
              demand strength, reliability, and non-stop performance.
            </p>
          </Reveal>
          <div className="ind-grid">
            {IND.map(([img, label], i) => (
              <Reveal key={label} className="ind" delay={(i % 4) as 0 | 1 | 2 | 3}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_BASE + img} alt="" />
                <span>{label}</span>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/industries" className="btn btn-ghost">See all industries →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="cta-band">
            <span className="eyebrow">Let&apos;s Roll Together</span>
            <h2>Great Journeys Start With a Simple Hello</h2>
            <p>
              Whether you need a quote, want to partner with us, or just want to learn more about our tires —
              we&apos;re here and ready to talk.
            </p>
            <Link href="/contact" className="btn btn-primary">Contact Us →</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
