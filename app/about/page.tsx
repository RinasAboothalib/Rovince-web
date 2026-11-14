import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import { IMG_BASE } from "@/lib/products";

export const metadata: Metadata = {
  title: "About Rovince — Industrial Tire Engineering",
  description:
    "Rovince is Sri Lanka's first and only USA-based solid tire manufacturer, producing premium industrial tires from Sri Lankan natural rubber.",
};

const VALUES = [
  ["🌿", "Premium Rubber, Built for Durability", "Every Rovince tire is made with the best natural rubber from Sri Lanka, where the world's finest natural rubber grows. High-quality compounds guarantee long-lasting treads, resistance to damage, and optimal performance in heavy-duty, puncture-prone environments."],
  ["⚡", "Built for the Grind 24/7", "Industries never stop — and neither do our tires. Engineered for puncture resistance and high load capacities, they help keep your operations running without interruption. Our zero-downtime promise keeps your business moving no matter what."],
  ["⏱️", "4000 Hours of Performance", "Rovince tires are engineered to deliver over 4,000 working hours — reducing replacements, minimizing downtime, and maximizing return on investment for continuous operation on ports, fleets and sites."],
  ["🏷️", "Your Brand, Our Craftsmanship", "Have a vision for your own tire brand? Our private label manufacturing program gives you world-class tires with your name on them — you own the product, the market, and the profits."],
  ["💰", "Premium Quality, Competitive Pricing", "You don't have to choose between performance and price. Rovince delivers exceptional value as the best-priced premium tire brand proudly made in Sri Lanka."],
  ["🏛️", "Real-World Expertise", "With decades of experience in industrial tire engineering and manufacturing, Rovince brings precision and reliability to every yard, warehouse and construction zone."],
];

export default function About() {
  return (
    <>
      <section className="pbanner">
        <div className="wrap">
          <Reveal as="p" className="crumb"><Link href="/">Home</Link> / About</Reveal>
          <Reveal delay={1}>
            <h1>American Standards,<br /><span className="grad">Global Trust</span></h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead">Decades of industrial tire engineering, built into every product we deliver.</p>
          </Reveal>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap split">
          <Reveal className="media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG_BASE + "home_about_1.webp"} alt="Rovince tire manufacturing" />
          </Reveal>
          <Reveal delay={1}>
            <span className="eyebrow">Who We Are</span>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: ".3em 0" }}>
              We don&apos;t just manufacture tires — we engineer endurance.
            </h2>
            <p className="lead">
              At Rovince, we specialize in industrial tires engineered for reliability, safety, and endurance.
              Each tire is crafted using premium compounds and advanced engineering to meet strict international
              and USA standards. We are Sri Lanka&apos;s first and only USA-based solid tire manufacturer,
              producing tires from Sri Lankan premium natural rubber.
            </p>
            <p className="lead" style={{ marginTop: "1em" }}>
              Rovince industrial &amp; construction tires deliver maximum load-bearing capacity, superior grip,
              and long-lasting durability, even in the most demanding environments. For years, Rovince tires have
              been trusted by industries and construction operations across the USA.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">What Makes Us a Class Apart</span>
            <h2>Built Different, From the Ground Up</h2>
          </Reveal>
          <div className="feat-grid">
            {VALUES.map(([ic, h, p], i) => (
              <Reveal key={h} className="card" delay={(i % 3) as 0 | 1 | 2}>
                <div className="ic">{ic}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec stats">
        <div className="wrap">
          <div className="sec-head center"><span className="eyebrow">Tough Tires. Stronger Numbers.</span></div>
          <Stats />
        </div>
      </section>

      <section className="sec" id="compliance">
        <div className="wrap">
          <Reveal className="sec-head center">
            <span className="eyebrow">Unmatched Compliance Excellence</span>
            <h2>Certified. Compliant. Dependable.</h2>
          </Reveal>
          <div className="comp-grid">
            <Reveal className="comp"><div className="badge">REACH</div><p>Chemicals approved by the European Chemical Directive.</p></Reveal>
            <Reveal className="comp" delay={1}><div className="badge">The Tire &amp; Rim Association</div><p>Ensures full load capacity and safety standards.</p></Reveal>
            <Reveal className="comp" delay={2}><div className="badge">ETRTO</div><p>Ensures full load capacity and safety standards.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="cta-band">
            <span className="eyebrow">Let&apos;s Roll Together</span>
            <h2>Partner With Rovince</h2>
            <p>OEM, private-label or a single quote — great journeys start with a simple hello.</p>
            <Link href="/contact" className="btn btn-primary">Contact Us →</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
