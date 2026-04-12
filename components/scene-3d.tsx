"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial, Float, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

function Stars() {
    const ref = useRef<THREE.Points>(null!)
    const [positions] = useMemo(() => {
        const pos = new Float32Array(2000 * 3)
        for (let i = 0; i < 2000; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50
        }
        return [pos]
    }, [])

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 20
        ref.current.rotation.y -= delta / 30
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00f5d4"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

function Nebula() {
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext('2d')!
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
        gradient.addColorStop(0, 'rgba(155, 93, 229, 0.2)')
        gradient.addColorStop(1, 'rgba(5, 5, 5, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 512, 512)
        return new THREE.CanvasTexture(canvas)
    }, [])

    return (
        <mesh position={[0, 0, -10]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial map={texture} transparent opacity={0.5} depthWrite={false} />
        </mesh>
    )
}

function CentralGeometry() {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        const { x, y } = state.mouse
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, y * 0.5, 0.05)
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.5, 0.05)
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2, 1]} />
                <meshStandardMaterial
                    wireframe
                    color="#00f5d4"
                    emissive="#00f5d4"
                    emissiveIntensity={2}
                />
            </mesh>
        </Float>
    )
}

export default function Scene3D() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#9b5de5" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00f5d4" />
                <Stars />
                <CentralGeometry />
                <Nebula />
            </Canvas>
        </div>
    )
}
