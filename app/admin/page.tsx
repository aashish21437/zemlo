import React from 'react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { Users, Car, FileText, ShieldAlert, Plus, Shield } from 'lucide-react';
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";
import Query from "@/models/Query";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/check-permissions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession();
  
  await dbConnect();
  const dbUser = session?.user?.email ? await User.findOne({ email: session.user.email }) : null;
  
  // Check authorization using the NEW dynamic system
  const hasDashboardAccess = await checkPermission('admin_dashboard');

  if (!hasDashboardAccess) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="h-20 w-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">System Locked</h1>
                <p className="text-muted-foreground text-sm font-medium italic">
                    WARNING: You are not authorized to visit this page. Your access level is <span className="text-foreground font-black not-italic px-2 py-0.5 bg-muted rounded">{dbUser?.role || 'UNREGISTERED'}</span>.
                </p>
                <div className="pt-6 border-t border-border">
                    <Link href="/" className="px-8 py-3 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all inline-block">
                        Back to Workspace
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  // Fetch Stats
  const userCount = await User.countDocuments();
  const vehicleCount = await Vehicle.countDocuments();
  const queryCount = await Query.countDocuments();

  const stats = [
    { name: 'Total Users', value: userCount, icon: Users, link: '/admin/users' },
    { name: 'Vehicle Registry', value: vehicleCount, icon: Car, link: '/vehicle' },
    { name: 'Active Queries', value: queryCount, icon: FileText, link: '/qreg/query' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        {/* HEADER */}
        <div className="mt-12 mb-12 border-b border-border pb-8">
            <h1 className="text-5xl font-black font-sans uppercase italic tracking-tighter">
                System <span className="text-muted-foreground not-italic font-sans font-light">Administration</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-medium italic text-sm">
                Control center for permissions, fleet, and system logs.
            </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Quick Actions</h3>
            <div className="flex gap-4">
                <Link 
                    href="/admin/users" 
                    className="flex-1 bg-zinc-950 text-white p-6 rounded-4xl flex items-center justify-between group hover:bg-zinc-900 transition-all border border-zinc-800"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase italic tracking-tighter">Manage System Users</p>
                            <p className="text-[10px] opacity-60 font-bold uppercase">Add new members & assign roles</p>
                        </div>
                    </div>
                    <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={16} />
                    </div>
                </Link>
                <Link 
                    href="/admin/permissions" 
                    className="flex-1 bg-white text-black p-6 rounded-4xl flex items-center justify-between group hover:bg-zinc-100 transition-all border border-zinc-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-zinc-900 rounded-full flex items-center justify-center text-white">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase italic tracking-tighter">Access Matrix</p>
                            <p className="text-[10px] opacity-60 font-bold uppercase">Define role-based permissions</p>
                        </div>
                    </div>
                    <div className="h-8 w-8 rounded-full border border-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={16} />
                    </div>
                </Link>
            </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat) => (
                <Link 
                    key={stat.name} 
                    href={stat.link}
                    className="p-8 bg-card border border-border rounded-4xl hover:border-foreground transition-all group"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 group-hover:text-foreground">
                                {stat.name}
                            </p>
                            <h3 className="text-4xl font-black tracking-tighter italic">
                                {stat.value}
                            </h3>
                        </div>
                        <stat.icon size={24} className="text-muted-foreground group-hover:text-foreground" />
                    </div>
                </Link>
            ))}
        </div>

        {/* ACCESS WARNING */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-6 rounded-3xl flex items-center gap-4">
            <ShieldAlert size={20} className="text-red-500" />
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">
                Warning: All changes made in this panel are permanent and logged. Ensure user promotion is authorized.
            </p>
        </div>
      </div>
    </div>
  );
}
