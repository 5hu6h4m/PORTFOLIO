"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import React from "react"

export function TiltCard({ children, shineColor = "#00f5d4" }: { children: React.ReactNode, shineColor?: string }) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const shineOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0, 1])

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative h-full"
        >
            {children}
            <motion.div 
                style={{
                    background: `radial-gradient(circle at center, ${shineColor}15 0%, transparent 80%)`,
                    opacity: shineOpacity,
                }}
                className="absolute inset-0 pointer-events-none z-30"
            />
        </motion.div>
    )
}
