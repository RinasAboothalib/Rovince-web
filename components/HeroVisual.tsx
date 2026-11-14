"use client";
import { useRef } from "react";
import { IMG_BASE } from "@/lib/products";

/** Floating 3D tire with mouse-parallax tilt */
export default function HeroVisual() {
  const stage = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!wrap.current || !stage.current) return;
    if (!window.matchMedia("(min-width:960px)").matches) return;
    const r = wrap.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.current.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
  };
  const onLeave = () => {
    if (stage.current) stage.current.style.transform = "";
  };

  return (
    <div className="hero-visual" ref={wrap} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="tire-stage" ref={stage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tire-img" src={IMG_BASE + "tire_1.webp"} alt="Rovince industrial solid tire" />
        <div className="hero-badge a">
          <div className="n">4000+</div>
          <div className="l">Working Hours</div>
        </div>
        <div className="hero-badge b">
          <div className="n">2M+</div>
          <div className="l">Tires Delivered</div>
        </div>
      </div>
    </div>
  );
}
