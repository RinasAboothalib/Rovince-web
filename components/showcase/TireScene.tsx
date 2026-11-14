"use client";
/* Premium static product display — the tire stays fixed and solid, with only
   subtle idle motion. Raycaster hover inspection: hovering a component
   smoothly zooms the camera into it, highlights it, and shows a label. */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
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
/* Part definitions                                                    */
/* ------------------------------------------------------------------ */
export type PartKey = "tread" | "sidewall" | "rim" | "shoulder";

export const PART_INFO: Record<
  PartKey,
  { label: string; title: string; lines: string[]; anchor: [number, number, number] }
> = {
  tread: {
    label: "Advanced Tread Design",
    title: "Advanced Tread Design",
    lines: [
      "Deep, self-aligning tread blocks for even wear across the full contact patch.",
      "72-block layout tuned for forklift & port duty cycles.",
    ],
    anchor: [1.42, 0.12, 0],
  },
  sidewall: {
    label: "Reinforced Sidewall",
    title: "Reinforced Sidewall",
    lines: [
      "Embossed brand markings — ROVINCE · ZERO DOWNTIME · RS-500.",
      "Three-stage solid construction, no air and no punctures.",
    ],
    anchor: [-1.02, 0.78, 0.4],
  },
  rim: {
    label: "Heavy-Duty Construction",
    title: "Heavy-Duty Construction",
    lines: [
      "Steel rim assembly rated for the full 5,000 kg load index.",
      "Six-bolt press-on fitment for industrial handling equipment.",
    ],
    anchor: [0, 0.55, 0.35],
  },
  shoulder: {
    label: "Enhanced Grip",
    title: "Enhanced Grip",
    lines: [
      "Reinforced shoulder blocks resist chunking under cornering loads.",
      "Stable traction on wet and oily yard surfaces.",
    ],
    anchor: [1.02, 1.02, 0.32],
  },
};

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
/* The tire model — fixed, solid display position                      */
/* ------------------------------------------------------------------ */
const HOME_POS = new THREE.Vector3(0, 0.55, 5.4);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

