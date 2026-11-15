import type { Metadata } from "next";
import QuoteList from "@/components/QuoteList";

export const metadata: Metadata = {
  title: "Your Quote List — Send One Request",
  description:
    "Add several sizes — or a photo of the tire — to one quote list and send a single request with only the details needed to price it.",
  alternates: { canonical: "/quote" },
  robots: { index: false },
};

export default function QuotePage() {
  return (
    <section className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">One request, many sizes</span>
          <h2>Quote list</h2>
        </div>
        <QuoteList />
      </div>
    </section>
  );
}
