'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactNode } from 'react';
import type { Group } from 'three';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { floatDefaults, materials } from '@/three/config';

/**
 * Idle drift for any 3D subject.
 *
 * Wrap children to animate an imported model, or leave it empty for the default
 * placeholder — a sheet of stock, which is the right stand-in for a printing
 * studio and gets replaced when real geometry arrives.
 *
 * Motion is applied to a wrapper group, not the mesh, so a child model keeps
 * its own transforms. When the visitor has asked for reduced motion the frame
 * loop exits immediately and the object simply sits still.
 */

export interface FloatingObjectProps {
  children?: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Vertical travel, world units. */
  amplitude?: number;
  /** Bob cycles per second. */
  speed?: number;
  /** Y rotation, radians per second. Set 0 to hold a fixed angle. */
  spin?: number;
  /** Offsets the bob so a group of objects is not synchronised. */
  phase?: number;
  /** Lean toward the pointer. Ignored on touch, where there is no pointer. */
  followPointer?: boolean;
}

export function FloatingObject({
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  amplitude = floatDefaults.amplitude,
  speed = floatDefaults.speed,
  spin = floatDefaults.spin,
  phase = 0,
  followPointer = true,
}: FloatingObjectProps) {
  const group = useRef<Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    const node = group.current;
    if (!node || reducedMotion) return;

    const t = state.clock.elapsedTime;

    node.position.y = position[1] + Math.sin(t * speed * Math.PI * 2 + phase) * amplitude;

    if (spin !== 0) {
      node.rotation.y += spin * delta;
    }

    if (followPointer) {
      // `state.pointer` is normalised to -1..1; ease toward it rather than
      // snapping, so a fast mouse move does not jerk the object.
      const targetX = rotation[0] + state.pointer.y * floatDefaults.tilt;
      const targetZ = rotation[2] + -state.pointer.x * floatDefaults.tilt * 0.5;
      node.rotation.x += (targetX - node.rotation.x) * Math.min(delta * 3, 1);
      node.rotation.z += (targetZ - node.rotation.z) * Math.min(delta * 3, 1);
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      {children ?? <PlaceholderSheet />}
    </group>
  );
}

/**
 * Default subject: a single sheet of stock with a foil edge. Deliberately
 * simple — real geometry replaces it, and until then it costs almost nothing.
 */
function PlaceholderSheet() {
  return (
    <group>
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[2.1, 2.97, 0.012]} />
        <meshStandardMaterial
          color={materials.paperStock.color}
          roughness={materials.paperStock.roughness}
          metalness={materials.paperStock.metalness}
        />
      </mesh>

      {/* Foil rule across the lower third, where a title block would sit. */}
      <mesh position={[0, -0.72, 0.008]}>
        <planeGeometry args={[1.36, 0.028]} />
        <meshStandardMaterial
          color={materials.foil.color}
          roughness={materials.foil.roughness}
          metalness={materials.foil.metalness}
        />
      </mesh>
    </group>
  );
}

export default FloatingObject;
