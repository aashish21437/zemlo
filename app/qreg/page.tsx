"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAgents } from '@/app/qreg/actions';
import { Plus, Search, Building2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


export default function AgentRegistryPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const data = await getAgents();
      setAgents(data);
      setLoading(false);
    }
    init();
  }, []);

  return (
    
    <div className="max-w-screen-2xl mx-auto">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black font-sans tracking-tight text-zinc-900">Agent Registry</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Manage your partner companies and contact persons.</p>
        </div>
        
        {/* The Button to lead to the new page */}
        <Button asChild className="rounded-md px-6 py-2.5 text-xs font-bold shadow-sm">
          <Link href="/qreg/agent/new">
            <Plus size={16} /> Register Agent
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-300" /></div>
      ) : (
        <Card className="border-none rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Company Code</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Company Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Contact Person</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {agents.map((agent) => (

                
// Inside your agents.map((agent) => ( ... ))

<tr key={agent._id} className="hover:bg-zinc-50/50 transition-colors group">
  <td className="px-6 py-4 text-sm font-mono font-bold text-zinc-400">
    {agent.agentNumber}
  </td>
  
  {/* CLICKABLE COMPANY NAME */}
  <td className="px-6 py-4">
    <Link 
      href={`/qreg/agent/${agent.agentNumber}`} 
      className="text-sm font-bold text-[#0070d2] hover:underline uppercase tracking-tight"
    >
      {agent.companyName}
    </Link>
  </td>

  <td className="px-6 py-4 text-sm text-zinc-600 font-medium">
    {agent.agentName}
  </td>
  
  <td className="px-6 py-4 text-sm text-zinc-500">
    {agent.email}
  </td>

  <td className="px-6 py-4 text-right">
    <Button asChild variant="secondary" size="xs" className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase">
      <Link href={`/qreg/agent/${agent.agentNumber}`}>
        Edit
      </Link>
    </Button>
  </td>
</tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}