import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { SkillsPlayground } from "@/components/skills-playground"
import { Projects } from "@/components/projects"
import { Experience } from "@/components/experience"
import { Certificates } from "@/components/certificates"
import { Contact } from "@/components/contact"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <SkillsPlayground />
        <Projects />
        <Experience />
        <Certificates />
        <Contact />
      </main>
      <footer className="text-center py-10 border-t border-white/10 mt-20 bg-[#050505]">
        <p className="text-sm font-bold tracking-tight text-white/90">
          Shubham Jadhav <span className="text-primary mx-2">—</span> Full Stack Developer
        </p>

        <div className="flex justify-center gap-6 mt-4 text-sm font-medium text-white/60">
          <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          <a href="https://github.com/Shubhamjadhav86" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
        </div>

        <p className="text-xs mt-6 text-white/30 font-mono tracking-widest uppercase">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  )
}
