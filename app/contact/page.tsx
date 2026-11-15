import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Rovince Tire",
  description:
    "US phone and sales email, Compton CA warehouse and the Nattandiya plant. Get a quote, become a dealer, or find a dealer near you.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Contact</span>
          <h2>Talk to US sales</h2>
          <p className="lead">
            For a price, add your sizes to the <Link href="/quote" style={{ textDecoration: "underline" }}>quote list</Link> and
            send one request. For anything else, reach us below.
          </p>
        </div>

        <div className="contact-grid">
          <div>
            <div className="info-item"><div className="ic">📞</div><div><h4>US Sales</h4><a href="tel:+15625550143">+1 (562) 555-0143</a><p style={{ marginTop: 2 }}>Mon–Fri, 8am–5pm PT <span className="confirm-tag">[confirm]</span></p></div></div>
            <div className="info-item"><div className="ic">✉️</div><div><h4>Sales email</h4><a href="mailto:sales@rovincetire.com">sales@rovincetire.com</a> <span className="confirm-tag">[confirm]</span></div></div>
            <div className="info-item"><div className="ic">🏬</div><div><h4>US warehouse</h4><p>Compton, California · ships in 1–2 working days</p></div></div>
            <div className="info-item"><div className="ic">🏭</div><div><h4>Plant</h4><p>Nattandiya, Sri Lanka</p></div></div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
