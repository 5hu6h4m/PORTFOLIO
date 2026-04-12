'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-lg"
      >
        <div className="relative">
            <h1 className="text-[150px] md:text-[200px] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-primary/30 select-none">
            404
            </h1>
            <div className="absolute inset-x-0 bottom-4 h-1/2 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 tracking-tight">
            Lost in Cyberspace?
        </h2>
        
        <p className="text-white/50 text-base mt-4 font-medium max-w-sm leading-relaxed">
          The page you're trying to reach doesn't exist or has been moved to a new dimension.
        </p>
        
        <div className="pt-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase rounded-2xl hover:bg-cyan-400 hover:text-white transition-all active:scale-95 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(0,245,212,0.5)]"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>Return Protocol</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
