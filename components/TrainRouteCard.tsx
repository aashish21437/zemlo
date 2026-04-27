import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface RouteSegment {
  id: string;
  type: "departure" | "train" | "transfer" | "arrival";
  stationName?: string;
  time?: string;
  trainName?: string;
  duration?: string;
  fare?: string;
  seatFee?: string;
  seatOptions?: { name: string; price: string; isSelected: boolean }[];
}

export interface RouteData {
  id: string;
  totalTime: string;
  transfers: number;
  fare: string;
  seatFee: string;
  totalPrice: string;
  distance: string;
  standardTotal: string;
  greenTotal: string;
  segments: RouteSegment[];
}

export function TrainRouteCard({ 
  route, 
  index, 
  onSelect 
}: { 
  route: RouteData; 
  index?: number;
  onSelect?: (route: RouteData, type: "Standard" | "Green", price: number) => void;
}) {
  const standardTotal = route.standardTotal;
  const greenTotal = route.greenTotal;

  const parsePrice = (str: string) => {
    const match = str.replace(/,/g, "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Group segments into legs
  const legs: { id: string; from: string; train: string; to: string; duration: string }[] = [];
  let currentFrom = "";

  route.segments.forEach((seg, i) => {
    if (seg.type === "departure" || seg.type === "transfer") {
      currentFrom = seg.stationName || "";
    } else if (seg.type === "train") {
      let toStation = "";
      for (let j = i + 1; j < route.segments.length; j++) {
        if (route.segments[j].type === "transfer" || route.segments[j].type === "arrival") {
          toStation = route.segments[j].stationName || "";
          break;
        }
      }
      legs.push({
        id: seg.id,
        from: currentFrom,
        train: seg.trainName || "Unknown",
        to: toStation,
        duration: seg.duration?.replace(/[\[\]]/g, "") || "",
      });
      currentFrom = toStation;
    }
  });

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
            <Button 
              variant="outline" 
              size="icon-sm" 
              className="font-black shadow-sm" 
              type="button" 
              title="Add to itinerary"
              onClick={() => onSelect?.(route, "Standard", parsePrice(standardTotal))}
            >
              +
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">Green</span>
            <strong className="text-lg font-bold text-foreground font-mono tracking-tight">{greenTotal}</strong>
            <Button 
              variant="outline" 
              size="icon-sm" 
              className="font-black shadow-sm" 
              type="button" 
              title="Add to itinerary"
              onClick={() => onSelect?.(route, "Green", parsePrice(greenTotal))}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Route Legs */}
      <div className="p-4 flex flex-col gap-3 bg-background">
        {legs.map((leg) => (
          <div key={leg.id} className="grid grid-cols-[100px_auto_1fr_auto_100px_auto] md:grid-cols-[150px_auto_1fr_auto_150px_auto] items-center gap-2 md:gap-4 text-sm p-3 rounded-xl bg-muted/20 hover:bg-muted/50 transition-colors border border-transparent hover:border-border overflow-hidden">
            <div className="font-bold text-foreground text-right truncate" title={leg.from}>{leg.from}</div>
            <div className="text-muted-foreground/50 text-center">➔</div>
            <div className="flex justify-center min-w-0">
              <span className="text-primary font-medium flex items-center justify-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-xs truncate max-w-full" title={leg.train}>
                <TrainIcon name={leg.train} />
                <span className="truncate">{leg.train}</span>
              </span>
            </div>
            <div className="text-muted-foreground/50 text-center">➔</div>
            <div className="font-bold text-foreground truncate" title={leg.to}>{leg.to}</div>
            <div className="text-muted-foreground font-mono text-xs bg-muted/50 px-3 py-1 rounded-md whitespace-nowrap text-right justify-self-end">
              {leg.duration}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TrainIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();

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

  if (lower.includes("airline") || lower.includes("air")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-muted-foreground" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    );
  }

  if (lower.includes("walk")) {
    return (
      <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-muted-foreground">
        <circle cx="13" cy="4" r="2"/><path d="m7.5 16 1-4 4 1 2-3"/><path d="m10.5 21 1.5-5"/><path d="m16 21-2-5"/>
      </svg>
    );
  }

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
