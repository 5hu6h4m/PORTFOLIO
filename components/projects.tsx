"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Projects() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await fetch(`/api/projects`, { cache: 'no-store' })
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json()
                setProjects(data)
            } catch (err) {
                console.warn("Backend not reachable. Falling back to local data.", err)
                setError(err instanceof Error ? err : new Error(String(err)))
                setProjects([]) 
            } finally {
                setLoading(false)
            }
        }
        loadProjects()
    }, [])

    if (loading) return <div className="py-24 text-center font-mono animate-pulse text-[#00f5d4] uppercase tracking-widest">Initialising Project Modules...</div>
    
    if (error && projects.length === 0) return (
        <div className="py-12 px-6 text-center border border-yellow-500/20 bg-yellow-500/5 rounded-2xl mx-auto max-w-xl">
             <p className="text-yellow-500 font-mono text-xs flex flex-col items-center">
                 <span>⚠️ BACKEND_SERVICE_OFFLINE: Connect your MongoDB</span>
             </p>
        </div>
    )

    if (projects.length === 0) return null

    return (
        <section id="projects" className="relative z-10 bg-[#071a15] py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative pb-[20vh]">
                {/* Header */}
                <div className="mb-20 md:mb-32 text-center pointer-events-none sticky top-12 z-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight bg-[#071a15] inline-block px-8 py-2 rounded-full border border-white/10 shadow-2xl">My Work</h2>
                </div>

                <div className="flex flex-col relative w-full mt-10">
                    {projects.map((project: any, index: number) => {
                        const imgUrl = project.image?.startsWith('http') ? project.image : `${BASE_URL}${project.image}`;
                        
                        return (
                            <div 
                                key={project._id || index}
                                className="sticky flex flex-col items-center justify-center w-full min-h-[70vh] md:min-h-[80vh] mb-24 md:mb-40"
                                style={{
                                    top: `15vh`, // Stick near the top, under the header
                                    zIndex: index + 10 // Ensure proper stacking
                                }}
                            >
                                <div className="relative w-full h-[60vh] md:h-[70vh] rounded-[2rem] overflow-hidden flex flex-col items-center justify-end p-8 md:p-16 border md:border-2 border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] bg-[#051410] group transform transition-all duration-500 hover:scale-[1.02]">
                                    
                                    {/* Project Image */}
                                    <div className="absolute inset-0 w-full h-full">
                                        <img 
                                            src={imgUrl} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-70 transition-opacity" 
                                        />
                                        {/* Extremely subtle gradient ONLY at the bottom for text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                                    </div>

                                    {/* Integrated Content - Clean and non-obstructive */}
                                    <div className="absolute inset-x-0 bottom-0 z-20 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row justify-between items-end gap-8">
                                        <div className="max-w-3xl text-left flex gap-6 items-start">
                                            {/* Vertical Accent Line */}
                                            <div className="hidden md:block w-1.5 h-32 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full mt-4" />

                                            <div className="flex-1">
                                                {/* Meta Info */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-[10px] md:text-xs font-mono font-black text-primary uppercase tracking-[0.3em]">Project {String(index + 1).padStart(2, '0')}:</span>
                                                    {project.techStack && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {(Array.isArray(project.techStack) ? project.techStack : project.techStack.split(',')).slice(0, 3).map((tech: string, i: number) => (
                                                                <span key={i} className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                                    {tech.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 
                                                    className="text-4xl md:text-6xl lg:text-7xl font-sans font-black mb-6 leading-[1.05] tracking-tighter"
                                                    style={{ textShadow: '0 10px 30px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)' }}
                                                >
                                                    <span className="text-white">{project.title.split('(')[0]}</span>
                                                    {project.title.includes('(') && (
                                                        <span 
                                                            className="block text-2xl md:text-3xl lg:text-4xl text-primary font-bold mt-2 italic"
                                                            style={{ textShadow: '0 5px 15px rgba(0,0,0,1)' }}
                                                        >
                                                            {project.title.substring(project.title.indexOf('('))}
                                                        </span>
                                                    )}
                                                </h3>
                                                
                                                <p 
                                                    className="text-white/95 text-sm md:text-lg lg:text-xl font-medium leading-relaxed line-clamp-2 max-w-2xl border-l-[3px] border-primary/40 pl-6 ml-1"
                                                    style={{ textShadow: '0 2px 8px rgba(0,0,0,1)' }}
                                                >
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Primary CTA */}
                                        <div className="flex flex-col items-end gap-6 min-w-fit">
                                            <div className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-primary/60 pb-1 border-b border-primary/20 hover:text-white hover:border-white transition-all cursor-pointer">
                                                Explore Case Study
                                            </div>
                                            <Button 
                                                asChild 
                                                className="h-12 md:h-16 px-10 md:px-14 rounded-full bg-white hover:bg-primary text-black font-black text-base md:text-xl transition-all hover:scale-105 shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
                                            >
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                                    View Project
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                
            </div>
        </section>
    )
}
