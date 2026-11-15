"use client";
import { useState } from "react";

type Part = { key: string; label: string; tip: string };

/** Drawn tire sidewall with hoverable/tappable size parts explained. */
export default function Sidewall({
  size = "6.50-10",
  line = "R1 Super Premium",
  pattern = "Traction",
}: {
  size?: string;
  line?: string;
  pattern?: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  // Split "6.50-10" → width 6.50, rim 10 ; or "28x9-15" → 28 × 9 − 15
  const dash = size.match(/^([\d.]+)-(\d+)$/);
  const cross = size.match(/^([\d.]+)x([\d.]+)-?(\d+)?$/i);

  let parts: { text: string; part?: Part }[] = [{ text: size }];
  if (dash) {
    parts = [
      { text: dash[1], part: { key: "w", label: "Section width", tip: `${dash[1]} is the width — section width in inches (about ${Math.round(parseFloat(dash[1]) * 25.4)} mm).` } },
      { text: "-" },
      { text: dash[2], part: { key: "r", label: "Rim diameter", tip: `${dash[2]} is the rim size — the wheel diameter in inches the tire fits.` } },
    ];
  } else if (cross) {
    parts = [
      { text: cross[1], part: { key: "d", label: "Overall diameter", tip: `${cross[1]} is the overall tire diameter in inches.` } },
      { text: "×" },
      { text: cross[2], part: { key: "w", label: "Width", tip: `${cross[2]} is the tire width in inches.` } },
      ...(cross[3] ? [{ text: "−" }, { text: cross[3], part: { key: "r", label: "Rim", tip: `${cross[3]} is the rim diameter in inches.` } }] : []),
    ];
  }

  return (
    <div className="sidewall-art">
      <svg viewBox="0 0 320 320" aria-hidden className="sw-svg">
        <defs>
          <radialGradient id="swrubber" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#222" />
            <stop offset="100%" stopColor="#0c0c0c" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="150" fill="url(#swrubber)" stroke="rgba(255,255,255,.14)" strokeWidth="1" />
        {/* tread blocks */}
        {Array.from({ length: 44 }).map((_, i) => {
          const a = (i / 44) * Math.PI * 2;
          const x1 = 160 + Math.cos(a) * 150;
          const y1 = 160 + Math.sin(a) * 150;
          const x2 = 160 + Math.cos(a) * 128;
          const y2 = 160 + Math.sin(a) * 128;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,.6)" strokeWidth="5" />;
        })}
        <circle cx="160" cy="160" r="126" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1" />
        <circle cx="160" cy="160" r="66" fill="#0a0a0a" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
        {/* moulded text around the sidewall */}
        <path id="swcurve" d="M160,70 a90,90 0 1,1 -0.1,0" fill="none" />
        <text className="sw-mould">
          <textPath href="#swcurve" startOffset="2%">
            ROVINCE · {line.toUpperCase()} · {pattern.toUpperCase()}
          </textPath>
        </text>
      </svg>

      <div className="sw-code" role="group" aria-label={`Size ${size}, tap a number to learn what it means`}>
        {parts.map((p, i) =>
          p.part ? (
            <button
              key={i}
              type="button"
              className={"sw-part" + (open === p.part.key ? " on" : "")}
              onClick={() => setOpen((o) => (o === p.part!.key ? null : p.part!.key))}
              onMouseEnter={() => setOpen(p.part!.key)}
              onMouseLeave={() => setOpen(null)}
              aria-describedby={open === p.part.key ? "sw-tip" : undefined}
            >
              {p.text}
            </button>
          ) : (
            <span key={i} className="sw-sep">{p.text}</span>
          ),
        )}
      </div>

      <div className="sw-tip" id="sw-tip" role="status" hidden={!open}>
        {parts.find((p) => p.part?.key === open)?.part?.tip ?? "Tap a number to learn what it means."}
      </div>
    </div>
  );
}
