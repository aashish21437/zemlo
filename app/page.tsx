"use client";

import React from 'react';
import { Mail } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero"; // Import your new component
import SightseeingSection from "@/components/SightseeingSection";
import CRMSection from "@/components/CRMSection";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

      <main>
        {/* The clean, imported Hero component */}
        <Hero />

        <SightseeingSection />
        <CRMSection />

        {/* Contact Pill */}
        <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center px-4">
          <a
            href="mailto:aashish@zemlo.in"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950/95 dark:bg-zinc-50 backdrop-blur-sm shadow-2xl text-white dark:text-black text-sm font-bold hover:scale-105 transition-all"
          >
            <Mail size={16} />
            Reach out via email
          </a>
        </div>
      </main>
    </div>
  );
}