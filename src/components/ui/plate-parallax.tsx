'use client';

import type { ReactNode } from 'react';

import { MouseParallax, MouseParallaxLayer } from '@/components/motion';
import { pointer } from '@/lib/theme/animations';

/**
 * The pointer field for one mounted photograph.
 *
 * `PrintPlate` is a server component on purpose - its hover states are CSS, so
 * a page of forty plates costs nothing on the client. This is the opt-in that
 * lets a particular plate answer the cursor without dragging that whole
 * decision along with it: the plate stays server-rendered and this small client
 * component wraps only the image inside it.
 *
 * The field is scoped to the plate's own box, so the photograph leans by a few
 * pixels according to where in *that* plate the pointer is - which is what
 * 'nearby' has to mean for this to read as depth rather than as the page
 * sliding. §9.3's rule holds: the frame stays exactly where the layout put it
 * and the picture moves inside it.
 *
 * The overscan is on the layer, not the image, so the crop never changes: 4% is
 * three times the 4.8px the layer can travel at `mediaRange` and depth 0.6.
 */
export function PlateParallax({ children }: { children: ReactNode }) {
  return (
    <MouseParallax range={pointer.mediaRange} className='absolute inset-0'>
      <MouseParallaxLayer depth={0.6} className='absolute inset-0 scale-[1.04]'>
        {children}
      </MouseParallaxLayer>
    </MouseParallax>
  );
}

export default PlateParallax;
