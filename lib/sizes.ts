/* =====================================================================
   Tire size catalogue + machine map for the "Find your size" concept.
   Sample load / stock data for demonstration — replace with live ERP feed.
===================================================================== */
const TIRE = "/tires/";

export type Stock = { status: "in-stock" | "made-to-order"; location?: string };

export type TireSize = {
  id: string;
  size: string;            // canonical, e.g. "6.50-10"
  alt: string[];           // alternative spellings
  line: "Resilient solid" | "Press-on band";
  grade: string;           // e.g. "R1 Super Premium"
  tread: string;           // e.g. "Traction"
  img: string;
  sectionIn: number;       // section width in inches
  rimIn: number;           // rim diameter in inches
  fits: string;
  loadWheelKg: number;     // carries per tire, load wheel
  steeringKg: number;      // steering wheel
  standingKg: number;      // standing still
  colors: string[];
  stock: Stock;
};

const kgToLb = (kg: number) => Math.round(kg * 2.20462);
export const lb = (kg: number) => kgToLb(kg).toLocaleString();
export const kg = (n: number) => n.toLocaleString();

export const SIZES: TireSize[] = [
  {
    id: "650-10-r1", size: "6.50-10", alt: ["650-10", "6.50x10"],
    line: "Resilient solid", grade: "R1 Super Premium", tread: "Traction", img: TIRE + "tire_1.png",
    sectionIn: 6.5, rimIn: 10, fits: "a 5.00 in. easy-fit or normal",
    loadWheelKg: 2340, steeringKg: 1800, standingKg: 2720,
    colors: ["Black", "Non-marking grey"], stock: { status: "in-stock", location: "Compton, CA" },
  },
  {
    id: "650-10-r2", size: "6.50-10", alt: ["650-10", "6.50x10"],
    line: "Resilient solid", grade: "R2 Super Premium", tread: "Traction", img: TIRE + "tire_1.png",
    sectionIn: 6.5, rimIn: 10, fits: "a 5.00 in. easy-fit or normal",
    loadWheelKg: 2460, steeringKg: 1890, standingKg: 2860,
    colors: ["Black"], stock: { status: "made-to-order" },
  },
  {
    id: "700-12-r1", size: "7.00-12", alt: ["700-12", "7.00x12"],
    line: "Resilient solid", grade: "R1 Super Premium", tread: "Traction", img: TIRE + "tire_5.png",
    sectionIn: 7.0, rimIn: 12, fits: "a 5.00 in. easy-fit or normal",
    loadWheelKg: 2930, steeringKg: 2250, standingKg: 3410,
    colors: ["Black", "Non-marking grey"], stock: { status: "in-stock", location: "Compton, CA" },
  },
  {
    id: "28x9-15-r1", size: "28x9-15", alt: ["28x9x15", "28-9-15"],
    line: "Resilient solid", grade: "R1 Super Premium", tread: "Traction", img: TIRE + "tire_5.png",
    sectionIn: 9.0, rimIn: 15, fits: "a 7.00 in. or 7.50 in. rim",
    loadWheelKg: 3770, steeringKg: 2900, standingKg: 4380,
    colors: ["Black", "Non-marking grey"], stock: { status: "made-to-order" },
  },
  {
    id: "21x8-9-r1", size: "21x8-9", alt: ["21x8x9", "21-8-9"],
    line: "Resilient solid", grade: "R1 Super Premium", tread: "Traction", img: TIRE + "tire_6.png",
    sectionIn: 8.0, rimIn: 9, fits: "a 6.00 in. or 7.00 in. rim",
    loadWheelKg: 3766, steeringKg: 2890, standingKg: 4370,
    colors: ["Black"], stock: { status: "in-stock", location: "Compton, CA" },
  },
  {
    id: "21x7x15-po", size: "21x7x15", alt: ["21-7-15", "21x7-15"],
    line: "Press-on band", grade: "Super Premium", tread: "Traction", img: TIRE + "tire_3.png",
    sectionIn: 7.0, rimIn: 15, fits: "a 15 in. press-on wheel",
    loadWheelKg: 2685, steeringKg: 2060, standingKg: 3120,
    colors: ["Black", "Non-marking grey"], stock: { status: "in-stock", location: "Compton, CA" },
  },
  {
    id: "18x7-8-po", size: "18x7-8", alt: ["18-7-8", "18x7x8"],
    line: "Press-on band", grade: "Super Premium", tread: "Traction", img: TIRE + "tire_3.png",
    sectionIn: 7.0, rimIn: 8, fits: "an 8 in. press-on wheel",
    loadWheelKg: 2120, steeringKg: 1630, standingKg: 2460,
    colors: ["Black", "Non-marking grey"], stock: { status: "in-stock", location: "Compton, CA" },
  },
];

/* Machine picker → likely size ids, by wheel position */
export type Machine = { id: string; label: string; note: string; front: string[]; rear: string[] };
export const MACHINES: Machine[] = [
  {
    id: "forklift-sit",
    label: "Sit-down counterbalance forklift",
    note: "The most common warehouse forklift. Front wheels carry the load.",
    front: ["650-10-r1", "700-12-r1", "28x9-15-r1", "21x8-9-r1"],
    rear: ["18x7-8-po", "21x7x15-po"],
  },
  {
    id: "reach",
    label: "Reach / electric forklift",
    note: "Indoor electric trucks, often non-marking tires.",
    front: ["21x7x15-po", "18x7-8-po"],
    rear: ["18x7-8-po"],
  },
  {
    id: "skid",
    label: "Skid steer loader",
    note: "Four equal wheels — pick any corner.",
    front: ["28x9-15-r1", "21x8-9-r1"],
    rear: ["28x9-15-r1", "21x8-9-r1"],
  },
];

export const byId = (id: string) => SIZES.find((s) => s.id === id)!;
