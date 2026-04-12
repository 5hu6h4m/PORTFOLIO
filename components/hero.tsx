"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { InteractiveBackground } from "@/components/interactive-background"
import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useLenis } from "lenis/react"
import { ResumeButton } from "./resume-button"

export function Hero() {
    const [text, setText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [loopNum, setLoopNum] = useState(0)
    const [typingSpeed, setTypingSpeed] = useState(150)

    const phrases = ["Software Developer", "Full Stack Engineer", "UI Architect"]

    const lenis = useLenis()

    const scrollToSection = (e: React.MouseEvent, href: string) => {
        e.preventDefault()
        lenis?.scrollTo(href, {
            offset: 0,
            duration: 2,
            easing: (t) => 1 - Math.pow(1 - t, 4) // Quart Out
        })
    }

    useEffect(() => {
        const handleType = () => {
            const i = loopNum % phrases.length
            const fullPhrase = phrases[i]

            setText(isDeleting 
                ? fullPhrase.substring(0, text.length - 1) 
                : fullPhrase.substring(0, text.length + 1)
            )

            setTypingSpeed(isDeleting ? 100 : 150)

            if (!isDeleting && text === fullPhrase) {
                setTimeout(() => setIsDeleting(true), 2000)
            } else if (isDeleting && text === "") {
                setIsDeleting(false)
                setLoopNum(loopNum + 1)
            }
        }

        const timer = setTimeout(handleType, typingSpeed)
        return () => clearTimeout(timer)
    }, [text, isDeleting, loopNum, typingSpeed, phrases])

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-32 lg:pt-20 pb-12">
            <InteractiveBackground />
            
            <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-6 lg:px-20">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-20 space-y-6 lg:space-y-10 mt-16 sm:mt-24 md:mt-0 pt-8 lg:pt-0 text-left"
                >
                    <div className="space-y-2 lg:space-y-4">
                        <h3 className="text-[1rem] md:text-[1.35rem] font-bold font-mono tracking-tight text-white flex items-center gap-2 h-8 mt-12 lg:mt-0">
                            {text}<span className="w-1.5 h-6 lg:h-8 bg-[#00f5d4] animate-pulse" />
                        </h3>
                        <h2 className="text-[1.7rem] md:text-[3.4rem] font-bold text-[#00f5d4] tracking-tight -mb-1 md:mb-2">
                            Hello, I&apos;m
                        </h2>
                        <h1 className="flex flex-col gap-1 text-[3.4rem] sm:text-[3.4rem] lg:text-[6.75rem] font-black tracking-tighter leading-[0.8] font-[family-name:var(--font-plus-jakarta)] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00f5d4] to-white drop-shadow-[0_0_35px_rgba(0,245,212,0.4)]">
                            <span className="pr-12 w-fit">Shubham</span>
                            <span className="pb-[4px] pr-12 w-fit">Jadhav</span>
                        </h1>
                    </div>
                    
                    <p className="text-sm md:text-2xl text-white/60 max-w-xl leading-relaxed font-medium font-[family-name:var(--font-inter)] italic drop-shadow-sm">
                        &quot;I build products, not just projects — designed to solve, scale, and stand out.&quot;
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-4">
                        <Link href="#projects" onClick={(e) => scrollToSection(e, "#projects")}>
                            <button className="group relative px-6 lg:px-10 h-10 lg:h-14 bg-[#00f5d4] text-black rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,245,212,0.5)] active:scale-95">
                                <span className="relative z-10">View My Work</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </button>
                        </Link>
                        
                        <Link href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>
                            <button className="group relative px-6 lg:px-10 h-10 lg:h-14 bg-white text-black rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,245,212,0.35)] hover:bg-[#00f5d4] active:scale-95">
                                <span className="relative z-10">Contact Me</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </button>
                        </Link>
                        
                        <ResumeButton variant="hero" />
                    </div>

                    <div className="flex items-center gap-6 lg:gap-8 pt-4 lg:pt-6">
                        {[
                            { Icon: Linkedin, href: "https://www.linkedin.com/in/shubham-jadhav-b209a6307/" },
                            { Icon: Github, href: "https://github.com/5hu6h4m" },
                            { Icon: Mail, href: "mailto:shubhamja9863@gmail.com" }
                        ].map((social, i) => (
                            <motion.a
                                key={i}
                                href={social.href}
                                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                                rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                                whileHover={{ scale: 1.3, color: "#00f5d4" }}
                                className="text-white/80 transition-colors"
                            >
                                <social.Icon className="w-5 h-5 lg:w-8 lg:h-8" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Right Visual (Desktop) / Background mascot (Mobile) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute lg:relative inset-0 lg:inset-auto flex items-center justify-center lg:justify-end z-10 lg:z-auto pointer-events-none lg:pointer-events-auto -mt-32 lg:mt-0"
                >
                    {/* Multi-layered Radial Glow */}
                    <div className="absolute w-full h-full lg:w-[130%] lg:h-[130%] bg-[#00f5d4]/5 blur-[80px] lg:blur-[120px] rounded-full pointer-events-none animate-pulse" />
                    
                    <div className="relative w-[90%] md:w-full max-w-[380px] md:max-w-[500px] lg:max-w-[700px] translate-x-16 translate-y-10 scale-[1.2] sm:scale-[1.3] md:scale-100 md:translate-x-0 md:translate-y-0 flex items-center justify-center opacity-40 md:opacity-50 lg:opacity-100 transition-all duration-1000">
                        <Image 
                            src="/avatar-real.png" 
                            alt="Avatar" 
                            width={700}
                            height={700}
                            quality={100}
                            className="object-contain w-full h-auto filter drop-shadow-[0_0_50px_rgba(0,245,212,0.45)]"
                            priority
                        />
                    </div>
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
        </section>
    )
}
