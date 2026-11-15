import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SIZES, bySlug, lineSlug, sizeSlug, sizeHref, kgToLb, fmt, kgLb, sameSizeOtherLines,
} from "@/data/sizes";
import SizeLoad from "@/components/SizeLoad";
import { familyTire } from "@/lib/media";

type Params = { line: string; size: string };

export function generateStaticParams(): Params[] {
  return SIZES.map((t) => ({ line: lineSlug(t.line), size: sizeSlug(t.size) }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const t = bySlug(params.line, params.size);
  if (!t) return { title: "Size not found" };
  const load = t.loadKg.forkliftLoad;
  const loadStr = load ? `${fmt(load)} kg (${fmt(kgToLb(load))} lb) load wheel. ` : "";
  return {
    title: `${t.size} Solid Forklift Tire, ${t.line}`,
    description: `${t.size} ${t.line} ${t.pattern.toLowerCase()} solid tire. ${loadStr}Rim ${t.rimSizeIn} in. Black or non-marking grey. Check stock and add to a quote.`,
    alternates: { canonical: sizeHref(t) },
  };
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{value}</td>
    </tr>
  );
}

export default function SizePage({ params }: { params: Params }) {
  const t = bySlug(params.line, params.size);
  if (!t) notFound();

  const L = t.loadKg;
  const others = sameSizeOtherLines(t);
  const inStock = t.stock.black === "in_stock" || t.stock.grey === "in_stock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${t.size} ${t.line} Solid Tire`,
    sku: t.id,
    brand: { "@type": "Brand", name: "Rovince Tire" },
    category: t.family,
    description: `${t.size} ${t.line} ${t.pattern} solid industrial tire.`,
    ...(t.overallDiameterMm ? { width: `${t.sectionWidthMm} mm`, height: `${t.overallDiameterMm} mm` } : {}),
    offers: {
      "@type": "Offer",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      areaServed: "US",
    },
  };

  return (
    <article className="size-page">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/sizes">Find a size</Link> / {t.family} / <Link href={`/tires/${lineSlug(t.line) === "r1-super-premium" || lineSlug(t.line) === "r2-super-premium" ? "resilient-solid" : t.family.toLowerCase().replace(/\s+/g, "-")}`}>{t.line}</Link>
        </nav>

        <div className="size-top">
          {/* photo */}
          <div className="size-photo">
            <div className="size-photo-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={familyTire(t.family)} alt={`${t.size} ${t.line} solid tire`} />
              <span className="size-photo-tag">{t.line} · {t.colours[0]} <em className="confirm-tag">[representative — line photo]</em></span>
            </div>
          </div>

          {/* headline + load */}
          <div className="size-head">
            <p className="eyebrow">{t.family} · {t.line} · {t.pattern}</p>
            <h1 className="size-code">{t.size}</h1>
            <p className="size-fits">
              Fits a {t.rimSizeIn} in rim, {t.fit.toLowerCase()}.{" "}
              {t.sectionWidthMm ? `Section width ${(t.sectionWidthMm / 25.4).toFixed(2)} in (${t.sectionWidthMm} mm), ` : ""}
              rim diameter {t.rimSizeIn} in.
            </p>
            <SizeLoad t={t} />
          </div>
        </div>

        {/* full spec table — real text */}
        <section className="spec">
          <h2>Full specification</h2>
          <div className="sizes-scroll">
            <table className="spec-table">
              <tbody>
                <Row label="Size" value={t.size} />
                <Row label="Line" value={t.line} />
                <Row label="Tread pattern" value={t.pattern} />
                <Row label="Rim size" value={`${t.rimSizeIn} in`} />
                <Row label="Fit" value={t.fit} />
                <Row label="Colours" value={t.colours.join(" · ")} />
                {t.overallDiameterMm && <Row label="Overall diameter" value={`${t.overallDiameterMm} mm (${(t.overallDiameterMm / 25.4).toFixed(1)} in)`} />}
                {t.sectionWidthMm && <Row label="Section width" value={`${t.sectionWidthMm} mm (${(t.sectionWidthMm / 25.4).toFixed(2)} in)`} />}
                {t.treadWidthMm && <Row label="Tread width" value={`${t.treadWidthMm} mm (${(t.treadWidthMm / 25.4).toFixed(2)} in)`} />}
                {t.weightKg2Layer && <Row label="Approx. weight (2-layer)" value={`${t.weightKg2Layer} kg (${fmt(kgToLb(t.weightKg2Layer))} lb)`} />}
                {t.weightKg3Layer && <Row label="Approx. weight (3-layer)" value={`${t.weightKg3Layer} kg (${fmt(kgToLb(t.weightKg3Layer))} lb)`} />}
                {L.forkliftLoad && <Row label="Forklift, load wheel" value={kgLb(L.forkliftLoad)} />}
                {L.forkliftSteer && <Row label="Forklift, steering wheel" value={kgLb(L.forkliftSteer)} />}
                {L.other6 && <Row label="Other vehicle, 6 km/h" value={kgLb(L.other6)} />}
                {L.other10 && <Row label="Other vehicle, 10 km/h" value={kgLb(L.other10)} />}
                {L.other25 && <Row label="Other vehicle, 25 km/h" value={kgLb(L.other25)} />}
                {L.static && <Row label="Standing still (static)" value={kgLb(L.static)} />}
              </tbody>
            </table>
          </div>
          {t.confirm && <p className="confirm-note">Figures from the 2025 catalogue — <span className="confirm-tag">[confirm with Rovince]</span> against the checked spreadsheet before launch.</p>}
        </section>

        {others.length > 0 && (
          <section className="same-size">
            <h2>Same size in other lines</h2>
            <div className="same-size-list">
              {others.map((o) => (
                <Link key={o.id} href={sizeHref(o)} className="same-size-card">
                  <span className="ss-size">{o.size}</span>
                  <span>{o.line}</span>
                  <span className="stock mto"><i /> made to order</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
