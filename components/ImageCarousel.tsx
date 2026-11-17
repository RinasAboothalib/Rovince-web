"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

export type CarouselCard = {
  image: string;
  label: string;
  id: string;
};

type ImageCarouselProps = {
  cards: CarouselCard[];
  className?: string;
  maxRotationDegrees?: number;
  maxDepthPx?: number;
  minScale?: number;
  cardGap?: number;
  frictionFactor?: number;
  wheelSensitivity?: number;
  dragSensitivity?: number;
  backgroundBlur?: number;
  gradientSize?: number;
  gradientIntensity?: number;
  enableKeyboard?: boolean;
  onCardChange?: (index: number) => void;
  cardAspectRatio?: number;
  initialIndex?: number;
};

const FALLBACK_COLORS = [
  ["#5e7c91", "#1a2a38"],
  ["#617b91", "#252d33"],
  ["#7997a4", "#26343b"],
  ["#71859a", "#2a3542"],
  ["#86a4af", "#27373d"],
  ["#6d7f8b", "#242e35"],
];

const wrapIndex = (index: number, length: number) =>
  ((Math.round(index) % length) + length) % length;

export default function ImageCarousel({
  cards,
  className = "",
  maxRotationDegrees = 28,
  maxDepthPx = 140,
  minScale = 0.92,
  cardGap = 28,
  frictionFactor = 0.9,
  wheelSensitivity = 0.6,
  dragSensitivity = 1,
  backgroundBlur = 24,
  gradientSize = 0.65,
  gradientIntensity = 0.7,
  enableKeyboard = true,
  onCardChange,
  cardAspectRatio = 0.8,
  initialIndex = 0,
}: ImageCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragPosition = useRef(initialIndex);
  const velocity = useRef(0);
  const frame = useRef<number | null>(null);
  const [position, setPosition] = useState(initialIndex);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [colors, setColors] = useState<Record<number, [string, string]>>({});

  const activeCard = useMemo(
    () => wrapIndex(activeIndex, cards.length),
    [activeIndex, cards.length],
  );

  useEffect(() => {
    let cancelled = false;

    cards.forEach((card, index) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        if (cancelled) return;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 20;
          canvas.height = 20;
          const context = canvas.getContext("2d", { willReadFrequently: true });
          if (!context) return;
          context.drawImage(image, 0, 0, 20, 20);
          const pixels = context.getImageData(0, 0, 20, 20).data;
          let red = 0;
          let green = 0;
          let blue = 0;
          let count = 0;

          for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 160) continue;
            red += pixels[i];
            green += pixels[i + 1];
            blue += pixels[i + 2];
            count++;
          }

          if (count > 0) {
            const toHex = (value: number) => Math.round(value / count).toString(16).padStart(2, "0");
            const average = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
            setColors((current) => ({
              ...current,
              [index]: [average, FALLBACK_COLORS[index % FALLBACK_COLORS.length][1]],
            }));
          }
        } catch {
          // Cross-origin canvas access can be blocked; fallback gradients are used.
        }
      };
      image.src = card.image;
    });

    return () => {
      cancelled = true;
    };
  }, [cards]);

  const settle = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);

    const animate = () => {
      setPosition((current) => {
        const nearest = Math.round(current);
        const next = nearest === current ? current : current + (nearest - current) * (1 - frictionFactor);
        velocity.current = next - current;

        if (Math.abs(nearest - next) < 0.002) {
          const finalIndex = wrapIndex(nearest, cards.length);
          setActiveIndex((old) => {
            if (old !== finalIndex) onCardChange?.(finalIndex);
            return finalIndex;
          });
          return nearest;
        }
        frame.current = requestAnimationFrame(animate);
        return next;
      });
    };

    frame.current = requestAnimationFrame(animate);
  }, [cards.length, frictionFactor, onCardChange]);

  const moveTo = useCallback((index: number) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    setPosition(index);
    const nextIndex = wrapIndex(index, cards.length);
    setActiveIndex((old) => {
      if (old !== nextIndex) onCardChange?.(nextIndex);
      return nextIndex;
    });
  }, [cards.length, onCardChange]);

  useEffect(() => {
    if (!enableKeyboard) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") moveTo(activeCard - 1);
      if (event.key === "ArrowRight") moveTo(activeCard + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeCard, enableKeyboard, moveTo]);

  useEffect(() => {
    setPosition(initialIndex);
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY + event.deltaX;
    setPosition((current) => current + delta * 0.002 * wheelSensitivity);
    velocity.current = delta * 0.002 * wheelSensitivity;
    if (frame.current) cancelAnimationFrame(frame.current);
    window.clearTimeout((viewportRef.current as unknown as { settleTimer?: number })?.settleTimer);
    const timer = window.setTimeout(settle, 120);
    (viewportRef.current as unknown as { settleTimer?: number }).settleTimer = timer;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    dragStart.current = event.clientX;
    dragPosition.current = position;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const viewportWidth = viewportRef.current?.clientWidth ?? 900;
    const cardWidth = Math.min(300, viewportWidth * 0.46);
    const step = cardWidth + cardGap;
    const next = dragPosition.current - ((event.clientX - dragStart.current) / step) * dragSensitivity;
    setPosition(next);
  };

  const handlePointerUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    settle();
  };

  const gradient = colors[activeCard] ?? FALLBACK_COLORS[activeCard % FALLBACK_COLORS.length];
  const [primary, secondary] = gradient;
  const size = `${gradientSize * 100}%`;

  return (
    <div
      className={`image-carousel ${className}`}
      style={{
        "--carousel-blur": `${backgroundBlur}px`,
        "--carousel-gradient-size": size,
        "--carousel-primary": primary,
        "--carousel-secondary": secondary,
        "--carousel-intensity": gradientIntensity,
        "--carousel-gap": `${cardGap}px`,
      } as React.CSSProperties}
      ref={viewportRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Machine choices"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="image-carousel-gradient" aria-hidden />
      <div className="image-carousel-track">
        {cards.map((card, index) => {
          let delta = index - position;
          if (Math.abs(delta) > cards.length / 2) {
            delta += delta > 0 ? -cards.length : cards.length;
          }
          const distance = Math.abs(delta);
          const depth = Math.min(distance * maxDepthPx, maxDepthPx);
          const scale = Math.max(minScale, 1 - distance * (1 - minScale));
          const rotation = Math.max(-maxRotationDegrees, Math.min(maxRotationDegrees, -delta * maxRotationDegrees));
          const cardWidth = 300;
          const x = delta * (cardWidth + cardGap);
          const zIndex = 100 - Math.round(distance * 10);
          const isActive = wrapIndex(index, cards.length) === activeCard;

          return (
            <button
              type="button"
              key={card.id}
              className={`image-carousel-card${isActive ? " active" : ""}`}
              style={{
                "--card-x": `${x}px`,
                "--card-depth": `-${depth}px`,
                "--card-scale": scale,
                "--card-rotation": `${rotation}deg`,
                "--card-aspect": cardAspectRatio,
                zIndex,
              } as React.CSSProperties}
              onClick={() => moveTo(index)}
              aria-label={card.label}
              aria-current={isActive ? "true" : undefined}
            >
              <span className="image-carousel-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt="" draggable={false} />
              </span>
              <span className="image-carousel-label">{card.label}</span>
            </button>
          );
        })}
      </div>
      <div className="image-carousel-dots" aria-label="Carousel navigation">
        {cards.map((card, index) => (
          <button
            type="button"
            key={`dot-${card.id}`}
            className={index === activeCard ? "active" : ""}
            onClick={() => moveTo(index)}
            aria-label={`Show ${card.label}`}
          />
        ))}
      </div>
    </div>
  );
}
