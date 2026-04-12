"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { registerAgent, getAgentById, updateAgent } from '@/app/qreg/actions'; 
import { ChevronLeft, Building2, User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

// Explicitly define the Agent shape for TypeScript
interface AgentData {
  _id: string;
  companyName?: string;
  agentName?: string;
  email?: string;
  phone?: string;
  address?: string;
  agentNumber?: string;
}

export default function AgentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [formData, setFormData] = useState({
    company: '',
    agentName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    async function loadAgent() {
      if (isNew) {
        setFetching(false);
        return;
      }

      if (id) {
        setFetching(true);
        try {
          // Cast to any to bypass strict property checks during the Vercel build
          const currentAgent = await getAgentById(id) as any;
          
          if (currentAgent) {
            setFormData({
              company: currentAgent.companyName || '',
              agentName: currentAgent.agentName || '',
              email: currentAgent.email || '',
              phone: currentAgent.phone || '',
              address: currentAgent.address || '',
            });
          }
        } catch (error) {
          console.error("Error loading agent:", error);
        } finally {
          setFetching(false);
        }
      }
    }
    loadAgent();
  }, [id, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const res = isNew ? await registerAgent(data) : await updateAgent(id, data);
      
      setLoading(false);
      if (res?.success) {
        alert("Agent saved successfully!");
        router.push('/qreg');
      } else {
        alert(res?.error || "Error saving agent");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("An unexpected error occurred while saving.");
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-[#0070d2]" size={40} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="flex justify-between items-center py-6 mb-10 border-b border-zinc-200">
        <button onClick={() => router.push('/qreg')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors">
          <ChevronLeft size={16} /> Back to Registry
        </button>
        <button 
          type="submit" 
          form="agentForm" 
          disabled={loading}
          className="bg-[#0070d2] text-white px-10 py-2.5 rounded-md text-xs font-bold hover:bg-[#005fb2] disabled:opacity-50 transition-all shadow-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Agent"}
        </button>
      </header>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-zinc-50/50 border-b border-zinc-200">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Account Information</h2>
        </div>
        
        <form id="agentForm" onSubmit={handleSave} className="divide-y divide-zinc-100">
          <div className="grid grid-cols-3 items-center p-6 gap-6">
            <label className="text-sm font-medium text-zinc-600 flex items-center gap-2"><Building2 size={14}/> Company Name</label>
            <input 
              required 
              value={formData.company} 
              onChange={e => setFormData({...formData, company: e.target.value})} 
              className="col-span-2 bg-zinc-50 border border-zinc-200 rounded-md py-2 px-4 text-sm outline-none focus:bg-white focus:border-[#0070d2] uppercase font-bold" 
            />
          </div>

          <div className="grid grid-cols-3 items-center p-6 gap-6">
            <label className="text-sm font-medium text-zinc-600 flex items-center gap-2"><User size={14}/> Contact Person</label>
            <input 
              required 
              value={formData.agentName} 
              onChange={e => setFormData({...formData, agentName: e.target.value})} 
              className="col-span-2 bg-zinc-50 border border-zinc-200 rounded-md py-2 px-4 text-sm outline-none focus:bg-white focus:border-[#0070d2]" 
            />
          </div>

          <div className="grid grid-cols-3 items-center p-6 gap-6">
            <label className="text-sm font-medium text-zinc-600 flex items-center gap-2"><Mail size={14}/> Business Email</label>
            <input 
              required 
              type="email"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="col-span-2 bg-zinc-50 border border-zinc-200 rounded-md py-2 px-4 text-sm outline-none focus:bg-white focus:border-[#0070d2]" 
            />
          </div>

          <div className="grid grid-cols-3 items-center p-6 gap-6">
            <label className="text-sm font-medium text-zinc-600 flex items-center gap-2"><Phone size={14}/> Contact Number</label>
            <input 
              required 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              className="col-span-2 bg-zinc-50 border border-zinc-200 rounded-md py-2 px-4 text-sm outline-none focus:bg-white focus:border-[#0070d2]" 
            />
          </div>

          <div className="grid grid-cols-3 items-start p-6 gap-6">
            <label className="text-sm font-medium text-zinc-600 mt-2 flex items-center gap-2"><MapPin size={14}/> Office Address</label>
            <textarea 
              required 
              rows={3}
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              className="col-span-2 bg-zinc-50 border border-zinc-200 rounded-md py-2 px-4 text-sm outline-none focus:bg-white focus:border-[#0070d2] resize-none" 
            />
          </div>
        </form>
      </div>
    </div>
  );
}