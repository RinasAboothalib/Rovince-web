import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Rovince — Let's Roll Together",
  description:
    "Get a quote, partner with Rovince, or learn more about our industrial tires. Great journeys start with a simple hello.",
};

export default function Contact() {
  return (
    <>
      <section className="pbanner">
        <div className="wrap">
          <Reveal as="p" className="crumb"><Link href="/">Home</Link> / Contact</Reveal>
          <Reveal delay={1}><h1>Let&apos;s Roll <span className="grad">Together</span></h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              Whether you need a quote, want to partner with us, or just want to learn more about our tires —
              we&apos;re here and ready to talk. Great journeys start with a simple hello.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap contact-grid">
          <Reveal>
            <span className="eyebrow">Get in Touch</span>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.3rem)", margin: ".3em 0 1em" }}>Reach the Rovince team</h2>
            <div className="info-item"><div className="ic">✉️</div><div><h4>Email</h4><a href="mailto:info@rovincetire.com">info@rovincetire.com</a></div></div>
            <div className="info-item"><div className="ic">🌐</div><div><h4>Website</h4><a href="https://www.rovincetire.com" target="_blank" rel="noopener noreferrer">www.rovincetire.com</a></div></div>
            <div className="info-item"><div className="ic">🏭</div><div><h4>Manufacturing</h4><p>Premium natural rubber · Made in Sri Lanka</p></div></div>
            <div className="info-item"><div className="ic">🇺🇸</div><div><h4>Standards</h4><p>USA-based solid tire manufacturer · American industrial standards</p></div></div>
          </Reveal>
          <Reveal delay={1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
