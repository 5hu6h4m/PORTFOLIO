"use client";

import Sidebar from '@/components/admin/Sidebar';
import { safeStorage } from '@/lib/safe-storage';
import { getCookie, deleteCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { verifyToken } from '@/lib/admin-api';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setIsSidebarOpen(false); // Close sidebar on route change
        setMounted(true);
        const checkAuth = async () => {
            // Verify with backend via HTTP-Only cookie automatically
            const result = await verifyToken();
            if (result.valid) {
                setIsAuthenticated(true);
                if (pathname === '/admin/login') {
                    router.replace('/admin/dashboard');
                }
            } else {
                setIsAuthenticated(false);
                if (pathname !== '/admin/login') {
                    router.replace('/admin/login');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [pathname, router]);

    if (!mounted || (isLoading && pathname !== '/admin/login')) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const showSidebar = isAuthenticated && pathname !== '/admin/login';

    return (
        <div className="min-h-screen bg-black text-white relative font-sans overflow-x-hidden selection:bg-primary/30">
            {/* Background elements to match main site */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,245,212,0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />
            
            {showSidebar && (
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                />
            )}
            {showSidebar && (
                <AdminNavbar 
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                />
            )}
            
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            <main className={cn(
                "p-4 md:p-8 transition-all duration-300 min-h-screen relative z-10",
                showSidebar ? "lg:ml-64 pt-24 lg:pt-12" : "ml-0"
            )}>
                <div className={cn(
                    "w-full max-w-7xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_50px_-12px_rgba(0,245,212,0.1)] relative overflow-hidden",
                    pathname === '/admin/login' ? "bg-transparent border-none p-0 backdrop-blur-0 shadow-none overflow-visible" : "p-6 md:p-12"
                )}>
                    {/* Subtle decorative glow */}
                    {!pathname.includes('/login') && (
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
