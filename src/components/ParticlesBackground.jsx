// ParticlesBackground.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";

/* 🎨 COLORS (FROM SECOND CODE ONLY) */
/* 🎨 COLORS (slightly darker tones) */
const COLORS = [
  "#1e40af", // darker blue
  "#3b82f6", // toned soft blue
  "#0ea5e9"  // deeper cyan
];

/* 🔷 SHAPE */
function ProfessionalShape({ position, color, scale, speed, shapeType }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime() * speed;

    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.008;

    meshRef.current.position.y += Math.sin(t) * 0.015;
    meshRef.current.position.x += Math.cos(t) * 0.01;
  });

 const getGeometry = () => {
  switch (shapeType) {
    case "cube":
      return <boxGeometry args={[1.4, 1.4, 1.4]} />;

    case "sphere":
      // replaced with sharper crystal-like geometry
      return <octahedronGeometry args={[1.2, 0]} />;

    case "capsule":
      // replaced with elongated sharp prism feel
      return <coneGeometry args={[0.9, 2.2, 6]} />;

    case "icosahedron":
      // already sharp, slightly refined
      return <icosahedronGeometry args={[1.3, 1]} />;

    default:
      return <tetrahedronGeometry args={[1.3, 0]} />;
  }
};
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {getGeometry()}

      {/* 🔥 SAME MATERIAL STYLE, COLOR SWAPPED */}
      <MeshDistortMaterial
        color={color}
        speed={0.8}
        distort={0.15}
        radius={1}
        metalness={0.9}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.25}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/* 🌌 FLOATING SYSTEM */
function FloatingSystem({ count = 45 }) {
  const shapes = useMemo(() => {
    const types = ["cube", "sphere", "capsule", "icosahedron"];

    return Array.from({ length: count }, () => ({
      position: [
  (Math.random() - 0.5) * 70, // was 60
  (Math.random() - 0.5) * 48, // was 40
  (Math.random() - 0.5) * 48  // was 40
],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      scale: Math.random() * 0.9 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      shapeType: types[Math.floor(Math.random() * types.length)]
    }));
  }, [count]);

  return shapes.map((props, i) => (
    <ProfessionalShape key={i} {...props} />
  ));
}

/* 🎮 MAIN */
export default function ParticlesBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 60 }}
      dpr={[1, 2]}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: "#050816" // FROM SECOND CODE
      }}
    >
      {/* 💡 SAME LIGHT STRUCTURE, COLOR ADAPTED */}
      <ambientLight intensity={0.3} />

      <pointLight
        position={[10, 10, 10]}
        intensity={1.2}
        color="#2563eb"
      />

      <spotLight
        position={[-10, -10, 10]}
        intensity={0.8}
        color="#38bdf8"
      />

      {/* 🌟 STARS SAME */}
      <Stars
        radius={100}
        depth={50}
        count={500}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* 🌀 FLOAT SYSTEM SAME */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
        <FloatingSystem count={40} />
      </Float>

      {/* 🌫️ FOG MATCHED */}
      <fog attach="fog" args={["#050816", 10, 80]} />
    </Canvas>
  );
}