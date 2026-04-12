'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Award, LogOut, MessageSquare, Menu } from 'lucide-react';
import { logout } from '@/lib/admin-api';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

export default function AdminNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/admin/login';
    };

    return (
        <nav className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-black/60 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onToggleSidebar}
                    className="p-2.5 -ml-2 text-gray-400 hover:text-primary transition-all active:scale-90 bg-white/5 rounded-xl border border-white/5"
                >
                    <Menu size={24} />
                </button>
                <div className="text-xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-primary/50 bg-clip-text text-transparent italic">
                    S2W <span className="text-primary not-italic text-sm tracking-widest ml-1">ADMIN</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all relative group",
                                    isActive ? "bg-primary/20 text-primary" : "text-gray-500 hover:text-white"
                                )}
                                title={item.name}
                            >
                                <Icon size={20} className="relative z-10" />
                                {isActive && (
                                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl" />
                                )}
                            </Link>
                        );
                    })}
                </div>
                
                <div className="w-px h-6 bg-white/10 mx-2" />
                
                <button 
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 active:scale-90"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
}
