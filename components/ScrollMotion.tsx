"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Site-wide scroll-reveal. Auto-tags common blocks so pages don't each wire
   it up, re-scans after every navigation, and no-ops under reduced motion.
   Content is visible by default; only .motion-on hides-then-reveals. */
const SELECTORS = [
  ".sec-head",
  ".card",
  ".line-card",
  ".comp",
  ".mf-step",
  ".mf-mcard",
  ".proof-grid > div",
  ".industries-grid > *",
  ".size-top",
  ".spec",
  ".same-size",
  ".dealer-cta",
  ".home-no-size",
  ".comp-strip",
  ".info-item",
  ".split > *",
  ".line-detail > *",
  ".feat-grid > *",
  ".feature-item",
  ".perform-card",
  ".cross-card",
  ".value",
  ".line-hero > *",
].join(",");

export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    document.documentElement.classList.add("motion-on");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("rv-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    // slight re-scan delay so the new route's DOM is in place
    const id = window.setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTORS));
      els.forEach((el) => {
        if (el.classList.contains("rv")) return;
        el.classList.add("rv");
        // stagger siblings within the same parent
        const sibs = Array.from(el.parentElement?.children ?? []).filter((c) => (c as HTMLElement).classList.contains("rv"));
        const idx = sibs.indexOf(el);
        if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 5) * 70}ms`;
        // already in view on load → reveal immediately (no scroll needed)
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92) el.classList.add("rv-in");
        else io.observe(el);
      });
    }, 60);

    return () => {
      window.clearTimeout(id);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
