'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Award, LogOut, MessageSquare, Globe, ExternalLink, X, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '@/lib/admin-api';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];


export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/admin/login';
    };


    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 h-screen flex flex-col p-6 z-[60] transition-transform duration-300 lg:translate-x-0 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex items-center justify-between mb-10">
                <div className="text-2xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-primary/50 bg-clip-text text-transparent italic">
                    S2W <span className="text-primary not-italic">ADMIN</span>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose} 
                        className="lg:hidden p-2 -mr-2 text-gray-400 hover:text-primary transition-all active:scale-90"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            <div className="mb-8">
                <Link 
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Globe size={18} className="animate-pulse" />
                    <span className="font-bold text-xs uppercase tracking-widest">Live Portfolio</span>
                    <ExternalLink size={14} className="ml-auto opacity-50" />
                </Link>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
                                isActive 
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_-5px_rgba(0,245,212,0.2)]" 
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="activeNav"
                                    className="absolute inset-0 border border-primary/50 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-primary")} />
                            <span className="font-semibold text-sm tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm tracking-tight group"
            >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Logout</span>
            </button>
        </aside>
    );
}
