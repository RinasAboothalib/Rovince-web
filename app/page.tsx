import Link from "next/link";
import SizeSearch from "@/components/SizeSearch";
import Sidewall from "@/components/Sidewall";
import { FAMILIES } from "@/data/sizes";
import {
  HERO_BANNER,
  ABOUT_PHOTO,
  INDUSTRIES,
  familyTire,
} from "@/lib/media";

const FEATURES = [
  {
    title: "American Standards, Global Trust",
    body:
      "With decades of experience in industrial tire engineering and manufacturing, Rovince Tires brings real-world industrial expertise to every product we deliver. Whether you work in industrial yards, warehouses, or construction zones, it delivers the strength, safety, and durability needed to withstand the demanding working conditions.",
  },
  {
    title: "Premium Rubber, Built for Durability",
    body:
      "Every Rovince tire is made with the best natural rubber from Sri Lanka, where the world's finest natural rubber grows. The high-quality rubber compounds guarantee that treads will last a long time, be highly resistant to damage, and deliver optimal performance in heavy-duty, puncture-prone environments. From warehouse forklift tires to skid steer tires, our unique rubber composition & precision engineering techniques deliver unbeatable resilience, reduced downtime, and extended tire life.",
  },
  {
    title: "Built for the Grind 24/7. Zero Downtime",
    body:
      "At Rovince, we understand that industries never stop. With back-to-back shifts and nonstop operations, your equipment needs to keep up. So do our tires. They are meant to last all day and all night, so operations can run smoothly, with minimum maintenance and maximum reliability. Engineered for puncture resistance and designed to handle high load capacities, Rovince tires help keep your operations running without interruption.",
  },
  {
    title: "4000 Hours of Unmatched Performance",
    body:
      "Rovince industrial tires are engineered to deliver an extended lifespan of over 4,000 working hours, providing the resilience industries require. Designed to reduce replacements, minimize downtime, and maximize return on investment, these tires are built for continuous operation. Whether used on port handling equipment, warehouse fleets, construction vehicles, or material handling machinery, Rovince tires deliver exceptional load-bearing strength and perform reliably under pressure.",
  },
  {
    title: "Your Brand, Our Craftsmanship",
    body:
      "Have a vision for your own tire brand? We make it real. With our private label manufacturing program, you get world-class tires with your name on them — so you own the product, the market, and the profits.",
  },
  {
    title: "Premium Quality, Competitive Pricing",
    body:
      "Who says you have to choose between performance and price? Rovince delivers exceptional value, making it the best-priced premium tire brand proudly made in Sri Lanka. Big performance, smart investment.",
  },
];

const STATS = [
  { num: "10+", lbl: "Years of Legacy" },
  { num: "2 Million+", lbl: "Tires Delivered" },
  { num: "20+", lbl: "Countries Exported" },
  { num: "99.5%", lbl: "On-Time Delivery Rate" },
  { num: "100%", lbl: "Customer Satisfaction" },
];

const COMPLIANCE = [
  { badge: "REACH", text: "Chemicals approved by the European Chemical Directive" },
  { badge: "Tire & Rim Association", text: "Ensure full load capacity and safety standards" },
  { badge: "ETRTO", text: "Ensure full load capacity and safety standards" },
];

