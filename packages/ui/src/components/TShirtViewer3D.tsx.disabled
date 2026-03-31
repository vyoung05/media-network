'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface TShirtViewer3DProps {
  designImageUrl: string;
  brandColor?: string;
}

// T-Shirt Mesh Component
function TShirtMesh({ designImageUrl, brandColor }: TShirtViewer3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [designTexture, setDesignTexture] = useState<THREE.Texture | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Load design texture
  useEffect(() => {
    if (designImageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        designImageUrl,
        (texture) => {
          texture.flipY = false;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          setDesignTexture(texture);
        },
        undefined,
        (error) => {
          console.error('Error loading design texture:', error);
        }
      );
    }
  }, [designImageUrl]);

  // Auto-rotate animation
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Use simple geometries for the t-shirt shape

  return (
    <group 
      ref={meshRef} 
      onPointerDown={() => setAutoRotate(false)}
      onPointerUp={() => setAutoRotate(true)}
    >
      {/* T-shirt torso (main body) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2, 0.3]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-1.1, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.8, 8]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[1.1, 0.3, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.8, 8]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Design overlay on front */}
      {designTexture && (
        <mesh position={[0, 0.1, 0.16]} castShadow>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            map={designTexture}
            transparent
            alphaTest={0.1}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
      )}

      {/* Subtle brand accent on collar/tag */}
      <mesh position={[0, 0.9, 0.16]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial 
          color={brandColor || '#3B82F6'}
          emissive={brandColor || '#3B82F6'}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

// Scene Component
function Scene({ designImageUrl, brandColor }: TShirtViewer3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* T-Shirt */}
      <TShirtMesh designImageUrl={designImageUrl} brandColor={brandColor} />

      {/* Ground shadow */}
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.5} 
        scale={10} 
        blur={1.5} 
        far={2} 
      />

      {/* Environment for reflections */}
      <Environment preset="studio" />

      {/* Camera Controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={2}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  );
}

// Main Component
export function TShirtViewer3D({ designImageUrl, brandColor }: TShirtViewer3DProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative">
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading 3D Model...</p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
        onCreated={() => setIsLoaded(true)}
      >
        <Scene designImageUrl={designImageUrl} brandColor={brandColor} />
      </Canvas>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black bg-opacity-50 px-3 py-2 rounded">
        <p>🖱️ Drag to rotate • 🔍 Scroll to zoom</p>
      </div>
    </div>
  );
}