"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchHyperdia, type RouteData, type SearchParams } from "./actions";
import Navbar from "@/components/Navbar";

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function TrainsPage() {
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // App state
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    setRoutes([]);
    setError("");

    const params: SearchParams = {
      from: from.trim(),
      to: to.trim(),
    };

    try {
      const result = await searchHyperdia(params);
      setHasSearched(true);

      if (result.success) {
        setRoutes(result.routes || []);
      } else {
        setError(result.error || "Unknown error");
      }
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground pt-20 pb-20 px-4 md:px-10 transition-colors duration-500">
        <div className="max-w-[98%] mx-auto">
          
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Transit Routing</h1>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Live Database Queries</p>
            </div>
          </div>

          {/* SEARCH FORM */}
          <Card className="mb-6 border-none rounded-[1.5rem] shadow-md">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-tighter mb-1.5">Origin Station</label>
                  <input type="text" required value={from} onChange={(e) => setFrom(e.target.value)}
                    placeholder="e.g. TOKYO" className="w-full bg-background border-none rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all uppercase shadow-sm" />
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-tighter mb-1.5">Destination Station</label>
                  <input type="text" required value={to} onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g. KYOTO" className="w-full bg-background border-none rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all uppercase shadow-sm" />
                </div>

                <Button type="submit" disabled={isSearching}
                  className="h-[44px] px-8 rounded-md text-sm font-bold shadow-md min-w-[150px] w-full md:w-auto mt-4 md:mt-0">
                  {isSearching ? "SEARCHING..." : "SEARCH ROUTES"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ── LOADING ── */}
          {isSearching && (
            <div className="border-none rounded-[1.5rem] p-16 text-center bg-card shadow-md mt-6">
              <div className="inline-block w-8 h-8 border-2 border-muted-foreground border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Accessing Timetables...</p>
            </div>
          )}

          {/* ── ERROR ── */}
          {error && (
            <div className="bg-destructive/10 border-none rounded-[1.5rem] p-6 mb-6 mt-6 shadow-sm">
              <p className="text-sm text-destructive font-bold uppercase tracking-tight">⚠ System Error: {error}</p>
            </div>
          )}

          {/* ── NO RESULTS ── */}
          {hasSearched && !isSearching && routes.length === 0 && !error && (
            <div className="border-none rounded-[1.5rem] p-16 text-center bg-card shadow-md mt-6">
              <p className="text-sm text-muted-foreground font-medium italic">No transit records found matching these parameters.</p>
            </div>
          )}

          {/* ── RESULTS ── */}
          {hasSearched && !isSearching && routes.length > 0 && (
            <div className="mt-8">
              {routes.map((route, idx) => (
                <RouteCard key={route.id} route={route} index={idx} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// ─── ROUTE CARD ───────────────────────────────────────────────────────────────

function RouteCard({ route, index }: { route: RouteData; index: number }) {
    const standardTotal = route.standardTotal;
    const greenTotal = route.greenTotal;

  return (
    <Card className="mb-8 border-none rounded-[1.5rem] overflow-hidden shadow-md">
      {/* Route header */}
      <div className="bg-secondary/30 dark:bg-white/5 dark:backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-medium">
            Time: <strong className="text-foreground">{route.totalTime}</strong>
            <span className="mx-2 text-border">|</span>
            Distance: <strong className="text-foreground">{route.distance}</strong>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">Standard</span>
            <strong className="text-lg font-bold text-foreground font-mono tracking-tight">{standardTotal}</strong>
            <Button variant="outline" size="icon-sm" className="font-black shadow-sm" type="button" title="Add to itinerary">
              +
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">Green</span>
            <strong className="text-lg font-bold text-foreground font-mono tracking-tight">{greenTotal}</strong>
            <Button variant="outline" size="icon-sm" className="font-black shadow-sm" type="button" title="Add to itinerary">
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Route table */}
      <table className="w-full text-left text-sm border-collapse bg-background">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Station / Line</th>
            <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right w-32">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {route.segments.map((seg) => {
            if (seg.type === "departure") {
              return (
                <tr key={seg.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground text-base">{seg.stationName}</span>
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              );
            }

            if (seg.type === "train") {
              return (
                <tr key={seg.id} className="hover:bg-muted/80 transition-colors bg-muted/20">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <TrainIcon name={seg.trainName || ""} />
                      <span className="text-muted-foreground font-medium">{seg.trainName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right text-muted-foreground font-medium text-xs">
                    {seg.duration}
                  </td>
                </tr>
              );
            }

            if (seg.type === "transfer") {
              return (
                <tr key={seg.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground text-base">{seg.stationName}</span>
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              );
            }

            if (seg.type === "arrival") {
              return (
                <tr key={seg.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground text-base">{seg.stationName}</span>
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </Card>
  );
}

// ─── TRAIN ICON ───────────────────────────────────────────────────────────────

function TrainIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();

  // Shinkansen
  if (lower.includes("shinkansen")) {
    return (
      <svg width="20" height="14" viewBox="0 0 28 16" className="flex-shrink-0 text-foreground" fill="currentColor">
        <rect x="2" y="1" width="24" height="11" rx="5" />
        <rect x="5" y="3" width="6" height="4" rx="1" className="text-background" fill="currentColor" />
        <rect x="13" y="3" width="6" height="4" rx="1" className="text-background" fill="currentColor" />
        <circle cx="8" cy="14" r="1.5" className="text-primary" fill="currentColor" />
        <circle cx="20" cy="14" r="1.5" className="text-primary" fill="currentColor" />
      </svg>
    );
  }

  // Airline
  if (lower.includes("airline") || lower.includes("air")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-muted-foreground" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    );
  }

  // Walk
  if (lower.includes("walk")) {
    return (
      <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-muted-foreground">
        <circle cx="13" cy="4" r="2"/><path d="m7.5 16 1-4 4 1 2-3"/><path d="m10.5 21 1.5-5"/><path d="m16 21-2-5"/>
      </svg>
    );
  }

  // Default train
  return (
    <svg width="16" height="14" viewBox="0 0 24 20" fill="none" className="flex-shrink-0">
      <rect x="4" y="2" width="16" height="12" rx="3" className="fill-muted-foreground" />
      <rect x="6" y="4" width="4" height="3" rx="1" className="fill-background" />
      <rect x="12" y="4" width="4" height="3" rx="1" className="fill-background" />
      <circle cx="8" cy="17" r="1.5" className="fill-primary" />
      <circle cx="16" cy="17" r="1.5" className="fill-primary" />
    </svg>
  );
}
