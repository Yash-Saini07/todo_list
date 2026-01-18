"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "../hooks/useTheme";
import * as THREE from "three";

// --------------------------------------------------------
// Vertex Shader
// --------------------------------------------------------
const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Deep Liquid flow - Increased amplitude frequency for more "ripples"
  float elevation = sin(modelPosition.x * 0.3 + uTime * 0.4) * 
                    sin(modelPosition.y * 0.3 + uTime * 0.2) * 2.0;
  
  // Secondary detail wave
  elevation -= cos(modelPosition.x * 1.0 + uTime * 0.8) * 0.2;

  // Mouse interaction
  float dist = distance(uMouse, modelPosition.xy);
  float interaction = max(0.0, 6.0 - dist); // Larger radius
  elevation += interaction * 0.5;

  modelPosition.z += elevation;
  vElevation = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
}
`;

// --------------------------------------------------------
// Fragment Shader
// --------------------------------------------------------
const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  // 1. Complex Gradient Mixing
  // Faster, more varied shifts
  float timeFast = uTime * 0.4;
  
  // Create dynamic mixing patterns based on UV and Time
  float mix1 = sin(vUv.x * 3.0 + timeFast) * 0.5 + 0.5;
  float mix2 = cos(vUv.y * 3.0 - timeFast * 0.8) * 0.5 + 0.5;
  float mix3 = sin((vUv.x + vUv.y) * 2.0 + timeFast * 0.5) * 0.5 + 0.5; // Diagonal
  
  // Layered blending for "variety"
  vec3 c1 = mix(uColor1, uColor2, mix1);
  vec3 c2 = mix(uColor2, uColor3, mix2);
  vec3 baseColor = mix(c1, c2, mix3);

  // 2. Fake Lighting / Depth
  // Darken values deep in the wave (Shadows)
  float shadow = step(0.0, vElevation) * 0.1;
  
  // Highlight peaks
  float light = smoothstep(0.5, 2.0, vElevation); 
  
  // Apply lighting
  vec3 finalColor = baseColor;
  finalColor *= 0.6 + (vElevation + 2.0) * 0.2; // Ambient Occlusion
  finalColor += light * 0.25; // Specular Highlight

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const PALETTES = {
  dark: [
    { c1: "#4f46e5", c2: "#ec4899", c3: "#06b6d4" }, // Neon (Indigo/Pink/Cyan)
    { c1: "#0f172a", c2: "#7c3aed", c3: "#38bdf8" }, // Deep Space (Dark/Violet/Sky)
    { c1: "#115e59", c2: "#10b981", c3: "#3b82f6" }, // Emerald Abyss (Teal/Emerald/Blue)
    { c1: "#be123c", c2: "#fb7185", c3: "#f59e0b" }, // Sunset Glow (Rose/Orange)
  ],
  light: [
    { c1: "#60a5fa", c2: "#f472b6", c3: "#a78bfa" }, // Cotton Candy (Blue/Pink/Purple)
    { c1: "#34d399", c2: "#2dd4bf", c3: "#fde047" }, // Spring Breeze (Green/Teal/Yellow)
    { c1: "#fbbf24", c2: "#fb7185", c3: "#c084fc" }, // Golden Hour (Amber/Rose/Violet)
    { c1: "#7dd3fc", c2: "#818cf8", c3: "#60a5fa" }, // Clear Sky (Sky/Indigo/Blue)
  ]
};

function LiquidMesh({ theme }) {
    const meshRef = useRef();
    const { viewport } = useThree();
    const mouseRef = useRef(new THREE.Vector2(0, 0));

    // Convert hex strings to THREE.Colors once
    const paletteSets = useMemo(() => {
        const p = theme === 'dark' ? PALETTES.dark : PALETTES.light;
        return p.map(set => ({
            c1: new THREE.Color(set.c1),
            c2: new THREE.Color(set.c2),
            c3: new THREE.Color(set.c3),
        }));
    }, [theme]);

    // Uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uColor1: { value: new THREE.Color(0,0,0) },
            uColor2: { value: new THREE.Color(0,0,0) },
            uColor3: { value: new THREE.Color(0,0,0) },
        }),
        []
    );

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            
            // 1. Time & Mouse
            meshRef.current.material.uniforms.uTime.value = time;
            const x = (state.mouse.x * viewport.width) / 2;
            const y = (state.mouse.y * viewport.height) / 2;
            mouseRef.current.lerp(new THREE.Vector2(x, y), 0.1);
            meshRef.current.material.uniforms.uMouse.value = mouseRef.current;

            // 2. Palette Cycling logic
            // Change palette every X seconds
            const duration = 8.0; 
            const total = paletteSets.length;
            
            // Calculate interpolation factor
            // t goes from 0 to total
            const cycleTime = time * 0.2; // Speed of cycle
            const index1 = Math.floor(cycleTime) % total;
            const index2 = (index1 + 1) % total;
            const mixFactor = cycleTime % 1; // 0.0 to 1.0

            const p1 = paletteSets[index1];
            const p2 = paletteSets[index2];

            // Lerp between palette 1 and palette 2
            meshRef.current.material.uniforms.uColor1.value.lerpColors(p1.c1, p2.c1, mixFactor);
            meshRef.current.material.uniforms.uColor2.value.lerpColors(p1.c2, p2.c2, mixFactor);
            meshRef.current.material.uniforms.uColor3.value.lerpColors(p1.c3, p2.c3, mixFactor);
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1]}>
            {/* High segment count for smooth deformation */}
            <planeGeometry args={[20, 20, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe={false}
            />
        </mesh>
    );
}

export default function InteractiveBackground() {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-50 dark:bg-neutral-950 transition-colors duration-700">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                <LiquidMesh theme={theme} />
            </Canvas>
        </div>
    );
}
