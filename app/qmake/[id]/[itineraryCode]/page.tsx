"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Search, Save, Trash2, Loader2, Check, Hash, FileDown } from 'lucide-react';
import { searchSightseeing, saveItineraryData, getItineraryByCode } from '../../actions';
import { generateItineraryPDF } from '@/lib/generatePDF';

export default function ItineraryBuilder() {
  const params = useParams();
  const router = useRouter();
  const { id, itineraryCode } = params;

  const [days, setDays] = useState<any[]>([
    { stay: "", activities: [], notes: "" },
    { stay: "", activities: [], notes: "" }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeSearchDay, setActiveSearchDay] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    async function load() {
      if (!itineraryCode) return;
      try {
        const data = await getItineraryByCode(itineraryCode as string);
        if (data && data.days && data.days.length > 0) {
          setDays(data.days);
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [itineraryCode]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        const results = await searchSightseeing(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addActivity = (dayIndex: number, spot: any) => {
    const newDays = [...days];
    newDays[dayIndex].activities.push(spot);
    setDays(newDays);
    setSearchQuery("");
    setSearchResults([]);
    setActiveSearchDay(null);
  };

  const removeActivity = (dayIndex: number, spotIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities.splice(spotIndex, 1);
    setDays(newDays);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveItineraryData(itineraryCode as string, days);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (err) {
      console.error("Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    generateItineraryPDF(id as string, itineraryCode as string, days, totalCost);
  };

  const totalCost = days.reduce((sum, day) => {
    return sum + day.activities.reduce((dSum: number, act: any) => dSum + (act.adult_price || 0), 0);
  }, 0);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-black" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-20 pb-40 px-4 md:px-10 text-black">
      <div className="max-w-[98%] mx-auto">
        
        {/* HEADER & NAV */}
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-black">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight uppercase italic">
                Itinerary Builder <span className="text-zinc-300 not-italic font-light">[{itineraryCode}]</span>
              </h1>
              <p className="text-[11px] text-black font-bold uppercase tracking-widest">Linked Query: #{id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-50 px-6 py-3 rounded-lg border border-zinc-200">
            <div className="text-right border-r border-zinc-200 pr-6 mr-2">
              <p className="text-[9px] font-black text-black uppercase tracking-widest leading-none">Estimate Total</p>
              <p className="text-xl font-black italic text-black">¥{totalCost.toLocaleString()}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleDownloadPDF} 
                className="bg-white text-black border border-black px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 flex items-center gap-2 transition-all"
              >
                <FileDown size={14} strokeWidth={3} /> Download PDF
              </button>

              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-black text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm"
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                {isSaving ? "Saving..." : "Save Plan"}
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE TABLE */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden shadow-sm bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 font-bold text-black w-24 uppercase tracking-tighter"><Hash size={14}/></th>
                <th className="px-6 py-4 font-bold text-black w-64 uppercase tracking-tighter">Stay Location</th>
                <th className="px-6 py-4 font-bold text-black uppercase tracking-tighter">Day Sightseeing & Activities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {days.map((day, dIdx) => (
                <tr key={dIdx} className="align-top group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-8">
                    <span className="text-4xl font-black italic text-zinc-200 group-hover:text-black transition-colors">0{dIdx + 1}</span>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-3 bg-white p-3 rounded border border-zinc-300 focus-within:border-black transition-all">
                      <MapPin size={14} className="text-black" />
                      <input 
                        placeholder="STAYING CITY" 
                        value={day.stay || ""}
                        onChange={(e) => {
                          const newDays = [...days];
                          newDays[dIdx].stay = e.target.value;
                          setDays(newDays);
                        }}
                        className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest w-full outline-none text-black placeholder:text-zinc-400" 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {day.activities.map((act: any, aIdx: number) => (
                        <div key={aIdx} className="flex items-center gap-3 bg-white border border-black px-3 py-2 rounded shadow-sm hover:bg-zinc-50 transition-all">
                          <div>
                            <p className="text-[8px] font-black text-black uppercase leading-none">{act.category_primary}</p>
                            <p className="text-xs font-bold text-black">{act.name_en}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-black italic">¥{act.adult_price}</span>
                          <button onClick={() => removeActivity(dIdx, aIdx)} className="text-zinc-400 hover:text-black transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {day.activities.length === 0 && (
                        <p className="text-[10px] font-bold text-zinc-400 italic py-2">No activities added for this day...</p>
                      )}
                    </div>

                    <div className="relative max-w-xl">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={14} />
                      <input 
                        value={activeSearchDay === dIdx ? searchQuery : ""}
                        onFocus={() => setActiveSearchDay(dIdx)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="SEARCH MASTER DATABASE..." 
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-300 rounded text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-black outline-none transition-all text-black placeholder:text-zinc-400"
                      />
                      
                      {activeSearchDay === dIdx && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black rounded shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                          {searchResults.map((spot) => (
                            <button 
                              key={spot._id}
                              onClick={() => addActivity(dIdx, spot)}
                              className="w-full flex justify-between items-center p-3 hover:bg-zinc-100 text-left border-b border-zinc-100 last:border-0 text-black"
                            >
                              <div>
                                <p className="font-bold text-[11px] uppercase tracking-tight">{spot.name_en}</p>
                                <p className="text-[8px] font-black text-zinc-500 uppercase">{spot.municipality}</p>
                              </div>
                              <span className="text-[9px] font-black bg-black text-white px-2 py-1 rounded italic">¥{spot.adult_price}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showSavedToast && (
          <div className="fixed bottom-10 right-10 bg-black text-white px-6 py-3 rounded font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50">
            <Check size={14} className="text-green-400" strokeWidth={4} /> Database Synchronized
          </div>
        )}
      </div>
    </div>
  );
}