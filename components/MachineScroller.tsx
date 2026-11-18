"use client";
import { useEffect, useRef } from "react";
import { MACHINE_PHOTO } from "@/lib/media";

const MACHINES = [
  { id: "forklift", label: "Forklift" },
  { id: "skid-steer", label: "Skid steer" },
  { id: "port", label: "Port / container handler" },
  { id: "baggage", label: "Airport baggage tractor" },
  { id: "reach-truck", label: "Reach truck / order picker" },
  { id: "other", label: "Other machines" },
];

/** Pinned horizontal gallery: page scroll is captured while the
    machine photos slide sideways, then released after the row ends. */
export default function MachineScroller() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const size = () => {
      // wrapper tall enough to hold the whole horizontal travel
      const travel = Math.max(0, track.scrollWidth - window.innerWidth);
      wrap.style.height = `${window.innerHeight + travel}px`;
    };

    const onScroll = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = wrap.getBoundingClientRect();
      // 0 when the sticky stage just locks, 1 when the row reaches its end
      const progress = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      const max = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translateX(${-progress * max}px)`;
    };

    size();
    onScroll();
    const onResize = () => { size(); onScroll(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="pin-scroll" ref={wrapRef}>
      <div className="pin-stage" ref={stageRef}>
        <div className="pin-track" ref={trackRef}>
          {MACHINES.map((m) => (
            <figure className="pin-card" key={m.id}>
              <span className="pin-pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MACHINE_PHOTO[m.id]} alt={m.label} loading="lazy" />
              </span>
              <figcaption>{m.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
