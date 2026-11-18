import type { Metadata } from "next";
import MachineFinder from "@/components/MachineFinder";
import MachineScroller from "@/components/MachineScroller";

export const metadata: Metadata = {
  title: "Pick Your Machine — Find the Right Tire Size",
  description:
    "No size on the old tire? Pick your machine, click the wheel, choose glide or grip, and get the likely Rovince sizes with their load. Add them straight to a quote.",
  alternates: { canonical: "/machine" },
};

export default function MachinePage() {
  return (
    <>
      <section className="sec" style={{ paddingTop: 120 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">No size? Start here</span>
            <h2>Pick your machine</h2>
            <p className="lead">
              Three quick questions — machine, wheel, and glide or grip — and we&apos;ll show the sizes that
              usually fit. Check the number on your tire, then add it to a quote.
            </p>
          </div>
          <MachineScroller />
          <MachineFinder />
        </div>
      </section>
    </>
  );
}
