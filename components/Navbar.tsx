"use client";

import React from 'react';
import Link from 'next/link'; // Import Link
import { Globe } from 'lucide-react';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserStatus from "./UserStatus";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="flex items-center gap-4 md:gap-8 px-3 py-2 rounded-full bg-background/70 backdrop-blur-md border border-border shadow-sm transition-all duration-500"
      >

        {/* Logo / Globe Icon - Link to Home */}
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:scale-105 transition-transform"
        >
          <Globe size={18} strokeWidth={2.5} />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center px-2 gap-8">
          <Link
            href="/sightseeing-dashboard"
            className="text-[13px] font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Database
          </Link>

          <Link
            href="/vehicle"
            className="text-[13px] font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Vehicles
          </Link>

          <Link
            href="/trains"
            className="text-[13px] font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Trains
          </Link>

          <Link
            href="/qmake"
            className="text-[13px] font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Query Maker
          </Link>

          {/* CRM -> Qreg */}
          <Link
            href="/qreg"
            className="text-[13px] font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            CRM
          </Link>

          <a href="mailto:aashish@zemlo.in" className="text-[13px] font-medium text-foreground/80 hover:text-primary transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <ThemeToggle />

          {/* Integrated Login/User Button */}
          <UserStatus />
        </div>
      </nav>
    </div>
  );
}