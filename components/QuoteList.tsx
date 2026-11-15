"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useQuote } from "@/lib/quote";
import { findByKey, normaliseSize, sizeHref } from "@/data/sizes";

export default function QuoteList() {
  const { lines, count, add, setQty, remove, clear, ready } = useQuote();
  const [newSize, setNewSize] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const addSize = () => {
    const s = newSize.trim();
    if (!s) return;
    const match = findByKey(s)[0];
    if (match) {
      add({ key: `${match.id}-Black`, size: match.size, line: `${match.family} · ${match.line}`, colour: "Black", meta: "load on request", href: sizeHref(match) });
    } else {
      add({ key: `freetext-${normaliseSize(s) || s}`, size: s, line: "Size not listed", colour: "—", meta: "We'll tell you if we can make it.", freeText: true });
    }
    setNewSize("");
  };

  const addPhoto = (file: File) => {
    add({ key: `photo-${Date.now()}`, size: "Size from your photo", line: file.name, colour: "—", meta: "We'll read the size and confirm it in your quote.", photoName: file.name });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    if (!String(f.get("company") || "").trim()) errs.company = "Tell us your company.";
    if (!String(f.get("name") || "").trim()) errs.name = "Your name, please.";
    const email = String(f.get("email") || "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = "Enter a valid work email.";
    const phone = String(f.get("phone") || "").replace(/\D/g, "");
    if (phone && phone.length < 10) errs.phone = "Enter a 10-digit US phone.";
    const zip = String(f.get("zip") || "");
    if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) errs.zip = "Enter a 5-digit ZIP.";
    if (!count) errs.list = "Add at least one size to your quote list.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // [CONFIRM WITH ROVINCE] wire to a serverless email endpoint with the photo attachment.
    const ref = "RQ-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setSent(ref);
  };

  if (sent) {
    return (
      <div className="quote-done">
        <div className="quote-done-mark">✓</div>
        <h2>Quote request sent</h2>
        <p className="lead">Reference <strong>{sent}</strong>. We reply within one US business day <span className="confirm-tag">[confirm]</span>.</p>
        <p className="quote-done-note">A copy has gone to your email with every line on it. Nothing to pay — this is a price request.</p>
        <button className="btn btn-primary" onClick={() => { clear(); setSent(null); }}>Start a new quote</button>
      </div>
    );
  }

  const empty = ready && lines.length === 0;

  return (
    <div className="quote-grid">
      {/* lines */}
      <div className="quote-lines-wrap">
        <div className="quote-head">
          <h2>Your quote list</h2>
          <span>{lines.length} line{lines.length !== 1 ? "s" : ""} · {count} tire{count !== 1 ? "s" : ""}</span>
        </div>

        {empty ? (
          <div className="quote-empty">
            <p>Your quote list is empty.</p>
            <div className="hns-btns">
              <Link href="/" className="btn btn-ghost">Find a size →</Link>
              <Link href="/machine" className="btn btn-ghost">Pick your machine →</Link>
            </div>
          </div>
        ) : (
          <ul className="quote-items">
            {lines.map((l) => (
              <li key={l.key} className={l.photoName || l.freeText ? "photo" : ""}>
                <div className="qi-main">
                  <div className="qi-title">
                    {l.href ? <Link href={l.href}>{l.size}</Link> : l.size}
                  </div>
                  <div className="qi-spec">{l.line}{l.colour !== "—" ? ` · ${l.colour.toLowerCase()}` : ""}</div>
                  <div className="qi-meta">{l.meta}</div>
                </div>
                <div className="qi-qty">
                  <button onClick={() => setQty(l.key, -1)} aria-label="Less">−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.key, 1)} aria-label="More">+</button>
                </div>
                <button className="qi-remove" onClick={() => remove(l.key)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        {/* add row */}
        <div className="quote-add">
          <input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSize()}
            placeholder="Type another size, e.g. 18x7-8"
            aria-label="Add another size"
          />
          <button type="button" className="row-add" onClick={addSize}>Add</button>
          <button type="button" className="row-add" onClick={() => fileRef.current?.click()}>Add a photo</button>
          <Link href="/machine" className="row-add">Pick a machine</Link>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(f); e.target.value = ""; }} />
        </div>
      </div>

      {/* request form */}
      <aside className="quote-form-card">
        <h3>Where should we send prices?</h3>
        {errors.list && <p className="field-err">{errors.list}</p>}
        <form onSubmit={submit} noValidate>
          <div className="qf-field">
            <label>I&apos;m a</label>
            <div className="pills small" role="radiogroup">
              {["Dealer", "Fleet", "Distributor", "Other"].map((r, i) => (
                <label key={r} className="radio-pill">
                  <input type="radio" name="role" value={r} defaultChecked={i === 0} />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="qf-row">
            <div className="qf-field"><label htmlFor="company">Company</label><input id="company" name="company" placeholder="Harbor Lift Service" />{errors.company && <span className="field-err">{errors.company}</span>}</div>
            <div className="qf-field"><label htmlFor="name">Your name</label><input id="name" name="name" placeholder="Dana Ruiz" />{errors.name && <span className="field-err">{errors.name}</span>}</div>
          </div>
          <div className="qf-row">
            <div className="qf-field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" inputMode="tel" placeholder="(562) 555-0143" />{errors.phone && <span className="field-err">{errors.phone}</span>}</div>
            <div className="qf-field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" placeholder="dana@harborlift.com" />{errors.email && <span className="field-err">{errors.email}</span>}</div>
          </div>
          <div className="qf-row">
            <div className="qf-field"><label htmlFor="zip">Ship to ZIP</label><input id="zip" name="zip" inputMode="numeric" placeholder="90810" />{errors.zip && <span className="field-err">{errors.zip}</span>}</div>
            <div className="qf-field">
              <label>Need it by</label>
              <div className="pills small" role="radiogroup">
                {["This week", "This month", "Just pricing"].map((r, i) => (
                  <label key={r} className="radio-pill"><input type="radio" name="need" value={r} defaultChecked={i === 1} /><span>{r}</span></label>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-quote" style={{ width: "100%", justifyContent: "center" }}>
            Send quote request →
          </button>
          <p className="quote-form-note">No price shown online — a person prices your exact sizes and stock. <span className="confirm-tag">[email wiring: confirm endpoint]</span></p>
        </form>
      </aside>
    </div>
  );
}
