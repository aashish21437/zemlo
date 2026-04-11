"use client"

import React from 'react';

interface Agent {
  _id: string;
  agentNumber: string;
  companyName: string;
  agentName: string;
  email: string;
  phone: string;
  address: string;
}

export function AgentTable({ agents }: { agents: Agent[] }) {
  return (
    <section className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-500/5 border-b border-border">
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50">ID</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Company</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Agent</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Email</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Phone</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 font-sans">
            {agents.map((agent) => (
              <tr key={agent._id} className="hover:bg-zinc-500/[0.03] transition-colors group">
                <td className="px-4 py-4 font-mono text-xs font-bold text-foreground/40 group-hover:text-foreground">{agent.agentNumber}</td>
                <td className="px-4 py-4 text-sm font-bold">{agent.companyName}</td>
                <td className="px-4 py-4 text-sm opacity-80">{agent.agentName}</td>
                <td className="px-4 py-4 text-xs font-medium opacity-60">{agent.email}</td>
                <td className="px-4 py-4 text-xs font-medium opacity-60">{agent.phone}</td>
                <td className="px-4 py-4 text-[11px] opacity-40 truncate max-w-[200px]">{agent.address}</td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center text-sm text-muted-foreground italic">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}