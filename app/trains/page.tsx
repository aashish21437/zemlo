"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchHyperdia, type RouteData, type SearchParams } from "./actions";
import Navbar from "@/components/Navbar";
import { TrainRouteCard } from "@/components/TrainRouteCard";

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
                <TrainRouteCard key={route.id} route={route} index={idx} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}


