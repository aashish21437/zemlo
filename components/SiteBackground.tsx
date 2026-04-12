"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// Lazy-load both WebGL components — never SSR
const LightRays = dynamic(() => import('@/components/LightRays'), { ssr: false });
const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false });

export default function SiteBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Don't render anything until we know the real theme
  if (!mounted) return null;

  // ── DARK MODE: LightRays ──────────────────────────────────────
  if (resolvedTheme === 'dark') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          className="w-full h-full"
        />
      </div>
    );
  }

  // ── LIGHT MODE: LiquidEther ───────────────────────────────────
  if (resolvedTheme === 'light') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          className="w-full h-full"
        />
      </div>
    );
  }

  return null;
}
