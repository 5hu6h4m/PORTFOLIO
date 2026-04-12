'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/admin-api';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login('admin', password);
            // Session is now managed securely via backend HTTP-Only cookies
            window.location.href = '/admin/dashboard';
        } catch (err: any) {

            setError(err.message === 'Login failed' ? 'INVALID_SECURITY_KEY' : err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-4">
            <div className="w-full max-w-sm bg-[#0a0a0a] p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 bg-[length:200%_auto] animate-gradient" />
                
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                        <Lock className="w-8 h-8 text-cyan-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
                    <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-mono">Authentication Required</p>
                </div>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-lg mb-6 text-center"
                    >
                        <p className="text-red-500 text-xs font-mono uppercase tracking-tighter">{error}</p>
                    </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="SECURITY_KEY"
                            className="w-full px-4 py-4 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:bg-white/10 transition-all outline-none text-center tracking-[0.5em] font-mono text-sm placeholder:tracking-normal placeholder:opacity-20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-cyan-400 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : "AUTHENTICATE"}
                    </button>
                </form>
            </div>
        </div>
    );
}
