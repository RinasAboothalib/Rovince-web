import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT, CLASS_APART } from "@/lib/content";
import { ABOUT_PHOTO } from "@/lib/media";

export const metadata: Metadata = {
  title: "About Rovince Tire",
  description:
    "Rovince builds solid industrial tires at its own plant in Nattandiya, Sri Lanka, and sells and ships them to US customers from Compton, California. Exporting to 20+ countries.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">About · where strength meets precision</span>
          <h2>Solid tires, built in Sri Lanka, sold from California</h2>
          <p className="lead">{ABOUT.lead}</p>
        </div>

        <div className="split">
          <div>
            {ABOUT.body.map((p, i) => (
              <p className="lead" key={i} style={{ marginBottom: "1em" }}>{p}</p>
            ))}
            <p className="exports">
              <strong>Exports:</strong> {ABOUT.exports.join(" · ")} <span className="confirm-tag">[confirm list]</span>
            </p>
          </div>
          <div className="media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ABOUT_PHOTO} alt="Rovince tire manufacturing" />
          </div>
        </div>

        {/* facility + vision + mission */}
        <div className="feat-grid" style={{ marginTop: 50 }}>
          <div className="card"><h3>Our facility — Nattandiya</h3><p>{ABOUT.facility} <span className="confirm-tag">[real plant photos to come]</span></p></div>
          <div className="card"><h3>Our vision</h3><p>&ldquo;{ABOUT.vision}&rdquo;</p></div>
          <div className="card"><h3>Our mission</h3><p>{ABOUT.mission}</p></div>
        </div>

        {/* what makes Rovince a class apart */}
        <div className="sec-head" style={{ marginTop: 60 }}>
          <span className="eyebrow">A class apart</span>
          <h2>What makes Rovince tires different</h2>
        </div>
        <div className="feat-grid">
          {CLASS_APART.map((c) => (
            <div className="card" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body} {c.confirm && <span className="confirm-tag">[confirm test conditions]</span>}</p>
            </div>
          ))}
        </div>

        {/* core values */}
        <div className="sec-head" style={{ marginTop: 60 }}>
          <span className="eyebrow">Core values</span>
          <h2>What we stand on</h2>
        </div>
        <div className="values-grid">
          {ABOUT.values.map((v) => (
            <div className="value" key={v.k}>
              <strong>{v.k}</strong>
              <p>{v.v}</p>
            </div>
          ))}
        </div>

        <div className="dealer-cta" style={{ marginTop: 60 }}>
          <div>
            <span className="eyebrow">Work with us</span>
            <h2>Become a Rovince dealer</h2>
            <p className="lead">Great journeys start with a simple hello.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">Contact us →</Link>
        </div>
      </div>
    </section>
  );
}
