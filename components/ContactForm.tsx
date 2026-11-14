"use client";
import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="card"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        (e.target as HTMLFormElement).reset();
      }}
    >
      <div className="field">
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" type="text" required placeholder="Jane Smith" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="jane@company.com" />
      </div>
      <div className="field">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" placeholder="Your company" />
      </div>
      <div className="field">
        <label htmlFor="interest">Interested in</label>
        <select id="interest" name="interest" defaultValue="Resilient Solid Tires">
          <option>Resilient Solid Tires</option>
          <option>Press-On Band Tires</option>
          <option>Skid Steer Tires</option>
          <option>Port Tires</option>
          <option>Private-label / OEM program</option>
          <option>General enquiry</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="msg">Message</label>
        <textarea id="msg" name="msg" placeholder="Tell us about your equipment and operating conditions…" />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
        Send Message →
      </button>
      {sent && (
        <div className="form-ok">
          ✓ Thanks — your message is ready to send. We&apos;ll be in touch shortly. (Demo form — connect to your
          mail handler to go live.)
        </div>
      )}
    </form>
  );
}
