import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { getVehicles } from './actions';
import { Car, Building2, MapPin, Hash } from 'lucide-react';

export default async function VehicleDashboard() {
  const vehicles = await getVehicles();

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-12 border-b border-border pb-8 mt-12">
          <div>
            <h1 className="text-4xl font-black font-sans uppercase italic tracking-tighter">
              Vehicle <span className="text-muted-foreground not-italic font-sans font-light">Fleet & Pricing</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-medium italic text-sm">
              {vehicles.length} pricing configurations synced to Master Engine
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/vehicle/bulk"
              className="px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] border border-foreground hover:bg-muted/10 transition-all"
            >
              Bulk Upload
            </Link>
            <Link
              href="/vehicle/new"
              className="bg-foreground text-background px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] border border-foreground hover:opacity-90 transition-all shadow-sm"
            >
              + Register Pricing
            </Link>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-card border border-border rounded-4xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-32">ID</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Type</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vendor</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pricing City</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">10HR Price</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Airport T/F</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vehicles.map((v: any) => (
                  <tr key={v._id} className="hover:bg-muted/10 transition-colors group">
                    {/* UNIQUE PRICING ID */}
                    <td className="p-6">
                      <span className="font-mono text-xs font-black text-muted-foreground flex items-center gap-1.5">
                        <Hash size={11} />{v.pricing_id || '—'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-base uppercase tracking-tight flex items-center gap-2">
                        <Car size={15} className="text-muted-foreground" /> {v.vehicleType}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-sm uppercase flex items-center gap-2">
                        <Building2 size={14} className="text-muted-foreground" /> {v.vendorName}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-bold flex items-center gap-2 px-3 py-1 bg-muted/20 w-fit rounded border border-border">
                        <MapPin size={14} className="text-muted-foreground" /> {v.city || 'ANY'}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-right font-mono">
                      ¥{v.prices?.fix10Hours?.toLocaleString() || '0'}
                    </td>
                    <td className="p-6 font-bold text-right font-mono">
                      ¥{v.prices?.airportTransfer?.toLocaleString() || '0'}
                    </td>
                    <td className="p-6 text-right">
                      <Link
                        href={`/vehicle/${v._id}`}
                        className="px-4 py-2 bg-foreground/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-foreground/10 hover:bg-foreground/10 transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {vehicles.length === 0 && (
            <div className="p-20 text-center">
              <div className="text-muted-foreground font-bold italic uppercase tracking-widest text-xs opacity-40">
                No Vehicle Records Found
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
