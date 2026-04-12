"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cpu } from 'lucide-react';

export default function SightseeingSection() {
  return (
    <section id="work" className="py-20 px-6 sm:px-10 lg:px-16 container mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">
            Featured Tool
          </h2>
          <p className="text-3xl md:text-5xl font-serif tracking-tighter">
            Sightseeing Database
          </p>
        </div>
        <a 
          href="/sightseeing-dashboard" 
          className="text-sm font-bold hover:underline hidden md:block"
        >
          Open Full Dashboard →
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Large Feature Card */}
        <div className="lg:col-span-2 group relative bg-zinc-900 rounded-4xl overflow-hidden border border-zinc-800 transition-all hover:shadow-2xl">
          <div className="p-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase border border-blue-500/20">
                Live Database
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/20">
                MongoDB Atlas
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Japan Tourism Master Engine
            </h3>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              A professional-grade data management system built for 2026 tourism scale. 
              Features deep nesting and real-time cloud synchronization.
            </p>
            <div className="pt-8">
              <Button asChild className="rounded-full bg-white text-black hover:bg-zinc-200 px-8 py-6 text-md font-bold transition-transform hover:scale-105">
                <a href="/sightseeing-dashboard">Launch Dashboard</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Card */}
        <Card className="rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-none p-10 flex flex-col justify-between min-h-120 transition-all duration-500">
          <div className="space-y-10">
            <div className="flex justify-between items-start">
              <div className="h-14 w-14 rounded-2xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-zinc-50 dark:text-zinc-900 shadow-xl">
                <Cpu size={28} strokeWidth={1.5} />
              </div>
              <span className="px-3 py-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] border border-zinc-300/50 dark:border-zinc-700/50">
                B2B Ready
              </span>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
                Industry Use Case
              </h4>
              <p className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100">
                DMC Itinerary <br /> Automation
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Helping Companies filter thousands of spots by 
                <span className="text-zinc-950 dark:text-white font-bold underline decoration-blue-500/30 mx-1">Vibe & Season</span> 
                instantly.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">API Latency</p>
                <p className="text-2xl font-black font-mono">18<span className="text-xs ml-1 opacity-40">MS</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Cloud Engine</p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs font-bold text-emerald-500 uppercase">Operational</span>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}