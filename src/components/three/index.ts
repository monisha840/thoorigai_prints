/**
 * The 3D branch's barrel.
 *
 * Importing anything from here pulls `three` into the calling chunk, which is
 * exactly what §5.1's boundary rule exists to prevent. Eager modules must deep
 * import `./lazy-scene` instead — it is the one file here that is `three`-free.
 *
 * `FoldSequenceCanvas` is deliberately **not** exported. It is a dynamic-import
 * target, and re-exporting it would make it one careless `import { … }` away
 * from being statically bundled back into the main chunk.
 */
export { Scene } from './scene';
export { Camera } from './camera';
export { Lights } from './lights';
export { FloatingObject } from './floating-object';
export { FoldRig } from './fold-rig';
export { lazyScene } from './lazy-scene';
export { ScenePlaceholder } from './scene-placeholder';

export type { SceneProps } from './scene';
export type { CameraProps } from './camera';
export type { LightsProps } from './lights';
export type { FloatingObjectProps } from './floating-object';
export type { FoldRigProps } from './fold-rig';
