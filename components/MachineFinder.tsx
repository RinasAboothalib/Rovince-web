"use client";
import { useState } from "react";
import Link from "next/link";
import { SIZES, sizeHref, fmt, type TireSize } from "@/data/sizes";
import { useQuote } from "@/lib/quote";
import { MACHINE_PHOTO } from "@/lib/media";
import ImageCarousel from "@/components/ImageCarousel";

const MACHINES = [
  { id: "forklift", label: "Forklift" },
  { id: "skid-steer", label: "Skid steer" },
  { id: "port", label: "Port / container handler" },
  { id: "baggage", label: "Airport baggage tractor" },
  { id: "reach-truck", label: "Reach truck / order picker" },
  { id: "other", label: "Other" },
];

// curated candidate size ids by machine + wheel position
const PICKS: Record<string, { front: string[]; rear: string[] }> = {
  forklift: {
    front: ["r1-super-premium-6-50-10", "r1-super-premium-7-00-12", "r1-super-premium-28x9-15", "r1-super-premium-21x8x9"],
    rear: ["r1-super-premium-18x7-8", "r1-super-premium-16x6-8"],
  },
  "reach-truck": { front: ["press-on-band-21x7x15", "press-on-band-18x7-8"], rear: ["press-on-band-18x7-8"] },
  "skid-steer": { front: ["skid-steer-10-16-5", "skid-steer-12-16-5"], rear: ["skid-steer-10-16-5", "skid-steer-12-16-5"] },
  port: { front: ["port-18-00-25"], rear: ["port-18-00-25"] },
  baggage: { front: ["r1-super-premium-6-50-10", "r1-super-premium-5-00-8"], rear: ["r1-super-premium-5-00-8"] },
  other: { front: ["r1-super-premium-6-50-10", "r1-super-premium-7-00-12"], rear: ["r1-super-premium-18x7-8"] },
};

const get = (id: string) => SIZES.find((s) => s.id === id);

export default function MachineFinder() {
  const { add } = useQuote();
  const [machine, setMachine] = useState<string | null>(null);
  const [wheel, setWheel] = useState<"front" | "rear">("front");
  const [tread, setTread] = useState<"glide" | "grip" | null>(null);
  const [marking, setMarking] = useState<"black" | "grey">("black");

  const pick = machine ? PICKS[machine] ?? PICKS.other : null;
  const sizes = (pick ? pick[wheel] : []).map(get).filter(Boolean) as TireSize[];
  const showResult = machine && tread;

  const addRow = (t: TireSize) => {
    const load = wheel === "front" ? t.loadKg.forkliftLoad : t.loadKg.forkliftSteer;
    const colour = marking === "grey" ? "Non-marking grey" : "Black";
    add({
      key: `${t.id}-${colour}`,
      size: t.size,
      line: `${t.family} · ${t.line} · ${t.pattern.toLowerCase()}`,
      colour,
      meta: `${load ? `${fmt(load)} kg ${wheel === "front" ? "load" : "steering"} wheel · ` : ""}made to order`,
      href: sizeHref(t),
    });
  };

  return (
    <div className="machine-finder">
      {/* Step 1 */}
      <div className="mf-step">
        <div className="mf-step-h"><span className="mf-stepno">Step 1 of 3</span> What machine?</div>
        <ImageCarousel
          cards={MACHINES.map((item) => ({
            id: item.id,
            label: item.label,
            image: MACHINE_PHOTO[item.id],
          }))}
          className="mf-machines"
          initialIndex={machine ? MACHINES.findIndex((item) => item.id === machine) : 0}
          onCardChange={(index) => setMachine(MACHINES[index]?.id ?? null)}
          maxRotationDegrees={28}
          maxDepthPx={140}
          minScale={0.92}
          cardGap={28}
          frictionFactor={0.9}
          wheelSensitivity={0.6}
          dragSensitivity={1}
          backgroundBlur={24}
          gradientSize={0.65}
          gradientIntensity={0.7}
          enableKeyboard
          cardAspectRatio={0.8}
        />
      </div>

      {machine && (
        <div className="mf-step">
          <div className="mf-step-h"><span className="mf-stepno">Step 2 of 3</span> Which wheel?</div>
          <div className="mf-machine-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MACHINE_PHOTO[machine]} alt={MACHINES.find((m) => m.id === machine)?.label ?? ""} />
            <span className={"mf-wheel-dot " + wheel}>Tap · {wheel === "front" ? "front load wheel" : "rear steering wheel"}</span>
          </div>
          <div className="pills">
            <button className={wheel === "front" ? "on" : ""} onClick={() => setWheel("front")}>Front (load)</button>
            <button className={wheel === "rear" ? "on" : ""} onClick={() => setWheel("rear")}>Rear (steering)</button>
          </div>
          <p className="mf-hint">
            {wheel === "front"
              ? "Front wheels carry the load. They take the weight of the forks, so they're rated by load — usually the larger size."
              : "Rear wheels steer. They're smaller and rated for steering duty."}
          </p>
        </div>
      )}

      {machine && (
        <div className="mf-step">
          <div className="mf-step-h"><span className="mf-stepno">Step 3 of 3</span> Glide or grip?</div>
          <div className="pills">
            <button className={tread === "glide" ? "on" : ""} onClick={() => setTread("glide")}>Glide (smooth / indoor)</button>
            <button className={tread === "grip" ? "on" : ""} onClick={() => setTread("grip")}>Grip (traction / outdoor)</button>
          </div>
          <div className="pills" style={{ marginTop: 10 }}>
            <button className={marking === "black" ? "on" : ""} onClick={() => setMarking("black")}>Black</button>
            <button className={marking === "grey" ? "on" : ""} onClick={() => setMarking("grey")}>Non-marking (indoor clean floors)</button>
          </div>
        </div>
      )}

      {showResult && (
        <div className="mf-result">
          <div className="mf-result-h">
            Your match: <strong>{(sizes[0]?.line ?? "Resilient Solid R1").toUpperCase()}, {tread === "grip" ? "TRACTION" : "SMOOTH"}, {marking === "grey" ? "NON-MARKING" : "BLACK"}</strong>
          </div>
          <p className="mf-hint">Common {wheel} sizes on this kind of machine. Check the number on your tire.</p>
          <div className="mf-sizes">
            {sizes.map((t) => {
              const load = wheel === "front" ? t.loadKg.forkliftLoad : t.loadKg.forkliftSteer;
              return (
                <div className="mf-row" key={t.id}>
                  <Link href={sizeHref(t)} className="mf-size">{t.size}</Link>
                  <span className="mf-load">{load ? `${fmt(load)} kg ${wheel === "front" ? "load" : "steering"} wheel` : "Ask us for the load"}</span>
                  <button className="row-add" onClick={() => addRow(t)}>+ Add</button>
                </div>
              );
            })}
            {sizes.length === 0 && <p className="mf-hint">Sizes for this machine are coming — <Link href="/quote">send us a photo</Link> and we&apos;ll confirm.</p>}
          </div>
          <p className="mf-hint">Not sure? <Link href="/quote">Send us a photo of the tire.</Link></p>
        </div>
      )}
    </div>
  );
}
