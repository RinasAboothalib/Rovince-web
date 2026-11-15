"use client";
/* Premium static product display — the tire stays fixed and solid, with only
   subtle idle motion. Raycaster hover inspection: hovering a component
   smoothly zooms the camera into it, highlights it, and shows a label. */
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
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
type InspectionTarget = {
  part: PartKey;
  point: THREE.Vector3;
  pointer: [number, number];
};

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
  clearHovered,
}: {
  hovered: PartKey | null;
  setHovered: (target: InspectionTarget) => void;
  clearHovered: () => void;
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
    const tween = gsap.to(intro.current, { t: 1, duration: 0.9, ease: "power2.out" });
    return () => {
      tween.kill();
      sidewall.dispose();
    };
  }, [sidewall]);

  /* classify a local hit point into a component region (tire axis = Z) */
  const classify = (local: THREE.Vector3): PartKey | null => {
    const r = Math.hypot(local.x, local.y);
    const az = Math.abs(local.z);
    if (r < 0.74) return "rim";
    if (r < 1.16) return "sidewall";
    return az > 0.3 ? "shoulder" : "tread";
  };

  const inspect = (e: ThreeEvent<PointerEvent>, partOverride?: PartKey) => {
    e.stopPropagation();
    const local = group.current
      ? group.current.worldToLocal(e.point.clone())
      : e.point;
    const part =
      partOverride === "tread"
        ? Math.abs(local.z) > 0.32
          ? "shoulder"
          : "tread"
        : partOverride ??
          (Math.hypot(local.x, local.y) > 1.16 && Math.abs(local.z) > 0.32
            ? "shoulder"
            : classify(local));
    if (!part) return;
    setHovered({
      part,
      point: e.point.clone(),
      pointer: [e.pointer.x, e.pointer.y],
    });
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      const entrance = (1 - intro.current.t) * 0.018;
      group.current.rotation.y = intro.current.rot + entrance + Math.sin(t * 0.18) * 0.002;
      group.current.rotation.x = Math.sin(t * 0.12) * 0.002;
    }
  });

  const rubber = (
    <meshStandardMaterial color="#191919" roughness={0.88} metalness={0.08} />
  );

  return (
    <group ref={group} rotation={[0, 0.78, 0]}>
      {/* raycast catcher = the visible tire surfaces */}
      <mesh
        onPointerMove={(e) => inspect(e)}
        onPointerDown={(e) => inspect(e)}
      >
        <torusGeometry args={[1, 0.42, 64, 128]} />
        {rubber}
      </mesh>

      <instancedMesh
        ref={instRef}
        args={[tread.geo, undefined, 72]}
        onPointerMove={(e) => inspect(e, "tread")}
        onPointerDown={(e) => inspect(e, "tread")}
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
          onPointerMove={(e) => inspect(e, "sidewall")}
          onPointerDown={(e) => inspect(e, "sidewall")}
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
        onPointerMove={(e) => inspect(e, "rim")}
        onPointerDown={(e) => inspect(e, "rim")}
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
  hovered: RefObject<InspectionTarget | null>;
  setPanel: (p: PartKey | null) => void;
}) {
  const { camera } = useThree();
  const tween = useRef<gsap.core.Timeline | null>(null);
  const current = useRef<PartKey | null>(null);
  const focus = useRef(HOME_TARGET.clone());

  useFrame(() => {
    const target = hovered.current;
    const part = target?.part ?? null;
    if (part === current.current) return;
    current.current = part;
    setPanel(part);

    tween.current?.kill();
    if (part && target) {
      const anchor = target.point;
      const viewDirection = HOME_POS.clone().sub(anchor).normalize();
      const homeDistance = HOME_POS.distanceTo(anchor);
      const zoomDistance = Math.max(2.5, homeDistance / 1.35);
      const destination = anchor.clone().addScaledVector(viewDirection, zoomDistance);
      tween.current = gsap.timeline().to(camera.position, {
        x: destination.x,
        y: destination.y,
        z: destination.z,
        duration: 0.85,
        ease: "power3.inOut",
      }).to(focus.current, {
        x: anchor.x,
        y: anchor.y,
        z: anchor.z,
        duration: 0.85,
        ease: "power3.inOut",
      }, 0);
    } else {
      tween.current = gsap.timeline().to(camera.position, {
        x: HOME_POS.x,
        y: HOME_POS.y,
        z: HOME_POS.z,
        duration: 0.9,
        ease: "power3.inOut",
      }).to(focus.current, {
        x: HOME_TARGET.x,
        y: HOME_TARGET.y,
        z: HOME_TARGET.z,
        duration: 0.9,
        ease: "power3.inOut",
      }, 0);
    }
  });
  useFrame(() => camera.lookAt(focus.current));
  useEffect(() => () => {
    tween.current?.kill();
  }, []);
  return null;
}

function PointerLeaveRig({
  hovered,
  clearHovered,
}: {
  hovered: RefObject<InspectionTarget | null>;
  clearHovered: () => void;
}) {
  const { pointer } = useThree();
  useFrame(() => {
    const target = hovered.current;
    if (!target) return;
    if (Math.hypot(pointer.x - target.pointer[0], pointer.y - target.pointer[1]) > 0.06) {
      clearHovered();
    }
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Floating label near the selected area                               */
/* ------------------------------------------------------------------ */
function PartLabel({
  part,
  position,
  onLeave,
}: {
  part: PartKey | null;
  position: [number, number, number] | null;
  onLeave: () => void;
}) {
  if (!part || !position) return null;
  const info = PART_INFO[part];
  return (
    <Html position={position} center distanceFactor={7} zIndexRange={[20, 0]}>
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
  const hovered = useRef<InspectionTarget | null>(null);
  const [labelPart, setLabelPart] = useState<PartKey | null>(null);
  const [labelPosition, setLabelPosition] = useState<[number, number, number] | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setHovered = (target: InspectionTarget) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    hovered.current = target;
    if (labelPart !== target.part) {
      setLabelPart(target.part);
      setLabelPosition([target.point.x, target.point.y, target.point.z]);
    }
  };
  const clearHovered = () => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    hovered.current = null;
    clearTimer.current = setTimeout(() => {
      setLabelPart(null);
      setLabelPosition(null);
      clearTimer.current = null;
    }, 90);
  };

  useEffect(() => () => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 40, position: [HOME_POS.x, HOME_POS.y, HOME_POS.z] }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
      onPointerMissed={clearHovered}
      onPointerLeave={clearHovered}
    >
      {/* studio lighting */}
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 7, 6]} angle={0.5} penumbra={0.8} intensity={140} color="#ffffff" />
      <spotLight position={[-7, 3, -5]} angle={0.6} penumbra={1} intensity={90} color="#9fb6ff" />
      <pointLight position={[0, -3, 3]} intensity={22} color="#ff7a1a" />
      <spotLight position={[0, 4, 3]} angle={0.45} penumbra={0.9} intensity={110} color="#ffffff" />

      <TireModel hovered={labelPart} setHovered={setHovered} clearHovered={clearHovered} />

      <PartLabel
        part={labelPart}
        position={labelPosition}
        onLeave={clearHovered}
      />

      <ContactShadows position={[0, -1.85, 0]} opacity={0.75} scale={12} blur={2.6} far={4} />
      <PointerLeaveRig hovered={hovered} clearHovered={clearHovered} />
      <CameraRig hovered={hovered} setPanel={onHover} />
    </Canvas>
  );
}
