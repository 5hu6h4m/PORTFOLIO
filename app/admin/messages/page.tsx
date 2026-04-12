'use client';

import { useState, useEffect } from 'react';
import { fetchMessages, deleteMessage } from '@/lib/admin-api';
import { safeStorage } from '@/lib/safe-storage';
import { Trash2, Mail, User, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const token = safeStorage.getItem('adminToken');
            const data = await fetchMessages(token);
            setMessages(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setMessageToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!messageToDelete) return;
        
        setIsDeleting(true);
        setDeletingId(messageToDelete); // Keep for UI indicators if needed
        try {
            const token = safeStorage.getItem('adminToken');
            await deleteMessage(messageToDelete, token);
            // Optimistic remove — no full reload needed
            setMessages((prev) => prev.filter((m) => m._id !== messageToDelete));
            setIsDeleteModalOpen(false);
            setMessageToDelete(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete message.');
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 gap-3 text-white/40">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading messages...
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-bold">Messages</h1>
                <span className="text-xs font-mono text-white/30 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    {messages.length} total
                </span>
            </div>

            <div className="space-y-6">
                {messages.length === 0 ? (
                    <div className="text-center py-20 bg-[#151515] rounded-3xl border border-white/5">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/20" />
                        <p className="text-white/40">No messages yet.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -40, scale: 0.97 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#151515] p-8 rounded-3xl border border-white/5 group hover:border-white/10 transition-all relative"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        {/* Sender info row */}
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono">
                                                <User size={12} />
                                                {msg.name}
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono">
                                                <Mail size={12} />
                                                {msg.email}
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs font-mono ml-auto">
                                                <Calendar size={12} />
                                                {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <h3 className="text-xl font-bold mb-3 tracking-tight">{msg.subject}</h3>

                                        {/* Message body */}
                                        <p className="text-white/60 leading-relaxed whitespace-pre-wrap text-sm">{msg.message}</p>
                                    </div>

                                    {/* Delete button */}
                                    <div className="flex md:flex-col items-start md:items-end justify-end md:justify-start pt-1">
                                        <motion.button
                                            onClick={() => handleDeleteClick(msg._id)}
                                            disabled={deletingId === msg._id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/0 border border-red-500/0 text-white/20 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-300 text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {deletingId === msg._id ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={14} />
                                            )}
                                            {deletingId === msg._id ? 'Deleting...' : 'Delete'}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                loading={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Message"
                message={`Are you sure you want to delete this contact message? This action is permanent and cannot be reversed.`}
            />
        </div>
    );
}

