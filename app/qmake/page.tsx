"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { getAllActiveQueries } from './actions';

export default function QMakeHome() {
  const [queries, setQueries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await getAllActiveQueries();
      setQueries(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredQueries = queries.filter(q => q.includes(searchTerm));

  return (
    <div className="min-h-screen bg-white pt-20 pb-20 px-4 md:px-10">
      {/* Changed max-w-5xl to max-w-[98%] for maximum width usage */}
      <div className="max-w-[98%] mx-auto">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Query Archive</h1>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Master Itinerary Database</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input 
                placeholder="Search Query ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-zinc-300 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-zinc-900 w-72 transition-all"
              />
            </div>
            <button 
              onClick={() => {
                const newId = prompt("Enter New Query ID:");
                if(newId) router.push(`/qmake/${newId}`);
              }}
              className="bg-zinc-900 text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} strokeWidth={3} /> NEW ENTRY
            </button>
          </div>
        </div>

        {/* DATA TABLE - Now spans the full width */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 font-bold text-zinc-600 w-24 uppercase tracking-tighter">S.No</th>
                <th className="px-6 py-4 font-bold text-zinc-600 uppercase tracking-tighter">Query Reference ID</th>
                <th className="px-6 py-4 font-bold text-zinc-600 uppercase tracking-tighter">System Status</th>
                <th className="px-6 py-4 font-bold text-zinc-600 text-right uppercase tracking-tighter">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-zinc-300" size={24} />
                        <span className="text-xs text-zinc-400 font-medium italic">Accessing Records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredQueries.length > 0 ? (
                filteredQueries.map((id, index) => (
                  <tr 
                    key={id} 
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/qmake/${id}`)}
                  >
                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{String(index + 1).padStart(2, '0')}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900 text-base italic tracking-tight">#{id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-100">
                        Operational
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-300 group-hover:text-zinc-900 transition-colors font-black uppercase text-[10px] tracking-widest flex items-center gap-2 ml-auto border border-transparent group-hover:border-zinc-200 px-3 py-1 rounded">
                        View Files <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-zinc-400 italic font-medium">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM METRICS */}
        <div className="mt-6 flex justify-between items-center px-2">
            <div className="flex gap-6">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Total Records: <span className="text-zinc-900">{filteredQueries.length}</span>
                </p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Database: <span className="text-zinc-900">Synchronized</span>
                </p>
            </div>
            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
              Zemlo Internal System v1.0
            </p>
        </div>
      </div>
    </div>
  );
}