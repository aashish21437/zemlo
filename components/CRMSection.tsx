"use client";

import React from 'react';
import { Zap, Shield, ArrowDown } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CRMSection() {
  return (
    <section id="crm" className="py-20 px-6 sm:px-10 lg:px-16 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-4">
            Enterprise Solutions
          </h2>
          <p className="text-3xl md:text-5xl font-sans tracking-tighter text-foreground">
            DMC Sales & Partner Engine
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild className="rounded-full px-6 border-zinc-200 dark:border-zinc-800">
            <a href="/qreg">Agent Registry</a>
          </Button>
          <Button asChild className="rounded-full bg-[#0070d2] text-white hover:bg-[#005fb2] px-6 transition-transform hover:scale-105">
            <a href="/qreg/query">Query Command</a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LARGE CARD: Query Management (Command Center) */}
        <div className="lg:col-span-8 group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-2xl flex flex-col md:flex-row">
          <div className="p-10 md:w-1/2 space-y-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#0070d2]">
              <Zap size={18} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Pipeline</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">Query Command Center</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              A high-velocity sales dashboard for managing travel inquiries. Featuring 11 stages and automatic 
              <span className="font-mono text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-zinc-900 dark:text-white mx-1">
                ASAHI
              </span> 
              naming logic.
            </p>
            <div className="pt-4 flex gap-4 text-[10px] font-bold uppercase text-zinc-400 tracking-tighter">
              <span>• 11 Sales Stages</span>
              <span>• Auto-Numbering</span>
            </div>
          </div>

          {/* Visual UI Preview */}
          <div className="md:w-1/2 bg-zinc-100 dark:bg-zinc-950 p-6 flex items-center justify-center border-l border-zinc-200 dark:border-zinc-800">
            <div className="w-full space-y-4">
              <div className="flex gap-1 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`h-6 flex-1 rounded-sm ${i === 1 ? 'bg-[#0070d2]' : 'bg-zinc-300 dark:bg-zinc-800'}`} 
                    style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)' }} 
                  />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-10 w-full bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm" />
                <div className="h-10 w-full bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* SMALL CARD: Agent Registry (Partner Network) */}
        <Card className="lg:col-span-4 rounded-[2.5rem] bg-zinc-950 text-white border-none p-10 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
            <Shield size={120} strokeWidth={1} />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
              <Shield size={24} />
            </div>
            <h4 className="text-2xl font-bold tracking-tight leading-tight">Partner & Agent <br /> Registry</h4>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Centralized database for global B2B travel partners. Securely manage company codes and leads.
            </p>
          </div>
          <div className="pt-8 relative z-10">
            <a href="/qreg" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all text-white">
              Explore Network <ArrowDown size={14} className="-rotate-90" />
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}