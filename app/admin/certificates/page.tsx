'use client';

import { useState, useEffect } from 'react';
import { safeStorage } from '@/lib/safe-storage';
import { Plus, Trash2, Edit2, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';



interface Certificate {
    _id?: string;
    title: string;
    issuer: string;
    date: string;
    image: string;
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [newCert, setNewCert] = useState<Certificate>({
        title: '',
        issuer: '',
        date: '',
        image: ''
    });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [certToDelete, setCertToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            const { fetchCertificates } = await import('@/lib/admin-api');
            const data = await fetchCertificates();
            setCertificates(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cert: Certificate) => {
        setNewCert({ ...cert });
        setEditingId(cert._id || null);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id: string) => {
        setCertToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!certToDelete) return;
        
        setIsDeleting(true);
        setErrorMsg(null);
        try {
            const token = safeStorage.getItem('adminToken');
            const { deleteCertificate } = await import('@/lib/admin-api');
            await deleteCertificate(certToDelete, token);
            setIsDeleteModalOpen(false);
            setCertToDelete(null);
            loadCertificates();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(`DELETE ERROR: ${err.message || 'Network Failed'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            const token = safeStorage.getItem('adminToken');
            const { createCertificate, updateCertificate } = await import('@/lib/admin-api');
            
            if (editingId) {
                await updateCertificate(editingId, newCert, token);
            } else {
                await createCertificate(newCert, token);
            }
            setShowForm(false);
            setEditingId(null);
            setNewCert({ title: '', issuer: '', date: '', image: '' });
            loadCertificates();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(`SAVE ERROR: ${err.message || 'Network Failed'}`);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const { uploadFile } = await import('@/lib/admin-api');
            const response = await uploadFile(file);
            const imageUrl = response.imageUrl || response;
            setNewCert({ ...newCert, image: imageUrl });
        } catch (err: any) {
            console.error("Upload failed:", err);
            setErrorMsg(`UPLOAD ERROR: ${err.message || 'Image upload failed'}`);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                        Manage <span className="text-primary italic">Certificates</span>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide border-l-2 border-primary/30 pl-4 py-1">
                        Showcase your verified achievements and credentials
                    </p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] active:scale-95 group"
                >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>{showForm ? 'Close Form' : 'Add Certificate'}</span>
                </button>
            </div>

            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-xl font-mono text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <b>CRITICAL FAILURE:</b> {errorMsg}
                    <p className="text-xs opacity-70 mt-1">Please copy this exact error and tell Antigravity!</p>
                </div>
            )}

            {showForm && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16" />
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">Certificate Title</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600"
                                    value={newCert.title}
                                    onChange={(e) => setNewCert({...newCert, title: e.target.value})}
                                    placeholder="e.g. AWS Certified Architect"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">Issuer</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600"
                                    value={newCert.issuer}
                                    onChange={(e) => setNewCert({...newCert, issuer: e.target.value})}
                                    placeholder="e.g. Amazon Web Services"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">Date Issued</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600"
                                    value={newCert.date}
                                    onChange={(e) => setNewCert({...newCert, date: e.target.value})}
                                    placeholder="March 2024"
                                />
                            </div>
                        </div>
                        <div className="space-y-6 flex flex-col">
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Credential File</label>
                                <div className="flex flex-col gap-6 p-4 rounded-xl bg-black/40 border border-white/10 border-dashed hover:border-primary/30 transition-all">
                                    <input 
                                        type="file" 
                                        onChange={handleImageUpload} 
                                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                                        accept=".pdf,image/*"
                                    />
                                    {newCert.image && (
                                        <div className="mt-2 p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3 relative">
                                            {typeof newCert.image === 'string' && newCert.image.endsWith('.pdf') ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary/10 rounded-lg">
                                                        <FileText className="text-primary" size={24} />
                                                    </div>
                                                    <span className="text-sm font-black uppercase tracking-widest text-primary/70">PDF Uploaded</span>
                                                </div>
                                            ) : (
                                                <div className="relative group w-full h-32">
                                                    <img src={newCert.image} alt="Preview" className="w-full h-full rounded-lg object-contain bg-black/50 border border-white/10" />
                                                </div>
                                            )}
                                            <button 
                                                type="button" 
                                                onClick={() => setNewCert({ ...newCert, image: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 hover:scale-110 transition-all z-20"
                                                title="Remove Image"
                                            >
                                                <Trash2 size={16} strokeWidth={2} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-4 pt-8 border-t border-white/5">
                            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">Discard Changes</button>
                            <button type="submit" className="px-12 py-3 rounded-xl bg-white text-black font-black uppercase tracking-wider hover:bg-primary transition-all shadow-xl active:scale-95">
                                {editingId ? 'Update Certificate' : 'Save Certificate'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                    <motion.div 
                        key={cert._id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden flex flex-col p-6 group hover:border-primary/40 transition-all duration-500 shadow-xl"
                    >
                        <div className="w-full h-48 rounded-2xl bg-black/50 mb-6 flex items-center justify-center border border-white/5 overflow-hidden shadow-inner relative">
                            {typeof cert.image === 'string' && cert.image.endsWith('.pdf') ? (
                                <FileText className="text-primary/70 group-hover:scale-110 transition-transform duration-700" size={64} />
                            ) : (
                                <img src={cert.image} alt={cert.title} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </div>
                        
                        <div className="flex flex-col flex-1">
                            <h3 className="text-xl font-black mb-1 tracking-tight line-clamp-1">{cert.title}</h3>
                            <p className="text-primary text-sm font-bold tracking-wider uppercase mb-1">{cert.issuer}</p>
                            <p className="text-gray-500 text-xs tracking-widest font-mono mb-4">{cert.date}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <button onClick={() => handleEdit(cert)} className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all active:scale-90" title="Edit Certificate"><Edit2 size={18} /></button>
                                <button onClick={() => cert._id && handleDeleteClick(cert._id)} className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-all active:scale-90" title="Delete Permanent"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                loading={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Certificate"
                message={`Are you sure you want to delete this certificate? This action cannot be undone.`}
            />
        </div>
    );
}
