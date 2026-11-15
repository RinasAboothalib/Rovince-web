"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { SIZES, LINES, sizeHref, fmt, kgToLb, normaliseSize, type TireSize } from "@/data/sizes";
import { useQuote } from "@/lib/quote";

type SortKey = "size" | "line" | "rim" | "load";

export default function SizesTable() {
  const { add } = useQuote();
  const [q, setQ] = useState("");
  const [line, setLine] = useState("");
  const [colour, setColour] = useState("");
  const [stock, setStock] = useState("");
  const [minLoad, setMinLoad] = useState(0);
  const [sort, setSort] = useState<SortKey>("size");
  const [dir, setDir] = useState<1 | -1>(1);

  const rows = useMemo(() => {
    const key = normaliseSize(q);
    let list = SIZES.filter((t) => {
      if (key && !(t.sizeKey.includes(key) || t.aliases.some((a) => normaliseSize(a).includes(key)))) return false;
      if (line && t.line !== line) return false;
      if (colour === "grey" && !t.colours.includes("Non-marking grey")) return false;
      if (colour === "black" && !t.colours.includes("Black")) return false;
      if (stock === "in" && !(t.stock.black === "in_stock" || t.stock.grey === "in_stock")) return false;
      if (stock === "mto" && (t.stock.black === "in_stock" || t.stock.grey === "in_stock")) return false;
      if (minLoad && (t.loadKg.forkliftLoad ?? 0) < minLoad) return false;
      return true;
    });
    const val = (t: TireSize) =>
      sort === "size" ? Number(t.sizeKey) : sort === "line" ? t.line : sort === "rim" ? parseFloat(t.rimSizeIn) : t.loadKg.forkliftLoad ?? 0;
    list = [...list].sort((a, b) => {
      const va = val(a), vb = val(b);
      return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
    });
    return list;
  }, [q, line, colour, stock, minLoad, sort, dir]);

  const toggleSort = (k: SortKey) => {
    if (sort === k) setDir((d) => (d === 1 ? -1 : 1));
    else { setSort(k); setDir(1); }
  };

  const addRow = (t: TireSize) => {
    const load = t.loadKg.forkliftLoad;
    const inStock = t.stock.black === "in_stock" || t.stock.grey === "in_stock";
    add({
      key: `${t.id}-Black`,
      size: t.size,
      line: `${t.family} · ${t.line}`,
      colour: "Black",
      meta: `${load ? `${fmt(load)} kg load wheel · ` : ""}${inStock ? "in stock, Compton" : "made to order"}`,
      href: sizeHref(t),
    });
  };

  return (
    <div className="sizes-wrap">
      <div className="sizes-filters">
        <input placeholder="Search size, e.g. 6.50-10" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search size" />
        <select value={line} onChange={(e) => setLine(e.target.value)} aria-label="Tire line">
          <option value="">All lines</option>
          {LINES.map((l) => <option key={l.line} value={l.line}>{l.line}</option>)}
        </select>
        <select value={colour} onChange={(e) => setColour(e.target.value)} aria-label="Colour">
          <option value="">Any colour</option>
          <option value="black">Black</option>
          <option value="grey">Non-marking grey</option>
        </select>
        <select value={stock} onChange={(e) => setStock(e.target.value)} aria-label="Stock">
          <option value="">Any stock</option>
          <option value="in">In stock</option>
          <option value="mto">Made to order</option>
        </select>
        <select value={minLoad} onChange={(e) => setMinLoad(Number(e.target.value))} aria-label="Minimum load">
          <option value={0}>Any load</option>
          <option value={2000}>2,000 kg+</option>
          <option value={3000}>3,000 kg+</option>
          <option value={4000}>4,000 kg+</option>
        </select>
      </div>

      <p className="sizes-count">{rows.length} sizes</p>

      <div className="sizes-scroll">
        <table className="sizes-table">
          <thead>
            <tr>
              <th className="col-size" onClick={() => toggleSort("size")}>Size {sort === "size" ? (dir === 1 ? "▲" : "▼") : ""}</th>
              <th onClick={() => toggleSort("line")}>Line</th>
              <th onClick={() => toggleSort("rim")}>Rim (in)</th>
              <th>Pattern</th>
              <th onClick={() => toggleSort("load")}>Forklift load wheel</th>
              <th>Colours</th>
              <th>Stock</th>
              <th aria-label="Add" />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const load = t.loadKg.forkliftLoad;
              const inStock = t.stock.black === "in_stock" || t.stock.grey === "in_stock";
              return (
                <tr key={t.id}>
                  <td className="col-size"><Link href={sizeHref(t)}>{t.size}</Link></td>
                  <td>{t.line}</td>
                  <td className="num">{t.rimSizeIn}</td>
                  <td>{t.pattern}</td>
                  <td className="num">{load ? `${fmt(load)} kg (${fmt(kgToLb(load))} lb)` : "Ask us"}</td>
                  <td>{t.colours.includes("Non-marking grey") ? "Black · Grey" : "Black"}</td>
                  <td><span className={"stock " + (inStock ? "in" : "mto")}><i /> {inStock ? "Compton" : "Made to order"}</span></td>
                  <td><button type="button" className="row-add" onClick={() => addRow(t)}>+ Add</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
