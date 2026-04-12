'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Home, WifiOff, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';

interface OfflinePageProps {
    isOpen: boolean;
    onClose: () => void;
}

export function OfflinePage({ isOpen, onClose }: OfflinePageProps) {
    const [mounted, setMounted] = useState(false);
    const lenis = useLenis();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll & Lenis Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            lenis?.stop();
        } else {
            document.body.style.overflow = 'unset';
            lenis?.start();
        }
        return () => {
            document.body.style.overflow = 'unset';
            lenis?.start();
        };
    }, [isOpen, lenis]);

    if (!mounted) return null;

    const content = (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[99999] bg-[#ffffff] dark:bg-[#202124] text-[#3c4043] dark:text-[#bdc1c6] font-sans flex flex-col pointer-events-auto"
                >
                    {/* Utility Bar / Close Button */}
                    <div className="absolute top-0 right-0 p-6 flex justify-end z-[100000]">
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] rounded-full transition-colors group"
                            title="Close"
                        >
                            <X size={24} className="text-[#5f6368] dark:text-[#9aa0a6] group-hover:text-[#202124] dark:group-hover:text-white" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                        <div className="max-w-[600px] w-full space-y-8 mt-[-10vh]">
                            
                            {/* Browser Error Icon */}
                            <div className="mb-8">
                                <div className="w-[72px] h-[72px] bg-[#f1f3f4] dark:bg-[#3c4043] rounded-full flex items-center justify-center">
                                    <WifiOff size={40} className="text-[#5f6368] dark:text-[#9aa0a6]" />
                                </div>
                            </div>

                            {/* Main Error Message */}
                            <div className="space-y-4">
                                <h1 className="text-[22px] md:text-[28px] font-medium leading-tight">
                                    No internet
                                </h1>
                                
                                <div className="space-y-4 text-[14px] md:text-[16px]">
                                    <p>Try:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Checking the network cables, modem, and router</li>
                                        <li>Reconnecting to Wi-Fi</li>
                                        <li><span className="text-[#1a73e8] dark:text-[#8ab4f8] cursor-pointer hover:underline">Running Network Diagnostics</span></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-8 space-y-12">
                                <div className="text-[12px] opacity-60 font-mono text-gray-400">
                                    ERR_INTERNET_DISCONNECTED
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-2.5 bg-[#1a73e8] dark:bg-[#8ab4f8] text-white dark:text-[#202124] rounded-md font-medium text-[14px] hover:shadow-md transition-shadow active:bg-[#185abc]/90 shadow-sm"
                                    >
                                        Reload
                                    </button>
                                    
                                    <button 
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-6 py-2.5 border border-[#dadce0] dark:border-[#5f6368] rounded-md font-medium text-[14px] hover:bg-[#f8f9fa] dark:hover:bg-[#303134] transition-colors bg-white dark:bg-transparent"
                                    >
                                        <Home size={16} />
                                        <span>Back to Home</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer text (authentic) */}
                    <div className="p-12 hidden md:block">
                        <p className="text-[12px] opacity-40">
                            Check the proxy and the firewall or <span className="text-[#1a73e8] dark:text-[#8ab4f8] cursor-pointer">check connection settings</span>.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
