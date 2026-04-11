"use client";

import React, { useRef, useTransition } from 'react';
import { addSightseeing } from './actions';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function AddSightseeingPage() {
    // 1. Hook to handle the "Pending" state of the server action
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        startTransition(async () => {
            const result = await addSightseeing(formData);
            if (result.success) {
                alert("✅ Successfully synced to Atlas Cloud!");
                formRef.current?.reset(); // Clear form on success
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Sightseeing Master Entry</h1>
                        <p className="text-gray-600 mt-2">Populate the Japan Tourism Database (2026 Schema)</p>
                    </div>
                    {isPending && (
                        <div className="flex items-center gap-2 text-blue-600 font-bold animate-pulse">
                            <Loader2 className="animate-spin" size={20} />
                            Saving to Atlas...
                        </div>
                    )}
                </header>

                <form 
                    ref={formRef} 
                    action={clientAction} 
                    className={`space-y-8 transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                >
                    {/* SECTION 1: WHO / WHAT */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-blue-600 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">1</span>
                                Who / What: Basic Details
                            </h2>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">English Name (name_en)</label>
                                    <input name="name_en" type="text" required placeholder="e.g. Kiyomizu-dera" className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Aliases (Comma separated)</label>
                                    <input name="aliases" type="text" placeholder="The Golden Pavilion, Kinkaku-ji" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Primary Category</label>
                                    <select name="category_primary" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-white">
                                        <option value="Temple">Temple</option>
                                        <option value="Shrine">Shrine</option>
                                        <option value="Museum">Museum</option>
                                        <option value="Park">Park</option>
                                        <option value="Castle">Castle</option>
                                        <option value="Observation Deck">Observation Deck</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Category Tags (Comma separated)</label>
                                    <input name="category_tags" type="text" placeholder="UNESCO, Garden, Historical, Hiking" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Year Founded</label>
                                    <input name="year_founded" type="text" placeholder="e.g. 778" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Gov Status</label>
                                    <input name="government_status" type="text" placeholder="National Treasure" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div className="flex items-center space-x-3 pt-6">
                                    <input name="unesco_status" type="checkbox" className="w-6 h-6 accent-blue-600 cursor-pointer" />
                                    <label className="font-bold text-slate-700">UNESCO Site?</label>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Tagline (5-word hook)</label>
                                    <input name="tagline" type="text" placeholder="Tokyo's Oldest Buddhist Temple" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                                    <textarea name="description_short" rows={2} className="w-full border-slate-200 border-2 p-3 rounded-xl"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Long Description</label>
                                    <textarea name="description_long" rows={5} className="w-full border-slate-200 border-2 p-3 rounded-xl"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: WHERE */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-emerald-600 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">2</span>
                                Where: Location & Coordinates
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Prefecture</label>
                                    <input name="prefecture" type="text" required placeholder="Tokyo" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Municipality</label>
                                    <input name="municipality" type="text" required placeholder="Minato-ku" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Neighborhood</label>
                                    <input name="neighborhood" type="text" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Postal Code</label>
                                    <input name="postal_code" type="text" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1 font-mono text-emerald-700">Longitude (X)</label>
                                    <input name="lng" type="number" step="any" required className="w-full border-slate-200 border-2 p-3 rounded-xl bg-emerald-50/30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1 font-mono text-emerald-700">Latitude (Y)</label>
                                    <input name="lat" type="number" step="any" required className="w-full border-slate-200 border-2 p-3 rounded-xl bg-emerald-50/30" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: TICKETING */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-amber-500 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-amber-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">4</span>
                                Ticket Types & Pricing
                            </h2>
                        </div>
                        <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Adult Price</label>
                                <input name="adult_price" type="number" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Student High School</label>
                                <input name="student_high_school_price" type="number" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Infant Price</label>
                                <input name="infant_child_price" type="number" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* FINAL SUBMIT BAR */}
                    <div className="sticky bottom-6 z-50">
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="w-full bg-blue-600 text-white text-xl font-bold py-5 rounded-2xl shadow-2xl hover:bg-blue-700 transform active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <><Loader2 className="animate-spin" /> Processing Entry...</>
                            ) : (
                                "Save Sightseeing Spot to MongoDB"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}