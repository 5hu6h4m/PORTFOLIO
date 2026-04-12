'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Award, LogOut, MessageSquare } from 'lucide-react';
import { logout } from '@/lib/admin-api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/admin/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-10">
                <div className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-tighter">
                    ADMIN <span className="text-white/20 font-light ml-1">PORTFOLIO</span>
                </div>
                
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-mono text-xs uppercase tracking-widest",
                                    isActive ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={16} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link 
                    href="/" 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-primary hover:bg-primary/10 transition-all font-mono text-xs uppercase tracking-widest border border-primary/20"
                >
                    <FolderKanban size={16} />
                    <span>View Site</span>
                </Link>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-mono text-xs uppercase tracking-widest border border-transparent hover:border-rose-500/20"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}
