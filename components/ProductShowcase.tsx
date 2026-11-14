"use client";
/* =====================================================================
   ProductShowcase — premium prism coverflow for the tire lineup.

   INTEGRATION NOTE (React Bits Pro – Prism Carousel):
   The official Pro component installs via:
       npx shadcn@latest add @reactbits-starter/prism-carousel-tw
   which requires REACTBITS_LICENSE_KEY in .env.local (see components.json).
   That install is gated on the license key, so until it runs this file
   provides a faithful coverflow with the SAME data + control surface
   (central large image, scaled dimmed neighbors, prism-spectrum sweep on
   activate, captions, counter, prev/next, drag/swipe, autoplay+hover-pause,
   infinite loop). Once the Pro component is installed, replace the render
   body below with <PrismCarousel {...config} items={items} /> — the
   `items` and `config` shapes already match the documented API.
===================================================================== */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

// Prism Carousel configuration (per the design brief; tuned for this layout)
const config = {
  aspect: 1.5,
  size: 0.62,
  neighborScale: 0.66,
  gap: 14,
  radius: 18,
  saturation: 0,
  dim: 0.2,
  sweep: 1,
  sweepDuration: 1.1,
  dispersion: 1,
  autoplay: true,
  interval: 4.5,
  loop: true,
  captions: true,
  controls: true,
  draggable: true,
  wheel: false,
  pauseOnHover: true,
  backgroundColor: "transparent",
  dpr: 2,
};

const items = PRODUCTS.map((p) => ({
  src: p.img,
  alt: `${p.name} — ${p.sub}`,
  title: p.name,
  subtitle: p.desc,
  href: p.href,
}));

export default function ProductShowcase() {
  const N = items.length;
  const [active, setActive] = useState(0);
  const [sweeping, setSweeping] = useState(false);
  const hover = useRef(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const go = (dir: number) => {
    setActive((a) => (a + dir + N) % N);
    setSweeping(true);
    window.setTimeout(() => setSweeping(false), config.sweepDuration * 1000);
  };

  // autoplay with pause-on-hover
  useEffect(() => {
    if (!config.autoplay) return;
    const id = window.setInterval(() => {
      if (!hover.current) go(1);
    }, config.interval * 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // drag / swipe
  const onDown = (x: number) => (drag.current = { x, moved: false });
  const onMove = (x: number) => {
    if (!drag.current) return;
    const dx = x - drag.current.x;
    if (Math.abs(dx) > 70 && !drag.current.moved) {
      drag.current.moved = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  const onUp = () => (drag.current = null);

  const aspect = config.aspect;
  const baseW = 480; // px, central image width
  const h = Math.round(baseW / aspect);

  return (
    <section className="showcase-sec" aria-label="Product coverflow">
      <div className="wrap">
        <div className="sec-head center reveal in">
          <span className="eyebrow">Our Product Lineup</span>
          <h2>The Rovince Tire Lineup, in Full Color</h2>
          <p className="lead" style={{ marginInline: "auto" }}>
            A cinematic coverflow of every Rovince line. The active tire sweeps back to full colour
            while its neighbours sit dimmed in 3D depth. Drag, swipe, or use the controls.
          </p>
        </div>

        <div className="prism-wrap">
          <div
            style={{
              position: "relative",
              height: h + 60,
              perspective: "1600px",
              cursor: "grab",
              touchAction: "pan-y",
            }}
            onMouseEnter={() => (hover.current = true)}
            onMouseLeave={() => {
              hover.current = false;
              onUp();
            }}
            onMouseDown={(e) => onDown(e.clientX)}
            onMouseMove={(e) => onMove(e.clientX)}
            onMouseUp={onUp}
            onTouchStart={(e) => onDown(e.touches[0].clientX)}
            onTouchMove={(e) => onMove(e.touches[0].clientX)}
            onTouchEnd={onUp}
          >
            {items.map((it, i) => {
              // signed shortest distance from active (supports loop)
              let d = i - active;
              if (d > N / 2) d -= N;
              if (d < -N / 2) d += N;
              const isActive = d === 0;
              const abs = Math.abs(d);
              const scale = isActive ? 1 : Math.pow(config.neighborScale, abs);
              const tx = d * (baseW * 0.52 + config.gap);
              const tz = isActive ? 120 : -abs * 220;
              const ry = isActive ? 0 : d > 0 ? -34 : 34;
              const dim = isActive ? 0 : config.dim + abs * 0.08;
              const sat = isActive ? 1 : config.saturation;
              const w = baseW;
              return (
                <figure
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: w,
                    height: h,
                    margin: `${-h / 2}px 0 0 ${-w / 2}px`,
                    background: "transparent",
                    transform: `translate3d(${tx}px,0,${tz}px) rotateY(${ry}deg) scale(${scale})`,
                    transition: `transform ${config.sweepDuration}s var(--ease), filter ${config.sweepDuration}s var(--ease), opacity .5s`,
                    filter: `saturate(${sat}) brightness(${1 - dim}) drop-shadow(0 32px 46px rgba(0,0,0,.7))`,
                    zIndex: 100 - abs,
                    cursor: isActive ? "grab" : "pointer",
                  }}
                  onClick={() => !isActive && go(d > 0 ? 1 : -1)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.src}
                    alt={it.alt}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                  {/* prism-spectrum sweep on the active card */}
                  {isActive && sweeping && (
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(105deg,transparent 20%,rgba(255,0,80,.35),rgba(255,176,32,.35),rgba(60,220,160,.35),rgba(60,140,255,.35),transparent 80%)",
                        mixBlendMode: "screen",
                        animation: `prismSweep ${config.sweepDuration}s var(--ease)`,
                      }}
                    />
                  )}
                </figure>
              );
            })}
          </div>

          {/* supporting info: counter, caption, controls */}
          <div className="prism-meta">
            {config.controls && (
              <div className="prism-ctrls">
                <button aria-label="Previous" onClick={() => go(-1)}>
                  ‹
                </button>
              </div>
            )}
            <div>
              <div className="title">{items[active].title}</div>
              {config.captions && <div className="sub">{PRODUCTS[active].sub} · {PRODUCTS[active].tags.join(" · ")}</div>}
            </div>
            <span className="prism-counter">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            {config.controls && (
              <div className="prism-ctrls">
                <button aria-label="Next" onClick={() => go(1)}>
                  ›
                </button>
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 22 }}>
            <Link href={items[active].href} className="btn btn-ghost">
              View all products →
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes prismSweep {
          0% {
            transform: translateX(-60%);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateX(60%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
