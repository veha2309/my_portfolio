import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Starfield({ count = 1500, visible = true, isLightMode = false }) {
  const points = useRef<THREE.Points>(null!);

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uLowIntensity;
    attribute float aSize;
    attribute float aSpeed;
    varying float vOpacity;

    void main() {
      vec3 pos = position;
      float angle = uTime * aSpeed * 0.05;
      float c = cos(angle);
      float s = sin(angle);
      pos.xy = mat2(c, -s, s, c) * pos.xy;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (800.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      vOpacity = 0.7;
    }
  `;

  const fragmentShader = `
    varying float vOpacity;
    uniform vec3 uColor;
    uniform float uLowIntensity;

    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.1, d) * vOpacity * (1.1 - uLowIntensity);
      gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
    }
  `;

  const { positions, sizes, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        const r = 100 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
        sz[i] = Math.random() * 2 + 1; 
        sp[i] = Math.random() * 2.0 + 0.5;
    }
    return { positions: pos, sizes: sz, speeds: sp };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color(isLightMode ? '#2c1810' : '#00e5ff') },
    uLowIntensity: { value: 0 }
  }), []);

  useFrame((state) => {
    if (!points.current) return;
    const material = points.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.getElapsedTime();
    
    const scrollY = window.scrollY;
    const isProjectSection = scrollY > 800 && scrollY < 4000;
    const targetIntensity = isProjectSection ? 1.0 : 0.0;
    material.uniforms.uLowIntensity.value = THREE.MathUtils.lerp(material.uniforms.uLowIntensity.value, targetIntensity, 0.1);
    
    const targetColorStr = isLightMode ? '#2c1810' : '#00e5ff';
    material.uniforms.uColor.value.lerp(new THREE.Color(targetColorStr), 0.1);
  });

  return (
    <points ref={points} visible={visible}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}
