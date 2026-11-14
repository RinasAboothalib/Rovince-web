"use client";
/* Split showcase — the product lineup as an editorial two-pane layout.
   Left: the active tire on a lit stage. Right: the full lineup as an
   interactive index; hovering or tapping a row swaps the stage. */
import { useRef, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/lib/products";

export default function LineupWheel() {
  const [active, setActive] = useState(0);
  const p = PRODUCTS[active];
  const stageRef = useRef<HTMLDivElement>(null);

  /* 3D tilt — pointer position drives rotateX/rotateY on the tire */
  const onMove = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 16).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 22).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <section className="sec lineup-sec" aria-label="Product lineup">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Our Product Lineup</span>
          <h2>
            One Range. <span className="grad">Every Yard.</span>
          </h2>
          <p className="lead">
            From zero-downtime resilient solids to heavy-haul port tires —
            browse the lineup and see what each line is built for.
          </p>
        </Reveal>

        <Reveal className="lineup-panel">
          {/* Stage */}
          <div
            ref={stageRef}
            className="lineup-stage"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            <div className="stage-glow" aria-hidden />
            <div className="stage-tilt">
              <img key={p.img} src={p.img} alt={`${p.name} — ${p.sub}`} />
              <div className="stage-sheen" aria-hidden />
            </div>
            <div className="stage-shadow" aria-hidden />
            <div className="stage-badge">
              <span className="dot" aria-hidden />
              {p.sub}
            </div>
          </div>

          {/* Index */}
          <div className="lineup-index">
            {PRODUCTS.map((item, i) => (
              <button
                key={item.name}
                type="button"
                className={`lineup-row${i === active ? " on" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
              >
                <span className="row-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="row-body">
                  <span className="row-name">{item.name}</span>
                  <span className="row-sub">{item.desc}</span>
                  <span className="row-tags">
                    {item.tags.map((t) => (
                      <em key={t}>{t}</em>
                    ))}
                  </span>
                </span>
                <span className="row-arrow" aria-hidden>
                  →
                </span>
              </button>
            ))}

            <Link href={p.href} className="btn btn-ghost lineup-cta">
              View {p.name} →
            </Link>
          </div>
        </Reveal>
      </div>

      <style jsx global>{`
        .lineup-sec .sec-head {
          margin-bottom: 40px;
        }

        .lineup-panel {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 28px;
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-radius: calc(var(--radius) + 6px);
          padding: 28px;
        }

        /* ---- stage ---- */
        .lineup-stage {
          position: relative;
          min-height: 420px;
          border-radius: var(--radius);
          background:
            radial-gradient(120% 90% at 50% 0%, var(--bg-3), var(--bg) 70%);
          border: 1px solid var(--line);
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 40px;
        }
        .stage-glow {
          position: absolute;
          inset: auto -10% -22% -10%;
          height: 55%;
          background: radial-gradient(
            50% 60% at 50% 100%,
            var(--accent-glow),
            transparent 70%
          );
          opacity: 0.55;
          pointer-events: none;
          transition: 0.5s var(--ease);
        }
        .lineup-stage img {
          position: relative;
          width: min(78%, 460px);
          filter: drop-shadow(0 40px 50px rgba(0, 0, 0, 0.65));
          animation: tire-in 0.7s var(--ease);
        }

        /* ---- 3D tilt ---- */
        .lineup-stage {
          perspective: 900px;
        }
        .stage-tilt {
          position: relative;
          display: grid;
          place-items: center;
          transform-style: preserve-3d;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.25s var(--ease);
          will-change: transform;
        }
        .lineup-stage:hover .stage-tilt {
          transition: transform 0.08s linear;
        }
        .stage-tilt img {
          width: min(78%, 460px);
          transform: translateZ(40px);
        }
        /* continuous 3D turntable + float on the tire itself */
        .stage-tilt img {
          animation:
            tire-in 0.7s var(--ease),
            tire-float 4.5s ease-in-out infinite,
            tire-spin 14s linear infinite;
        }
        @keyframes tire-float {
          0%,
          100% {
            margin-top: 0;
            translate: 0 0;
          }
          50% {
            translate: 0 -14px;
          }
        }
        @keyframes tire-spin {
          from {
            rotate: y 0deg;
          }
          to {
            rotate: y 360deg;
          }
        }
        /* moving specular highlight that tracks the cursor */
        .stage-sheen {
          position: absolute;
          inset: -10%;
          pointer-events: none;
          background: radial-gradient(
            32% 32% at var(--mx, 50%) var(--my, 50%),
            rgba(255, 255, 255, 0.14),
            transparent 70%
          );
          mix-blend-mode: screen;
          opacity: 0;
          transition: opacity 0.4s var(--ease);
        }
        .lineup-stage:hover .stage-sheen {
          opacity: 1;
        }
        /* grounded shadow that shifts opposite to the tilt */
        .stage-shadow {
          position: absolute;
          bottom: 6%;
          left: 50%;
          width: 55%;
          height: 36px;
          transform: translateX(calc(-50% + var(--ry, 0deg) * -1.6));
          background: radial-gradient(
            50% 50% at 50% 50%,
            rgba(0, 0, 0, 0.7),
            transparent 70%
          );
          filter: blur(10px);
          pointer-events: none;
        }
        @keyframes tire-in {
          from {
            opacity: 0;
            transform: translateY(26px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .stage-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 7px 14px;
          backdrop-filter: blur(6px);
        }
        .stage-badge .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
        }

        /* ---- index ---- */
        .lineup-index {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lineup-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-bottom: 1px solid var(--line);
          padding: 16px 10px;
          cursor: pointer;
          color: var(--muted);
          transition: 0.35s var(--ease);
          border-radius: 12px;
        }
        .lineup-row:hover {
          color: var(--fg);
          background: rgba(255, 255, 255, 0.02);
        }
        .lineup-row.on {
          color: var(--fg);
          background: var(--surface);
          border-color: var(--line-2);
        }
        .row-num {
          font-family: var(--font-head);
          font-size: 0.8rem;
          color: var(--muted-2);
          padding-top: 4px;
          transition: 0.35s var(--ease);
        }
        .lineup-row.on .row-num {
          color: var(--accent);
        }
        .row-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .row-name {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: -0.01em;
        }
        .row-sub {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: 0.4s var(--ease);
        }
        .lineup-row.on .row-sub {
          max-height: 4em;
          opacity: 1;
        }
        .row-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .row-tags em {
          font-style: normal;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 3px 10px;
        }
        .row-arrow {
          align-self: center;
          opacity: 0;
          transform: translateX(-6px);
          transition: 0.35s var(--ease);
          color: var(--accent);
        }
        .lineup-row.on .row-arrow {
          opacity: 1;
          transform: none;
        }

        .lineup-cta {
          margin-top: 18px;
          align-self: flex-start;
        }

        @media (max-width: 900px) {
          .lineup-panel {
            grid-template-columns: 1fr;
          }
          .lineup-stage {
            min-height: 300px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lineup-stage img {
            animation: tire-in 0.7s var(--ease);
          }
          .stage-tilt {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
