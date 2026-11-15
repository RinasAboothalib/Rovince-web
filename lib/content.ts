/* Full product + company content, transcribed from the existing rovincetire.com
   pages (resilient-solid, press-on-band, skid-steer, port, about).
   Light edits only: unproven numeric claims are tagged for confirmation and the
   duplicated "Integrity" value is given its own text. */

export type PerformItem = { name: string; desc?: string };

export type LineContent = {
  tagline: string;
  features: string[];
  performBest: PerformItem[];
  nonMarking?: { intro: string; features: string[]; performBest: PerformItem[] };
};

export const LINE_CONTENT: Record<string, LineContent> = {
  "resilient-solid": {
    tagline:
      "Designed for heavy-duty industrial environments, offering durability, comfort and optimal traction. Available as R1 Super Premium and R2 Super Premium.",
    features: [
      "Abrasion-resistant natural rubber compound for consistent grip, maximum friction and lasting tread life.",
      "Wider tread blocks for maximum traction on uneven terrain and enhanced load support — built for warehouse and port work.",
      "Vibration-free design reduces operational vibration for a smoother ride and operator comfort.",
      "Deep grooves and tread patterns for traction on wet or smooth industrial floors — better grip, less slippage.",
      "Deep tread for longer wear life and fewer replacements.",
      "Low-rolling-resistance compound for durability, better efficiency and cost savings over every kilometre.",
    ],
    performBest: [
      { name: "Forklifts" },
      { name: "Container Trailers" },
      { name: "Container Handlers" },
      { name: "Airport Baggage Trailers" },
      { name: "Electric Tow Tractors" },
    ],
    nonMarking: {
      intro:
        "Non-marking resilient solids for indoor industrial use — clean-floor performance, durability and reduced noise in sensitive spaces.",
      features: [
        "Non-marking compound leaves no streaks or marks on floors for clean indoor operation.",
        "Flat-free cushion tire — puncture-proof, with high resistance to cuts, chunks and abrasion.",
        "Built for hygiene-sensitive zones such as airports, hospitals and food-grade facilities.",
        "Carries heavy loads with smooth cornering, reduced vibration and reliable operator comfort.",
        "Smooth ride quality with reduced vibration and noise.",
        "Thermal-resistant design prevents overheating during heavy-duty, extended-use cycles.",
      ],
      performBest: [
        { name: "Mobile Work Platforms" },
        { name: "Reach Trucks" },
        { name: "Indoor Forklifts" },
        { name: "Order Pickers" },
        { name: "Pallet Stackers" },
      ],
    },
  },
  "press-on-band": {
    tagline:
      "Compact and durable for effortless mounting, with a metal-to-rubber bond that locks on for a non-removable fit across material-handling equipment. Traction and Smooth profiles.",
    features: [
      "Easy to install with secure press-fit mounting.",
      "Compact design ideal for small industrial vehicles.",
      "High load capacity and excellent traction.",
      "Long wear life in demanding conditions.",
      "Reduced downtime and maintenance.",
      "Low rolling resistance for better efficiency and cost savings over every kilometre.",
    ],
    performBest: [
      { name: "Compact Loader" },
      { name: "Side Loader" },
      { name: "Forklifts" },
      { name: "Terminal Trailers" },
    ],
    nonMarking: {
      intro:
        "Non-marking press-on bands — the same rugged durability with clean, floor-safe performance for hygiene-sensitive environments.",
      features: [
        "Non-marking formula prevents floor stains and scuffing.",
        "Quiet, smooth operation on indoor surfaces.",
        "Maintains strength and stability under heavy loads.",
        "Ideal for pharma, food and cleanroom environments.",
        "Resistant to chunking and abrasion.",
        "Low rolling resistance for better efficiency.",
      ],
      performBest: [
        { name: "Pallet Jacks" },
        { name: "Counterbalance Forklifts" },
        { name: "Conveyor Drive Units" },
        { name: "Custom Indoor Equipment" },
      ],
    },
  },
  "skid-steer": {
    tagline:
      "Workmaster SKS tires, built tough for the roughest terrain — superior traction, stability and durability for heavy-duty skid steer work.",
    features: [
      "Aggressive tread pattern for maximum grip on mud, gravel and uneven terrain.",
      "Exceptional protection against punctures and abrasions — ideal for demolition zones and scrap yards.",
      "Deep, open-lug self-cleaning design prevents mud buildup for consistent traction and longer wear life.",
      "Ideal for heavy-duty construction, landscaping and demolition sites.",
      "Wide, balanced tread footprint reduces ground pressure and improves machine stability.",
      "Reduced rolling resistance for better energy efficiency, lower fuel use and reduced emissions.",
    ],
    performBest: [
      { name: "Skid Steer Loader", desc: "Construction, demolition and material handling" },
      { name: "Compact Utility Loader", desc: "Landscaping and maintenance tasks" },
      { name: "Mini Excavator", desc: "Traction and stability on uneven terrain" },
      { name: "Trencher", desc: "Reliable grip and durability in trenching" },
      { name: "Snow Removal Equipment", desc: "Cold, slippery and abrasive conditions" },
    ],
  },
  port: {
    tagline:
      "Engineered for extreme loads and continuous duty cycles — strength, stability and safety in high-demand port and terminal environments.",
    features: [
      "High-load capacity, tailored for container handlers, reach stackers and terminal tractors.",
      "Heavy-duty casing resists cuts, abrasions and impact damage for maximum uptime.",
      "Advanced compounds and internal structure reduce heat buildup for continuous operation.",
      "Deep treads and specialised compounds extend tire life and cut downtime.",
      "Built for frequent braking, acceleration and sharp maneuvering in congested terminals.",
      "Optimised tread reduces energy loss for better efficiency and lower cost per kilometre.",
    ],
    performBest: [
      { name: "Container Trailers", desc: "High-load towing across paved terminal surfaces" },
      { name: "Empty Container Handler", desc: "Vertical lifting and maneuvering under stress" },
      { name: "Terminal Tractor", desc: "Low rolling resistance for fuel-efficient yard work" },
      { name: "Straddle Carrier", desc: "Stability and shock absorption during stacking" },
      { name: "Gantry Crane", desc: "High-load tires for slow-speed, high-weight operations" },
    ],
  },
};

