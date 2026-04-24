"use server";

import * as cheerio from "cheerio";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type RouteSegment = {
  id: string;
  type: "departure" | "train" | "transfer" | "arrival";
  stationName?: string;
  time?: string;        // e.g. "6 Min" or "137 Min"
  trainName?: string;   // e.g. "Shinkansen Nozomi Exp."
  duration?: string;    // e.g. "[131 Min]"
  fare?: string;        // e.g. "¥8,360"
  seatFee?: string;     // e.g. "Reserved seat: ¥5,810"
  seatOptions?: { name: string; price: string; isSelected: boolean }[]; // Full list of available seats
};

export type RouteData = {
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
};

export type SearchParams = {
  from: string;
  to: string;
};

// ─── RATE LIMITING (in-memory, resets each hour) ──────────────────────────────

let requestCount = 0;
let lastResetTime = Date.now();
const MAX_REQUESTS_PER_HOUR = 10;

function checkRateLimit(): { allowed: boolean; remaining: number } {
  const now = Date.now();
  if (now - lastResetTime > 3_600_000) {
    requestCount = 0;
    lastResetTime = now;
  }
  if (requestCount >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }
  requestCount++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - requestCount };
}

// ─── MAIN SEARCH ──────────────────────────────────────────────────────────────

export async function searchHyperdia(params: SearchParams): Promise<{
  success: boolean;
  routes?: RouteData[];
  error?: string;
  remaining?: number;
  debugHtml?: string;
}> {
  const rateCheck = checkRateLimit();
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: "Rate limit exceeded (max 10/hour). Please wait before searching again.",
      remaining: 0,
    };
  }

  try {
    // ── Build POST form body (matched to actual network capture) ───────
    const form = new URLSearchParams();
    form.append("dep_node", params.from.toUpperCase());
    form.append("arv_node", params.to.toUpperCase());
    form.append("via_node01", "");
    form.append("via_node02", "");
    form.append("via_node03", "");
    // Hardcoded to Sep 2023 — Hyperdia's timetable DB only has this era of data
    form.append("year", "2023");
    form.append("month", "09");
    form.append("day", "01");
    form.append("hour", "09");
    form.append("minute", "00");
    // "2" is the "Average" search type which works best for generic queries
    form.append("search_type", "2");
    form.append("search_way", "");
    form.append("transtime", "undefined");
    form.append("sort", "0");
    form.append("max_route", "5");
    form.append("faretype", "0");
    form.append("ship", "off");
    form.append("lmlimit", "null");
    form.append("search_target", "route");
    form.append("facility", "reserved");
    form.append("sum_target", "7");
    form.append("_", "");

    // ── Headers (matched to actual network capture — AJAX request) ────
    const headers: Record<string, string> = {
      "Host": "www.hyperdia.com",
      "Origin": "https://www.hyperdia.com",
      "Referer": `https://www.hyperdia.com/cgi/en/search.html?dep_node=${encodeURIComponent(params.from.toUpperCase())}&arv_node=${encodeURIComponent(params.to.toUpperCase())}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "text/javascript, text/html, application/xml, text/xml, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "X-Prototype-Version": "1.5.1",
      "X-Requested-With": "XMLHttpRequest",
    };

    // ── Step 1: Hit landing page for session cookies ──────────────────
    try {
      const landing = await fetch("https://www.hyperdia.com/en/", {
        headers: { "User-Agent": headers["User-Agent"] },
        cache: "no-store",
      });
      const setCookies = landing.headers.getSetCookie?.() || [];
      if (setCookies.length > 0) {
        headers["Cookie"] = setCookies
          .map((c) => c.split(";")[0].trim())
          .join("; ");
      } else {
        // Fallback for environments without getSetCookie
        const rawCookie = landing.headers.get("set-cookie");
        if (rawCookie) {
          headers["Cookie"] = rawCookie
            .split(",")
            .map((c) => c.split(";")[0].trim())
            .join("; ");
        }
      }
    } catch {
      // Continue without cookies if landing page fails
    }

    // ── Step 2: POST to CGI endpoint ──────────────────────────────────
    const response = await fetch(
      "https://www.hyperdia.com/cgi/search/en/hyperdia2.cgi",
      {
        method: "POST",
        headers,
        body: form.toString(),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Hyperdia returned HTTP ${response.status}`);
    }

    const html = await response.text();

    // ── Step 3: Parse HTML ────────────────────────────────────────────
    const routes = parseHyperdiaHtml(html);

    if (routes.length === 0) {
      return {
        success: true,
        routes: [],
        remaining: rateCheck.remaining,
        debugHtml: html.substring(0, 3000),
      };
    }

    return { success: true, routes, remaining: rateCheck.remaining };
  } catch (err: any) {
    console.error("searchHyperdia error:", err);
    return {
      success: false,
      error: err.message || "Failed to reach Hyperdia",
      remaining: rateCheck.remaining,
    };
  }
}

// ─── HTML PARSER (based on actual Hyperdia response structure) ─────────────────