function TireModel({
  hovered,
  setHovered,
}: {
  hovered: PartKey | null;
  setHovered: (p: PartKey | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef({ t: 0, rot: 0.35 });
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
    gsap.to(intro.current, { t: 1, duration: 2.4, ease: "power3.out" });
    return () => sidewall.dispose();
  }, [sidewall]);

  /* classify a local hit point into a component region (tire axis = Z) */
  const classify = (local: THREE.Vector3): PartKey | null => {
    const r = Math.hypot(local.x, local.y);
    const az = Math.abs(local.z);
    if (r < 0.74) return "rim";
    if (r < 1.16) return "sidewall";
    return az > 0.3 ? "shoulder" : "tread";
  };

  const onMove = (e: any) => {
    e.stopPropagation();
    const local = group.current
      ? group.current.worldToLocal(e.point.clone())
      : e.point;
    const part = classify(local);
    setHovered(part);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      /* entrance settles into a fixed pose, then only ±1° breathing */
      const i = intro.current.t;
      group.current.rotation.y = 0.35 * (1 - i) + Math.sin(t * 0.22) * 0.02;
      group.current.rotation.x = Math.sin(t * 0.15) * 0.008;
      group.current.position.y = Math.sin(t * 0.5) * 0.02; // extremely subtle
    }
  });

  const rubber = (
    <meshStandardMaterial color="#191919" roughness={0.88} metalness={0.08} />
  );

  return (
    <group ref={group} rotation={[0, 0.35, 0]}>
      {/* raycast catcher = the visible tire surfaces */}
      <mesh onPointerMove={onMove} onPointerOut={() => setHovered(null)}>
        <torusGeometry args={[1, 0.42, 64, 128]} />
        {rubber}
      </mesh>

      <instancedMesh
        ref={instRef}
        args={[tread.geo, undefined, 72]}
        onPointerMove={onMove}
        onPointerOut={() => setHovered(null)}
      >
        <meshStandardMaterial
          color="#232323"
          roughness={0.95}
          metalness={0.04}
          emissive="#ff7a1a"
          emissiveIntensity={hovered === "tread" ? 0.12 : 0}
        />
      </instancedMesh>

      {/* circumferential grooves */}
      {[0.42, -0.42].map((z) => (
        <mesh key={z} position={[0, 0, z * 0.9]}>
          <torusGeometry args={[1.31, 0.035, 8, 96]} />
          <meshStandardMaterial color="#0b0b0b" roughness={1} />
        </mesh>
      ))}
      <mesh>
        <torusGeometry args={[1.34, 0.03, 8, 96]} />
        <meshStandardMaterial color="#0b0b0b" roughness={1} />
      </mesh>

      {/* sidewall lettering rings (front & back) */}
      {[0.435, -0.435].map((z) => (
        <mesh
          key={z}
          position={[0, 0, z]}
          rotation={[0, z < 0 ? Math.PI : 0, 0]}
          onPointerMove={onMove}
          onPointerOut={() => setHovered(null)}
        >
          <ringGeometry args={[0.74, 1.18, 96]} />
          <meshStandardMaterial
            map={sidewall}
            transparent
            roughness={0.55}
            metalness={0.05}
            emissive="#ff7a1a"
            emissiveIntensity={hovered === "sidewall" ? 0.1 : 0}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      ))}

      {/* rim assembly */}
      <group
        onPointerMove={onMove}
        onPointerOut={() => setHovered(null)}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.32, 48]} />
          <meshStandardMaterial
            color="#5c5f63"
            metalness={0.92}
            roughness={0.28}
            emissive="#ff7a1a"
            emissiveIntensity={hovered === "rim" ? 0.08 : 0}
          />
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

      {/* ---- soft orange highlight overlays (opacity animated) ---- */}
      <HighlightTorus r={1.36} tube={0.09} on={hovered === "tread"} />
      {[0.34, -0.34].map((z) => (
        <HighlightTorus key={z} r={1.2} tube={0.11} z={z} on={hovered === "shoulder"} />
      ))}
      {[0.45, -0.45].map((z) => (
        <mesh
          key={z}
          position={[0, 0, z]}
          rotation={[0, z < 0 ? Math.PI : 0, 0]}
        >
          <ringGeometry args={[0.75, 1.17, 96]} />
          <GlowMat on={hovered === "sidewall"} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.63, 0.63, 0.34, 48, 1, true]} />
        <GlowMat on={hovered === "rim"} />
      </mesh>
    </group>
  );
}

function GlowMat({ on }: { on: boolean }) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      const target = on ? 0.22 : 0;
      ref.current.opacity += (target - ref.current.opacity) * Math.min(1, dt * 7);
    }
  });
  return (
    <meshBasicMaterial
      ref={ref}
      color="#ff7a1a"
      transparent
      opacity={0}
      blending={THREE.AdditiveBlending}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );
}

