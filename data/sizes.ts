/* =====================================================================
   Rovince size catalogue — the single source of truth.
   Sizes are built from the 2025 catalogue CSV (R1 Super Premium seed).
   Every figure is real text so Google + Ctrl+F can find it.
   [CONFIRM WITH ROVINCE] all numbers against the checked spreadsheet,
   and the stock status per size and colour, before launch.
===================================================================== */

export type Family = "Resilient solid" | "Press-on band" | "Skid steer" | "Port";
export type Line =
  | "R1 Super Premium"
  | "R2 Super Premium"
  | "Press-on Band"
  | "Skid Steer"
  | "Port";
export type Colour = "Black" | "Non-marking grey";
export type StockState = "in_stock" | "made_to_order";

export type LoadKg = {
  static?: number;
  forkliftLoad?: number;
  forkliftSteer?: number;
  other6?: number;
  other10?: number;
  other25?: number;
};

export type TireSize = {
  id: string;
  line: Line;
  family: Family;
  size: string; // display, e.g. "6.50-10"
  sizeKey: string; // normalised, e.g. "65010"
  aliases: string[];
  rimSizeIn: string;
  fit: string;
  pattern: "Traction" | "Smooth" | "Rib";
  weightKg2Layer?: number;
  weightKg3Layer?: number;
  overallDiameterMm?: number;
  sectionWidthMm?: number;
  treadWidthMm?: number;
  loadKg: LoadKg;
  colours: Colour[];
  stock: { black: StockState; grey: StockState };
  machines: string[];
  photos: { black?: string; grey?: string };
  confirm?: boolean; // true = figures not yet verified with Rovince
};

/* ---------- normalisation ---------- *
   Strip spaces, unify x / - / / separators, drop decimal points, keep digits.
   6.50-10 = 650-10 = 6.50x10 = 6.50 10 = 6,50-10  →  "65010"
   21x8x9 = 21x8-9 = 21 x 8 x 9  →  "2189"                                    */
export function normaliseSize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[x×*]/g, "")
    .replace(/[\s./\-,]/g, "")
    .replace(/[^0-9]/g, "");
}

export const kgToLb = (kg: number) => Math.round(kg * 2.20462);
export const fmt = (n: number) => n.toLocaleString("en-US");
export const kgLb = (kg: number) => `${fmt(kg)} kg (${fmt(kgToLb(kg))} lb)`;

