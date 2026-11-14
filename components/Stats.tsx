"use client";
import { useEffect, useRef, useState } from "react";

type Stat = { end: number; suffix: string; label: string };
const STATS: Stat[] = [
  { end: 10, suffix: "+", label: "Years of Legacy" },
  { end: 2, suffix: "M+", label: "Tires Delivered" },
  { end: 20, suffix: "+", label: "Countries Exported" },
  { end: 99.5, suffix: "%", label: "On-Time Delivery" },
  { end: 100, suffix: "%", label: "Customer Satisfaction" },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState("0" + suffix);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dec = end % 1 !== 0 ? 1 : 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        let t0: number | null = null;
        const step = (t: number) => {
          if (!t0) t0 = t;
          const p = Math.min((t - t0) / 1300, 1);
          setVal((end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, suffix]);
  return (
    <div ref={ref} className="num">
      {val}
    </div>
  );
}

export default function Stats() {
  return (
    <div className="stats-grid">
      {STATS.map((s) => (
        <div className="stat" key={s.label}>
          <Counter end={s.end} suffix={s.suffix} />
          <div className="lbl">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
