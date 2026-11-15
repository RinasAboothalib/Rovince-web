import Link from "next/link";
import { LOGO } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Rovince Tire" />
            <p>
              Solid tires for forklifts, skid steers and port machines. Made in Nattandiya, Sri Lanka;
              sold and shipped from Compton, California.
            </p>
            <p style={{ marginTop: 10 }}>
              <a href="tel:+15625550143">+1 (562) 555-0143</a> ·{" "}
              <a href="mailto:sales@rovincetire.com">sales@rovincetire.com</a>
            </p>
          </div>
          <div className="foot-col">
            <h4>Find a tire</h4>
            <Link href="/">Find a size</Link>
            <Link href="/sizes">All sizes</Link>
            <Link href="/machine">Pick your machine</Link>
            <Link href="/quote">Quote list</Link>
          </div>
          <div className="foot-col">
            <h4>Tire lines</h4>
            <Link href="/tires/resilient-solid">Resilient Solid</Link>
            <Link href="/tires/press-on-band">Press-On Band</Link>
            <Link href="/tires/skid-steer">Skid Steer</Link>
            <Link href="/tires/port">Port</Link>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/compliance">Compliance</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Rovince Tire. All rights reserved.</span>
          <span className="endorsement">
            Part of{" "}
            <a href="https://plac.global" target="_blank" rel="noopener noreferrer">
              plac. global holdings
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
