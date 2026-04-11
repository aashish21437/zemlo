"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";

export function QregNav() {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    // Exact match for Agent Reg, startsWith for Query (to cover /query and /query/[id])
    if (path === '/qreg') return pathname === '/qreg';
    return pathname.startsWith(path);
  };

  const linkStyles = (path: string) => `
    text-sm transition-all pb-4 whitespace-nowrap border-b-2
    ${isActive(path) 
      ? 'font-bold text-foreground border-foreground' 
      : 'font-medium text-muted-foreground border-transparent hover:text-foreground hover:border-zinc-300'}
  `;

  return (
    <>
                  <Navbar />
    <nav className="mt-8 flex gap-10 border-b border-zinc-200 mb-10 overflow-x-auto no-scrollbar">
      <Link href="/qreg" className={linkStyles('/qreg')}>
        Agent Registry
      </Link>
      <Link href="/qreg/query" className={linkStyles('/qreg/query')}>
        Query Management
      </Link>
    </nav>
    </>
  );
}