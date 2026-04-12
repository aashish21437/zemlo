"use client";

import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-40 pb-20 px-6 sm:px-10 lg:px-16 container mx-auto">
      <div className="flex justify-between items-start mb-20 text-xs tracking-tighter text-muted-foreground/90 font-medium">
        <div className="flex items-center gap-1.5 pt-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-inner"></span>
          </span>
          <span>Available for new projects</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
        <div className="md:col-span-2 space-y-12">
          <h1 className="text-5xl md:text-8xl font-black font-sans tracking-tighter leading-[0.95] text-foreground transition-colors duration-300">
            Designing software that works effortlessly.
          </h1>
        </div>

        <div className="space-y-4 pt-1 md:pt-4">
          <div />
          <img className="h-40 w-40 rounded-xl bg-background dark:bg-zinc-800 border border-border" src="ashish.jpg" alt="" />
          <p className="text-base font-medium leading-relaxed text-muted-foreground/80 max-w-sm">
            Hi, I&apos;m Aashish Chauhan, a freelance Website Developer based in India. I collaborate with companies to craft digital tools that drive success.
          </p>
          <a href="#work" className="inline-flex items-center gap-2.5 text-sm font-bold text-foreground hover:underline transition-all">
            Discover <ArrowDown size={14} className="opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
}