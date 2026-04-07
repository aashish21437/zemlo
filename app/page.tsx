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
              <span>Available for new projects</span>
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

          {/* --- PROJECTS / DASHBOARD SECTION --- */}
          <section id="work" className="py-20 px-6 sm:px-10 lg:px-16 container mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Featured Tool</h2>
                <p className="text-3xl md:text-5xl font-serif tracking-tighter">Sightseeing Database</p>
              </div>
              <a href="/sightseeing-dashboard" className="text-sm font-bold hover:underline hidden md:block">
                Open Full Dashboard →
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Large Feature Card */}
              <div className="lg:col-span-2 group relative bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-800 transition-all hover:shadow-2xl">
                <div className="p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase border border-blue-500/20">Live Database</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/20">MongoDB Atlas</span>
                  </div>

                  <h3 className="text-3xl font-bold text-white tracking-tight">Japan Tourism Master Engine</h3>
                  <p className="text-zinc-400 max-w-md leading-relaxed">
                    A professional-grade data entry and management system built for 2026 tourism scale.
                    Features 9-section deep nesting, GeoJSON geospatial mapping, and real-time cloud synchronization.
                  </p>

                  <div className="pt-8">
                    <Button asChild className="rounded-full bg-white text-black hover:bg-zinc-200 px-8 py-6 text-md font-bold">
                      <a href="/sightseeing-dashboard">Launch Dashboard</a>
                    </Button>
                  </div>
                </div>

                {/* Visual representation of a data table inside the card
      <div className="absolute bottom-0 right-0 left-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent p-10 flex items-end opacity-40 group-hover:opacity-100 transition-opacity">
         <div className="w-full space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="h-3 w-3/4 bg-zinc-800 rounded-full" />
            <div className="h-3 w-1/2 bg-zinc-800 rounded-full" />
            <div className="h-3 w-2/3 bg-zinc-800 rounded-full" />
         </div>
      </div> */}
              </div>

              {/* Secondary Info Card - Enhanced for "Full" look */}
              {/* Secondary Info Card - Theme-Aware System Health & DMC Use Case */}
              <Card className="rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-none p-10 flex flex-col justify-between min-h-[480px] transition-all duration-500">

                <div className="space-y-10">
                  {/* Top Header & B2B Badge */}
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-zinc-50 dark:text-zinc-900 shadow-xl">
                      <Cpu size={28} strokeWidth={1.5} />
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] border border-zinc-300/50 dark:border-zinc-700/50">
                        B2B Ready
                      </span>
                    </div>
                  </div>

                  {/* DMC Use Case Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">Industry Use Case</h4>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100">
                      DMC Itinerary <br /> Automation
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                      Helping Destination Management Companies filter thousands of spots by <span className="text-zinc-950 dark:text-white font-bold underline decoration-blue-500/30">Vibe, Accessibility, & Season</span> to build luxury tours instantly.
                    </p>
                  </div>

                  {/* Tech Stack List */}
                  {/* <div className="space-y-5 pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
         <h4 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-200">System Integrity</h4>
         <ul className="space-y-4 text-[13px] font-medium">
            <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
               <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] dark:shadow-[0_0_12px_rgba(16,185,129,0.7)]" /> 
               Next.js 15 Server Actions
            </li>
            <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
               <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] dark:shadow-[0_0_12px_rgba(59,130,246,0.7)]" /> 
               Mongoose Middleware
            </li>
            <li className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
               <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] dark:shadow-[0_0_12px_rgba(168,85,247,0.7)]" /> 
               Multi-region Cloud Sync
            </li>
         </ul>
      </div> */}
                </div>

                {/* LIVE SYSTEM METRICS FOOTER */}
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">API Latency</p>
                      <p className="text-2xl font-black font-mono text-zinc-900 dark:text-white">
                        18<span className="text-xs ml-1 opacity-40 font-sans">MS</span>
                      </p>
                    </div>

                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Cloud Engine</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-tighter">Operational</span>
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>





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