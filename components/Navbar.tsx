"use client";

import React from 'react';
import Link from 'next/link'; // Import Link
import { Globe } from 'lucide-react';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserStatus from "./UserStatus";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav 
        className="flex items-center gap-4 md:gap-8 px-3 py-2 rounded-full bg-zinc-950/40 dark:bg-zinc-50/40 backdrop-blur-sm ring-1 ring-white/10 dark:ring-black/10 transition-all duration-500"
      >
        
        {/* Logo / Globe Icon - Link to Home */}
<Link 
  href="/" 
  className="flex h-10 w-10 items-center justify-center rounded-full bg-background dark:bg-black text-black dark:text-white shadow-sm hover:scale-105 transition-transform"
>
  <Globe size={18} strokeWidth={2.5} />
</Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center px-2 gap-8">
          {/* Work -> Sightseeing Dashboard */}
          <Link 
            href="/sightseeing-dashboard" 
            className="text-[13px] font-medium text-white dark:text-zinc-900 hover:opacity-70 transition-opacity"
          >
            Work
          </Link>

          {/* CRM -> Qreg */}
          <Link 
            href="/qreg" 
            className="text-[13px] font-medium text-white dark:text-zinc-900 hover:opacity-70 transition-opacity"
          >
            CRM
          </Link>

          <a href="mailto:aashish@zemlo.in" className="text-[13px] font-medium text-white dark:text-zinc-900 hover:opacity-70 transition-opacity">Contact</a>
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 dark:border-black/10 pl-4">
          <ThemeToggle />
          
          {/* Integrated Login/User Button */}
          <UserStatus />
        </div>
      </nav>
    </div>
  );
}