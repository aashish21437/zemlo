"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Hash, Layers, ExternalLink, Loader2, Settings } from 'lucide-react';
import { getItineraries, createItinerary, getQueryTitle } from '../actions';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

export default function ItinerarySelector() {
  const params = useParams();
  const router = useRouter();
  const queryId = String(params.id).padStart(5, '0');
  
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [queryName, setQueryName] = useState<string>(`#${queryId}`);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getItineraries(queryId);
      setItineraries(data);
      const title = await getQueryTitle(queryId);
      setQueryName(title);
      setLoading(false);
    }
    load();
  }, [queryId]);

  const handleAddNew = async () => {
    setIsCreating(true);
    const nextLetter = String.fromCharCode(97 + itineraries.length); 
    const newCode = `${queryId}${nextLetter}`;
    const versionName = `Option ${nextLetter.toUpperCase()}`;

    try {
      await createItinerary(queryId, newCode, versionName);
      // Refresh local list
      setItineraries([...itineraries, { itinerary_code: newCode, version_name: versionName }]);
    } catch (error) {
      console.error("Database Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-zinc-300" size={32} />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-20 pb-20 px-4 md:px-10">
        <div className="max-w-[98%] mx-auto">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => router.push('/qmake')}
              className="rounded-full"
            >
              <ArrowLeft size={20} className="text-zinc-600" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Itinerary Options</h1>
              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">
                Parent Query: <span className="text-zinc-900">{queryName}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => router.push(`/qreg/query/${queryId}`)}
              className="border-zinc-900 text-zinc-900 font-bold"
            >
              <Settings size={16} /> REGISTRY EDIT
            </Button>
            <Button 
              disabled={isCreating}
              onClick={handleAddNew}
              className="font-bold shadow-sm"
            >
              {isCreating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} strokeWidth={3} />}
              ADD NEW OPTION
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        <Card className="border-none rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 font-bold text-zinc-600 w-24 uppercase tracking-tighter">S.No</th>
                <th className="px-6 py-4 font-bold text-zinc-600 uppercase tracking-tighter">
                  <div className="flex items-center gap-2"><Hash size={12}/> Option Code</div>
                </th>
                <th className="px-6 py-4 font-bold text-zinc-600 uppercase tracking-tighter">
                  <div className="flex items-center gap-2"><Layers size={12}/> Version Name</div>
                </th>
                <th className="px-6 py-4 font-bold text-zinc-600 text-right uppercase tracking-tighter">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {itineraries.length > 0 ? (
                itineraries.map((itin, index) => (
                  <tr 
                    key={itin.itinerary_code} 
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/qmake/${queryId}/${itin.itinerary_code}`)}
                  >
                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                        {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-100 text-zinc-900 px-2 py-1 rounded text-[10px] font-black font-mono">
                        {itin.itinerary_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900 text-base italic tracking-tight uppercase">
                      {itin.version_name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[10px] text-zinc-400 group-hover:text-zinc-900 ml-auto">
                        Edit Plan <ExternalLink size={12} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-zinc-400 italic font-medium">
                    No options generated for this query yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* METRICS */}
        <div className="mt-6 flex justify-between items-center px-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
              Available Versions: <span className="text-zinc-900">{itineraries.length}</span>
            </p>
            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
              Zemlo Internal System v1.0
            </p>
        </div>
      </div>
    </div>
    </>
  );
}