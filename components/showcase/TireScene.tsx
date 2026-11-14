"use client";
/* Procedural 3D tire — built from real geometry (torus body, instanced tread
   blocks, canvas-textured sidewall lettering, metallic rim assembly).
   Drag = 360° orbit, wheel/pinch = zoom, idle = auto-rotate, plus hotspots. */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, Html, OrbitControls } from "@react-three/drei";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import * as THREE from "three";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/* Sidewall lettering texture — drawn on a canvas ring, fully offline   */
/* ------------------------------------------------------------------ */
function makeSidewallTexture() {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "#cfcfcf";
  ctx.font = "700 64px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  const drawArc = (text: string, radius: number, centerAngle: number) => {
    const step = 0.115;
    const start = centerAngle - ((text.length - 1) * step) / 2;
    [...text].forEach((ch, i) => {
      const a = start + i * step;
      ctx.save();
      ctx.translate(S / 2, S / 2);
      ctx.rotate(a);
      ctx.translate(0, -radius);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  };

  drawArc("ROVINCE", 340, -Math.PI / 2);
  drawArc("ZERO DOWNTIME", 340, Math.PI / 2);
  drawArc("RS-500", 250, -Math.PI / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ */
/* The tire model                                                      */
/* ------------------------------------------------------------------ */
function TireModel({ scrollRef }: { scrollRef: RefObject<{ v: number }> }) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef({ t: 0, rot: 0 });
  const sidewall = useMemo(() => makeSidewallTexture(), []);

  /* instanced tread blocks around the circumference */
  const tread = useMemo(() => {
    const COUNT = 72;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const list: { m: THREE.Matrix4; w: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      const w = i % 4 === 0 ? 0.2 : 0.26; // varied block widths → pattern
      const m = new THREE.Matrix4();
      m.compose(
        new THREE.Vector3(Math.cos(a) * 1.31, Math.sin(a) * 1.31, 0),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, a)),
        new THREE.Vector3(w, 0.2, 0.8),
      );
      list.push({ m, w });
    }
    return { geo, list };
  }, []);
  const instRef = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    tread.list.forEach((b, i) => instRef.current?.setMatrixAt(i, b.m));
    if (instRef.current) instRef.current.instanceMatrix.needsUpdate = true;
  }, [tread]);

  useEffect(() => {
    /* cinematic entrance */
    gsap.to(intro.current, { t: 1, duration: 2.4, ease: "power3.out" });
    return () => sidewall.dispose();
  }, [sidewall]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    /* scroll-driven slow yaw */
    if (group.current) {
      const i = intro.current.t;
      group.current.rotation.y = -2.4 * (1 - i) + (scrollRef.current?.v ?? 0) * Math.PI * 0.6;
      group.current.rotation.x = Math.sin(t * 0.4) * 0.02 - 0.04 * (1 - i);
    }
  });

  const rubber = (
    <meshStandardMaterial color="#191919" roughness={0.88} metalness={0.08} />
  );

  return (
    <group ref={group} rotation={[0, -2.4, 0]}>
      {/* carcass */}
      <mesh>
        <torusGeometry args={[1, 0.42, 64, 128]} />
        {rubber}
      </mesh>

      {/* instanced tread blocks */}
      <instancedMesh ref={instRef} args={[tread.geo, undefined, 72]}>
        <meshStandardMaterial color="#232323" roughness={0.95} metalness={0.04} />
      </instancedMesh>

      {/* circumferential grooves */}
      {[0.42, -0.42].map((z) => (
        <mesh key={z} position={[0, 0, z * 0.9]}>
          <torusGeometry args={[1.31, 0.035, 8, 96]} />
          <meshStandardMaterial color="#0b0b0b" roughness={1} />
        </mesh>
      ))}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.34, 0.03, 8, 96]} />
        <meshStandardMaterial color="#0b0b0b" roughness={1} />
      </mesh>

      {/* sidewall lettering rings (front & back) */}
      {[0.435, -0.435].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, z < 0 ? Math.PI : 0, 0]}>
          <ringGeometry args={[0.74, 1.18, 96]} />
          <meshStandardMaterial
            map={sidewall}
            transparent
            roughness={0.55}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      ))}

      {/* rim assembly */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.32, 48]} />
          <meshStandardMaterial color="#5c5f63" metalness={0.92} roughness={0.28} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.4, 32]} />
          <meshStandardMaterial color="#3a3d41" metalness={0.9} roughness={0.35} />
        </mesh>
        {[...Array(6)].map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.045, 0.045, 0.36, 12]} />
              <meshStandardMaterial color="#232527" metalness={0.85} roughness={0.4} />
            </mesh>
          );
        })}
        {[0.17, -0.17].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <torusGeometry args={[0.62, 0.035, 12, 64]} />
            <meshStandardMaterial color="#8a8d92" metalness={0.95} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Sweeping studio light + camera intro                                */
/* ------------------------------------------------------------------ */
function Rig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.7, 10);
    gsap.to(camera.position, { z: 5.4, duration: 2.2, ease: "power3.inOut" });
  }, [camera]);
  return null;
}

