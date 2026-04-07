"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Globe, Mail, ArrowUpRight, Cpu } from 'lucide-react';
// Import the brand logos from the new library
import { SiGithub, SiX } from '@icons-pack/react-simple-icons';


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-background border-t border-border/40 px-6 py-16 sm:px-10 lg:px-16 mt-20">
            <div className="max-w-7xl mx-auto">

                {/* --- TOP: BRAND & STATUS --- */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-24">
                    <div className="space-y-6 max-w-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center text-zinc-50 dark:text-zinc-950 shadow-2xl">
                                <Globe size={20} strokeWidth={2} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">ZEMLO<span className="text-blue-500">.</span></span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                            Freelance Software Developer specializing in high-performance tourism databases and architectural digital tools. Based in India, working globally.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:items-end gap-3"
                    >
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            Engine Operational
                        </div>
                        <p className="text-muted-foreground/50 text-[10px] font-mono uppercase tracking-[0.2em]">
                            v2.6.4 // Node-2026-Stable
                        </p>
                    </motion.div>
                </div>

                {/* --- MIDDLE: NAVIGATION LINKS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-border/40 py-16">
                    <FooterGroup
                        title="Sitemap"
                        links={[
                            { label: 'Work', href: '#work' },
                            { label: 'Dashboard', href: '/sightseeing-dashboard' },
                            { label: 'Add Entry', href: '/add-sightseeings' },
                            { label: 'Architecture', href: '#' }
                        ]}
                    />
                    <FooterGroup
                        title="Connect"
                        links={[
                            { label: 'GitHub', href: 'https://github.com/aashish' },
                            { label: 'Twitter', href: '#' },
                            { label: 'Instagram', href: '#' }
                        ]}
                    />
                    <FooterGroup
                        title="Support"
                        links={[
                            { label: 'Email', href: 'mailto:aashish@zemlo.in' },
                            { label: 'WhatsApp', href: '#' },
                            { label: 'Availability', href: '#' }
                        ]}
                    />
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Location</h4>
                        <div className="space-y-1">
                            <p className="text-sm font-bold">Haridwar, UK</p>
                            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest leading-relaxed">
                                29.9457° N <br /> 78.1642° E
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM: LEGAL --- */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                        <span>© {currentYear} ZEMLO.IN</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-300" />
                        <span>Built with Next.js 15</span>
                    </div>

                    <div className="flex gap-6 items-center">
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors"><SiGithub size={18} /></Link>
                        <Link href="#"><SiGithub size={18} /></Link>
                        <Link href="#"><SiX size={18} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

/* --- HELPER COMPONENTS --- */

function FooterGroup({ title, links }: { title: string, links: { label: string, href: string }[] }) {
    return (
        <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{title}</h4>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="group flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-all underline-offset-4 hover:underline"
                        >
                            {link.label}
                            <ArrowUpRight size={12} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Footer;