/* Shared cross-section (resilient solid / three-layer build) */
export const CROSS_SECTION = [
  { layer: "Tread layer", desc: "Designed to resist wear and abrasion, with low heat build-up." },
  { layer: "Centre layer", desc: "Provides an excellent cushioning effect and precise steering." },
  { layer: "Base layer", desc: "A premium compound for high stability and a strong grip on the wheel." },
];

/* "What makes Rovince a class apart" — shown once, on About */
export const CLASS_APART: { title: string; body: string; confirm?: boolean }[] = [
  {
    title: "Real-world industrial expertise",
    body: "Years of industrial tire engineering and manufacturing go into every product. From industrial yards to warehouses and construction zones, Rovince delivers the strength, safety and durability demanding conditions require.",
  },
  {
    title: "Premium rubber, built for durability",
    body: "Made with the best natural rubber from Sri Lanka. High-quality compounds mean long-lasting treads, strong resistance to damage and optimal performance in heavy-duty, puncture-prone environments.",
  },
  {
    title: "Built for the grind, 24/7",
    body: "Engineered for puncture resistance and high load capacities, Rovince tires keep running through back-to-back shifts so operations run with minimum maintenance and maximum reliability.",
  },
  {
    title: "4,000+ working hours",
    body: "Engineered for an extended lifespan of over 4,000 working hours to reduce replacements, cut downtime and maximise return on investment.",
    confirm: true,
  },
  {
    title: "Your brand, our craftsmanship",
    body: "With our private-label manufacturing program you get world-class tires with your name on them — you own the product, the market and the profits.",
  },
  {
    title: "Premium quality, competitive pricing",
    body: "Exceptional value — the best-priced premium tire brand proudly made in Sri Lanka. Big performance, smart investment.",
  },
];

/* Proof figures (some unproven — tagged for confirmation) */
export const STATS: { n: string; label: string; confirm?: boolean }[] = [
  { n: "2014", label: "First solid tire built in Sri Lanka" },
  { n: "4 lines", label: "Resilient solid, press-on, skid steer, port" },
  { n: "~70 sizes", label: "Black or non-marking grey in every size" },
  { n: "20+", label: "Countries exported to", confirm: true },
];

/* About page content */
export const ABOUT = {
  lead:
    "Our story began with a simple observation: industry needed a tire tough enough to survive, smart enough to adapt, and reliable enough to cut downtime. So in 2014 we began building that tire — in Sri Lanka.",
  body: [
    "Rovince builds solid industrial tires at its own plant in Nattandiya, Sri Lanka, and sells and ships them to US tire dealers and fleets from a warehouse in Compton, California. We also export to customers in 20+ countries including the USA, Germany, UAE, Saudi Arabia, Pakistan and India.",
    "This isn't just about rubber and rims. It's about resilience — engineering trust into every tread, so every mile you run on a Rovince is a mile of certainty.",
  ],
  facility:
    "At our factory in Nattandiya we blend modern machinery with local craftsmanship and global standards. From testing labs to real-world load simulations, every tire is built where precision meets purpose.",
  vision: "Leading the way in global industrial tire excellence.",
  mission:
    "To engineer superior solid tires that maximise performance, reliability and value for industries worldwide — through continuous innovation, lasting partnerships and solutions that drive operational excellence with integrity and customer focus.",
  values: [
    { k: "Reliability", v: "We deliver products and service our customers can count on, every time, everywhere." },
    { k: "Innovation", v: "We challenge norms to develop smarter, stronger and more efficient tire solutions." },
    { k: "Customer-centricity", v: "Our customers' success drives our innovation and our commitment to excellence." },
    { k: "Integrity", v: "We do what we say — honest specs, honest stock, honest dealing on every order." },
    { k: "Performance excellence", v: "We engineer every tire to exceed industry standards and customer expectations, with no compromise." },
    { k: "Sustainability", v: "We build products — and a future — that are resilient and responsible." },
  ],
  exports: ["USA", "Germany", "UAE", "Saudi Arabia", "Pakistan", "India"],
};
