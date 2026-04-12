"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Github, Linkedin, Mail, MessageCircle, Send, ArrowUpRight, Globe, Clock, MapPin, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createPortal } from "react-dom"

const contactMethods = [
    {
        name: "Email",
        value: "shubhamjadhav86@gmail.com",
        icon: Mail,
        href: "mailto:shubhamjadhav86@gmail.com",
        color: "#00ffff"
    },
    {
        name: "Github",
        value: "Shubhamjadhav86",
        icon: Github,
        href: "https://github.com/Shubhamjadhav86",
        color: "#ffffff"
    },
    {
        name: "Linkedin",
        value: "Connect with me",
        icon: Linkedin,
        href: "#",
        color: "#0077B5"
    },
    {
        name: "WhatsApp",
        value: "Direct Chat",
        icon: MessageCircle,
        href: "https://wa.me/910000000000",
        color: "#25D366"
    }
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.4,
            delayChildren: 0.5
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1] as any 
        }
    }
}

export function Contact() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const successModal = (
        <AnimatePresence>
            {showSuccess && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSuccess(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-2xl pointer-events-auto cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        className="relative w-full max-w-sm bg-[#050505] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden group pointer-events-auto"
                    >
                        {/* Decorative Top Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        
                        {/* Animated Checkmark */}
                        <div className="mb-8 relative">
                            <motion.div 
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                                className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10"
                            >
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <motion.path 
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                                        d="M20 6L9 17L4 12"
                                    />
                                </svg>
                            </motion.div>
                            
                            {/* Radials */}
                            <motion.div 
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 rounded-full border border-primary/40 -z-10"
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div>
                                <h4 className="text-2xl font-black text-white tracking-widest uppercase italic mb-1">Transmission</h4>
                                <h4 className="text-sm font-mono text-primary font-bold tracking-[0.4em] uppercase">Successful</h4>
                            </div>
                            
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Your message has been encrypted and delivered. I will respond to your inquiry shortly.
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            onClick={() => setShowSuccess(false)}
                            className="mt-10 w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.3em] transition-all hover:border-primary/40 active:scale-95"
                        >
                            Return to Interface
                        </motion.button>

                        {/* Scan Line */}
                        <motion.div 
                            animate={{ y: [0, 400] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <section id="contact" className="container py-40 border-b border-white/5 relative overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1, margin: "-50px" }}
                className="relative z-10"
            >
                {/* Header Section */}
                <motion.div 
                    variants={itemVariants}
                    className="text-center mb-24 relative z-10"
                >
                    <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.5em] text-[#00f5d4] mb-4">GET IN TOUCH</h2>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                        Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-rose-500">Me</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base leading-relaxed italic">Let&apos;s build the future together. Reach out for collaborations or opportunities.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Main Contact Card Area */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ scale: 1.005 }}
                        className="lg:col-span-7 glass p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden h-full"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-all" />
                        
                        <div className="relative z-10">
                            <h3 className="text-4xl font-bold mb-6 tracking-tight leading-tight">
                                Got a project in mind? <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Let&apos;s Build it Together!</span>
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-md italic mb-8">
                                I&apos;m currently open to new opportunities and freelance collaborations. 
                                Turn your ideas into digital reality.
                            </p>
                        </div>

                        <div className="mt-auto relative z-10">
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const data = {
                                    name: formData.get('name'),
                                    email: formData.get('email'),
                                    subject: formData.get('subject'),
                                    message: formData.get('message')
                                };
                                try {
                                    setIsSubmitting(true);
                                    const { sendMessage } = await import('@/lib/admin-api');
                                    await sendMessage(data);
                                    setShowSuccess(true);
                                    (e.target as HTMLFormElement).reset();
                                } catch (err) {
                                    alert('Failed to send message');
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-primary font-bold ml-2">Name</label>
                                        <input name="name" placeholder="Shubham Jadhav" required className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-primary font-bold ml-2">Email</label>
                                        <input name="email" type="email" placeholder="hello@example.com" required className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-primary font-bold ml-2">Subject</label>
                                    <input name="subject" placeholder="Project Inquiry" required className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-primary font-bold ml-2">Message</label>
                                    <textarea name="message" placeholder="Tell me about your vision..." required className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full h-40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono text-sm resize-none" />
                                </div>
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    disabled={isSubmitting}
                                    className="group relative rounded-2xl h-16 px-10 text-base font-bold shadow-[0_10px_30px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,245,212,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300 w-full md:w-auto disabled:opacity-50 overflow-hidden"
                                >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                                {isSubmitting ? (
                                    <span className="relative z-10 flex items-center">
                                        <Zap className="w-5 h-5 mr-3 animate-pulse" />
                                        Transmitting...
                                    </span>
                                ) : (
                                    <span className="relative z-10 flex items-center">
                                        <Send className="w-5 h-5 mr-3" />
                                        Initiate Contact
                                    </span>
                                )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-5 flex flex-col gap-8 h-full">
                        {/* Current Status Card */}
                        <motion.div 
                            variants={itemVariants}
                            className="glass p-8 rounded-[2.5rem] flex-1 flex flex-col justify-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] -z-10 group-hover:bg-green-500/20 transition-all" />
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                                </div>
                                <span className="text-sm font-mono uppercase tracking-widest text-green-500 font-bold">Current Status: Available</span>
                            </div>
                            <h4 className="text-2xl font-bold mb-4 tracking-tight">Based in India, <br /> Working Worldwide.</h4>
                            <div className="space-y-4 text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-primary" />
                                    <p className="text-sm font-mono">Asia/Kolkata (GMT+5:30)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <p className="text-sm font-mono">Mon - Sat: 9AM - 8PM</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <p className="text-sm font-mono">Remote Friendly / Hybrid</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Links Bento Section */}
                        <div className="grid grid-cols-2 gap-6 flex-1">
                            {contactMethods.map((method, index) => (
                                <motion.a
                                    key={index}
                                    href={method.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variants={itemVariants}
                                    whileHover={{ y: -8, scale: 1.05, rotate: 2 }}
                                    className="glass p-6 rounded-[2rem] flex flex-col items-center justify-center text-center group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <method.icon className="w-6 h-6" style={{ color: method.color }} />
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{method.name}</p>
                                    <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 absolute top-5 right-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {/* Success Overlay with Portal */}
            {mounted && createPortal(successModal, document.body)}

            {/* Footer */}
            <div className="mt-32 text-center text-muted-foreground font-mono text-sm opacity-50 uppercase tracking-[0.3em]">
                Designed & Built by Shubham Jadhav © 2026
            </div>
        </section>
    )
}
