"use client";
import { IMG_BASE } from "@/lib/products";

/** Static hero product display */
export default function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="tire-stage">
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
