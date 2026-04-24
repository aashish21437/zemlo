"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllActiveQueries } from './actions';
import Navbar from "@/components/Navbar";

export default function QMakeHome() {
  const [queries, setQueries] = useState<{id: string, name: string}[]>([]);
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

  const filteredQueries = queries.filter(q => 
    q.id.includes(searchTerm) || 
    q.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-20 px-4 md:px-10 transition-colors duration-500">
        <div className="max-w-[98%] mx-auto">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6 pb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Query Archive</h1>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Master Itinerary Database</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                placeholder="Search Query ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground w-72 transition-all shadow-sm"
              />
            </div>
            <Button 
              onClick={() => {
                const newId = prompt("Enter New Query ID:");
                if(newId) router.push(`/qmake/${String(newId).padStart(5, '0')}`);
              }}
              className="rounded-full px-6 py-5 text-sm font-bold shadow-md"
            >
              <Plus size={16} strokeWidth={3} /> NEW ENTRY
            </Button>
          </div>
        </div>

        <Card className="border-none rounded-[1.5rem] overflow-hidden shadow-md">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/30 dark:bg-white/5 dark:backdrop-blur-md">
                <th className="px-6 py-4 font-bold text-muted-foreground w-24 uppercase tracking-tighter">S.No</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-tighter">Query Name</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-tighter">System Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground text-right uppercase tracking-tighter">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-muted-foreground" size={24} />
                        <span className="text-xs text-muted-foreground font-medium italic">Accessing Records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredQueries.length > 0 ? (
                filteredQueries.map((q, index) => (
                  <tr 
                    key={q.id} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/qmake/${String(q.id).padStart(5, '0')}`)}
                  >
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{String(index + 1).padStart(2, '0')}</td>
                    <td className="px-6 py-4 font-bold text-foreground text-sm tracking-tight">{q.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-sm">
                        Operational
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest ml-auto text-[10px] text-muted-foreground group-hover:text-foreground">
                        View Files <ExternalLink size={12} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-muted-foreground italic font-medium">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* BOTTOM METRICS */}
        <div className="mt-6 flex justify-between items-center px-2">
            <div className="flex gap-6">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Total Records: <span className="text-foreground">{filteredQueries.length}</span>
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Database: <span className="text-foreground">Synchronized</span>
                </p>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.2em]">
              Zemlo Internal System v1.0
            </p>
        </div>
      </div>
    </div>
    </>
  );
}