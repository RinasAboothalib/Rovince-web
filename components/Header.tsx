"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOGO } from "@/lib/products";
import { useQuote } from "@/lib/quote";

const LINES = [
  { href: "/tires/resilient-solid", label: "Resilient Solid" },
  { href: "/tires/press-on-band", label: "Press-On Band" },
  { href: "/tires/skid-steer", label: "Skid Steer" },
  { href: "/tires/port", label: "Port" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useQuote();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => (pathname === href ? "active" : "");

  return (
    <>
      <header className={"site-header" + (scrolled ? " scrolled" : "")}>
        <div className="wrap nav">
          <Link href="/" className="logo" aria-label="Rovince Tire — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Rovince Tire" />
          </Link>
          <nav aria-label="Primary">
            <ul>
              <li><Link href="/" className={active("/")}>Find a size</Link></li>
              <li><Link href="/machine" className={active("/machine")}>Pick your machine</Link></li>
              <li className="has-menu">
                <button type="button" aria-haspopup="true">Tire lines ▾</button>
                <div className="submenu">
                  <Link href="/sizes">All sizes</Link>
                  {LINES.map((l) => (
                    <Link key={l.href} href={l.href}>{l.label}</Link>
                  ))}
                </div>
              </li>
              <li><Link href="/about" className={active("/about")}>About</Link></li>
              <li><Link href="/contact" className={active("/contact")}>Contact</Link></li>
            </ul>
          </nav>
          <div className="nav-right">
            <a className="us-phone" href="tel:+15625550143">
              <span aria-hidden>📞</span> <span className="num">+1 (562) 555-0143</span>
            </a>
            <Link href="/quote" className="quote-pill" aria-label={`Quote list, ${count} tires`}>
              Quote list <span className="q-count">{count}</span>
            </Link>
            <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              ☰
            </button>
          </div>
        </div>
      </header>
      <div className={"mobile-menu" + (open ? " open" : "")}>
        <Link href="/" onClick={() => setOpen(false)}>Find a size</Link>
        <Link href="/machine" onClick={() => setOpen(false)}>Pick your machine</Link>
        <Link href="/sizes" onClick={() => setOpen(false)}>All sizes</Link>
        {LINES.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        <a href="tel:+15625550143">+1 (562) 555-0143</a>
      </div>
    </>
  );
}
