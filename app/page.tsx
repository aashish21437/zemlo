"use client"

import React from 'react';
import { Globe, Mail, Moon, Sun, ArrowDown, Zap, Shield, Cpu } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors">

      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex items-center gap-8 px-2 py-2 rounded-full bg-zinc-950/90 dark:bg-zinc-50/90 backdrop-blur-lg ring-1 ring-white/10 dark:ring-black/10 transition-all duration-500">

          {/* Logo / Globe Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background dark:bg-black text-black dark:text-white shadow-sm">
            <Globe size={18} strokeWidth={2.5} />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center px-4 gap-8">
            <a href="#hero" className="text-[13px] font-medium text-foreground dark:text-zinc-500 hover:text-white dark:hover:text-black transition-colors">Work</a>
            <a href="#team" className="text-[13px] font-medium text-foreground dark:text-zinc-500 hover:text-white dark:hover:text-black transition-colors">Team</a>
            <a href="#contact" className="text-[13px] font-medium text-foreground dark:text-zinc-500 hover:text-white dark:hover:text-black transition-colors">Contact</a>
                        <ThemeToggle />


          {/* Email Pill Button */}
          <a
            href="mailto:aashish@zemlo.in"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background dark:bg-black text-black dark:text-white text-[13px] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all shadow-md"
          >
            <Mail size={14} strokeWidth={2.5} />
            aashish@zemlo.in
          </a>
          </div>
        </nav>
      </div>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        {/* ... (Your redesigned black pill navbar code is already here) ... */}
      </div>

      <main>
        {/* --- NEW HERO SECTION (image_4.png style) --- */}
        <section className="pt-40 pb-20 px-6 sm:px-10 lg:px-16 container mx-auto">

          {/* Top Status Area - Matches [image_4.png] layout */}
          <div className="flex justify-between items-start mb-20 text-xs tracking-tighter text-muted-foreground/90 font-medium">

            <div className="flex items-center gap-1.5 pt-1">
              <span className="relative flex h-2.5 w-2.5">
                {/* Ping/Pulse animation for the status dot */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-inner"></span>
              </span>
              <span>Available for new project</span>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">

            {/* COLUMN 1 & 2: Main Header (Playfair Serif Font) */}
            <div className="md:col-span-2 space-y-12">
              <h1 className="text-5xl md:text-8xl font-black font-serif tracking-tighter leading-[0.95] text-foreground transition-colors duration-300">
                Designing software that works effortlessly.
              </h1>

              {/* Social Icons (matching the layout in image_4.png) */}
              <div className="flex gap-4 items-center text-foreground dark:text-zinc-500">
                {/* ... Add Lucide icons like Globe, Mail, LinkedIn ... */}
              </div>
            </div>

            {/* COLUMN 3: Profile & Intro Text (Geist Sans Font) */}
            <div className="space-y-12 pt-1 md:pt-4">
              {/* Optional Profile Placeholder */}
              <div className="h-20 w-20 rounded-xl bg-background dark:bg-zinc-800 border border-border" />

              {/* Refined intro text, matching the width in image_4.png */}
              <p className="text-base font-medium leading-relaxed text-muted-foreground/80 max-w-sm">
                Hi Aashish Chauhan, a freelance Website Developer based in India. I collaborate with companies to craft digital tools that are integral to achieving their future goals and driving success.
              </p>

              {/* Discover Link with Icon */}
              <a href="#discover" className="inline-flex items-center gap-2.5 text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:underline transition-all">
                Discover <ArrowDown size={14} className="opacity-70" />
              </a>
            </div>
          </div>

          {/* Fixed Floating Action Pill (Pasting this logic at bottom of main) */}
          <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center px-4">
            <a href="mailto:aashish@zemlo.in" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950/95 dark:bg-zinc-50 backdrop-blur-sm shadow-2xl text-white dark:text-black text-sm font-bold hover:bg-zinc-800 dark:hover:bg-background transition-all">
              <Mail size={16} />
              Reach out via email
            </a>
          </div>

        </section>

        {/* --- REST OF THE PAGE --- */}
        {/* Team, Footer, etc. (They now look very professional below the clean hero) */}
      </main>
    </div>
  );
}

// Small helper component for the features
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}