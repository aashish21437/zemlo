"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { bulkRegisterVehicles } from '../actions';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, ArrowLeft, Database, Download, Car } from 'lucide-react';
import Link from 'next/link';

const CSV_HEADERS = [
  "vehicleType", "vendorName", "city", "contactEmail", "contactPhone",
  "fix10Hours", "fix12Hours", "airportTransfer", "stationTransfer", "hourlyOvertime"
];

const SAMPLE_ROWS = [
  ["ALPHARD PVT", "MK TAXI", "TOKYO", "booking@mktaxi.com", "+81-3-5555-1234", "90000", "105000", "45000", "30000", "12000"],
  ["HIACE PVT",   "KINKI TOURIST", "OSAKA", "reserve@kinki.co.jp", "+81-6-4444-5678", "70000", "82000", "38000", "25000", "9000"],
];

export default function VehicleBulkPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const downloadTemplate = () => {
    const csvContent = [CSV_HEADERS, ...SAMPLE_ROWS].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "vehicle_pricing_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setData(results.data),
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    const res = await bulkRegisterVehicles(data);
    if (res.success) {
      router.push('/vehicle');
    } else {
      alert(res.error || "Error during bulk registration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-12">
      <div className="max-w-7xl mx-auto">

        {/* Top Nav */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/vehicle" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all">
            <ArrowLeft size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Back to Vehicles</span>
          </Link>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-5 py-2 border border-foreground/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <Download size={14} /> Download Template
          </button>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Bulk Vehicle <span className="text-muted-foreground not-italic font-light">Pricing Import</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium italic text-sm">
            Upload a CSV to batch-register pricing configurations. Each row gets a unique <span className="font-black text-foreground not-italic">VP-XXXXX</span> ID automatically.
          </p>
        </header>

        {/* CSV columns reference */}
        <div className="mb-8 p-5 bg-muted/10 border border-border rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Required CSV Columns</p>
          <div className="flex flex-wrap gap-2">
            {CSV_HEADERS.map(h => (
              <span key={h} className="px-3 py-1 bg-foreground text-background text-[10px] font-black font-mono rounded-full">{h}</span>
            ))}
          </div>
        </div>

        {/* Upload or Preview */}
        {data.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-[3rem] p-24 text-center">
            <div className="max-w-sm mx-auto space-y-6">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Upload size={40} />
              </div>
              <h2 className="text-xl font-bold uppercase">Select CSV File</h2>
              <p className="text-sm text-muted-foreground">Download the template above, fill in your vehicle pricing data, then upload it here.</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFilePreview}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-foreground file:text-background cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-4xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/10">
                <h3 className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                  <Car size={16} /> Data Preview — {data.length} records
                </h3>
                <button onClick={() => setData([])} className="text-[10px] font-black uppercase text-red-500 hover:underline">
                  Clear & Start Over
                </button>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-card border-b border-border z-10">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <th className="p-4">#</th>
                      <th className="p-4">Vehicle Type</th>
                      <th className="p-4">Vendor</th>
                      <th className="p-4">City</th>
                      <th className="p-4 text-right">10HR</th>
                      <th className="p-4 text-right">12HR</th>
                      <th className="p-4 text-right">Airport</th>
                      <th className="p-4 text-right">Station</th>
                      <th className="p-4 text-right">Overtime/hr</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-muted/5 transition-colors text-sm">
                        <td className="p-4 font-mono text-muted-foreground text-xs">{i + 1}</td>
                        <td className="p-4 font-bold uppercase">
                          {row.vehicleType || <span className="text-red-500 italic">Missing</span>}
                        </td>
                        <td className="p-4 font-medium uppercase">{row.vendorName}</td>
                        <td className="p-4 text-muted-foreground">{row.city}</td>
                        <td className="p-4 font-mono font-bold text-right">¥{Number(row.fix10Hours || 0).toLocaleString()}</td>
                        <td className="p-4 font-mono font-bold text-right">¥{Number(row.fix12Hours || 0).toLocaleString()}</td>
                        <td className="p-4 font-mono font-bold text-right">¥{Number(row.airportTransfer || 0).toLocaleString()}</td>
                        <td className="p-4 font-mono font-bold text-right">¥{Number(row.stationTransfer || 0).toLocaleString()}</td>
                        <td className="p-4 font-mono font-bold text-right">¥{Number(row.hourlyOvertime || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Confirm Footer */}
            <div className="flex items-center justify-between bg-foreground text-background p-8 rounded-4xl shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-background/20 rounded-xl">
                  <Database size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Ready to Deploy</p>
                  <p className="text-sm font-bold italic">{data.length} records will be assigned sequential VP-XXXXX IDs.</p>
                </div>
              </div>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="bg-background text-foreground px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? "Processing..." : (
                  <>
                    <CheckCircle size={16} />
                    Confirm & Register
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