export default function Home() {
  return (
    <>
      {/* HERO — tire-row banner backdrop + size search */}
      <section className="home-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="home-hero-bg" src={HERO_BANNER} alt="" aria-hidden />
        <div className="home-hero-shade" />
        <div className="wrap home-hero-grid">
          <div className="home-hero-copy">
            <span className="eyebrow">Rovince · solid industrial tires</span>
            <h1>Industrial Tires<br />Engineered for Strength</h1>
            <p className="lead">
              Built for performance. Type the size from your tire&apos;s sidewall and
              we&apos;ll show you the Rovince tire that fits, what it carries and
              where it ships from.
            </p>
            <SizeSearch autofocus />
          </div>
          <div className="home-hero-art">
            <Sidewall size="6.50-10" line="R1 Super Premium" pattern="Traction" />
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="sec">
        <div className="wrap about-grid">
          <div className="about-copy">
            <span className="eyebrow">About Us</span>
            <h2>We don&apos;t just manufacture tires</h2>
            <p className="lead">
              At Rovince, we specialize in industrial tires engineered for
              reliability, safety, and endurance. Each tire is crafted using
              premium compounds and advanced engineering to meet strict
              international and USA standards. We are Sri Lanka&apos;s first and
              only USA based solid tire manufacturer, producing tires from
              Sri Lankan premium natural rubber.
            </p>
            <p>
              Rovince industrial &amp; construction tires deliver maximum
              load-bearing capacity, superior grip, and long-lasting
              durability, even in the most demanding environments. For years,
              Rovince tires have been trusted by industries and construction
              operations across the USA. From forklifts in warehouses, skid
              steers on construction sites, material handling equipment in
              logistics hubs, to heavy machinery in manufacturing plants, our
              tires are proven to perform under pressure. With Rovince, you
              get stronger &amp; safer tires, ensuring longer operating hours
              and greater peace of mind.
            </p>
            <Link href="/about" className="btn btn-primary">Read more</Link>
          </div>
          <figure className="about-pic">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ABOUT_PHOTO} alt="Rovince industrial tire" loading="lazy" />
          </figure>
        </div>
      </section>

      {/* WHAT MAKES ROVINCE A CLASS APART */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Why Rovince</span>
            <h2>What makes Rovince tires a class apart</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <article className="feature-item" key={f.title}>
                <span className="feature-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — Tough Tires. Stronger Numbers */}
      <section className="stats">
        <div className="wrap">
          <div className="sec-head" style={{ textAlign: "center" }}>
            <span className="eyebrow">Proven track record</span>
            <h2>Tough tires. Stronger numbers.</h2>
          </div>
          <div className="stats-grid">
            {STATS.map((s) => (
              <div className="stat" key={s.lbl}>
                <div className="num">{s.num}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIRE LINES — Our product lineup */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Our product lineup</span>
            <h2>Built for forklifts, skid steers and port machines</h2>
          </div>
          <div className="line-cards">
            {FAMILIES.map((f) => (
              <Link key={f.slug} href={`/tires/${f.slug}`} className="line-card line-card-img">
                <span className="line-card-pic">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={familyTire(f.family)} alt={f.title} loading="lazy" />
                </span>
                <h3>{f.title}</h3>
                <p>{f.blurb}</p>
                <span className="line-card-go">See sizes →</span>
              </Link>
            ))}
          </div>
          <div className="home-no-size">
            <p>Don&apos;t know the size on your tire?</p>
            <div className="hns-btns">
              <Link href="/machine" className="btn btn-ghost">Pick your machine →</Link>
              <Link href="/sizes" className="btn btn-ghost">Browse all sizes →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES — Built for Every Industry */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Built for every industry</span>
            <h2>Trusted where performance can&apos;t stop</h2>
            <p className="lead">
              From bustling warehouses to rugged mining fields, Rovince tires
              are trusted by industries that demand strength, reliability and
              non-stop performance.
            </p>
          </div>
          <div className="industries-grid">
            {INDUSTRIES.map((i) => (
              <figure className="ind" key={i.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.img} alt={i.label} loading="lazy" />
                <figcaption>{i.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE — Unmatched Compliance Excellence */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head" style={{ textAlign: "center" }}>
            <span className="eyebrow">Made to standard</span>
            <h2>Unmatched compliance excellence</h2>
          </div>
          <div className="comp-grid">
            {COMPLIANCE.map((c) => (
              <div className="comp" key={c.badge}>
                <div className="badge">{c.badge}</div>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 18 }}>
            <Link href="/compliance" className="comp-strip-link">See full compliance details →</Link>
          </p>
        </div>
      </section>

      {/* SEO TEXT BLOCK */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap seo-block">
          <h2>Best industrial tires are from Rovince</h2>
          <p>
            At Rovince, we are dedicated to delivering the best industrial
            tires in the USA, built for industries that demand strength,
            safety, and long-lasting performance. The product lineup extends
            from forklift tires, skid steer tires, press-on tires, to port
            handling tires and all are engineered to meet the American
            industrial standards. From warehouses and logistics fleets to
            ports, quarries, and construction sites, Rovince ensures
            long-lasting performance with reduced downtime and lower cost per
            hour. Every tire is tested for strength and endurance, delivering
            reliable service for thousands of operating hours. With options
            for OEM and private-label solutions, Rovince is the trusted choice
            for American businesses seeking industrial tires USA that combine
            premium quality with competitive pricing.
          </p>
        </div>
      </section>

      {/* CTA — Let's Roll Together */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band">
            <span className="eyebrow">Get in touch</span>
            <h2>Let&apos;s roll together!</h2>
            <p>
              Whether you need a quote, want to partner with us, or just want
              to learn more about our tires, we&apos;re here and ready to talk.
              Because great journeys start with a simple hello.
            </p>
            <div className="dealer-cta-btns">
              <Link href="/contact" className="btn btn-primary">Contact us</Link>
              <Link href="/quote" className="btn btn-quote">View quote list →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
