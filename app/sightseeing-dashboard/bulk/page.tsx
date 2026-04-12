"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { bulkRegisterSightseeings } from '../actions';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, ArrowLeft, Database, Download } from 'lucide-react';
import Link from 'next/link';

export default function BulkRegistrationPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- FEATURE: DOWNLOAD TEMPLATE ---
  const downloadTemplate = () => {
    const headers = ["name_en", "category_primary", "municipality", "adult_price"];
    const sampleData = [
      ["Example Temple", "Temple", "Kyoto", "500"],
      ["Example Sky Tower", "Modern", "Tokyo", "2200"]
    ];
    
    // Combine headers and sample data into CSV format
    const csvContent = [headers, ...sampleData].map(e => e.join(",")).join("\n");
    
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sightseeing_bulk_template.csv");
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
      complete: (results) => {
        setData(results.data);
      }
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    const res = await bulkRegisterSightseeings(data);
    if (res.success) {
      router.push('/sightseeing-dashboard');
    } else {
      alert("Error during registration");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Template Download */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/sightseeing-dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all">
            <ArrowLeft size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
          </Link>

          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-5 py-2 border border-foreground/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            <Download size={14} />
            Download Template
          </button>
        </div>

        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Bulk Registration <span className="text-muted-foreground not-italic font-light">Console</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Preview and validate your dataset before pushing to Master Engine.</p>
        </header>

        {/* UPLOAD BOX OR PREVIEW TABLE LOGIC */}
        {data.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-[3rem] p-24 text-center">
             {/* ... existing upload box code ... */}
             <div className="max-w-sm mx-auto space-y-6">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Upload size={40} />
              </div>
              <h2 className="text-xl font-bold uppercase">Select CSV File</h2>
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
            {/* ... existing preview table code ... */}
            <div className="bg-card border border-border rounded-4xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/10">
                <h3 className="font-black uppercase text-xs tracking-[0.2em]">Data Preview ({data.length} records)</h3>
                <button onClick={() => setData([])} className="text-[10px] font-black uppercase text-red-500 hover:underline">Clear & Start Over</button>
              </div>
              <div className="overflow-x-auto max-h-125">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-card border-b border-border z-10">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <th className="p-6">Name</th>
                      <th className="p-6">Category</th>
                      <th className="p-6">Municipality</th>
                      <th className="p-6">Adult Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/5 transition-colors">
                        <td className="p-6 font-bold">{row.name_en || <span className="text-red-500 underline italic">Missing</span>}</td>
                        <td className="p-6 uppercase text-[10px] font-black tracking-widest opacity-60">{row.category_primary}</td>
                        <td className="p-6 text-sm italic">{row.municipality}</td>
                        <td className="p-6 font-mono font-bold">¥{row.adult_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-between bg-foreground text-background p-8 rounded-4xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-4">
                <div className="p-3 bg-background/20 rounded-xl">
                  <Database size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Ready to Deploy</p>
                  <p className="text-sm font-bold italic">{data.length} sightseeings will be assigned sequential IDs.</p>
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