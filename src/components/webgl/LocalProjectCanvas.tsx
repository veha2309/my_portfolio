import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Minimal displacement vertex shader
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Very subtle breathing
    pos.z += sin(uv.y * 10.0 + uTime) * 0.02;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Minimal texture fragment shader
const fragmentShader = `
  uniform sampler2D uTex;
  varying vec2 vUv;
  
  void main() {
    vec4 tex = texture2D(uTex, vUv);
    gl_FragColor = tex;
  }
`;

function ImagePlane({ imgUrl }: { imgUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const texture = useTexture(imgUrl);

  const uniforms = useMemo(() => ({
    uTex: { value: texture },
    uTime: { value: 0 }
  }), [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[10, 10, 16, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}

export default function LocalProjectCanvas({ imgUrl }: { imgUrl: string }) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  if (isMobile) {
    return <img src={imgUrl} alt="Project Media" className="w-full h-full object-cover" />;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* 
        This is a localized canvas. It does not span the whole page, 
        and it does not affect page layout.
      */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ImagePlane imgUrl={imgUrl} />
      </Canvas>
      {/* Fallback image behind canvas just in case */}
      <img src={imgUrl} alt="Fallback" className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50" />
    </div>
  );
}
