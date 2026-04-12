"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, PerspectiveCamera, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei"
import * as THREE from "three"

function Shape({ position, color, type }: { position: [number, number, number], color: string, type: 'sphere' | 'cube' | 'torus' }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.x = Math.cos(t / 4) / 2
        meshRef.current.rotation.y = Math.sin(t / 4) / 2
        meshRef.current.position.y = position[1] + Math.sin(t / 2) * 0.5
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                {type === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
                {type === 'cube' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
                {type === 'torus' && <torusGeometry args={[1, 0.4, 16, 100]} />}
                
                {type === 'sphere' ? (
                    <MeshDistortMaterial
                        color={color}
                        speed={5}
                        distort={0.4}
                        radius={1}
                    />
                ) : (
                    <MeshWobbleMaterial
                        color={color}
                        speed={2}
                        factor={0.5}
                    />
                )}
            </mesh>
        </Float>
    )
}

export function FloatingShapes() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f5d4" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#9b5de5" />
                
                <Shape position={[-5, 2, -2]} color="#00f5d4" type="sphere" />
                <Shape position={[5, -2, -5]} color="#9b5de5" type="cube" />
                <Shape position={[2, 4, -8]} color="#00f5d4" type="torus" />
                <Shape position={[-3, -4, -4]} color="#9b5de5" type="sphere" />
                
                {/* Background stars/particles could also be here, but we use the canvas background component */}
            </Canvas>
        </div>
    )
}
