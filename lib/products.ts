const IMG =
  "https://www.rovincetire.com/wp-content/themes/rovincetire/assets/images/";

export type Product = {
  name: string;
  sub: string;
  img: string;
  desc: string;
  tags: string[];
  href: string;
};

/** Shared product catalogue — drives the Prism Carousel and the Products grid */
export const PRODUCTS: Product[] = [
  {
    name: "Resilient Solid Tires",
    sub: "Zero Downtime",
    img: "/tires/tire_1.png",
    desc: "Three-stage solid construction for maximum load-bearing and puncture-proof, no-downtime operation in the toughest yards.",
    tags: ["Puncture-proof", "4000+ hrs", "Forklifts"],
    href: "/products",
  },
  {
    name: "Press-On Band Tires",
    sub: "Precision Fit",
    img: "/tires/tire_3.png",
    desc: "Smooth, low-rolling-resistance press-on bands engineered for electric forklifts and indoor material handling.",
    tags: ["Low resistance", "Warehouse", "Smooth"],
    href: "/products",
  },
  {
    name: "Skid Steer Tires",
    sub: "Built for Sites",
    img: "/tires/tire_5.png",
    desc: "Aggressive tread and reinforced sidewalls that grip, climb and resist cuts across rugged construction sites.",
    tags: ["Deep tread", "Cut-resistant", "Construction"],
    href: "/products",
  },
  {
    name: "Port Tires",
    sub: "Heavy Haul",
    img: "/tires/tire_6.png",
    desc: "High-capacity port handling tires built to carry extreme container loads through nonstop shipping operations.",
    tags: ["High load", "Container yards", "Nonstop"],
    href: "/products",
  },
];

export const LOGO = IMG + "logo.png";
export const IMG_BASE = IMG;
