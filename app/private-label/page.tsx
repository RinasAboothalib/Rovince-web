import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Private Label / OEM",
  description: "Private-label and OEM solid tire manufacturing from Rovince.",
  alternates: { canonical: "/private-label" },
  robots: { index: false },
};

export default function PrivateLabelPage() {
  return (
    <section className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="sec-head">
          <span className="eyebrow">OEM &amp; private label</span>
          <h2>Your brand, our tires</h2>
        </div>
        <div className="card">
          <p className="lead">
            This page is a placeholder. <span className="confirm-tag">[confirm with Rovince]</span> whether private
            label / OEM is offered today, and on which lines and minimum volumes, before it goes live.
          </p>
          <p className="lead" style={{ marginTop: "1em" }}>
            In the meantime, <Link href="/contact" style={{ textDecoration: "underline" }}>contact US sales</Link> to discuss.
          </p>
        </div>
      </div>
    </section>
  );
}
