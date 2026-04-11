"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SpaceBackground() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Create Parallax layers for depth
  // Stars move slower than the scroll, Planets move slightly faster
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const planetsY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-20 bg-[#020205] overflow-hidden pointer-events-none">
      
      {/* --- LAYER 1: Deep Space Ambient Glow --- */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-blue-900/10 blur-[150px]" />

      {/* --- LAYER 2: Tiny Distant Stars (Slowest Parallax) --- */}
      <motion.div style={{ y: layer1Y }} className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat" />
      </motion.div>

      {/* --- LAYER 3: Brighter Close Stars (Framer Motion) --- */}
      <motion.div style={{ y: layer2Y }} className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full shadow-lg"
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* --- LAYER 4: Planets (Fastest Parallax) --- */}
      <motion.div style={{ y: planetsY }} className="absolute inset-0 opacity-60">
        {/* Planet 1 (Top Left) */}
        <div className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#3b82f6_0%,_#1e3a8a_40%,_#020205_100%)] shadow-[-10px_-10px_20px_#1e3a8a/30]" />
        
        {/* Planet 2 (Center Right) */}
        <div className="absolute top-[50%] right-[15%] w-16 h-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#a16207_0%,_#713f12_40%,_#020205_100%)] shadow-[-10px_-10px_15px_#a16207/20]" />
        
        {/* Nebula Cloud (Bottom Left) */}
        <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px]" />
      </motion.div>

    </div>
  );
}