"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type QuoteLine = {
  key: string;
  size: string;
  line: string; // e.g. "Resilient solid · R1 Super Premium"
  colour: string;
  meta: string; // "2,340 kg load wheel · in stock, Compton"
  href?: string;
  photoName?: string; // SIZE FROM YOUR PHOTO line
  freeText?: boolean; // size we don't list yet
  qty: number;
};

type Ctx = {
  lines: QuoteLine[];
  count: number; // total tires
  add: (line: Omit<QuoteLine, "qty">, qty?: number) => void;
  setQty: (key: string, delta: number) => void;
  setQtyExact: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  ready: boolean;
};

const KEY = "rovince-quote-v1";
const QuoteContext = createContext<Ctx | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [ready, setReady] = useState(false);

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // persist + sync across tabs
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          setLines(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add: Ctx["add"] = (line, qty = 1) =>
    setLines((prev) => {
      const i = prev.findIndex((l) => l.key === line.key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...line, qty }];
    });

  const setQty: Ctx["setQty"] = (key, delta) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, l.qty + delta) } : l)));
  const setQtyExact: Ctx["setQtyExact"] = (key, qty) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, qty) } : l)));
  const remove: Ctx["remove"] = (key) => setLines((prev) => prev.filter((l) => l.key !== key));
  const clear = () => setLines([]);

  const count = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <QuoteContext.Provider value={{ lines, count, add, setQty, setQtyExact, remove, clear, ready }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
