'use client';

import { useEffect, useState } from 'react';
import { fetchProjects, fetchCertificates, fetchMessages } from '@/lib/admin-api';
import { FolderKanban, Award, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { safeStorage } from '@/lib/safe-storage';
import DashboardCharts from '@/components/admin/DashboardCharts';

export default function DashboardPage() {
    const [stats, setStats] = useState({ projects: 0, certificates: 0, messages: 0 });

    useEffect(() => {
        const getStats = async () => {
            const token = null; // Token passed via HTTP-Only cookie

            try {
                const projects = await fetchProjects();
                const certs = await fetchCertificates();
                const messages = await fetchMessages(token);
                setStats({ 
                    projects: projects.length, 
                    certificates: certs.length, 
                    messages: messages.length 
                });
            } catch (err) {
                console.error('Stats load error:', err);
            }
        };
        getStats();
    }, []);



    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                    System <span className="text-primary italic">Overview</span>
                </h1>
                <div className="flex items-center gap-4 text-gray-500 font-medium tracking-wide">
                    <p className="border-l-2 border-primary/30 pl-4 py-1">
                        Manage your portfolio content and track performance
                    </p>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] uppercase font-black tracking-tighter text-primary/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        System Online: v2.0.26
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between group relative overflow-hidden transition-all duration-500 hover:border-primary/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">Total Projects</p>
                        <h2 className="text-5xl font-black text-white tracking-tighter">{stats.projects}</h2>
                    </div>
                    <div className="p-5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,245,212,0.1)] group-hover:scale-110 transition-transform duration-500">
                        <FolderKanban size={36} strokeWidth={2.5} />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between group relative overflow-hidden transition-all duration-500 hover:border-primary/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">Certificates</p>
                        <h2 className="text-5xl font-black text-white tracking-tighter">{stats.certificates}</h2>
                    </div>
                    <div className="p-5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,245,212,0.1)] group-hover:scale-110 transition-transform duration-500">
                        <Award size={36} strokeWidth={2.5} />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between group relative overflow-hidden transition-all duration-500 hover:border-primary/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">Messages</p>
                        <h2 className="text-5xl font-black text-white tracking-tighter">{stats.messages}</h2>
                    </div>
                    <div className="p-5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,245,212,0.1)] group-hover:scale-110 transition-transform duration-500">
                        <MessageSquare size={36} strokeWidth={2.5} />
                    </div>
                </motion.div>
            </div>

            <DashboardCharts />
        </div>
    );
}
