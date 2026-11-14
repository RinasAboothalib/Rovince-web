"use client";
import dynamic from "next/dynamic";

const Showcase = dynamic(() => import("@/components/showcase/Showcase"), {
  ssr: false,
});

export default function ShowcasePage() {
  return <Showcase />;
}
