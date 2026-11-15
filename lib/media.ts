/* Image references — original photography from rovincetire.com + local
   background-removed tire cut-outs. Machine photos are the real machine
   shots from the existing site (not AI-generated). */
const CDN = "https://www.rovincetire.com/wp-content/themes/rovincetire/assets/images/";
const UP = "https://www.rovincetire.com/wp-content/uploads/";

export const HERO_BANNER = UP + "2026/06/banner_1.jpg";
export const ABOUT_PHOTO = CDN + "home_about_1.webp";

/** Transparent tire cut-outs by family (local /public/tires). */
export function familyTire(family: string): string {
  switch (family) {
    case "Press-on band": return "/tires/tire_3.png";
    case "Skid steer": return "/tires/tire_5.png";
    case "Port": return "/tires/tire_6.png";
    default: return "/tires/tire_1.png"; // Resilient solid
  }
}

/** Real machine photos from the site, by machine-finder id. */
export const MACHINE_PHOTO: Record<string, string> = {
  forklift: CDN + "industry_2.webp", // warehouse forklift
  "skid-steer": CDN + "industry_1.webp", // construction skid steer
  port: CDN + "industry_4.webp", // ports / container handler
  baggage: CDN + "industry_7.webp", // aviation ground support
  "reach-truck": CDN + "industry_6.webp", // indoor / manufacturing
  other: CDN + "industry_3.webp", // transport & material handling
};

/** Industries served, with the original site photos + copy. */
export const INDUSTRIES: { img: string; label: string }[] = [
  { img: CDN + "industry_1.webp", label: "Construction & Infrastructure" },
  { img: CDN + "industry_2.webp", label: "Warehousing & Logistics" },
  { img: CDN + "industry_3.webp", label: "Transport & Material Handling" },
  { img: CDN + "industry_4.webp", label: "Ports, Shipping & Container Yards" },
  { img: CDN + "industry_5.webp", label: "Mining & Quarrying" },
  { img: CDN + "industry_6.webp", label: "Manufacturing & Industrial Plants" },
  { img: CDN + "industry_7.webp", label: "Aviation & Ground Support" },
  { img: CDN + "industry_8.webp", label: "Scrap & Recycling Yards" },
];
