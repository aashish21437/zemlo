"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { getPermissionMatrix, togglePermission } from './actions';
import { ALL_ROLES, FEATURE_GROUPS } from "@/lib/permission-config";
import { Shield, Check, Lock, ArrowLeft, Loader2, Car, Users, Map, Camera, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PermissionsMatrix() {
  const [matrix, setMatrix] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  // Navigation State
  const [activeGroupId, setActiveGroupId] = useState(FEATURE_GROUPS[0].id);

  useEffect(() => {
    loadMatrix();
  }, []);

  async function loadMatrix() {
    try {
      const data = await getPermissionMatrix();
      setMatrix(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = async (featureKey: string, role: string) => {
    if (role === 'ADMIN') return;
    
    setSaving(`${featureKey}-${role}`);
    try {
      const res = await togglePermission(featureKey, role);
      if (res.success) {
        setMatrix(prev => {
            const current = [...(prev[featureKey] || [])];
            const updated = current.includes(role) 
                ? current.filter(r => r !== role)
                : [...current, role];
            return { ...prev, [featureKey]: updated };
        });
      } else if (res.message) {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const activeGroup = FEATURE_GROUPS.find(g => g.id === activeGroupId) || FEATURE_GROUPS[0];

  const getGroupIcon = (id: string) => {
    switch(id) {
        case 'vehicle': return <Car size={18} />;
        case 'crm': return <Users size={18} />;
        case 'qmake': return <Map size={18} />;
        case 'sightseeing': return <Camera size={18} />;
        case 'admin': return <Settings size={18} />;
        default: return <Settings size={18} />;
    }
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-foreground" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-[1600px] mx-auto">
        <Navbar />

        {/* TOP NAV & HEADER */}
        <div className="mt-12 mb-12 flex justify-between items-end border-b border-border pb-8">
            <div>
                <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all mb-4">
                    <ArrowLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Admin</span>
                </Link>
                <h1 className="text-4xl font-black font-sans uppercase italic tracking-tighter">
                    Access <span className="text-muted-foreground not-italic font-sans font-light">Matrix</span>
                </h1>
                <p className="text-muted-foreground mt-2 font-medium italic text-sm">
                    Configure feature-level permissions for each role.
                </p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 px-6 py-3 rounded-2xl flex items-center gap-3">
                <Shield size={16} className="text-amber-500" />
                <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    Permanent Admin Access Enforced
                </p>
            </div>
        </div>

        <div className="flex gap-12 items-start">
            {/* SIDEBAR NAVIGATION */}
            <div className="w-80 shrink-0 sticky top-32 space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 px-4">Modules</h3>
                {FEATURE_GROUPS.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => setActiveGroupId(group.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all group ${
                            activeGroupId === group.id 
                            ? 'bg-zinc-950 text-white shadow-xl shadow-black/10' 
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${
                                activeGroupId === group.id ? 'bg-white/10' : 'bg-muted-foreground/10'
                            }`}>
                                {getGroupIcon(group.id)}
                            </div>
                            <span className="text-xs font-black uppercase tracking-tight italic">
                                {group.label.split('(')[0]}
                            </span>
                        </div>
                        {activeGroupId === group.id && <ChevronRight size={16} />}
                    </button>
                ))}
            </div>

            {/* MATRIX CONTENT */}
            <div className="flex-1 min-w-0">
                <div className="bg-card border border-border rounded-4xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-border bg-muted/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                {getGroupIcon(activeGroupId)}
                                {activeGroup.label}
                            </h2>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 opacity-60">
                                {activeGroup.features.length} Features available
                            </p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-muted/10">
                                    <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground w-1/2">
                                        Feature Capability
                                    </th>
                                    {ALL_ROLES.map(role => (
                                        <th key={role} className="p-8 text-center min-w-[120px]">
                                            <div className="text-[10px] font-black uppercase tracking-widest mb-1 truncate">
                                                {role}
                                            </div>
                                            <div className={`h-1 mx-auto w-8 rounded-full ${
                                                role === 'ADMIN' ? 'bg-red-500' : 
                                                role === 'MANAGER' ? 'bg-blue-600' : 
                                                role === 'EXECUTIVE' ? 'bg-amber-500' : 
                                                role === 'EVERYONE' ? 'bg-emerald-500' : 'bg-zinc-400'
                                            }`} />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {activeGroup.features.map(feature => (
                                    <tr key={feature.id} className="hover:bg-muted/5 transition-colors group">
                                        <td className="p-8">
                                            <p className="text-sm font-bold uppercase tracking-tight group-hover:translate-x-1 transition-transform">{feature.label}</p>
                                            <p className="text-[9px] text-muted-foreground font-mono mt-1 opacity-40">{feature.id}</p>
                                        </td>
                                        {ALL_ROLES.map(role => {
                                            const isAllowed = (matrix[feature.id] || []).includes(role);
                                            const isSaving = saving === `${feature.id}-${role}`;
                                            const isDisabled = role === 'ADMIN';

                                            return (
                                                <td key={role} className="p-8 text-center">
                                                    <button 
                                                        disabled={isDisabled || isSaving}
                                                        onClick={() => handleToggle(feature.id, role)}
                                                        className={`relative h-10 w-10 mx-auto rounded-xl flex items-center justify-center transition-all ${
                                                            isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                                                        } ${
                                                            isAllowed 
                                                            ? 'bg-zinc-950 text-white shadow-lg shadow-black/20' 
                                                            : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-transparent hover:border-border'
                                                        }`}
                                                    >
                                                        {isSaving ? (
                                                            <Loader2 size={16} className="animate-spin text-foreground" />
                                                        ) : isAllowed ? (
                                                            <Check size={18} strokeWidth={4} />
                                                        ) : (
                                                            <Lock size={16} className="opacity-40" />
                                                        )}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* FOOTER INFO */}
                <div className="mt-8 flex items-center gap-3 text-muted-foreground">
                    <Check size={14} className="text-foreground" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                        Changes are saved instantly to the system configuration.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
