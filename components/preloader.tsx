"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const bootLines = [
  "Initializing Shubham OS v2026.03...",
  "Loading kernel modules...",
  "Checking hardware compatibility...",
  "Establishing secure connection...",
  "Loading UI components...",
  "System ready. Welcome, Shubham.",
]

export function Preloader() {
  const [currentLine, setCurrentLine] = useState(0)
  const [complete, setComplete] = useState(false)
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Check if preloader has already run this session (Safe access)
    try {
      const hasRun = sessionStorage.getItem("preloader-run")
      if (hasRun) {
        setShow(false)
        return
      }
    } catch (e) {
      console.warn("Storage access denied. Preloader will run normally.")
    }

    let timer: NodeJS.Timeout
    if (currentLine < bootLines.length) {
      timer = setTimeout(() => {
        setCurrentLine((prev) => prev + 1)
      }, 400 + Math.random() * 600)
    } else {
      timer = setTimeout(() => {
        setComplete(true)
        try {
          sessionStorage.setItem("preloader-run", "true")
        } catch (e) {
          // Ignore storage errors on write
        }
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [currentLine])

  if (!show) return null

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-start justify-center bg-black p-8 font-mono text-sm md:text-base text-primary overflow-hidden"
        >
          <div className="max-w-2xl space-y-2">
            {bootLines.slice(0, currentLine + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="text-primary opacity-50 select-none">[{i}]</span>
                <span>{line}</span>
                {i === currentLine && i < bootLines.length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-primary"
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
