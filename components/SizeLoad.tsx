"use client";
import { useState } from "react";
import {
  loadFigure, kgToLb, fmt, type TireSize, type WhatsOn, type Wheel, type Speed, sizeHref,
} from "@/data/sizes";
import { useQuote } from "@/lib/quote";

export default function SizeLoad({ t }: { t: TireSize }) {
  const { add } = useQuote();
  const [whatsOn, setWhatsOn] = useState<WhatsOn>("Forklift");
  const [wheel, setWheel] = useState<Wheel>("Load wheel");
  const [speed, setSpeed] = useState<Speed>("25");
  const [colour, setColour] = useState(t.colours[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const fig = loadFigure(t, whatsOn, wheel, speed);
  const greyStock = colour.includes("grey") ? t.stock.grey : t.stock.black;
  const inStock = greyStock === "in_stock";

  const addToQuote = () => {
    add(
      {
        key: `${t.id}-${colour}`,
        size: t.size,
        line: `${t.family} · ${t.line} · ${t.pattern.toLowerCase()}`,
        colour,
        meta: `${fig.kg ? `${fmt(fig.kg)} kg ${wheel.toLowerCase()} · ` : ""}${inStock ? "in stock, Compton" : "made to order"}`,
        href: sizeHref(t),
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="sizeload">
      {/* colour toggle */}
      <div className="sl-q">
        <span>Colour</span>
        <div className="pills">
          {t.colours.map((c) => (
            <button key={c} className={colour === c ? "on" : ""} onClick={() => setColour(c)}>
              <i className="sw-dot" style={{ background: c.includes("grey") ? "#cfd2d6" : "#111" }} /> {c}
            </button>
          ))}
        </div>
      </div>

      <div className="sl-q">
        <span>What&apos;s it on?</span>
        <div className="pills">
          {(["Forklift", "Other vehicle"] as const).map((o) => (
            <button key={o} className={whatsOn === o ? "on" : ""} onClick={() => setWhatsOn(o)}>{o}</button>
          ))}
        </div>
      </div>

      {whatsOn === "Forklift" ? (
        <div className="sl-q">
          <span>Which wheel?</span>
          <div className="pills">
            {(["Load wheel", "Steering wheel"] as const).map((o) => (
              <button key={o} className={wheel === o ? "on" : ""} onClick={() => setWheel(o)}>{o}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="sl-q">
          <span>Top speed</span>
          <div className="pills">
            {(["6", "10", "25"] as const).map((o) => (
              <button key={o} className={speed === o ? "on" : ""} onClick={() => setSpeed(o)}>{o} km/h</button>
            ))}
          </div>
        </div>
      )}

      {/* the one load figure */}
      <div className="sl-load">
        <div className="sl-load-lbl">{fig.label}</div>
        {fig.kg ? (
          <>
            <div className="sl-load-fig">{fmt(fig.kg)} <small>kg</small> <span className="lb">{fmt(kgToLb(fig.kg))} lb</span></div>
            <div className="sl-load-note">
              {t.loadKg.forkliftSteer ? <>Steering wheel: {fmt(t.loadKg.forkliftSteer)} kg ({fmt(kgToLb(t.loadKg.forkliftSteer))} lb). </> : null}
              {t.loadKg.static ? <>Standing still: {fmt(t.loadKg.static)} kg ({fmt(kgToLb(t.loadKg.static))} lb).</> : null}
            </div>
          </>
        ) : (
          <div className="sl-load-fig small">Ask us for the load rating.</div>
        )}
      </div>

      <div className="sl-stock">
        <span className={"stock " + (inStock ? "in" : "mto")}><i /> {inStock ? "In stock in Compton, CA · ships in 1–2 working days" : "Made to order · lead time [confirm] weeks"}</span>
      </div>

      <div className="sl-add">
        <div className="qty">
          <button onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Less">−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((n) => n + 1)} aria-label="More">+</button>
        </div>
        <button type="button" className="btn btn-quote" onClick={addToQuote}>
          {added ? "✓ Added to quote list" : "Add to quote list →"}
        </button>
      </div>
    </div>
  );
}
