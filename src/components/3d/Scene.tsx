import { Canvas, useFrame } from '@react-three/fiber';
import Starfield from './Starfield';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

const DARK_PRIMARY = '#00e5ff';
const LIGHT_PRIMARY = '#8b5e3c';
const LIGHT_FOG = '#e8dcc8';
const DARK_FOG = '#050608';

function CelestialStructures({ opacityRef, isLightMode = false }: { opacityRef: React.MutableRefObject<number>, isLightMode?: boolean }) {
  const objects = useMemo(() => Array.from({ length: 4 }).map((_, i) => ({
    position: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, -i * 20] as [number, number, number],
    size: Math.random() * 1.5 + 1.2,
    type: i % 3,
    baseColor: i % 2 === 0 ? DARK_PRIMARY : '#8b5cf6',
    lightBaseColor: i % 2 === 0 ? LIGHT_PRIMARY : '#a0522d',
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
  })), []);

  const themeColor = useMemo(() => new THREE.Color(), []);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const wireRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const opacity = opacityRef.current;
    themeColor.set(isLightMode ? LIGHT_PRIMARY : DARK_PRIMARY);
    objects.forEach((_, i) => {
      const mesh = meshRefs.current[i];
      const wire = wireRefs.current[i];
      if (mesh) {
        (mesh.material as THREE.MeshStandardMaterial).color.lerp(themeColor, 0.05);
        (mesh.material as THREE.MeshStandardMaterial).opacity = 0.85 * opacity;
      }
      if (wire) {
        (wire.material as THREE.MeshStandardMaterial).emissive.lerp(themeColor, 0.05);
        (wire.material as THREE.MeshStandardMaterial).opacity = 0.25 * opacity;
      }
    });
  });

  return (
    <group>
      {objects.map((obj, i) => (
        <group key={i} position={obj.position} rotation={obj.rotation}>
          <mesh ref={el => { meshRefs.current[i] = el; }}>
            {obj.type === 0 && <torusKnotGeometry args={[obj.size, 0.25, 32, 8]} />}
            {obj.type === 1 && <octahedronGeometry args={[obj.size * 1.4]} />}
            {obj.type === 2 && <dodecahedronGeometry args={[obj.size * 1.4]} />}
            <meshStandardMaterial
              color={isLightMode ? obj.lightBaseColor : obj.baseColor}
              metalness={0.7} roughness={0.3} transparent />
          </mesh>
          <mesh scale={1.05} ref={el => { wireRefs.current[i] = el; }}>
            {obj.type === 0 && <torusKnotGeometry args={[obj.size, 0.25, 20, 6]} />}
            {obj.type === 1 && <octahedronGeometry args={[obj.size * 1.4]} />}
            {obj.type === 2 && <dodecahedronGeometry args={[obj.size * 1.4]} />}
            <meshStandardMaterial
              emissive={isLightMode ? obj.lightBaseColor : obj.baseColor}
              wireframe transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SceneContent({ isLightMode = false }: { isLightMode?: boolean }) {
  const opacityRef = useRef(1);
  const gridRef = useRef<THREE.GridHelper>(null!);
  const scrollRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector2());

  // Throttle DOM reads off the render loop
  useMemo(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  useFrame((state) => {
    const scrollY = scrollRef.current;
    const mouse = mouseRef.current;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / (docHeight || 1), 1);

    const isProjectSection = scrollY > 800 && scrollY < 4000;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, isProjectSection ? 0.1 : 1, 0.05);

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 30 - progress * 150, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 4, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.y * 3, 0.03);
    state.camera.lookAt(0, 0, state.camera.position.z - 40);

    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.6 * opacityRef.current, 0.05);
    }
  });

  return (
    <>
      <Starfield count={1500} isLightMode={isLightMode} />
      <gridHelper
        ref={gridRef}
        args={[200, 30, isLightMode ? '#6b4226' : DARK_PRIMARY, isLightMode ? '#c4a882' : '#1a1a2e']}
        rotation={[Math.PI / 2.1, 0, 0]}
        position={[0, -20, -40]}
        onAfterRender={() => {
          if (!gridRef.current) return;
          const mat = gridRef.current.material as THREE.LineBasicMaterial;
          mat.transparent = true;
        }}
      />
      <CelestialStructures opacityRef={opacityRef} isLightMode={isLightMode} />
    </>
  );
}

export default function Scene({ isLightMode = false }: { isLightMode?: boolean }) {
  const fogColor = isLightMode ? LIGHT_FOG : DARK_FOG;
  return (
    <div
      className="fixed inset-0 -z-10 h-screen w-screen pointer-events-none"
      style={{ backgroundColor: isLightMode ? '#f0e6d0' : DARK_FOG }}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <fog attach="fog" args={[fogColor, 60, 180]} />
        <ambientLight intensity={isLightMode ? 1.5 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={isLightMode ? 1.5 : 3} color={isLightMode ? LIGHT_PRIMARY : DARK_PRIMARY} />
        <Suspense fallback={null}>
          <SceneContent isLightMode={isLightMode} />
        </Suspense>
      </Canvas>
    </div>
  );
}
