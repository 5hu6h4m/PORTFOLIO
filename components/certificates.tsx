"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Award, FileText, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Certificate {
    _id: string;
    title: string;
    issuer: string;
    date: string;
    image: string;
}

export function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadCerts = async () => {
      try {
        const response = await fetch(`/api/certificates`, { cache: 'no-store' })
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setCerts(data)
      } catch (err) {
        console.warn("Backend not reachable.", err)
        setCerts([])
      } finally {
        setLoading(false)
      }
    }
    loadCerts()
  }, [])

  // Auto-sliding loop for mobile (2s interval)
  useEffect(() => {
    if (typeof window === 'undefined' || certs.length <= 1) return;
    
    const conductSwap = () => {
      if (window.innerWidth < 1024) {
        next();
      }
    };

    const interval = setInterval(conductSwap, 2000);
    return () => clearInterval(interval);
  }, [certs])

  const next = () => {
    const visibleCards = typeof window !== 'undefined' && window.innerWidth < 1024 ? 1 : 4
    setCurrentIndex((prev) => (prev + 1) % (certs.length - visibleCards + 1))
  }

  const prev = () => {
    const visibleCards = typeof window !== 'undefined' && window.innerWidth < 1024 ? 1 : 4
    setCurrentIndex((prev) => (prev - 1 + (certs.length - visibleCards + 1)) % (certs.length - visibleCards + 1))
  }

  if (loading || certs.length === 0) return null

  return (
    <section id="certificates" className="container py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24 md:mb-40 px-4 relative z-10"
      >
        <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.5em] text-[#00f5d4] mb-4">Credentials & Achievements</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
          Premium 
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-rose-500">Certificates</span>
            <div className="absolute -top-[12.5rem] -right-28 w-[22rem] h-[22rem] z-20 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Image 
                src="/sit.png" 
                alt="Character Sitting" 
                width={352}
                height={352}
                quality={100}
                className="w-full h-full object-contain overflow-visible"
                style={{ transform: "translateY(13px) translateX(10px)" }} 
              />
            </div>
          </span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base leading-relaxed italic">
          A showcase of verified professional certifications.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative max-w-7xl mx-auto px-4 z-10"
      >
        <div className="relative overflow-hidden px-4">
          <motion.div 
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 24}px)` }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex gap-6 lg:gap-8"
          >
            {certs.map((cert, index) => (
              <div 
                key={cert._id} 
                className="w-full lg:w-[calc(25%-1.5rem)] flex-shrink-0"
              >
                <CertificateCard cert={cert} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col items-center mt-12 gap-8">
          <div className="flex items-center gap-8">
            <button onClick={prev} disabled={currentIndex === 0} className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,245,212,0.3)] text-white/50 hover:text-white disabled:opacity-20 transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={next} disabled={currentIndex >= certs.length - (typeof window !== 'undefined' && window.innerWidth < 1024 ? 1 : 4)} className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(255,45,85,0.3)] text-white/50 hover:text-white disabled:opacity-20 transition-all duration-300">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function CertificateCard({ cert, index }: { cert: Certificate, index: number }) {
  const themes = [
    { bg: "bg-amber-600/20", border: "border-amber-500/30", text: "text-amber-400", shadow: "shadow-amber-500/20", gradient: "from-amber-600/40 to-amber-900/60" },
    { bg: "bg-cyan-600/20", border: "border-cyan-500/30", text: "text-cyan-400", shadow: "shadow-cyan-500/20", gradient: "from-cyan-600/40 to-cyan-900/60" },
    { bg: "bg-blue-600/20", border: "border-blue-500/30", text: "text-blue-400", shadow: "shadow-blue-500/20", gradient: "from-blue-600/40 to-blue-900/60" },
    { bg: "bg-rose-600/20", border: "border-rose-500/30", text: "text-rose-400", shadow: "shadow-rose-500/20", gradient: "from-rose-600/40 to-rose-900/60" },
  ]
  const theme = themes[index % themes.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 1.2, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="h-full w-full"
    >
        <motion.div 
          className="relative group w-full h-[450px] flex flex-col items-center justify-end mt-16"
          whileHover="hover"
          initial="initial"
        >
      <motion.div 
        variants={{
          hover: { y: -50, scale: 1.02, opacity: 1, rotate: 2 },
          initial: { y: 40, scale: 0.95, opacity: 1, rotate: 0 }
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute top-10 w-[85%] aspect-[1.1] bg-[#fdfaf1] rounded-lg shadow-2xl border border-black/10 flex flex-col items-center p-4 z-10 overflow-hidden"
      >
        <div className="w-full h-full border-2 border-[#d4af37]/20 rounded-md p-2 flex flex-col items-center justify-center relative">
          <div className="absolute top-2 left-2 right-2 border-t border-[#d4af37]/30" />
          <div className="absolute bottom-2 left-2 right-2 border-b border-[#d4af37]/30" />
          <div className="w-12 h-12 rounded-full border-2 border-[#d4af37]/40 flex items-center justify-center mb-2 mt-4">
             <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#886d1a]" />
             </div>
          </div>
          <h4 className="text-[10px] sm:text-xs font-serif font-bold text-[#886d1a] tracking-[0.2em] uppercase mb-1 text-center px-2 line-clamp-1 w-full max-w-[80%]">{cert.title}</h4>
          <div className="w-16 h-[1px] bg-[#d4af37]/30 mb-2 mt-1" />
          <div className="flex flex-col gap-1 w-full px-2">
            <div className="h-[2px] w-full bg-[#d4af37]/10" />
            <div className="h-[2px] w-3/4 mx-auto bg-[#d4af37]/10" />
            <div className="h-[2px] w-1/2 mx-auto bg-[#d4af37]/10" />
          </div>
          <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20" />
        </div>
      </motion.div>

      <div className={cn(
        "relative w-full h-[320px] rounded-[2.5rem] p-8 flex flex-col items-center justify-end z-20 overflow-hidden border transition-all duration-500 shadow-2xl bg-black/40 backdrop-blur-3xl group-hover:bg-black/20",
        theme.border,
        `group-hover:${theme.shadow}`
      )}>
        <div className={cn("absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-b", theme.gradient)} />
        <div className="relative z-30 w-full text-center">
          <h3 className="text-white font-black text-xl leading-tight tracking-tight mb-4 uppercase">{cert.title}</h3>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 opacity-60">
                <CheckCircle2 className={cn("w-4 h-4", theme.text)} />
                <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{cert.issuer}</span>
            </div>
            <div className="text-[10px] text-white/20 font-mono font-bold tracking-widest">{cert.date}</div>
            <a 
                href={cert.image?.startsWith('http') ? cert.image : `${BASE_URL}${cert.image}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={cn(
                    "mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all transform active:scale-95",
                    `group-hover:border-${theme.text.split('-')[1]}-500/50`
                )}
            >
              View Credential <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
        </motion.div>
    </motion.div>
  )
}
