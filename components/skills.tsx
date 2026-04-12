"use client"

import { motion } from "framer-motion"
import { 
    Code2, 
    Layers, 
    Cpu, 
    Globe, 
    Database, 
    Palette, 
    Terminal, 
    Smartphone,
    Layout
} from "lucide-react"

const skills = [
    { name: "React", category: "Frontend", color: "#61DAFB", icon: Code2 },
    { name: "Next.js", category: "Frontend", color: "#ffffff", icon: Globe },
    { name: "TypeScript", category: "Language", color: "#3178C6", icon: Terminal },
    { name: "Node.js", category: "Backend", color: "#339933", icon: Database },
    { name: "Tailwind", category: "Styling", color: "#06B6D4", icon: Palette },
    { name: "Three.js", category: "3D", color: "#ffffff", icon: Layers },
    { name: "Python", category: "Backend", color: "#3776AB", icon: Cpu },
    { name: "MongoDB", category: "Database", color: "#47A248", icon: Database },
    { name: "Framer", category: "Animation", color: "#0055FF", icon: Layout },
]

export function Skills() {
    return (
        <section id="skills" className="container py-48 border-b border-white/5">
            <div className="max-w-4xl mb-16">
                <h2 className="text-4xl font-bold mb-4 tracking-tighter">TECHNICAL STACK</h2>
                <p className="text-muted-foreground text-lg">Tools and technologies I use to bring ideas to life.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ 
                            y: -5,
                            borderColor: skill.color,
                            boxShadow: `0 0 20px ${skill.color}33`
                        }}
                        className="p-6 glass border border-white/5 rounded-2xl transition-all duration-300 group cursor-default"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#00f5d4]/10 transition-colors">
                                <skill.icon className="w-6 h-6" style={{ color: skill.color }} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-[#00f5d4] transition-colors">{skill.name}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{skill.category}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
