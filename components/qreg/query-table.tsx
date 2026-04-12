"use client"

import React from 'react';
import Link from 'next/link';

export function QueryTable({ queries }: { queries: any[] }) {
  
  // Helper to style the status badges based on the CRM stage
  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("won") || s.includes("confirmation") || s.includes("invoiced")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s.includes("lost")) {
      return "bg-red-50 text-red-700 border-red-200";
    }
    if (s.includes("negotiation") || s.includes("revision")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    // Default for Received, Acknowledged, Quoted, etc.
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="w-full overflow-x-auto border border-border rounded-xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse min-w-275">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Query Name</th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Owner</th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Type</th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Travel Dates</th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nights</th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {queries.map((q) => (
            <tr key={q._id} className="hover:bg-zinc-50 transition-colors group">
              <td className="px-4 py-4">
                <Link 
                  href={`/qreg/query/${q.queryNumber}`} 
                  className="text-[11px] font-mono font-bold text-[#0070d2] hover:underline block"
                >
                  {q.queryName}
                </Link>
              </td>
              <td className="px-4 py-4 text-sm font-medium text-zinc-700">{q.owner}</td>
              <td className="px-4 py-4">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-100 text-zinc-600 rounded border border-zinc-200 uppercase">
                   {q.queryType}
                </span>
              </td>
              <td className="px-4 py-4 text-xs text-zinc-500 font-medium">
                {q.arrivalDate} <span className="mx-1 opacity-30">→</span> {q.departureDate}
              </td>
              <td className="px-4 py-4 text-sm font-black text-zinc-900">{q.nights}N</td>
              <td className="px-4 py-4 text-center">
                {/* DYNAMIC STATUS BADGE */}
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-tight ${getStatusStyle(q.status)}`}>
                  {q.status || "Query Received"}
                </span>
              </td>
            </tr>
          ))}

          {queries.length === 0 && (
            <tr>
              <td colSpan={6} className="py-20 text-center text-sm text-zinc-400 italic">
                No records found in the registry.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}