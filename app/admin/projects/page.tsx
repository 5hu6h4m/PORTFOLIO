'use client';

import { useState, useEffect } from 'react';
import { fetchProjects, deleteProject, createProject, uploadFile } from '@/lib/admin-api';
import { safeStorage } from '@/lib/safe-storage';
import { Plus, Trash2, Edit2, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

interface Project {
    _id?: string;
    title: string;
    description: string;
    techStack: string | string[];
    image: string;
    liveLink: string;
    githubLink: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [newProject, setNewProject] = useState<Project>({
        title: '',
        description: '',
        techStack: '',
        image: '',
        liveLink: '',
        githubLink: ''
    });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project: Project) => {
        setNewProject({
            ...project,
            techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack
        });
        setEditingId(project._id || null);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id: string) => {
        setProjectToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;
        
        setIsDeleting(true);
        setErrorMsg(null);
        try {
            const token = safeStorage.getItem('adminToken');
            await deleteProject(projectToDelete, token);
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
            loadProjects();
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
            const formattedProject = {
                ...newProject,
                techStack: typeof newProject.techStack === 'string' 
                    ? newProject.techStack.split(',').map(s => s.trim())
                    : newProject.techStack
            };
            
            if (editingId) {
                const { updateProject } = await import('@/lib/admin-api');
                await updateProject(editingId, formattedProject, token);
            } else {
                await createProject(formattedProject, token);
            }

            setNewProject({ title: '', description: '', techStack: '', image: '', liveLink: '', githubLink: '' });
            setEditingId(null);
            setShowForm(false);
            loadProjects();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(`SAVE ERROR: ${err.message || 'Network Failed'}`);
        }
    };


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const response = await uploadFile(file);
            const imageUrl = response.imageUrl || response;
            setNewProject({ ...newProject, image: imageUrl });
        } catch (err) {
            console.error("Image upload failed", err);
            setErrorMsg("Image upload failed");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                        Manage <span className="text-primary italic">Projects</span>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide border-l-2 border-primary/30 pl-4 py-1">
                        Showcase your best work with futuristic cards
                    </p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] active:scale-95 group"
                >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>{showForm ? 'Close Form' : 'Add Project'}</span>
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
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">Project Title</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                    placeholder="e.g. AI Portfolio 2026"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">Tech Stack</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600"
                                    value={newProject.techStack}
                                    onChange={(e) => setNewProject({...newProject, techStack: e.target.value})}
                                    placeholder="Next.js, Tailwind, Framer Motion"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">Live URL</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600"
                                        value={newProject.liveLink}
                                        onChange={(e) => setNewProject({...newProject, liveLink: e.target.value})}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">GitHub URL</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600"
                                        value={newProject.githubLink}
                                        onChange={(e) => setNewProject({...newProject, githubLink: e.target.value})}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 flex flex-col">
                            <div className="group flex-1">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-focus-within:text-primary transition-colors">Description</label>
                                <textarea 
                                    className="w-full h-[calc(100%-2rem)] bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-gray-600 resize-none"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                    placeholder="Describe the project objective and key features..."
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Cover Image</label>
                                <div className="flex items-center gap-6 p-4 rounded-xl bg-black/40 border border-white/10 border-dashed hover:border-primary/30 transition-all">
                                    <input type="file" onChange={handleImageUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                    {newProject.image && (
                                        <div className="relative group shrink-0">
                                            <img src={newProject.image.startsWith('http') ? newProject.image : `${BASE_URL}${newProject.image}`} alt="Preview" className="h-16 w-24 rounded-lg object-cover border border-white/10" />
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center pointer-events-none">
                                                <span className="text-[10px] font-black text-black bg-primary px-2 py-1 rounded">PREVIEW</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setNewProject({ ...newProject, image: '' })}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 hover:scale-110 transition-all z-20"
                                                title="Remove Image"
                                            >
                                                <Trash2 size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-4 pt-8 border-t border-white/5">
                            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">Discard Changes</button>
                            <button type="submit" className="px-12 py-3 rounded-xl bg-white text-black font-black uppercase tracking-wider hover:bg-primary transition-all shadow-xl active:scale-95">
                                {editingId ? 'Update & Deploy' : 'Initialize & Save'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {projects.map((project) => (
                    <motion.div 
                        key={project._id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden flex flex-col sm:flex-row gap-6 p-6 group hover:border-primary/40 transition-all duration-500 shadow-xl"
                    >
                        <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden shadow-2xl">
                            <img src={project.image?.startsWith('http') ? project.image : `${BASE_URL}${project.image}`} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight line-clamp-1">{project.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed tracking-wide">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 4).map((tech: string) => (
                                        <span key={tech} className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">{tech}</span>
                                    ))}
                                    {Array.isArray(project.techStack) && project.techStack.length > 4 && (
                                        <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                            +{project.techStack.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <a href={project.liveLink} target="_blank" className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all active:scale-90" title="Live View"><ExternalLink size={18} /></a>
                                    <a href={project.githubLink} target="_blank" className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all active:scale-90" title="Source Code"><Github size={18} /></a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEdit(project)} className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all active:scale-90" title="Edit Content"><Edit2 size={18} /></button>
                                    <button onClick={() => project._id && handleDeleteClick(project._id)} className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-all active:scale-90" title="Delete Permanent"><Trash2 size={18} /></button>
                                </div>
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
                title="Delete Project"
                message={`Are you sure you want to delete this project? This will permanently remove it from your portfolio.`}
            />
        </div>
    );
}
