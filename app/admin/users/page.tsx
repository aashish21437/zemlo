"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { getAllUsers, updateUserRole, deleteUser, createUser } from '../actions';
import { Shield, User as UserIcon, Trash2, Mail, Clock, ArrowLeft, ShieldAlert, Plus, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";

export default function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  
  // New User Form State
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'VIEWER' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change user role to ${newRole}?`)) return;
    try {
      await updateUserRole(userId, newRole);
      loadUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createUser(newUser);
      setNewUser({ email: '', name: '', role: 'VIEWER' });
      loadUsers();
      alert("User pre-registered successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
        case 'ADMIN': return 'bg-red-500 text-white border-red-600';
        case 'MANAGER': return 'bg-blue-600 text-white border-blue-700';
        case 'EXECUTIVE': return 'bg-amber-500 text-white border-amber-600';
        default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div></div>;

  if (!authorized) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="h-20 w-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Access Denied</h1>
                <p className="text-muted-foreground text-sm font-medium italic">
                    WARNING: You are not authorized to manage system users. This action requires <span className="text-red-500 font-black not-italic">ADMIN</span> privileges.
                </p>
                <div className="pt-6 border-t border-border">
                    <Link href="/admin" className="px-8 py-3 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all inline-block">
                        Back to Overview
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        {/* TOP NAV */}
        <div className="flex justify-between items-center mb-8 mt-12">
          <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all">
            <ArrowLeft size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Back to Admin</span>
          </Link>
        </div>

        {/* HEADER */}
        <div className="mb-12 border-b border-border pb-8">
            <h1 className="text-4xl font-black font-sans uppercase italic tracking-tighter">
                User <span className="text-muted-foreground not-italic font-sans font-light">Management</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-medium italic text-sm">
                Control individual access levels and revoke permissions.
            </p>
        </div>

        {/* ADD USER FORM */}
        <div className="mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <UserPlus size={14} /> Pre-Register System User
            </h3>
            <form onSubmit={handleCreateUser} className="bg-zinc-950 text-white p-8 rounded-4xl flex flex-wrap items-end gap-6 shadow-2xl">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[9px] font-black uppercase opacity-60 mb-2 block">Full Name (Optional)</label>
                    <input 
                        value={newUser.name}
                        onChange={e => setNewUser({...newUser, name: e.target.value.toUpperCase()})}
                        placeholder="e.g. JOHN DOE"
                        className="w-full bg-white/10 border-b border-white/20 p-2 outline-none focus:border-white font-bold text-sm uppercase"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[9px] font-black uppercase opacity-60 mb-2 block">Email Address</label>
                    <input 
                        type="email"
                        required
                        value={newUser.email}
                        onChange={e => setNewUser({...newUser, email: e.target.value.toLowerCase()})}
                        placeholder="user@zemlo.in"
                        className="w-full bg-white/10 border-b border-white/20 p-2 outline-none focus:border-white font-bold text-sm lowercase"
                    />
                </div>
                <div className="w-48">
                    <label className="text-[9px] font-black uppercase opacity-60 mb-2 block">Assigned Role</label>
                    <select 
                        value={newUser.role}
                        onChange={e => setNewUser({...newUser, role: e.target.value})}
                        className="w-full bg-white/10 border-b border-white/20 p-2 outline-none focus:border-white font-black text-[10px] uppercase"
                    >
                        <option value="ADMIN" className="text-black">ADMIN</option>
                        <option value="MANAGER" className="text-black">MANAGER</option>
                        <option value="EXECUTIVE" className="text-black">EXECUTIVE</option>
                        <option value="VIEWER" className="text-black">VIEWER</option>
                    </select>
                </div>
                <button 
                    disabled={isCreating}
                    className="bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all disabled:opacity-50"
                >
                    {isCreating ? "Adding..." : "Register User"}
                </button>
            </form>
        </div>

        {/* USERS TABLE */}
        <div className="bg-card border border-border rounded-4xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/20 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <th className="p-6">User / Account</th>
                            <th className="p-6">Role</th>
                            <th className="p-6">Last Login</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-muted/5 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        {user.image ? (
                                            <img src={user.image} className="w-10 h-10 rounded-full border border-border" alt="" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                <UserIcon size={20} className="text-muted-foreground" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-base tracking-tight uppercase">{user.name || 'ZEMLO User'}</p>
                                            <p className="text-xs font-medium text-muted-foreground lowercase flex items-center gap-1">
                                                <Mail size={12} /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getRoleColor(user.role)}`}
                                    >
                                        <option value="ADMIN" className="text-black">ADMIN</option>
                                        <option value="MANAGER" className="text-black">MANAGER</option>
                                        <option value="EXECUTIVE" className="text-black">EXECUTIVE</option>
                                        <option value="VIEWER" className="text-black">VIEWER</option>
                                    </select>
                                </td>
                                <td className="p-6 text-xs font-mono text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button 
                                        onClick={() => handleDelete(user._id)}
                                        className="p-3 text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="p-20 text-center opacity-40 uppercase font-black text-xs tracking-widest italic">
                    No System Users Found
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
