/**
 * Ambient declarations for non-code imports.
 *
 * Next only ships types for `*.module.css`. TypeScript 6 raises TS2882 on a
 * side-effect import it cannot resolve, so a global stylesheet import like
 * `import '@/styles/globals.css'` needs this declaration.
 */

declare module '*.css';
declare module '*.scss';

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}

declare module '*.hdr' {
  const src: string;
  export default src;
}