function parseHyperdiaHtml(html: string): RouteData[] {
  const $ = cheerio.load(html);
  const routes: RouteData[] = [];

  // Each route starts with a <div class="title2"> block
  const titleBlocks = $("div.title2");

  titleBlocks.each((idx, titleEl) => {
    const $title = $(titleEl);

    // ── Extract route summary from title_r ─────────────────────────
    const $titleR = $title.find(".title_r");
    const titleText = $titleR.text();

    // Extract values from the text_blue spans
    const blueSpans = $titleR.find(".text_blue");
    const blueValues: string[] = [];
    blueSpans.each((_, span) => {
      blueValues.push($(span).text().trim());
    });

    // Pattern: [totalTime, transfers, distance, total, fare, seatFee, ...]
    const totalTime = blueValues[0] ? `${blueValues[0]} Minutes` : "—";
    const transfers = blueValues[1] ? parseInt(blueValues[1]) : 0;
    const distance = blueValues[2] ? `${blueValues[2]} km` : "—";

    // Fare info from specific IDs
    const totalPrice = $titleR.find(`[id="fare_total${idx + 1}"]`).text().trim();
    const fare = $titleR.find(`[id="fare_unqin${idx + 1}"]`).text().trim();
    const seatFee = $titleR.find(`[id="fare_ryokin${idx + 1}"]`).text().trim();

    // ── Parse the route table (next sibling div.keiro) ─────────────
    const $keiro = $title.next("div.keiro");
    const segments: RouteSegment[] = [];

    if ($keiro.length > 0) {
      const $table = $keiro.find("table.table");
      const rows = $table.find("tr");

      rows.each((rIdx, row) => {
        const $row = $(row);
        const cells = $row.find("td");
        if (cells.length < 2) return; // Skip header rows with <th>

        // Check for header rows (th class)
        if ($row.find("td.th, td.th2").length > 0) return;

        // Get the first cell (Time column)
        const timeText = $(cells[0]).text().trim();

        // Determine row type by checking for specific images
        const imgAlt = $row.find("img").first().attr("alt") || "";

        if (imgAlt === "begin") {
          // DEPARTURE STATION
          const stationName = $row.find(".text_16").text().trim();
          segments.push({
            id: `r${idx}_s${segments.length}`,
            type: "departure",
            stationName,
            time: timeText.replace(/\s+/g, " "),
          });
        } else if (imgAlt === "end") {
          // ARRIVAL STATION
          const stationName = $row.find(".text_16").text().trim();
          segments.push({
            id: `r${idx}_s${segments.length}`,
            type: "arrival",
            stationName,
            time: timeText.replace(/\s+/g, " "),
          });
        } else if (imgAlt === "transfer") {
          // TRANSFER STATION
          const stationName = $row.find(".text_16").text().trim();
          segments.push({
            id: `r${idx}_s${segments.length}`,
            type: "transfer",
            stationName,
            time: timeText.replace(/\s+/g, " "),
          });
        } else if (imgAlt === "through" || $row.find("ul.track").length > 0) {
          // TRAIN LINE ROW
          const trainName = $row.find("ul.track span").text().trim();
          const duration = timeText; // e.g. "[131 Min]"

          // Extract fare from fare_r div
          const fareText = $row.find(".fare_r").text().trim();

          // Extract seat fee from select (selected option) and all options
          let seatFeeText = "";
          const seatOptions: { name: string; price: string; isSelected: boolean }[] = [];
          
          const $select = $row.find("select");
          if ($select.length > 0) {
            $select.find("option").each((_, opt) => {
              const text = $(opt).text().trim().replace(/\s+/g, " ");
              const isSelected = $(opt).attr("selected") !== undefined;
              
              // Hyperdia option format: "Reserved seat: ¥5,810" or just "Green seat: ¥10,680"
              const [name, price] = text.split(":");
              
              seatOptions.push({
                name: name ? name.trim() : text,
                price: price ? price.trim() : "",
                isSelected
              });
              
              if (isSelected) {
                seatFeeText = text;
              }
            });
            
            // If no option had 'selected' attribute explicitly, default to the first one
            if (seatFeeText === "" && seatOptions.length > 0) {
              seatOptions[0].isSelected = true;
              seatFeeText = seatOptions[0].name + (seatOptions[0].price ? ": " + seatOptions[0].price : "");
            }
          }

          segments.push({
            id: `r${idx}_s${segments.length}`,
            type: "train",
            trainName: trainName || undefined,
            duration: duration || undefined,
            fare: fareText || undefined,
            seatFee: seatFeeText || undefined,
            seatOptions: seatOptions.length > 0 ? seatOptions : undefined,
          });
        }
      });
    }

    const parsePrice = (str: string) => {
      const match = str.replace(/,/g, "").match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const ticketFareNum = parsePrice(fare || "0");
    let stdSeatFeeNum = 0;
    let greenSeatFeeNum = 0;

    segments.forEach((seg) => {
      if (seg.type === "train") {
        let stdPrice = 0;
        let greenPrice = 0;

        if (seg.seatOptions && seg.seatOptions.length > 0) {
          const stdOpt = seg.seatOptions.find(
            (o) => o.name.toLowerCase().includes("reserved") && !o.name.toLowerCase().includes("unreserved")
          ) || seg.seatOptions[0];

          const greenOpt = seg.seatOptions.find((o) => o.name.toLowerCase().includes("green")) || stdOpt;

          stdPrice = parsePrice(stdOpt.price);
          greenPrice = parsePrice(greenOpt.price);
        } else if (seg.seatFee) {
          stdPrice = parsePrice(seg.seatFee);
          greenPrice = stdPrice;
        }

        stdSeatFeeNum += stdPrice;
        greenSeatFeeNum += greenPrice;
      }
    });

    const standardTotal = `¥${(ticketFareNum + stdSeatFeeNum).toLocaleString()}`;
    const greenTotal = `¥${(ticketFareNum + greenSeatFeeNum).toLocaleString()}`;

    routes.push({
      id: `route_${idx + 1}`,
      totalTime,
      transfers,
      fare: fare ? `¥${fare}` : "—",
      seatFee: seatFee ? `¥${seatFee}` : "—",
      totalPrice: totalPrice ? `¥${totalPrice}` : "—",
      distance,
      standardTotal,
      greenTotal,
      segments,
    });
  });

  return routes;
}