export function lineSlug(line: Line): string {
  return line.toLowerCase().replace(/\s+/g, "-");
}
export function sizeSlug(size: string): string {
  return size.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export function sizeHref(t: TireSize): string {
  return `/sizes/${lineSlug(t.line)}/${sizeSlug(t.size)}`;
}

/* ---------- aliases ---------- *
   Generate the common spellings a dealer might type for a size.             */
function aliasesFor(size: string): string[] {
  const out = new Set<string>();
  out.add(size.replace(/\s+/g, ""));
  out.add(size.replace(/x/gi, "-"));
  out.add(size.replace(/-/g, "x"));
  out.add(size.replace(/\./g, "")); // 6.50-10 -> 650-10
  out.add(size.replace(/\./g, "").replace(/-/g, "x"));
  out.delete(size);
  return [...out];
}

/* ---------- R1 Super Premium seed (2025 catalogue) ---------- *
   cols: size,rim,wt2,wt3,od,section,tread,static,fl_load,fl_steer,v6,v10,v25 */
const R1_CSV = `
15x4 1/2-8,3,10.15,9.95,375,116,110,1210,1040,800,1040,940,800
4.00-8 RIB,3.75,11.8,11.7,406,116,106,,,,,,
4.00-8,3.75,12.2,12,403,116,106,,,,,,
16x6-8,4.33,17,16.8,417,148,135,1735,1495,1150,1495,1355,1150
5.00-8,3,17.6,17.2,453,122,112,1645,1415,1090,1415,1285,1090
18x7-8,4.33,21.3,20.8,451,146,133,2160,1860,1430,1860,1685,1425
140/55-9,4,10.9,10.4,383,124,118,2490,2145,1650,2145,1945,1650
6.00-9,4,26.5,26,529,131,120,2190,1885,1450,1885,1710,1450
21x8x9,6,34.8,34.3,523,172,159,3200,2755,2120,2755,2505,2120
200/50-10,6.5,24.7,24.2,457,187,170,2870,2470,1900,2470,2240,1900
6.50-10,5,36.5,35.8,571,151,136,2720,2340,1800,2340,2125,1800
23x9-10,6.5,45.7,45,578,184,168,4000,3445,2650,3445,3125,2650
7.00-12,5,46.8,45.8,652,166,150,3380,2920,2240,2920,2645,2240
23x10-12,8,50.2,49,576,217,211,4380,3770,2900,3770,3420,2900
27x10-12,8,73.2,71.9,668,220,205,4530,3900,3000,3900,3540,3000
28x9-15,7,60.1,58.9,689,204,190,4380,3770,2900,3770,3420,2900
7.00-15,5.5/6,67,65.8,748,186,165,4115,3545,2725,3545,3215,2725
250-15,7.0/7.5,67.5,66.2,715,212,193,5510,4750,3650,4750,4300,3650
8.25-15,5.5/6.5,89.4,88,812,201,181,5510,4750,3650,4750,4300,3650
8.25-15 SM,6.5,94.9,92.2,,,,5510,4750,3650,4750,4300,3650
300-15,8,111.9,108.1,814,238,216,6795,5850,4500,5850,5310,4500
28x12.5-15,9.75,81.5,78.75,683,280,268,,,,,,
`.trim();

const num = (s: string) => (s === "" ? undefined : Number(s));

function parseR1(): TireSize[] {
  return R1_CSV.split("\n").map((row) => {
    const [size, rim, wt2, wt3, od, sec, tread, st, fl, fs, v6, v10, v25] =
      row.split(",");
    const pattern: TireSize["pattern"] = /rib/i.test(size)
      ? "Rib"
      : /sm$/i.test(size)
        ? "Smooth"
        : "Traction";
    return {
      id: `r1-super-premium-${sizeSlug(size)}`,
      line: "R1 Super Premium",
      family: "Resilient solid",
      size,
      sizeKey: normaliseSize(size),
      aliases: aliasesFor(size),
      rimSizeIn: rim,
      fit: "Easy-fit / Normal",
      pattern,
      weightKg2Layer: num(wt2),
      weightKg3Layer: num(wt3),
      overallDiameterMm: num(od),
      sectionWidthMm: num(sec),
      treadWidthMm: num(tread),
      loadKg: {
        static: num(st),
        forkliftLoad: num(fl),
        forkliftSteer: num(fs),
        other6: num(v6),
        other10: num(v10),
        other25: num(v25),
      },
      colours: ["Black", "Non-marking grey"],
      stock: { black: "in_stock", grey: "made_to_order" },
      machines: ["forklift", "reach-truck"],
      photos: {},
      confirm: true,
    } satisfies TireSize;
  });
}

/* ---------- other lines: sample seed rows ---------- *
   Placeholder rows so all four lines exist in the finder. Replace with the
   checked spreadsheets for R2, Press-on Band, Skid Steer and Port.          */
function sample(
  line: Line,
  family: Family,
  size: string,
  rim: string,
  load: LoadKg,
  machines: string[],
  pattern: TireSize["pattern"] = "Traction",
): TireSize {
  return {
    id: `${lineSlug(line)}-${sizeSlug(size)}`,
    line,
    family,
    size,
    sizeKey: normaliseSize(size),
    aliases: aliasesFor(size),
    rimSizeIn: rim,
    fit: family === "Press-on band" ? "Press-on" : "Normal",
    pattern,
    loadKg: load,
    colours: ["Black", "Non-marking grey"],
    stock: { black: "made_to_order", grey: "made_to_order" },
    machines,
    photos: {},
    confirm: true,
  };
}

const OTHER: TireSize[] = [
  sample("R2 Super Premium", "Resilient solid", "6.50-10", "5", { static: 2860, forkliftLoad: 2460, forkliftSteer: 1890, other25: 2460 }, ["forklift"]),
  sample("Press-on Band", "Press-on band", "21x7x15", "15", { forkliftLoad: 2085, forkliftSteer: 1600, static: 2420 }, ["reach-truck", "forklift"]),
  sample("Press-on Band", "Press-on band", "18x7-8", "8", { forkliftLoad: 1860, forkliftSteer: 1430, static: 2160 }, ["reach-truck"]),
  sample("Skid Steer", "Skid steer", "10-16.5", "8.25", { static: 2100 }, ["skid-steer"]),
  sample("Skid Steer", "Skid steer", "12-16.5", "9.75", { static: 2500 }, ["skid-steer"]),
  sample("Port", "Port", "18.00-25", "13", { static: 14000 }, ["port"]),
];

export const SIZES: TireSize[] = [...parseR1(), ...OTHER];

export const LINES: { line: Line; family: Family; slug: string }[] = [
  { line: "R1 Super Premium", family: "Resilient solid", slug: lineSlug("R1 Super Premium") },
  { line: "R2 Super Premium", family: "Resilient solid", slug: lineSlug("R2 Super Premium") },
  { line: "Press-on Band", family: "Press-on band", slug: lineSlug("Press-on Band") },
  { line: "Skid Steer", family: "Skid steer", slug: lineSlug("Skid Steer") },
  { line: "Port", family: "Port", slug: lineSlug("Port") },
];

/* families → tire-line pages (/tires/[family]) */
export const FAMILIES: { slug: string; family: Family; title: string; blurb: string; bestFor: string[] }[] = [
  {
    slug: "resilient-solid",
    family: "Resilient solid",
    title: "Resilient Solid Tires",
    blurb: "Three-layer solid construction for forklifts and material handling — no air, no downtime.",
    bestFor: ["Counterbalance forklifts", "Container trailers & handlers", "Airport baggage trailers", "Electric tow tractors"],
  },
  {
    slug: "press-on-band",
    family: "Press-on band",
    title: "Press-On Band Tires",
    blurb: "Low-rolling-resistance press-on bands for electric trucks and indoor handling.",
    bestFor: ["Reach trucks", "Indoor forklifts", "Order pickers", "Pallet stackers", "Mobile work platforms"],
  },
  {
    slug: "skid-steer",
    family: "Skid steer",
    title: "Skid Steer Tires",
    blurb: "Deep-tread, cut-resistant tires that grip and climb across rough sites.",
    bestFor: ["Skid steer loaders", "Compact track loaders", "Construction sites"],
  },
  {
    slug: "port",
    family: "Port",
    title: "Port Tires",
    blurb: "High-capacity tires for container handlers and port equipment under extreme loads.",
    bestFor: ["Container handlers", "Reach stackers", "Port tractors", "Terminal yards"],
  },
];

/* ---------- lookups ---------- */
export function findByKey(input: string): TireSize[] {
  const key = normaliseSize(input);
  if (!key) return [];
  return SIZES.filter(
    (t) => t.sizeKey === key || t.sizeKey.startsWith(key) || t.aliases.some((a) => normaliseSize(a) === key),
  );
}
export function bySlug(line: string, size: string): TireSize | undefined {
  return SIZES.find((t) => lineSlug(t.line) === line && sizeSlug(t.size) === size);
}
export function byFamily(family: Family): TireSize[] {
  return SIZES.filter((t) => t.family === family);
}
export function sameSizeOtherLines(t: TireSize): TireSize[] {
  return SIZES.filter((x) => x.sizeKey === t.sizeKey && x.id !== t.id);
}

/* ---------- load-figure logic ---------- */
export type WhatsOn = "Forklift" | "Other vehicle";
export type Wheel = "Load wheel" | "Steering wheel";
export type Speed = "6" | "10" | "25";

export function loadFigure(
  t: TireSize,
  whatsOn: WhatsOn,
  wheel: Wheel,
  speed: Speed,
): { label: string; kg?: number } {
  const L = t.loadKg;
  if (whatsOn === "Forklift") {
    if (wheel === "Load wheel")
      return { label: "Carries per tire, on forklifts up to 25 km/h (15 mph)", kg: L.forkliftLoad };
    return { label: "Steering wheel, on forklifts", kg: L.forkliftSteer };
  }
  const map: Record<Speed, number | undefined> = { "6": L.other6, "10": L.other10, "25": L.other25 };
  return { label: `Carries per tire, up to ${speed} km/h`, kg: map[speed] };
}
