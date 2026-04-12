"use client"

import React, { useState } from 'react';
import { registerAgent } from '@/app/qreg/actions';
import { User, Building2, Mail, Phone, MapPin, Loader2, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';

export function AgentForm({ onRefresh }: { onRefresh: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean, agentNumber?: string, error?: string} | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const response = await registerAgent(new FormData(e.currentTarget));
    setLoading(false);
    setResult(response);

    if (response.success) {
      onRefresh(); // Refresh the table data
      setTimeout(() => {
        setIsModalOpen(false);
        setResult(null);
      }, 2000);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95"
      >
        <Plus size={18} /> Register Agent
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-background border border-border rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 p-2 rounded-full hover:bg-zinc-500/10"><X size={20} className="opacity-50" /></button>
            
            {result?.success ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 size={64} className="mx-auto text-emerald-500 animate-bounce" />
                <h2 className="text-3xl font-serif font-bold text-foreground">Agent {result.agentNumber} Registered</h2>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">New Registration</h2>
                {result?.error && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/20">{result.error}</div>}
                <input required name="company" className="w-full bg-zinc-500/5 border border-border rounded-xl py-3 px-4 outline-none focus:border-foreground" placeholder="Company Name" />
                <input required name="agentName" className="w-full bg-zinc-500/5 border border-border rounded-xl py-3 px-4 outline-none focus:border-foreground" placeholder="Agent Name" />
                <div className="grid grid-cols-2 gap-4">
                    <input required type="email" name="email" className="w-full bg-zinc-500/5 border border-border rounded-xl py-3 px-4 outline-none text-sm" placeholder="Email" />
                    <input required type="tel" name="phone" className="w-full bg-zinc-500/5 border border-border rounded-xl py-3 px-4 outline-none text-sm" placeholder="Phone" />
                </div>
                <textarea required name="address" rows={2} className="w-full bg-zinc-500/5 border border-border rounded-xl py-3 px-4 outline-none text-sm resize-none" placeholder="Address" />
                <button disabled={loading} className="w-full py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all flex justify-center">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Registration"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}