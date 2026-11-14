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
              Sri Lanka&apos;s first and only USA-based solid industrial tire manufacturer.
              Built for strength, safety, and 4000+ hours of unmatched performance.
            </p>
          </div>
          <div className="foot-col">
            <h4>Products</h4>
            <Link href="/products">Resilient Solid Tires</Link>
            <Link href="/products">Press-On Band Tires</Link>
            <Link href="/products">Skid Steer Tires</Link>
            <Link href="/products">Port Tires</Link>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/industries">Industries</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="foot-col">
            <h4>Compliance</h4>
            <Link href="/about#compliance">REACH</Link>
            <Link href="/about#compliance">Tire &amp; Rim Association</Link>
            <Link href="/about#compliance">ETRTO</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Rovince Tire. All rights reserved.</span>
          <span>Premium natural rubber · Made in Sri Lanka</span>
        </div>
      </div>
    </footer>
  );
}
