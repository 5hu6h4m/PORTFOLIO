'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    loading?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Permanent',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    loading = false
}: DeleteConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] shadow-red-500/10 group z-10 p-0"
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                        
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-white mb-1 uppercase">{title}</h3>
                                    <p className="text-[10px] font-black tracking-[0.2em] text-red-500/70 uppercase">Caution required</p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="ml-auto p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all pointer-events-auto"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-gray-400 font-medium leading-relaxed tracking-wide mb-8">
                                {message}
                            </p>
                        </div>

                        <div className="p-8 pt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all active:scale-95 disabled:opacity-50 pointer-events-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-black font-black uppercase tracking-widest hover:bg-red-400 transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 pointer-events-auto"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        <span>Confirm Delete</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Bottom accent */}
                        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
}
