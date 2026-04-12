"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, MapPin, Briefcase, Globe, Star, GitBranch, Terminal, Layers, Code, Laptop, Zap, BookOpen, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

import { useMotionValue, useSpring, useTransform } from "framer-motion"
import { TiltCard } from "@/components/ui/tilt-card"
import { ResumeButton } from "./resume-button"

interface AboutSettings {
  showGithub: boolean
  showLeetcode: boolean
  showCustom: boolean
  customTitle: string
  customDesc: string
  resumeUrl: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// --- Skeleton Loader ---
function StatsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-lg" />
                <div className="h-6 w-24 bg-white/5 rounded" />
            </div>
            <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                    <div className="h-10 bg-white/5 rounded-2xl" />
                    <div className="h-4 w-1/2 bg-white/5 rounded" />
                </div>
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-2 bg-white/5 rounded-full" />)}
            </div>
        </div>
    )
}

// --- Sub-component for LeetCode Stats ---
function LeetCodeStats() {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/stats/leetcode")
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then(json => {
                setData(json)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [])

    if (loading) return <StatsSkeleton />
    if (error) return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-white/30">
            <Laptop className="w-8 h-8 opacity-20" />
            <p className="text-xs font-mono uppercase tracking-widest">Stats temporarily unavailable</p>
        </div>
    )

    const stats = [
        { label: "Easy", solved: data?.easySolved, total: data?.totalEasy, color: "#00f5d4", beats: "84%" },
        { label: "Medium", solved: data?.mediumSolved, total: data?.totalMedium, color: "#10b981", beats: "92%" },
        { label: "Hard", solved: data?.hardSolved, total: data?.totalHard, color: "#ff2d55", beats: "87%" },
    ]

    return (
        <div className="space-y-6 h-full flex flex-col justify-between" style={{ transform: "translateZ(50px)" }}>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5 shadow-inner">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-black tracking-tighter text-white">LeetCode</h3>
                    </div>
                    <div className="text-[10px] font-mono text-[#00f5d4] uppercase tracking-normal sm:tracking-widest bg-[#00f5d4]/10 px-3 py-1 rounded-full border border-[#00f5d4]/20 shadow-[0_0_15px_rgba(0,245,212,0.2)] self-start sm:self-auto">
                        Top 5.2% Globally
                    </div>
                </div>
                
                <p className="text-[10px] text-white/40 font-bold italic tracking-wide border-l-2 border-[#00f5d4]/30 pl-3">
                    &quot;Strong in Medium-level solving (92% beat rate)&quot;
                </p>
            </div>

            <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                        <motion.circle 
                            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={251.2}
                            initial={{ strokeDashoffset: 251.2 }}
                            whileInView={{ strokeDashoffset: 251.2 - (251.2 * (data?.totalSolved / data?.totalQuestions)) }}
                            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                            strokeLinecap="round"
                            className="text-[#00f5d4] drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">{data?.totalSolved}</span>
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Solved</span>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 gap-2">
                    <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5 group-hover:border-[#00f5d4]/30 transition-colors">
                        <div className="text-[10px] text-white/40 uppercase font-black">Global Rank</div>
                        <div className="text-sm font-black text-white">{data?.ranking?.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {stats.map((s) => (
                    <div key={s.label} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold tracking-tight">
                            <span className="text-white/50 uppercase">{s.label}</span>
                            <span className="text-white/90">{s.solved} <span className="text-white/30">/ {s.total}</span> <span className="text-[#10b981] ml-2">↑ {s.beats}</span></span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${(s.solved / s.total) * 100}%` }}
                                transition={{ duration: 1.2, ease: "circOut" }}
                                className="h-full rounded-full relative"
                                style={{ backgroundColor: s.color }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <span className="text-[9px] text-white/20 font-mono tracking-tighter">Active: Recently active</span>
                <Link href="#projects" className="text-[9px] font-black uppercase text-[#00f5d4] hover:underline tracking-widest transition-all">
                    Applied in E-Cell Platform →
                </Link>
            </div>
        </div>
    )
}

// --- Sub-component for GitHub Stats ---
function GitHubStats() {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/stats/github")
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then(json => {
                setData(json)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [])

    if (loading) return <StatsSkeleton />
    if (error) return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-white/30">
            <Globe className="w-8 h-8 opacity-20" />
            <p className="text-xs font-mono uppercase tracking-widest">Stats temporarily unavailable</p>
        </div>
    )

    const metrics = [
        { icon: Star, label: "Total Stars Earned:", value: data?.stars || "18" },
        { icon: Terminal, label: "Total Commits:", value: data?.commits || "332" },
        { icon: GitBranch, label: "Total PRs:", value: data?.prs || "22" },
        { icon: Code, label: "Total Open Issues:", value: data?.open_issues_count || "45" },
    ]

    return (
        <div className="space-y-6 h-full flex flex-col justify-between" style={{ transform: "translateZ(50px)" }}>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5 shadow-inner">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-black tracking-tighter text-white">GitHub</h3>
                    </div>
                    <div className="relative group/grade self-start sm:self-auto">
                        <div className="absolute inset-0 bg-[#00f5d4]/20 blur-xl group-hover/grade:bg-[#00f5d4]/40 transition-colors rounded-full" />
                        <div className="relative w-11 h-11 rounded-full border-2 border-[#00f5d4] flex items-center justify-center text-sm font-black shadow-[0_0_20px_rgba(0,245,212,0.3)] bg-black">
                            A+
                        </div>
                    </div>
                </div>
                
                <p className="text-[10px] text-white/40 font-bold italic tracking-wide border-l-2 border-[#ff2d55]/30 pl-3">
                    &quot;Consistent commits. Clean repos. Real impact.&quot;
                </p>
            </div>

            <div className="space-y-4">
                {metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between group/line">
                        <div className="flex items-center gap-4">
                            <div className="p-1.5 bg-white/5 rounded-md group-hover/line:bg-white/10 transition-colors">
                                <m.icon className="w-3.5 h-3.5 text-white/40 group-hover/line:text-[#ff2d55] transition-colors" />
                            </div>
                            <span className="text-[11px] font-bold text-white/50 tracking-tight uppercase">{m.label}</span>
                        </div>
                        <span className="text-sm font-black text-white group-hover/line:text-[#ff2d55] transition-colors">{m.value}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="h-2.5 w-full flex rounded-full overflow-hidden border border-white/5 shadow-inner">
                    {data?.languages?.map((lang: any, i: number) => (
                        <motion.div 
                            key={lang.name}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${lang.percent}%` }}
                            transition={{ duration: 1.5, delay: i * 0.2 }}
                            style={{ backgroundColor: lang.color }}
                            className="h-full first:rounded-l-full last:rounded-r-full relative group"
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                {lang.name}: {lang.percent}%
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {data?.languages?.map((lang: any) => (
                        <div key={lang.name} className="flex items-center justify-between group/chip cursor-default">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" style={{ backgroundColor: lang.color }} />
                                <span className="text-[10px] font-bold text-white/40 group-hover/chip:text-white transition-colors">{lang.name}</span>
                            </div>
                            <span className="text-[9px] font-mono text-white/20 group-hover/chip:text-[#ff2d55]">{lang.percent}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <span className="text-[9px] text-white/20 font-mono tracking-tighter">Last commit: {data?.lastActivity ? new Date(data.lastActivity).toLocaleDateString() : "Just now"}</span>
                <Link href="#projects" className="text-[9px] font-black uppercase text-[#ff2d55] hover:underline tracking-widest transition-all">
                    View Related Project →
                </Link>
            </div>
        </div>
    )
}

// --- Sub-component: Custom Block (Admin-Configurable) ---
function CustomBlock({ title, desc }: { title: string, desc: string }) {
    const skills = [
        { label: 'React & Next.js', color: '#00f5d4' },
        { label: 'Node.js + Express', color: '#00f5d4' },
        { label: 'TypeScript', color: '#00f5d4' },
        { label: 'Java', color: '#f97316' },
        { label: 'MongoDB', color: '#10b981' },
        { label: 'PostgreSQL', color: '#10b981' },
        { label: 'REST APIs', color: '#00f5d4' },
        { label: 'JWT Auth', color: '#00f5d4' },
        { label: 'TailwindCSS', color: '#00f5d4' },
        { label: 'Framer Motion', color: '#a78bfa' },
        { label: 'Docker', color: '#60a5fa' },
        { label: 'Git & GitHub', color: '#f97316' },
        { label: 'DSA (Java)', color: '#facc15' },
        { label: 'Figma', color: '#f472b6' },
        { label: 'Vercel', color: '#00f5d4' },
    ]

    const highlights = [
        { icon: Zap, text: 'Ships fast. Writes clean.' },
        { icon: Code, text: 'Full-Stack: Frontend to Database.' },
        { icon: Layers, text: 'Scalable architecture, first time.' },
    ]

    return (
        <div className="space-y-5 h-full flex flex-col justify-between" style={{ transform: 'translateZ(50px)' }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <Zap className="w-5 h-5 text-[#00f5d4]" />
                    </div>
                    <h3 className="text-xl font-black tracking-tighter text-white">
                        {title || 'Skills Snapshot'}
                    </h3>
                </div>
                <div className="text-[10px] font-mono text-[#00f5d4] uppercase tracking-widest bg-[#00f5d4]/10 px-3 py-1 rounded-full border border-[#00f5d4]/20 self-start sm:self-auto">
                    Full Stack
                </div>
            </div>

            {/* Description (admin-configurable) */}
            <p className="text-[10px] text-white/40 font-bold italic tracking-wide border-l-2 border-[#00f5d4]/30 pl-3">
                &quot;{desc || 'Building products that are fast, clean, and built to last.'}&quot;
            </p>

            {/* Skill Tags Grid */}
            <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                    <motion.span
                        key={s.label}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="text-[10px] font-black px-3 py-1.5 rounded-xl cursor-default transition-all"
                        style={{
                            background: `${s.color}14`,
                            border: `1px solid ${s.color}33`,
                            color: s.color,
                        }}
                    >
                        {s.label}
                    </motion.span>
                ))}
            </div>

            {/* Highlights */}
            <div className="space-y-2 pt-3 border-t border-white/5">
                {highlights.map((h) => (
                    <div key={h.text} className="flex items-center gap-3 group/h">
                        <h.icon className="w-3.5 h-3.5 text-[#00f5d4] shrink-0 group-hover/h:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-white/60 group-hover/h:text-white/90 transition-colors tracking-tight">{h.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function About() {
    const [recruiterMode, setRecruiterMode] = useState(false)
    const [aboutSettings, setAboutSettings] = useState<AboutSettings>({
        showGithub: true,
        showLeetcode: false,
        showCustom: true,
        customTitle: 'Currently Leveling Up',
        customDesc: 'Building real-world projects, sharpening DSA skills, and working toward 200+ LeetCode problems.',
        resumeUrl: ''
    })

    useEffect(() => {
        fetch('/api/settings/about-sections')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setAboutSettings(data) })
            .catch(() => {})
    }, [])

    return (
        <section id="about" className="container px-6 md:px-8 py-48 border-b border-white/5 relative overflow-hidden">
            {/* Background Texture/Accent */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -z-10" />
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-24 relative z-10"
            >
                <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.5em] text-[#00f5d4] mb-4">IDENTITY & STATS</h2>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-rose-500">Area</span>
                </h1>
                <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base leading-relaxed italic">The technical identity and professional metrics of Shubham Jadhav.</p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-center mb-16 gap-8">
                
                <button 
                    onClick={() => setRecruiterMode(!recruiterMode)}
                    className={cn(
                        "group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500",
                        recruiterMode 
                            ? "bg-[#00f5d4] border-[#00f5d4] text-black shadow-[0_0_30px_rgba(0,245,212,0.4)]" 
                            : "bg-white/5 border-white/10 text-white/60 hover:border-[#00f5d4]/40 hover:text-white"
                    )}
                >
                    <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        recruiterMode ? "bg-black" : "bg-[#00f5d4]"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {recruiterMode ? "Close Shortcut" : "Recruiter Shortcut"}
                    </span>
                </button>
            </div>
            <AnimatePresence mode="wait">
                {recruiterMode ? (
                    <motion.div
                        key="recruiter"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8 }}
                            className="glass p-10 rounded-[2.5rem] border border-[#00f5d4]/30 shadow-[0_0_50px_rgba(0,245,212,0.1)]"
                        >
                            <h4 className="text-xs font-black text-[#00f5d4] uppercase tracking-[0.3em] mb-6">Top Proficiency</h4>
                            <div className="space-y-4">
                                {["Next.js & React", "TypeScript", "Node.js (Express)", "PostgreSQL/Supabase", "UI Architecture"].map(skill => (
                                    <div key={skill} className="flex items-center gap-4 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]/30 group-hover:bg-[#00f5d4] transition-colors" />
                                        <span className="text-xl font-bold text-white/80 group-hover:text-white transition-colors tracking-tight">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="md:col-span-2 glass p-10 rounded-[2.5rem] border border-white/10 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-4">Flagship Project</h4>
                                    <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">E-CELL PLATFORM</h3>
                                    <p className="text-white/50 text-lg mt-4 max-w-lg leading-relaxed italic">&quot;A high-performance ecosystem for startups, built with technical precision.&quot;</p>
                                </div>
                                <div className="w-16 h-16 bg-[#00f5d4]/10 rounded-3xl border border-[#00f5d4]/20 flex items-center justify-center">
                                    <Globe className="w-8 h-8 text-[#00f5d4]" />
                                </div>
                            </div>
                                                        <div className="flex flex-wrap items-center gap-4">
                                    <Link href="#projects" className="group relative px-8 py-4 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest overflow-hidden transition-all duration-500 hover:bg-[#00f5d4] hover:shadow-[0_0_25px_rgba(0,245,212,0.4)] active:scale-95">
                                        <span className="relative z-10">View Project Case Study</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    </Link>
                                    <ResumeButton variant="about" />
                                </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="standard"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 h-fit"
                    >
                        <motion.div 
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            whileHover={{ scale: 1.01 }}
                            className="md:col-span-2 glass p-6 lg:p-8 rounded-[2rem] flex flex-col justify-between group h-fit border border-white/5 relative overflow-hidden"
                        >
                            <div className="h-full flex flex-col relative z-20">
                                <div className="space-y-4 text-white/60 leading-relaxed text-lg lg:text-xl flex-1">
                                    <p className="tracking-tight">
                                        I’m a <span className="text-[#00f5d4] font-black uppercase tracking-tighter">Full Stack Developer</span> with an obsession for 
                                        building high-performance, visually compelling web applications.
                                    </p>
                                    <p className="tracking-tight">
                                        My approach combines <span className="text-white font-bold italic underline decoration-[#00f5d4]/30 underline-offset-8">technical precision</span> with 
                                        creative problem-solving, ensuring every project delivers clean architecture 
                                        and a seamless user experience.
                                    </p>
                                </div>

                                {/* Avatar Image (Inside Card, PC Only) - Reduced Size */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="hidden md:block relative w-full h-[250px] mt-6 group-hover:scale-[1.03] transition-transform duration-1000 origin-bottom"
                                >
                                    <Image 
                                        src="/about.png" 
                                        alt="About Avatar" 
                                        fill
                                        quality={100}
                                        className="object-contain object-top filter drop-shadow-[0_0_50px_rgba(0,245,212,0.45)] brightness-110"
                                        priority
                                    />
                                    {/* Subtle Ambient Glow behind avatar */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent -z-10 blur-2xl" />
                                </motion.div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6 relative z-20">
                                    <div className="inline-flex px-4 py-2 bg-[#00f5d4]/5 rounded-full text-[10px] font-black font-mono border border-[#00f5d4]/20 uppercase tracking-[0.2em] text-[#00f5d4] shadow-[0_0_20px_rgba(0,245,212,0.1)] w-fit">Available for Hire</div>
                                    <div className="inline-flex px-4 py-2 bg-white/5 rounded-full text-[10px] font-black font-mono border border-white/10 uppercase tracking-[0.2em] text-white/40 w-fit">Remote / Mumbai</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Developer Stats Section — Controlled by Admin Settings */}
                        <motion.div 
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                            className="md:col-span-2 grid grid-cols-1 gap-6 h-fit"
                        >
                            {/* Block 1: LeetCode (shown if enabled) OR Custom Block */}
                            <TiltCard>
                                <motion.div 
                                    whileHover={{ borderColor: aboutSettings.showLeetcode ? "rgba(255, 161, 22, 0.4)" : "rgba(0, 245, 212, 0.4)" }}
                                    className="glass p-5 md:p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group transition-colors duration-500 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] h-fit"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full transition-colors"
                                        style={{ background: aboutSettings.showLeetcode ? 'rgba(255,161,22,0.05)' : 'rgba(0,245,212,0.05)' }} />
                                    <AnimatePresence mode="wait">
                                        {aboutSettings.showLeetcode ? (
                                            <motion.div key="leet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <LeetCodeStats />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="custom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <CustomBlock title={aboutSettings.customTitle} desc={aboutSettings.customDesc} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </TiltCard>

                            {/* Block 2: GitHub Stats (shown if enabled) */}
                            {aboutSettings.showGithub && (
                                <TiltCard shineColor="#ff2d55">
                                    <motion.div 
                                        whileHover={{ borderColor: "rgba(255, 45, 85, 0.4)" }}
                                        className="glass p-5 md:p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group transition-colors duration-500 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,45,85,0.1)] h-fit"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff2d55]/5 blur-[60px] rounded-full group-hover:bg-[#ff2d55]/10 transition-colors" />
                                        <GitHubStats />
                                    </motion.div>
                                </TiltCard>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
