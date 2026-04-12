'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/admin-api';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { valid } = await verifyToken();
            if (valid) {
                 router.replace('/admin/dashboard');
            } else {
                 router.replace('/admin/login');
            }
        };
        checkAuth();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
    );
}
