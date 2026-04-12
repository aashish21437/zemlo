"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Loader2, Search, FileDown, X, Utensils } from 'lucide-react';
import { searchSightseeing, saveItineraryData, getItineraryByCode, getVehicleResources } from '../../actions';

export default function ExcelStyleBuilder() {
  const { id, itineraryCode } = useParams();
  const router = useRouter();

  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearchDay, setActiveSearchDay] = useState<number | null>(null);
  
  // Dynamic Registry Data
  const [vehicleResources, setVehicleResources] = useState<{types: string[], cities: string[]}>({ types: [], cities: [] });

  // --- 1. DATA INITIALIZATION ---
  useEffect(() => {
    async function load() {
      const data = await getItineraryByCode(itineraryCode as string);
      if (data?.days?.length > 0) {
        setDays(data.days);
      } else {
        setDays([{ 
          date: "", 
          vehicle: "ALPHARD PVT", 
          guide: "ENGLISH SPEAKING GUIDE",
          serviceTime: "10HRS", 
          stayingCity: "", 
          hotelName: "", 
          activities: [], 
          meals: { breakfast: true, lunch: false, dinner: false } 
        }]);
      }
      setLoading(false);
    }

    async function loadResources() {
      const res = await getVehicleResources();
      setVehicleResources(res);
    }

    load();
    loadResources();
  }, [itineraryCode]);

  // --- 2. SEARCH DEBOUNCE ---
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

  // --- 3. LOGIC HANDLERS ---
  const updateDay = (index: number, field: string, value: any) => {
    const newDays = [...days];
    // Handle nested object updates for 'meals.breakfast' etc.
    if (field.includes('.')) {
      const [obj, key] = field.split('.');
      if (!newDays[index][obj]) newDays[index][obj] = {};
      newDays[index][obj][key] = value;
    } else {
      newDays[index][field] = value;
    }
    setDays(newDays);
  };

  const handleDateChange = (index: number, newDate: string) => {
    const newDays = [...days];
    newDays[index].date = newDate;
    resequenceDates(newDays);
  };

  const resequenceDates = (allDays: any[]) => {
    if (!allDays[0]?.date) return;
    for (let i = 1; i < allDays.length; i++) {
      const prevDate = new Date(allDays[i - 1].date);
      if (!isNaN(prevDate.getTime())) {
        prevDate.setDate(prevDate.getDate() + 1);
        allDays[i].date = prevDate.toISOString().split('T')[0];
      }
    }
    setDays([...allDays]);
  };

  const addActivity = (dayIndex: number, spot: any) => {
    const newDays = [...days];
    if (!newDays[dayIndex].activities) newDays[dayIndex].activities = [];
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

  const removeDay = (index: number) => {
    if (days.length <= 1) return;
    if (confirm(`Remove Day ${index + 1}?`)) {
      const newDays = days.filter((_, i) => i !== index);
      resequenceDates(newDays);
    }
  };

  const addNewDay = () => {
    const lastDay = days[days.length - 1];
    let nextDate = "";
    if (lastDay?.date) {
      const d = new Date(lastDay.date);
      d.setDate(d.getDate() + 1);
      nextDate = d.toISOString().split('T')[0];
    }
    setDays([...days, { 
      date: nextDate, 
      vehicle: lastDay?.vehicle || "ALPHARD PVT", 
      guide: lastDay?.guide || "ENGLISH SPEAKING GUIDE",
      serviceTime: lastDay?.serviceTime || "10HRS", 
      stayingCity: lastDay?.stayingCity || "", 
      hotelName: lastDay?.hotelName || "", 
      activities: [],
      meals: { breakfast: true, lunch: false, dinner: false }
    }]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveItineraryData(itineraryCode as string, days);
      alert("Plan Saved Successfully!");
    } catch (err) {
      alert("Error saving plan");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 4. MODULAR COLUMN RENDERERS ---

  const renderDateCell = (day: any, dIdx: number) => (
    <td className="border-r border-black p-3 text-center bg-zinc-50/50 relative">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="font-black text-[12px]">DAY {dIdx + 1}</span>
        <button onClick={() => removeDay(dIdx)} className="print:hidden text-red-500 hover:scale-110 transition-all">
          <Trash2 size={14} />
        </button>
      </div>
      <input 
        type="date" 
        value={day.date || ""} 
        onChange={(e) => handleDateChange(dIdx, e.target.value)}
        className="w-full bg-transparent border border-zinc-200 rounded p-1 text-[10px] font-black text-black text-center" 
      />
    </td>
  );

  const renderVehicleCell = (day: any, dIdx: number) => (
    <td className="border-r border-black p-3">
      <label className="text-[8px] font-black text-zinc-400 block mb-1">VEHICLE TYPE</label>
      <select 
        value={day.vehicle || "NONE"} 
        onChange={(e) => updateDay(dIdx, 'vehicle', e.target.value)}
        className="w-full bg-transparent border-2 border-black p-1 outline-none font-black text-[10px] mb-2 uppercase"
      >
        <option value="NONE">SELECT VEHICLE...</option>
        {vehicleResources.types.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
        <hr className="my-1 border-black" />
        <option>PUBLIC TRANSPORT</option>
        <option>SELF DRIVE</option>
        <option>NONE</option>
      </select>
      <label className="text-[8px] font-black text-zinc-400 block mb-1 mt-2">STAYING CITY</label>
      <input 
        placeholder="e.g. TOKYO" 
        list="registry-cities"
        value={day.stayingCity || ""} 
        onChange={(e) => updateDay(dIdx, 'stayingCity', e.target.value.toUpperCase())}
        className="w-full p-1 border-b border-black outline-none font-black text-black text-[9px] uppercase placeholder:text-zinc-300" 
      />
      <datalist id="registry-cities">
        {vehicleResources.cities.map(city => (
          <option key={city} value={city} />
        ))}
      </datalist>
    </td>
  );

  const renderGuideCell = (day: any, dIdx: number) => (
    <td className="border-r border-black p-3">
      <label className="text-[8px] font-black text-zinc-400 block mb-1">GUIDE SERVICE</label>
      <select value={day.guide || "NONE"} onChange={(e) => updateDay(dIdx, 'guide', e.target.value)}
        className="w-full bg-transparent border-2 border-black p-1 outline-none font-black text-[10px] uppercase">
        <option>ENGLISH SPEAKING GUIDE</option>
        <option>THAI SPEAKING GUIDE</option>
        <option>DRIVER ONLY</option>
        <option>ASSISTANT ONLY</option>
        <option>NONE / SELF-GUIDED</option>
      </select>
    </td>
  );

  const renderItineraryCell = (day: any, dIdx: number) => (
    <td className="border-r border-black p-3 bg-white min-w-[420px]">
      <div className="flex justify-between items-start gap-4">
        {/* Activity List */}
        <div className="flex-1 space-y-1.5">
          {day.activities?.map((act: any, aIdx: number) => (
            <div key={aIdx} className="flex items-center justify-between py-1 border-b border-zinc-100 last:border-0 group">
              <span className="font-bold text-black text-[10px] uppercase">• {act.name_en}</span>
              <button 
                onClick={() => removeActivity(dIdx, aIdx)} 
                className="text-red-400 hover:text-red-600 px-1 transition-colors print:hidden"
              >
                <X size={12}/>
              </button>
            </div>
          ))}
          {(!day.activities || day.activities.length === 0) && (
            <p className="text-[9px] text-zinc-300 italic">No activities added...</p>
          )}
        </div>

        {/* MEAL MATRIX (B / L / D) */}
        <div className="flex flex-col items-center gap-1 border-l border-zinc-200 pl-3">
          <span className="text-[8px] font-black text-zinc-400 uppercase mb-1">Meals</span>
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <label key={meal} className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-black">{meal[0]}</span>
              <input 
                type="checkbox" 
                checked={day.meals?.[meal] || false}
                onChange={(e) => updateDay(dIdx, `meals.${meal}`, e.target.checked)}
                className="w-3.5 h-3.5 accent-black cursor-pointer border-black" 
              />
            </label>
          ))}
        </div>
      </div>

      <div className="relative print:hidden mt-4">
        <div className="flex items-center gap-2 border-2 border-black p-1.5 bg-zinc-50">
          <Search size={14} className="text-black" />
          <input 
            onFocus={() => { setActiveSearchDay(dIdx); setSearchQuery(""); }}
            onChange={(e) => setSearchQuery(e.target.value)} 
            value={activeSearchDay === dIdx ? searchQuery : ""}
            placeholder="SEARCH & ADD SPOT..." 
            className="w-full bg-transparent border-none text-[10px] font-black italic outline-none text-black uppercase" 
          />
        </div>

        {activeSearchDay === dIdx && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border-2 border-black z-50 shadow-2xl max-h-60 overflow-y-auto">
            {searchResults.map((spot: any) => (
              <button 
                key={spot._id} 
                type="button" 
                onClick={() => addActivity(dIdx, spot)}
                className="w-full p-2 text-left hover:bg-black hover:text-white text-[10px] font-bold border-b border-zinc-100 uppercase text-black"
              >
                {spot.name_en} — <span className="text-[8px] opacity-70">{spot.municipality}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </td>
  );

  // --- 5. MAIN RENDER ---
  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black" size={40} /></div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 font-sans uppercase">
      <div className="max-w-full mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="hover:bg-zinc-100 p-2 rounded-full transition-all">
              <ArrowLeft size={20}/>
            </button>
            <div>
              <h1 className="font-bold text-xl italic tracking-tighter">Master Itinerary Engine</h1>
              <p className="text-[10px] font-black text-zinc-400">Ref: {itineraryCode}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="border-2 border-black px-4 py-1 text-[10px] font-black flex items-center gap-2 hover:bg-zinc-50 transition-colors">
              <FileDown size={14}/> PDF PREVIEW
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="bg-black text-white px-6 py-1 text-[10px] font-black hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Master Plan"}
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="border-2 border-black">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-zinc-100 border-b-2 border-black text-center font-black">
                <th className="border-r border-black p-2 w-24">DATE</th>
                <th className="border-r border-black p-2 w-44">VEHICLE / CITY</th>
                <th className="border-r border-black p-2 w-48">GUIDE SERVICE</th>
                <th className="border-r border-black p-2 w-20">TIME</th>
                <th className="border-r border-black p-2">ITINERARY / MEALS</th>
                <th className="p-2 w-72">HOTEL (OR SIMILAR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {days.map((day, dIdx) => (
                <tr key={dIdx} className="align-top hover:bg-zinc-50/50 transition-colors group/row">
                  {renderDateCell(day, dIdx)}
                  {renderVehicleCell(day, dIdx)}
                  {renderGuideCell(day, dIdx)}
                  <td className="border-r border-black p-3 text-center">
                    <select 
                      value={day.serviceTime || ""} 
                      onChange={(e) => updateDay(dIdx, 'serviceTime', e.target.value)}
                      className="w-full text-center p-1 bg-transparent border-none outline-none font-black text-[10px] text-black appearance-none cursor-pointer" 
                    >
                      <option value="">SERVICE...</option>
                      <option value="10HRS">10HRS FIX</option>
                      <option value="12HRS">12HRS FIX</option>
                      <option value="AIRPORT TRANSFER">AIRPORT T/F</option>
                      <option value="STATION TRANSFER">STATION T/F</option>
                      <option value="OVERTIME">OVERTIME</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </td>
                  {renderItineraryCell(day, dIdx)}
                  <td className="p-3">
                    <textarea 
                      placeholder="HOTEL NAME & ROOM TYPE..."
                      value={day.hotelName || ""} 
                      onChange={(e) => updateDay(dIdx, 'hotelName', e.target.value)}
                      className="w-full h-32 bg-transparent border-2 border-zinc-100 p-2 outline-none font-bold text-[10px] resize-none leading-relaxed text-black focus:border-black uppercase" 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          onClick={addNewDay} 
          className="mt-6 w-full py-5 border-4 border-dashed border-zinc-200 font-black text-zinc-400 hover:text-black hover:border-black transition-all rounded-xl print:hidden text-sm"
        >
          + Initialize Next Itinerary Row (Day {days.length + 1})
        </button>
      </div>
    </div>
  );
}