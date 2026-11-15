import Link from "next/link";
import SizeSearch from "@/components/SizeSearch";
import Sidewall from "@/components/Sidewall";
import { FAMILIES } from "@/data/sizes";
import { HERO_BANNER, INDUSTRIES, familyTire } from "@/lib/media";

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
            <h1>What does your<br />old tire say?</h1>
            <p className="lead">
              Type the size from its sidewall. We&apos;ll show you the Rovince tire that fits, what it carries
              and where it ships from.
            </p>
            <SizeSearch autofocus />
          </div>
          <div className="home-hero-art">
            <Sidewall size="6.50-10" line="R1 Super Premium" pattern="Traction" />
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <section className="proof-strip">
        <div className="wrap proof-grid">
          <div><strong>Since 2014</strong><span>First solid tire built in Sri Lanka</span></div>
          <div><strong>About 70 sizes</strong><span>Across four tire lines</span></div>
          <div><strong>Black or grey</strong><span>Non-marking grey in every size</span></div>
          <div><strong>Compton, CA</strong><span>Ships in 1–2 working days <em className="confirm-tag">[confirm]</em></span></div>
        </div>
      </section>

      {/* TIRE LINES */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Four tire lines</span>
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

      {/* INDUSTRIES — original site photos + copy */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Built for every industry</span>
            <h2>Trusted where performance can&apos;t stop</h2>
            <p className="lead">
              From bustling warehouses to rugged mining fields, Rovince tires are trusted by industries that
              demand strength, reliability and non-stop performance.
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

      {/* COMPLIANCE STRIP */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="comp-strip">
            <span className="eyebrow">Made to standard</span>
            <div className="comp-strip-items">
              <span>REACH (EC 1907/2006)</span>
              <span>Tire &amp; Rim Association</span>
              <span>ETRTO</span>
              <Link href="/compliance" className="comp-strip-link">See compliance →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* DEALER CTA */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="dealer-cta">
            <div>
              <span className="eyebrow">For tire dealers &amp; fleets</span>
              <h2>Check a size, its load and its stock — then quote it.</h2>
              <p className="lead">Add several sizes to one quote list and send a single request. No email thread per size.</p>
            </div>
            <div className="dealer-cta-btns">
              <Link href="/contact" className="btn btn-primary">Become a dealer</Link>
              <Link href="/quote" className="btn btn-quote">View quote list →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
