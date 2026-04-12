"use client"

import { motion } from "framer-motion"
import { Calendar, GraduationCap, Trophy } from "lucide-react"

const education = [
    {
        degree: "B.Tech – Computer Science & Design",
        institution: "MET Bhujbal Knowledge City",
        year: "2024 – Present",
        score: "7.8",
        scoreLabel: "GPA",
        description: [
            "Focused on full-stack development and modern web technologies.",
            "Actively building real-world projects and improving problem-solving skills.",
        ]
    },
    {
        degree: "Higher Secondary (Science)",
        institution: "Shree Chhatrapati Shivaji Maharaj High School",
        year: "2023",
        score: "75%",
        scoreLabel: "Percentage",
        description: [
            "Completed Higher Secondary Certificate with Science stream.",
            "Built strong foundation in Mathematics, Physics and Computer Science.",
        ]
    },
    {
        degree: "Secondary Education",
        institution: "Muktangan Educational Campus",
        year: "2022",
        score: "91.80%",
        scoreLabel: "Percentage",
        description: [
            "Achieved an outstanding score in the SSC examination.",
            "Demonstrated consistent dedication and academic excellence.",
        ]
    },
]

export function Experience() {
    return (
        <section id="experience" className="container py-48 border-b border-white/5">


            {/* ── Education Heading ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
                className="text-center mb-24 relative z-10"
            >
                <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.5em] text-[#00f5d4] mb-4">
                    WHERE IT ALL STARTED
                </h2>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                    My{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-rose-500">
                        Education
                    </span>
                </h1>
                <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base leading-relaxed italic">
                    The academic milestones that shaped my technical foundation and problem-solving mindset.
                </p>
            </motion.div>

            {/* ── Education Stacked Cards ── */}
            <div className="flex flex-col relative w-full mt-10 max-w-4xl mx-auto pb-10">
                {education.map((item, index) => (
                    <div
                        key={index}
                        className="sticky flex flex-col items-center justify-center w-full min-h-[40vh] md:min-h-[50vh] mb-16 md:mb-32"
                        style={{
                            top: `max(15vh, 120px)`, // Stick near the top, under the header
                            zIndex: index + 10 // Ensure proper stacking
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden p-8 md:p-14 border border-white/10 shadow-[0_-20px_50px_-20px_rgba(0,245,212,0.1),_0_30px_60px_-15px_rgba(0,0,0,0.9)] bg-[#040e0b] group transform transition-all duration-500 hover:border-[#00f5d4]/30"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f5d4]/5 rounded-full blur-[80px] -z-10 group-hover:bg-[#00f5d4]/10 transition-colors duration-500" />
                            
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12 relative z-10 w-full">
                                {/* Left Side: Degree, Institution, Description */}
                                <div className="flex-1">
                                    {/* Year */}
                                    <div className="flex items-center gap-2 text-[#00f5d4] font-mono text-xs md:text-sm mb-4 uppercase tracking-widest bg-[#00f5d4]/10 inline-flex px-4 py-1.5 rounded-full border border-[#00f5d4]/20">
                                        <Calendar className="w-4 h-4" />
                                        {item.year}
                                    </div>

                                    {/* Degree */}
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                                        {item.degree}
                                    </h3>

                                    {/* Institution */}
                                    <div className="flex items-center gap-2 text-white/50 font-medium mb-6 uppercase text-sm md:text-base">
                                        <GraduationCap className="w-5 h-5" />
                                        {item.institution}
                                    </div>

                                    {/* Description bullets */}
                                    <ul className="space-y-4">
                                        {item.description.map((desc, i) => (
                                            <li key={i} className="flex gap-3 text-white/60 group-hover:text-white/80 transition-colors text-sm md:text-base">
                                                <span className="text-[#00f5d4] mt-1 text-xs">≫</span>
                                                <span className="leading-relaxed">{desc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* Right Side: Score */}
                                <div className="md:w-48 shrink-0">
                                    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#00f5d4]/10 to-transparent border border-[#00f5d4]/20 shadow-inner group-hover:shadow-[0_0_20px_rgba(0,245,212,0.1)] transition-all duration-500 h-full min-h-[140px]">
                                        <Trophy className="w-8 h-8 text-[#00f5d4] mb-3 group-hover:scale-110 transition-transform duration-500" />
                                        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-[#00f5d4]/70 mb-1">
                                            {item.scoreLabel}
                                        </p>
                                        <p className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none text-center">
                                            {item.score}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    )
}
