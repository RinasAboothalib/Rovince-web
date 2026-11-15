import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAMILIES, byFamily, sizeHref, fmt, kgToLb } from "@/data/sizes";
import { familyTire } from "@/lib/media";
import { LINE_CONTENT, CROSS_SECTION } from "@/lib/content";

type Params = { family: string };

export function generateStaticParams(): Params[] {
  return FAMILIES.map((f) => ({ family: f.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const f = FAMILIES.find((x) => x.slug === params.family);
  if (!f) return { title: "Tire line not found" };
  return {
    title: `${f.title} — Sizes, Loads & Stock`,
    description: `${f.blurb} Every ${f.title.toLowerCase()} size as text, with the load it carries and its stock.`,
    alternates: { canonical: `/tires/${f.slug}` },
  };
}

export default function TireLinePage({ params }: { params: Params }) {
  const f = FAMILIES.find((x) => x.slug === params.family);
  if (!f) notFound();
  const sizes = byFamily(f.family);

  return (
    <article className="sec" style={{ paddingTop: 120 }}>
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb"><Link href="/sizes">Tire lines</Link> / {f.title}</nav>
        <div className="line-hero">
          <div className="sec-head" style={{ marginTop: 14, marginBottom: 0 }}>
            <span className="eyebrow">{f.family}</span>
            <h2>{f.title}</h2>
            <p className="lead">{f.blurb}</p>
          </div>
          <div className="line-hero-pic">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={familyTire(f.family)} alt={f.title} />
          </div>
        </div>

        {(() => {
          const c = LINE_CONTENT[f.slug];
          if (!c) return null;
          return (
            <>
              <p className="lead" style={{ marginTop: 34, maxWidth: "70ch" }}>{c.tagline}</p>

              <h3 style={{ margin: "34px 0 16px" }}>Features</h3>
              <div className="feature-grid">
                {c.features.map((ft, i) => (
                  <div className="feature-item" key={i}>
                    <span className="feature-no">{String(i + 1).padStart(2, "0")}</span>
                    <p>{ft}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ margin: "40px 0 16px" }}>Where it performs best</h3>
              <div className="perform-grid">
                {c.performBest.map((p) => (
                  <div className="perform-card" key={p.name}>
                    <strong>{p.name}</strong>
                    {p.desc && <span>{p.desc}</span>}
                  </div>
                ))}
              </div>

              {f.slug === "resilient-solid" && (
                <>
                  <h3 style={{ margin: "40px 0 16px" }}>Tire cross-section</h3>
                  <div className="cross-grid">
                    {CROSS_SECTION.map((l, i) => (
                      <div className="cross-card" key={l.layer}>
                        <span className="cross-no">{String(i + 1).padStart(2, "0")}</span>
                        <strong>{l.layer}</strong>
                        <p>{l.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {c.nonMarking && (
                <div className="nonmarking">
                  <h3 style={{ margin: "44px 0 10px" }}>Non-marking {f.title.toLowerCase()}</h3>
                  <p className="lead" style={{ maxWidth: "70ch", marginBottom: 18 }}>{c.nonMarking.intro}</p>
                  <div className="feature-grid">
                    {c.nonMarking.features.map((ft, i) => (
                      <div className="feature-item" key={i}>
                        <span className="feature-no">{String(i + 1).padStart(2, "0")}</span>
                        <p>{ft}</p>
                      </div>
                    ))}
                  </div>
                  <h4 style={{ margin: "24px 0 12px", fontFamily: "var(--font-head)" }}>Where non-marking performs best</h4>
                  <div className="perform-grid">
                    {c.nonMarking.performBest.map((p) => (
                      <div className="perform-card" key={p.name}><strong>{p.name}</strong>{p.desc && <span>{p.desc}</span>}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        <h3 style={{ margin: "34px 0 16px" }}>Every {f.title.toLowerCase()} size</h3>
        <div className="sizes-scroll">
          <table className="sizes-table">
            <thead>
              <tr><th className="col-size">Size</th><th>Line</th><th>Rim (in)</th><th>Forklift load wheel</th><th>Colours</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {sizes.map((t) => {
                const load = t.loadKg.forkliftLoad;
                const inStock = t.stock.black === "in_stock" || t.stock.grey === "in_stock";
                return (
                  <tr key={t.id}>
                    <td className="col-size"><Link href={sizeHref(t)}>{t.size}</Link></td>
                    <td>{t.line}</td>
                    <td className="num">{t.rimSizeIn}</td>
                    <td className="num">{load ? `${fmt(load)} kg (${fmt(kgToLb(load))} lb)` : "Ask us"}</td>
                    <td>{t.colours.includes("Non-marking grey") ? "Black · Grey" : "Black"}</td>
                    <td><span className={"stock " + (inStock ? "in" : "mto")}><i /> {inStock ? "Compton" : "Made to order"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="confirm-note" style={{ marginTop: 16 }}>
          Brochure / datasheet PDF — <span className="confirm-tag">[to come from Rovince]</span>
        </p>
      </div>
    </article>
  );
}
