import type { Metadata } from "next";
import SizesTable from "@/components/SizesTable";

export const metadata: Metadata = {
  title: "All Solid Tire Sizes — Forklift, Skid Steer & Port",
  description:
    "Every Rovince solid tire size in one searchable table: rim size, pattern, forklift load in kg and lb, colour and stock. Filter by line, load and stock.",
  alternates: { canonical: "/sizes" },
};

export default function SizesPage() {
  return (
    <section className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Every size, as text</span>
          <h2>All tire sizes</h2>
          <p className="lead">
            One table of every size across all four lines — searchable and copyable, with the load each carries
            and its stock. Click a size for its full page.
          </p>
        </div>
        <SizesTable />
      </div>
    </section>
  );
}
