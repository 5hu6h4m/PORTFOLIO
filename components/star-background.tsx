"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

const StarBackground = (props: any) => {
  const ref: any = useRef(null);
  const [sphere] = useState(() => {
    try {
      const p = random.inSphere(new Float32Array(5001), { radius: 1.2 });
      // Sanity check for NaNs
      for (let i = 0; i < p.length; i++) {
        if (isNaN(p[i])) p[i] = 0;
      }
      return p;
    } catch (e) {
      console.error("Failed to generate stars:", e);
      return new Float32Array(0);
    }
  });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta/10;
    ref.current.rotation.y -= delta/15;
  })

  return (
    <group rotation={[0,0, Math.PI / 4]}>
        <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled
        {...props}
        >
            <PointMaterial
                transparent
                color="#fff"
                size={0.002}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    </group>
  )
};

export const StarsCanvas = () => (
    <div className="w-full h-auto fixed inset-0 z-[1] pointer-events-none">
        <Canvas camera={{position: [0, 0, 1]}}>
        <Suspense fallback={null}>
            <StarBackground />
        </Suspense>
        </Canvas>
    </div>
)
