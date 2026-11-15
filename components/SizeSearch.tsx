"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { findByKey, normaliseSize, sizeHref, SIZES } from "@/data/sizes";
import { useQuote } from "@/lib/quote";

function stockText(t: ReturnType<typeof findByKey>[number]) {
  const inStock = t.stock.black === "in_stock" || t.stock.grey === "in_stock";
  return inStock
    ? { cls: "in", text: "In stock, Compton" }
    : { cls: "mto", text: "Made to order" };
}

export default function SizeSearch({ autofocus = false }: { autofocus?: boolean }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { add } = useQuote();

  const results = useMemo(() => (q.trim() ? findByKey(q).slice(0, 8) : []), [q]);
  const key = normaliseSize(q);
  const altSpellings = useMemo(() => {
    if (!results.length) return [];
    const set = new Set<string>();
    results.forEach((r) => r.aliases.forEach((a) => a !== r.size && set.add(a)));
    return [...set].slice(0, 3);
  }, [results]);

  const noMatch = q.trim().length >= 2 && results.length === 0;

  return (
    <div className="sizesearch">
      <label htmlFor="size-q" className="sr-only">Tire size</label>
      <input
        id="size-q"
        ref={inputRef}
        autoFocus={autofocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="e.g. 6.50-10"
        inputMode="text"
        autoComplete="off"
        aria-expanded={focused && (results.length > 0 || noMatch)}
        aria-controls="size-results"
      />
      {focused && (results.length > 0 || noMatch) && (
        <div className="sizesearch-pop" id="size-results" role="listbox">
          {results.map((t) => {
            const s = stockText(t);
            return (
              <Link key={t.id} href={sizeHref(t)} className="ss-row" role="option">
                <span className="ss-size">{t.size}</span>
                <span className="ss-line">{t.family} · {t.line}</span>
                <span className={"stock " + s.cls}><i /> {s.text}</span>
              </Link>
            );
          })}
          {results.length > 0 && (
            <div className="ss-foot">
              {results.length} match{results.length > 1 ? "es" : ""}
              {altSpellings.length ? <>. Also matches {altSpellings.join(" and ")}.</> : "."}
            </div>
          )}
          {noMatch && (
            <div className="ss-nomatch">
              <p>We don&apos;t list <strong>{q.trim()}</strong> yet.</p>
              <button
                type="button"
                className="btn btn-quote"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  add({ key: `freetext-${key}`, size: q.trim(), line: "Size not listed", colour: "—", meta: "We'll tell you if we can make it.", freeText: true });
                  setQ("");
                }}
              >
                Add it to your quote anyway →
              </button>
            </div>
          )}
        </div>
      )}
      <p className="sizesearch-hint">
        Don&apos;t know the size? <Link href="/machine">Pick your machine</Link> or{" "}
        <Link href="/quote">send us a photo</Link>.
      </p>
    </div>
  );
}

export const TOTAL_SIZES = SIZES.length;
