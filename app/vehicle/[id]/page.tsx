"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Save, Trash2, Car, Building2, MapPin, Phone, Mail, DollarSign, Hash } from 'lucide-react';
import { registerVehicle, updateVehicle, getVehicleById, deleteVehicle } from '../actions';

const VEHICLE_TYPES = [
  "ALPHARD PVT", "HIACE PVT", "MICROBUS", "COASTER BUS", "MINI BUS", "COACH", 
  "LARGE COACH", "MEGA COACH", "LUXURY SEDAN", "OTHER"
];

export default function VehicleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  
  const [pricingId, setPricingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    vehicleType: 'ALPHARD PVT',
    vendorName: '',
    city: '',
    contactPhone: '',
    contactEmail: '',
    fix10Hours: 0,
    fix12Hours: 0,
    airportTransfer: 0,
    stationTransfer: 0,
    hourlyOvertime: 0,
  });

  useEffect(() => {
    async function loadData() {
      if (isNew) {
        setFetching(false);
        return;
      }
      if (id) {
        setFetching(true);
        const data = await getVehicleById(id as string);
        if (data) {
          setPricingId((data as any).pricing_id || null);
          setFormData({
            vehicleType: data.vehicleType || 'ALPHARD PVT',
            vendorName: data.vendorName || '',
            city: data.city || '',
            contactPhone: data.contactPhone || '',
            contactEmail: data.contactEmail || '',
            fix10Hours: data.prices?.fix10Hours || 0,
            fix12Hours: data.prices?.fix12Hours || 0,
            airportTransfer: data.prices?.airportTransfer || 0,
            stationTransfer: data.prices?.stationTransfer || 0,
            hourlyOvertime: data.prices?.hourlyOvertime || 0,
          });
        }
        setFetching(false);
      }
    }
    loadData();
  }, [id, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value != null ? String(value) : '');
      });

      const res = isNew ? await registerVehicle(dataToSend) : await updateVehicle(id as string, dataToSend);
      
      setLoading(false);
      if (res?.success) {
        alert("Vehicle Pricing saved successfully!");
        router.push('/vehicle');
      } else {
        alert(res?.error || "An error occurred");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Unexpected error occurred while saving.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this vehicle record?")) return;
    setLoading(true);
    try {
      const res = await deleteVehicle(id as string);
      setLoading(false);
      if (res?.success) {
        router.push('/vehicle');
      } else {
        alert(res?.error || "Error deleting record");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error deleting record");
    }
  };

  if (fetching) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-foreground" size={40} /></div>;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 font-sans text-foreground">
      <header className="flex justify-between items-center py-4 border-b border-border mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/vehicle')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ChevronLeft size={16} /> Back to Vehicles
          </button>
          {pricingId && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-muted/20 border border-border rounded-full font-mono text-xs font-black">
              <Hash size={11} /> {pricingId}
            </span>
          )}
          {isNew && (
            <span className="px-3 py-1 bg-muted/20 border border-dashed border-border rounded-full font-mono text-xs font-black text-muted-foreground">
              ID auto-assigned on save
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!isNew && (
            <button type="button" onClick={handleDelete} disabled={loading} className="px-4 py-2 text-red-600 border border-red-200 bg-red-50 rounded-md text-xs font-bold hover:bg-red-100 flex items-center gap-2">
              <Trash2 size={14} /> Delete
            </button>
          )}

          <button type="submit" form="vehicleForm" disabled={loading} className="px-10 py-2.5 bg-foreground text-background rounded-md text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Record
          </button>
        </div>
      </header>

      <form id="vehicleForm" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Core Details */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 bg-muted/20 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Fleet & Vendor Profile
             </div>
             <div className="p-6 flex flex-col gap-5">
                
                {/* Vehicle Type */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Car size={14} /> Vehicle Category
                  </label>
                  <select 
                    value={formData.vehicleType} 
                    onChange={e => setFormData({...formData, vehicleType: e.target.value})} 
                    className="w-full bg-background border border-border rounded-md py-2.5 px-3 text-sm font-bold uppercase outline-none focus:border-primary"
                  >
                    {VEHICLE_TYPES.map(vt => <option key={vt} value={vt}>{vt}</option>)}
                  </select>
                </div>

                {/* Vendor Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Building2 size={14} /> Transportation Vendor
                  </label>
                  <input 
                    required 
                    placeholder="e.g. TOKYO MK TAXI"
                    value={formData.vendorName} 
                    onChange={e => setFormData({...formData, vendorName: e.target.value})} 
                    className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm font-bold uppercase outline-none focus:border-primary placeholder:text-muted-foreground/30" 
                  />
                </div>

                {/* City Location */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin size={14} /> Primary City / Base
                  </label>
                  <input 
                    required 
                    placeholder="e.g. TOKYO / OSAKA"
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                    className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm font-bold uppercase outline-none focus:border-primary placeholder:text-muted-foreground/30" 
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Mail size={14} /> Reservation Email
                  </label>
                  <input 
                    type="email"
                    placeholder="booking@vendor.com"
                    value={formData.contactEmail} 
                    onChange={e => setFormData({...formData, contactEmail: e.target.value})} 
                    className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground/30" 
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Phone size={14} /> Emergency Phone
                  </label>
                  <input 
                    placeholder="+81-3-1234-5678"
                    value={formData.contactPhone} 
                    onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
                    className="w-full bg-background border border-border rounded-md py-2 px-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground/30 font-mono" 
                  />
                </div>

             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pricing Model */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 bg-muted/20 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                <span>Standardized Pricing Tiers</span>
                <span>Values IN JPY (¥)</span>
             </div>
             <div className="p-6 flex flex-col gap-6 divide-y divide-border">
                
                {/* 10 HRS FIX */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2"><DollarSign size={16} className="text-muted-foreground"/> 10 Hours Fix</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Standard Full Day Block</p>
                  </div>
                  <input 
                    type="number" required 
                    value={formData.fix10Hours} 
                    onChange={e => setFormData({...formData, fix10Hours: Number(e.target.value)})} 
                    className="w-32 bg-background border-2 border-border rounded-md py-2 px-3 text-lg font-black font-mono text-right outline-none focus:border-primary" 
                  />
                </div>

                {/* 12 HRS FIX */}
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2"><DollarSign size={16} className="text-muted-foreground"/> 12 Hours Fix</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Extended Full Day Block</p>
                  </div>
                  <input 
                    type="number" required 
                    value={formData.fix12Hours} 
                    onChange={e => setFormData({...formData, fix12Hours: Number(e.target.value)})} 
                    className="w-32 bg-background border-2 border-border rounded-md py-2 px-3 text-lg font-black font-mono text-right outline-none focus:border-primary" 
                  />
                </div>

                {/* AIRPORT */}
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2"><DollarSign size={16} className="text-muted-foreground"/> Airport Transfer</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">One-Way Drop/Pickup (NRT/HND/KIX)</p>
                  </div>
                  <input 
                    type="number" required 
                    value={formData.airportTransfer} 
                    onChange={e => setFormData({...formData, airportTransfer: Number(e.target.value)})} 
                    className="w-32 bg-background border-2 border-border rounded-md py-2 px-3 text-lg font-black font-mono text-right outline-none focus:border-primary" 
                  />
                </div>

                {/* STATION */}
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2"><DollarSign size={16} className="text-muted-foreground"/> Station Transfer</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Bullet Train Transfers</p>
                  </div>
                  <input 
                    type="number" required 
                    value={formData.stationTransfer} 
                    onChange={e => setFormData({...formData, stationTransfer: Number(e.target.value)})} 
                    className="w-32 bg-background border-2 border-border rounded-md py-2 px-3 text-lg font-black font-mono text-right outline-none focus:border-primary" 
                  />
                </div>

                {/* OVERTIME */}
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2"><DollarSign size={16} className="text-muted-foreground"/> Hourly Overtime</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Cost Per Extra Hour</p>
                  </div>
                  <input 
                    type="number" required 
                    value={formData.hourlyOvertime} 
                    onChange={e => setFormData({...formData, hourlyOvertime: Number(e.target.value)})} 
                    className="w-32 bg-background border-2 border-border rounded-md py-2 px-3 text-lg font-black font-mono text-right outline-none focus:border-primary" 
                  />
                </div>

             </div>
          </div>
        </div>

      </form>
    </div>
  );
}
