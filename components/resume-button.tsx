'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { OfflinePage } from "./ui/offline-page";
import { cn } from "@/lib/utils";

interface ResumeButtonProps {
    variant?: 'nav' | 'hero' | 'about' | 'default';
    className?: string;
}

export function ResumeButton({ variant = 'default', className }: ResumeButtonProps) {
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [showOffline, setShowOffline] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/settings/about-sections')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.resumeUrl) setResumeUrl(data.resumeUrl);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleAction = () => {
        if (resumeUrl) {
            window.open(resumeUrl, '_blank');
        } else {
            setShowOffline(true);
        }
    };

    if (loading && variant !== 'about') return null; // Avoid flicker in nav/hero

    // Variant Styles
    const variants = {
        nav: "text-[10px] font-bold text-white/50 hover:text-[#00f5d4] transition-all duration-300 uppercase tracking-[0.2em] relative group flex items-center gap-2",
        hero: "group relative px-6 lg:px-10 h-10 lg:h-14 bg-white/5 border border-white/10 text-white rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_30px_rgba(0,245,212,0.2)] active:scale-95 flex items-center justify-center gap-3",
        about: "group relative px-8 py-4 bg-white/5 border border-[#00f5d4]/20 text-white rounded-full font-black uppercase text-xs tracking-widest overflow-hidden transition-all duration-500 hover:border-[#00f5d4]/50 hover:bg-[#00f5d4]/10 hover:shadow-[0_0_20px_rgba(0,245,212,0.2)] active:scale-95 flex items-center justify-center gap-3",
        default: "flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAction}
                className={cn(variants[variant], className)}
            >
                {variant === 'nav' ? (
                    <>
                        <span>Resume</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00f5d4] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#00f5d4]" />
                    </>
                ) : (
                    <>
                        <FileText size={variant === 'hero' ? 18 : 14} />
                        <span>Resume (PDF)</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    </>
                )}
            </motion.button>

            <OfflinePage isOpen={showOffline} onClose={() => setShowOffline(false)} />
        </>
    );
}
