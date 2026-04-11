"use client"

import Link from 'next/link';
import { Plus } from 'lucide-react';

export function QueryForm() {
  return (
    <Link 
      href="/qreg/query/new" 
      className="flex items-center gap-2 px-6 py-2.5 bg-[#0070d2] text-white rounded-md font-bold text-xs hover:bg-[#005fb2] transition-all shadow-sm shadow-[#0070d2]/20"
    >
      <Plus size={16} /> 
      <span>New Query</span>
    </Link>
  );
}