/* ------------------------------------------------------------------ */
/* Scene wrapper — lights, controls, hotspots                          */
/* ------------------------------------------------------------------ */
export type Hotspot = {
  id: string;
  pos: [number, number, number];
  title: string;
  lines: string[];
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "tread",
    pos: [1.38, 0.15, 0.2],
    title: "Tread Pattern",
    lines: [
      "Deep, self-aligning tread blocks for even wear across the full contact patch.",
      "72-block layout tuned for forklift & port duty cycles.",
    ],
  },
  {
    id: "compound",
    pos: [0.2, 1.42, 0.15],
    title: "Rubber Compound",
    lines: [
      "Cut- and chunk-resistant resilient rubber blend.",
      "Engineered for 4,000+ working hours without downtime.",
    ],
  },
  {
    id: "sidewall",
    pos: [-0.9, 1.0, 0.32],
    title: "Sidewall Construction",
    lines: [
      "Three-stage solid construction — no air, no punctures.",
      "Reinforced carcass absorbs impact on dock and yard surfaces.",
    ],
  },
  {
    id: "grip",
    pos: [0.85, -1.12, 0.2],
    title: "Grip & Traction",
    lines: [
      "High-traction siping maintains bite on wet and oily concrete.",
      "Stable cornering under full container loads.",
    ],
  },
  {
    id: "grooves",
    pos: [-0.75, -1.18, 0.25],
    title: "Water Drainage Grooves",
    lines: [
      "Wide circumferential channels evacuate water fast.",
      "Reduced hydroplaning risk in outdoor yards.",
    ],
  },
  {
    id: "rim",
    pos: [0, 0.55, 0.45],
    title: "Size & Specifications",
    lines: [
      "Size 6.50-10 · Load index 168 · Speed rating A8.",
      "Press-on and standard fitments available.",
    ],
  },
];

function HotspotDot({
  h,
  onPick,
}: {
  h: Hotspot;
  onPick: (h: Hotspot) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Html position={h.pos} center distanceFactor={7} zIndexRange={[20, 0]}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => onPick(h)}
        className="hs-wrap"
      >
        <button className="hs-dot" aria-label={h.title} />
        <span className={`hs-label${hover ? " on" : ""}`}>{h.title}</span>
      </div>
      <style jsx global>{`
        .hs-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          pointer-events: auto;
        }
        .hs-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent, #ff7a1a);
          border: 2px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 14px rgba(255, 122, 26, 0.8);
          animation: hs-pulse 2s infinite;
        }
        @keyframes hs-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 122, 26, 0.6);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(255, 122, 26, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 122, 26, 0);
          }
        }
        .hs-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(12, 12, 14, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(8px);
          padding: 5px 10px;
          border-radius: 999px;
          white-space: nowrap;
          opacity: 0;
          transform: translateX(-4px);
          transition: 0.25s ease;
        }
        .hs-label.on {
          opacity: 1;
          transform: none;
        }
      `}</style>
    </Html>
  );
}

export default function TireScene({
  onPick,
  scrollRef,
}: {
  onPick: (h: Hotspot) => void;
  scrollRef: RefObject<{ v: number }>;
}) {
  const [idle, setIdle] = useState(true);
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 40, position: [0, 0.7, 10] }}
      gl={{ antialias: true, alpha: true }}
    >
      <Rig />

      {/* studio lighting */}
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 7, 6]} angle={0.5} penumbra={0.8} intensity={140} color="#ffffff" />
      <spotLight position={[-7, 3, -5]} angle={0.6} penumbra={1} intensity={90} color="#9fb6ff" />
      <pointLight position={[0, -3, 3]} intensity={22} color="#ff7a1a" />
      {/* dramatic sweep that glides across the rubber */}
      <SweepLight />

      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.55}>
        <TireModel scrollRef={scrollRef} />
      </Float>

      {HOTSPOTS.map((h) => (
        <HotspotDot key={h.id} h={h} onPick={onPick} />
      ))}

      <ContactShadows position={[0, -1.85, 0]} opacity={0.75} scale={12} blur={2.6} far={4} />

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.85}
        minDistance={3.2}
        maxDistance={8}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={idle}
        autoRotateSpeed={0.9}
        onStart={() => {
          setIdle(false);
          if (resume.current) clearTimeout(resume.current);
        }}
        onEnd={() => {
          resume.current = setTimeout(() => setIdle(true), 2600);
        }}
      />
    </Canvas>
  );
}

function SweepLight() {
  const ref = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.sin(t * 0.5) * 5;
      ref.current.position.z = 3 + Math.cos(t * 0.5) * 2.5;
    }
  });
  return (
    <spotLight
      ref={ref}
      position={[0, 4, 3]}
      angle={0.4}
      penumbra={0.9}
      intensity={110}
      color="#ffffff"
    />
  );
}
