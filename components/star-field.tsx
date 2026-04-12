"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function StarField() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted || theme !== "dark") return null

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                    }}
                />
            ))}
            {/* Subtle Moon glow in top right */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-primary/5 blur-[100px] rounded-full" />
        </div>
    )
}
