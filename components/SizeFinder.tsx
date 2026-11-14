"use client";
/* =====================================================================
   SizeFinder — "Start from the size printed on the old tire"
   Implements the proposal concept: search by size (with live stock),
   the load-figure detail, the "pick your machine" path, and a quote
   list with the "where should we send prices?" form.
   Load/stock figures are sample data for demonstration.
===================================================================== */
import { useMemo, useState } from "react";
import { SIZES, MACHINES, byId, kg, lb, type TireSize } from "@/lib/sizes";

type QuoteItem = {
  key: string;
  title: string;
  spec: string;
  meta: string;
  photo?: boolean;
  qty: number;
};

function StockBadge({ s }: { s: TireSize["stock"] }) {
  const inStock = s.status === "in-stock";
  return (
    <span className={"stock " + (inStock ? "in" : "mto")}>
      <i /> {inStock ? `In stock, ${s.location}` : "Made to order"}
    </span>
  );
}

export default function SizeFinder() {
  const [mode, setMode] = useState<"size" | "machine">("size");
  const [query, setQuery] = useState("6.50-10");
  const [openId, setOpenId] = useState<string | null>("650-10-r1");
  const [whatsOn, setWhatsOn] = useState<"Forklift" | "Other vehicle">("Forklift");
  const [wheel, setWheel] = useState<"Load wheel" | "Steering wheel">("Load wheel");
  const [color, setColor] = useState<string>("Black");

  // machine mode
  const [machineId, setMachineId] = useState(MACHINES[0].id);
  const [pos, setPos] = useState<"front" | "rear">("front");

  // quote
  const [quote, setQuote] = useState<QuoteItem[]>([
    { key: "q1", title: "6.50-10", spec: "Resilient solid R1 · traction · black", meta: "2,340 kg load wheel · in stock, Compton", qty: 8 },
    { key: "q2", title: "28x9-15", spec: "Resilient solid R1 · traction · non-marking", meta: "3,770 kg load wheel · made to order", qty: 4 },
    { key: "q3", title: "21x7x15", spec: "Press-on band · traction · black", meta: "2,685 kg load wheel · in stock, Compton", qty: 12 },
    { key: "q4", title: "Size from your photo", spec: "tire-photo-front.jpg", meta: "We'll read the size and confirm it in your quote", photo: true, qty: 2 },
  ]);
  const [sent, setSent] = useState(false);

  const norm = (s: string) => s.toLowerCase().replace(/\s/g, "");
  const matches = useMemo(() => {
    const q = norm(query);
    if (!q) return [];
    return SIZES.filter((s) => norm(s.size).includes(q) || s.alt.some((a) => norm(a).includes(q)));
  }, [query]);

  const addToQuote = (s: TireSize, col = color) => {
    const title = s.size;
    const spec = `${s.line} ${s.grade.split(" ")[0]} · ${s.tread.toLowerCase()} · ${col.toLowerCase()}`;
    const loadFig = wheel === "Steering wheel" ? s.steeringKg : s.loadWheelKg;
    const meta = `${kg(loadFig)} kg ${wheel.toLowerCase()} · ${s.stock.status === "in-stock" ? `in stock, ${s.stock.location}` : "made to order"}`;
    setQuote((q) => {
      const key = `${s.id}-${col}`;
      const existing = q.find((i) => i.key === key);
      if (existing) return q.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...q, { key, title, spec, meta, qty: 1 }];
    });
  };

  const setQty = (key: string, d: number) =>
    setQuote((q) => q.map((i) => (i.key === key ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const remove = (key: string) => setQuote((q) => q.filter((i) => i.key !== key));

  const totalTires = quote.reduce((n, i) => n + i.qty, 0);
  const machine = MACHINES.find((m) => m.id === machineId)!;
  const machineSizes = (pos === "front" ? machine.front : machine.rear).map(byId);
  const open = openId ? SIZES.find((s) => s.id === openId) : null;
  const loadFigure = open ? (wheel === "Steering wheel" ? open.steeringKg : open.loadWheelKg) : 0;

  return (
    <section className="finder-sec" id="find-your-size">
      <div className="wrap">
        <div className="sec-head reveal in">
          <span className="eyebrow">Find your fit</span>
          <h2>What does your old tire say?</h2>
          <p className="lead">
            Type the size from its sidewall. We&apos;ll show you the Rovince tire that fits, what it carries and
            where it ships from — then add it to a quote without a single email.
          </p>
        </div>

        <div className="finder-grid">
          {/* ---------- FINDER ---------- */}
          <div className="finder-card">
            <div className="finder-modes">
              <button className={mode === "size" ? "on" : ""} onClick={() => setMode("size")}>I know my size</button>
              <button className={mode === "machine" ? "on" : ""} onClick={() => setMode("machine")}>No size? Pick your machine</button>
            </div>

            {mode === "size" ? (
              <>
                <div className="finder-search">
                  <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpenId(null); }}
                    placeholder="e.g. 6.50-10"
                    aria-label="Tire size"
                  />
                </div>

                {matches.length > 0 ? (
                  <ul className="match-list">
                    {matches.map((s) => (
                      <li key={s.id}>
                        <button className={"match" + (openId === s.id ? " open" : "")} onClick={() => { setOpenId(s.id); setColor(s.colors[0]); }}>
                          <span className="m-size">{s.size}</span>
                          <span className="m-spec">{s.line} · {s.grade}</span>
                          <StockBadge s={s.stock} />
                        </button>
                      </li>
                    ))}
                    <li className="match-note">
                      {matches.length} match{matches.length > 1 ? "es" : ""}. Also matches {matches[0].alt.join(" and ")}.
                    </li>
                  </ul>
                ) : (
                  <p className="match-empty">No match yet — type a size like 6.50-10, 28x9-15 or 18x7-8.</p>
                )}

                {/* size detail (the "Size page") */}
                {open && (
                  <div className="size-detail">
                    <div className="sd-head">
                      <div>
                        <div className="sd-size">{open.size}</div>
                        <div className="sd-sub">{open.line} · {open.grade} · {open.tread}</div>
                        <p className="sd-fits">Fits {open.fits}. Section width {open.sectionIn} in, rim diameter {open.rimIn} in.</p>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={open.img} alt={open.size} />
                    </div>

                    <div className="sd-q">
                      <span>What&apos;s it on?</span>
                      <div className="pills">
                        {(["Forklift", "Other vehicle"] as const).map((o) => (
                          <button key={o} className={whatsOn === o ? "on" : ""} onClick={() => setWhatsOn(o)}>{o}</button>
                        ))}
                      </div>
                    </div>
                    <div className="sd-q">
                      <span>Which wheel?</span>
                      <div className="pills">
                        {(["Load wheel", "Steering wheel"] as const).map((o) => (
                          <button key={o} className={wheel === o ? "on" : ""} onClick={() => setWheel(o)}>{o}</button>
                        ))}
                      </div>
                    </div>

                    <div className="sd-load">
                      <div className="sd-load-lbl">Carries per tire{whatsOn === "Forklift" ? ", on forklifts up to 25 km/h (15 mph)" : ""}</div>
                      <div className="sd-load-fig">{kg(loadFigure)} <small>kg</small> <span className="lb">{lb(loadFigure)} lb</span></div>
                      <div className="sd-load-note">
                        Steering wheel: {kg(open.steeringKg)} kg ({lb(open.steeringKg)} lb). Standing still: {kg(open.standingKg)} kg ({lb(open.standingKg)} lb).
                      </div>
                    </div>

                    <div className="sd-colors">
                      {open.colors.map((c) => (
                        <button key={c} className={"swatch" + (color === c ? " on" : "")} onClick={() => setColor(c)}>
                          <i style={{ background: c.includes("grey") ? "#cfd2d6" : "#111" }} /> {c}
                        </button>
                      ))}
                    </div>

                    <div className="sd-stock"><StockBadge s={open.stock} /> {open.stock.status === "in-stock" ? "· Ships in 1–2 working days" : "· Built to order, ~3–4 weeks"}</div>

                    <button className="btn btn-primary sd-add" onClick={() => addToQuote(open)}>Add to quote list →</button>
                  </div>
                )}

                {/* sidewall explainer */}
                <div className="sidewall">
                  <svg viewBox="0 0 120 120" aria-hidden>
                    <circle cx="60" cy="60" r="56" fill="none" stroke="var(--line-2)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="30" fill="none" stroke="var(--line)" strokeWidth="2" />
                  </svg>
                  <div>
                    <strong>6.50</strong> is the width — section width in inches (about 165 mm).
                    The number after the dash, <strong>10</strong>, is the rim size. Hover any match to see the breakdown.
                  </div>
                </div>
              </>
            ) : (
              /* ---------- MACHINE MODE ---------- */
              <div className="machine">
                <label className="m-label">Pick your machine</label>
                <select value={machineId} onChange={(e) => setMachineId(e.target.value)}>
                  {MACHINES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
                <p className="m-note">{machine.note}</p>

                <div className="m-wheel">
                  <span>Which wheel?</span>
                  <div className="pills">
                    <button className={pos === "front" ? "on" : ""} onClick={() => setPos("front")}>Front (load)</button>
                    <button className={pos === "rear" ? "on" : ""} onClick={() => setPos("rear")}>Rear (steering)</button>
                  </div>
                </div>
                <p className="m-hint">
                  {pos === "front"
                    ? "Front wheels carry the load. They take the weight of the forks, so they're rated by load — usually the larger size."
                    : "Rear wheels steer. They're smaller and rated for steering duty."}
                </p>

                <div className="m-sizes">
                  <div className="m-sizes-head">Common {pos} sizes — check the number on your tire</div>
                  {machineSizes.map((s) => (
                    <div className="m-row" key={s.id + pos}>
                      <span className="m-size">{s.size}</span>
                      <span className="m-load">{kg(pos === "front" ? s.loadWheelKg : s.steeringKg)} kg {pos === "front" ? "load" : "steering"} wheel</span>
                      <button className="m-add" onClick={() => addToQuote(s, s.colors[0])}>Add</button>
                    </div>
                  ))}
                </div>
                <p className="m-photo">Not sure? <button className="linklike" onClick={() => setMode("size")}>Type the size</button> or send a photo of the tire.</p>
              </div>
            )}
          </div>

          {/* ---------- QUOTE LIST ---------- */}
          <aside className="quote-card">
            <div className="quote-head">
              <h3>Your quote list</h3>
              <span>{quote.length} lines · {totalTires} tires</span>
            </div>
            <ul className="quote-items">
              {quote.map((i) => (
                <li key={i.key} className={i.photo ? "photo" : ""}>
                  <div className="qi-main">
                    <div className="qi-title">{i.title}</div>
                    <div className="qi-spec">{i.spec}</div>
                    <div className="qi-meta">{i.meta}</div>
                  </div>
                  <div className="qi-qty">
                    <button onClick={() => setQty(i.key, -1)} aria-label="Less">−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.key, 1)} aria-label="More">+</button>
                  </div>
                  <button className="qi-remove" onClick={() => remove(i.key)}>Remove</button>
                </li>
              ))}
            </ul>

            <form
              className="quote-form"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              <h4>Where should we send prices?</h4>
              <div className="qf-field">
                <label>I&apos;m a</label>
                <div className="pills small">
                  {["Dealer", "Fleet", "Distributor", "Other"].map((r, idx) => (
                    <button type="button" key={r} className={idx === 0 ? "on" : ""} onClick={(e) => {
                      e.currentTarget.parentElement?.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
                      e.currentTarget.classList.add("on");
                    }}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="qf-row">
                <div className="qf-field"><label>Company</label><input placeholder="Harbor Lift Service" /></div>
                <div className="qf-field"><label>Your name</label><input placeholder="Dana Ruiz" /></div>
              </div>
              <div className="qf-row">
                <div className="qf-field"><label>Phone</label><input placeholder="(562) 555-0143" /></div>
                <div className="qf-field"><label>Work email</label><input type="email" placeholder="dana@harborlift.com" /></div>
              </div>
              <div className="qf-row">
                <div className="qf-field"><label>Ship to ZIP</label><input placeholder="90810" /></div>
                <div className="qf-field">
                  <label>Need it by</label>
                  <div className="pills small">
                    {["This week", "This month", "Just pricing"].map((r, idx) => (
                      <button type="button" key={r} className={idx === 1 ? "on" : ""} onClick={(e) => {
                        e.currentTarget.parentElement?.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
                        e.currentTarget.classList.add("on");
                      }}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Send me prices →
              </button>
              {sent && <div className="form-ok" style={{ display: "block" }}>✓ Request ready for {totalTires} tires across {quote.length} lines. (Demo — connect to your quoting inbox to go live.)</div>}
            </form>
          </aside>
        </div>

        <p className="finder-biz">
          <span className="eyebrow">What changes for the business</span>
          Dealers check a size, its load and its stock, and add it to one quote — one request for a whole order
          instead of an email thread per size. And every size becomes findable on Google.
        </p>
      </div>
    </section>
  );
}
