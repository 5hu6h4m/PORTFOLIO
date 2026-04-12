'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity, Zap, Shield, Cpu, Terminal as TerminalIcon } from 'lucide-react';

export default function DashboardCharts() {
    const [points, setPoints] = useState<number[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // Generate random points for a "live" graph
        const initialPoints = Array.from({ length: 20 }, () => Math.floor(Math.random() * 60) + 20);
        setPoints(initialPoints);

        const interval = setInterval(() => {
            setPoints(prev => [...prev.slice(1), Math.floor(Math.random() * 60) + 20]);
        }, 3000);

        // Simulated log stream
        const logLines = [
            "INIT_KERNEL_SUCCESS [0.002s]",
            "MOUNT_VOL_ADMIN_PROJ... OK",
            "SEC_SCAN_CLEAN (128ms)",
            "WEBSOCKET_OPEN [PORT_5000]",
            "CACHE_HIT: /api/projects",
            "TOKEN_VERIFIED: AdminSession",
            "PULL_LATEST_COMMITS...",
            "DB_SYNC_IDLE",
            "UPLINK_STABLE (98ms)"
        ];
        setLogs(logLines);

        return () => clearInterval(interval);
    }, []);

    // SVG Path generator for the sparkline
    const getPath = () => {
        if (points.length === 0) return "";
        const step = 200 / (points.length - 1);
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${100 - p}`).join(" ");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Activity Graph Card */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 overflow-hidden relative group"
            >
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={16} className="text-primary animate-pulse" />
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">System Activity</h3>
                        </div>
                        <p className="text-2xl font-black tracking-tight text-white italic">Live <span className="text-primary not-italic">Traffic</span></p>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-4 bg-primary/20 rounded-full overflow-hidden">
                                <motion.div 
                                    animate={{ height: ['20%', '100%', '30%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-full bg-primary"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Graph */}
                <div className="relative h-48 w-full">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-4 pointer-events-none">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-white/[0.03]" />
                        ))}
                    </div>

                    <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#00f5d4" stopOpacity="1" />
                                <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.8" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Area Fill */}
                        <motion.path 
                            initial={{ d: getPath() }}
                            animate={{ d: getPath() }}
                            transition={{ duration: 2 }}
                            d={`${getPath()} L 200 100 L 0 100 Z`}
                            fill="url(#lineGradient)"
                            fillOpacity="0.1"
                        />

                        {/* Main Line */}
                        <motion.path 
                            initial={{ d: getPath() }}
                            animate={{ d: getPath() }}
                            transition={{ duration: 2 }}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="1.5"
                            filter="url(#glow)"
                        />
                    </svg>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                    {[
                        { label: 'Latency', value: '42ms', icon: Zap },
                        { label: 'Up-Time', value: '99.9%', icon: Shield },
                        { label: 'CPU Load', value: '12%', icon: Cpu },
                        { label: 'Mem-Usage', value: '420MB', icon: Activity },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <stat.icon size={14} className="mx-auto mb-2 text-primary/40" />
                            <p className="text-[9px] font-black uppercase text-gray-500 mb-0.5">{stat.label}</p>
                            <p className="text-xs font-bold text-white tracking-widest">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Terminal Log Card */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-8 overflow-hidden relative shadow-2xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-white/5">
                        <TerminalIcon size={18} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">System Logs</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Real-time status feed</p>
                    </div>
                </div>

                <div className="font-mono text-[11px] space-y-2 mt-4 overflow-y-auto max-h-48 scrollbar-hide">
                    {logs.map((log, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="flex items-center gap-3 group"
                        >
                            <span className="text-primary opacity-40">[{new Date().toLocaleTimeString()}]</span>
                            <span className="text-gray-400 group-hover:text-primary transition-colors cursor-default">{log}</span>
                        </motion.div>
                    ))}
                    <motion.div 
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-primary/40 ml-1 translate-y-1"
                    />
                </div>

                {/* Decorative scanning line */}
                <motion.div 
                    animate={{ y: [0, 200, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"
                />
            </motion.div>
        </div>
    );
}
