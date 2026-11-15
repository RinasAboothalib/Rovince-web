import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance — REACH, TRA & ETRTO",
  description:
    "The standards Rovince solid tires are built to: EU REACH for chemical substances, the US Tire & Rim Association, and ETRTO in Europe.",
  alternates: { canonical: "/compliance" },
};

const CARDS = [
  {
    badge: "REACH (EC 1907/2006)",
    body: "Our rubber compounds are made to comply with the EU REACH regulation on the registration, evaluation, authorisation and restriction of chemical substances.",
    confirm: "Declaration PDF to be supplied by Rovince.",
  },
  {
    badge: "The Tire & Rim Association (TRA)",
    body: "The US standard for tire and rim dimensions and load ratings. Our sizes follow TRA dimensions so a tire interchanges on the right rim and carries its rated load.",
    confirm: "Confirm which TRA standards and year Rovince certifies to.",
  },
  {
    badge: "ETRTO",
    body: "The European Tyre and Rim Technical Organisation sets the equivalent dimensional and load standards for the EU market. Our European fitments follow ETRTO ratings.",
    confirm: "Confirm ETRTO coverage per line.",
  },
];

export default function CompliancePage() {
  return (
    <section className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Made to standard</span>
          <h2>Compliance</h2>
          <p className="lead">Each standard, stated accurately and separately. Claims marked for confirmation are not yet backed by a document on file.</p>
        </div>
        <div className="comp-grid">
          {CARDS.map((c) => (
            <div className="comp" key={c.badge}>
              <div className="badge">{c.badge}</div>
              <p>{c.body}</p>
              <p className="confirm-note"><span className="confirm-tag">[confirm with Rovince]</span> {c.confirm}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