function HighlightTorus({
  r,
  tube,
  z = 0,
  on,
}: {
  r: number;
  tube: number;
  z?: number;
  on: boolean;
}) {
  return (
    <mesh position={[0, 0, z]}>
      <torusGeometry args={[r, tube, 8, 96]} />
      <GlowMat on={on} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig — GSAP zoom into the hovered component, restore on leave  */
/* ------------------------------------------------------------------ */
function CameraRig({
  hovered,
  setPanel,
}: {
  hovered: RefObject<PartKey | null>;
  setPanel: (p: PartKey | null) => void;
}) {
  const { camera, controls } = useThree() as any;
  const tween = useRef<gsap.core.Timeline | null>(null);
  const current = useRef<PartKey | null>(null);

  useFrame(() => {
    const part = hovered.current;
    if (part === current.current) return;
    current.current = part;
    setPanel(part);

    tween.current?.kill();
    const cam = camera as THREE.PerspectiveCamera;
    if (part) {
      /* zoom toward the component anchor — ~1.35x closer */
      const anchor = new THREE.Vector3(...PART_INFO[part].anchor);
      const dir = anchor.clone().normalize();
      const dest = dir.multiplyScalar(2.35).add(new THREE.Vector3(0, 0.35, 0.6));
      tween.current = gsap.timeline().to(cam.position, {
        x: dest.x,
        y: dest.y,
        z: dest.z,
        duration: 1.1,
        ease: "power3.inOut",
      });
      if (controls) {
        tween.current
          .to(controls.target, {
            x: anchor.x * 0.4,
            y: anchor.y * 0.4,
            z: anchor.z * 0.4,
            duration: 1.1,
            ease: "power3.inOut",
          }, 0);
      }
    } else {
      tween.current = gsap.timeline().to(cam.position, {
        x: HOME_POS.x,
        y: HOME_POS.y,
        z: HOME_POS.z,
        duration: 1.2,
        ease: "power3.inOut",
      });
      if (controls) {
        tween.current.to(controls.target, {
          x: 0, y: 0, z: 0,
          duration: 1.2,
          ease: "power3.inOut",
        }, 0);
      }
    }
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Studio sweep light — soft changes across the rubber surface          */
/* ------------------------------------------------------------------ */
function SweepLight() {
  const ref = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.sin(t * 0.25) * 4;
      ref.current.position.z = 3.5 + Math.cos(t * 0.25) * 2;
    }
  });
  return (
    <spotLight
      ref={ref}
      position={[0, 4, 3]}
      angle={0.45}
      penumbra={0.9}
      intensity={110}
      color="#ffffff"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Floating label near the selected area                               */
/* ------------------------------------------------------------------ */
function PartLabel({
  part,
  onLeave,
}: {
  part: PartKey | null;
  onLeave: () => void;
}) {
  if (!part) return null;
  const info = PART_INFO[part];
  return (
    <Html position={info.anchor} center distanceFactor={7} zIndexRange={[20, 0]}>
      <div
        className="part-label"
        onMouseLeave={onLeave}
        style={{ pointerEvents: "none" }}
      >
        {info.label}
      </div>
      <style jsx global>{`
        .part-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(12, 12, 14, 0.72);
          border: 1px solid rgba(255, 122, 26, 0.45);
          box-shadow: 0 0 18px rgba(255, 122, 26, 0.25);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 999px;
          white-space: nowrap;
          animation: label-in 0.4s ease;
        }
        @keyframes label-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </Html>
  );
}

/* ------------------------------------------------------------------ */
/* Scene wrapper                                                       */
/* ------------------------------------------------------------------ */
export default function TireScene({
  onHover,
}: {
  onHover: (p: PartKey | null) => void;
}) {
  const hovered = useRef<PartKey | null>(null);
  const [labelPart, setLabelPart] = useState<PartKey | null>(null);

  const setHovered = (p: PartKey | null) => {
    hovered.current = p;
    setLabelPart(p);
  };

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 40, position: [0, 0.55, 10] }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* cinematic entrance: slow dolly into the display position */}
      <EntranceRig />

      {/* studio lighting */}
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 7, 6]} angle={0.5} penumbra={0.8} intensity={140} color="#ffffff" />
      <spotLight position={[-7, 3, -5]} angle={0.6} penumbra={1} intensity={90} color="#9fb6ff" />
      <pointLight position={[0, -3, 3]} intensity={22} color="#ff7a1a" />
      <SweepLight />

      <TireModel hovered={labelPart} setHovered={setHovered} />

      <PartLabel part={labelPart} onLeave={() => setHovered(null)} />

      <ContactShadows position={[0, -1.85, 0]} opacity={0.75} scale={12} blur={2.6} far={4} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.5}
        minDistance={2.4}
        maxDistance={8}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 0, 0]}
      />

      <CameraRig hovered={hovered} setPanel={onHover} />
    </Canvas>
  );
}

function EntranceRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.55, 10);
    gsap.to(camera.position, {
      x: HOME_POS.x,
      y: HOME_POS.y,
      z: HOME_POS.z,
      duration: 2.2,
      ease: "power3.inOut",
    });
  }, [camera]);
  return null;
}
