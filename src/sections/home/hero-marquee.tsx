import Image from 'next/image';

import { marqueeBronze, marqueeNavy, type MarqueeTile } from '@/content/home';
import { cn } from '@/lib/utils';

/**
 * The hero's media slot: two vertical runs of real work, moving against
 * each other.
 *
 * The navy column travels up, the bronze column travels down. Opposite
 * directions are the whole point — two columns moving the same way read as one
 * sliding panel, and it is the counter-motion that makes the pair feel like
 * something running rather than something scrolling.
 *
 * ## No JavaScript
 *
 * This is a server component and it ships none. The motion is a CSS keyframe on
 * a track that holds its children exactly twice and travels exactly -50%, so
 * the loop is seamless whatever the content height and there is nothing to
 * hydrate, measure or tear down. `transform` is the only animated property, so
 * every frame is compositor work — no layout, no paint.
 *
 * That matters more than it sounds: this replaced a WebGL scene that cost
 * 872KB of `three` on desktop. The hero now costs two CSS animations.
 *
 * ## Why the colour is a ground and not a tint
 *
 * Most of this library was shot on near-white studio sweeps. A duotone or a
 * `mix-blend-mode` over those would turn the white background into a flat field
 * of colour and swallow the product with it. Insetting each photograph on a
 * coloured card gives it a frame instead — which reads as deliberate at any
 * size, and works for a cut-out and an environment shot alike.
 *
 * ## Reduced motion
 *
 * `globals.css` stops both tracks outright and turns the masked columns into
 * ordinary scrollable ones, so the work is still all there and can be reached by
 * hand. It has to be an explicit stop rather than the blanket duration collapse:
 * 0.01ms on an infinite loop lands on the end frame, which for a marquee is
 * fully scrolled off.
 */

/** How long one full cycle takes. Different per column, deliberately. */
const DURATION = { navy: '58s', bronze: '46s' } as const;

export interface HeroMarqueeProps {
  className?: string;
}

export function HeroMarquee({ className }: HeroMarqueeProps) {
  return (
    <div
      className={cn(
        /*
          `w-auto`, not `w-full`. A block with an explicit `width: 100%` does not
          expand from negative horizontal margins — the left margin shifts it and
          the right one only grants overflow room, which is what left the old
          hero media 350px wide inside a 390px viewport, flush left with a 40px
          gap. `cn` runs tailwind-merge so this cannot be undone by class order.
        */
        'relative w-auto overflow-hidden',
        '-mx-5 aspect-[4/5] sm:-mx-8 sm:aspect-[4/3] lg:mx-0 lg:w-full lg:aspect-[4/5]',
        className,
      )}
    >
      <div className="marquee-mask-y absolute inset-0 grid grid-cols-2 gap-3 sm:gap-4">
        <Column tiles={marqueeNavy} tone="navy" duration={DURATION.navy} />
        <Column tiles={marqueeBronze} tone="bronze" duration={DURATION.bronze} down />
      </div>
    </div>
  );
}

/**
 * One column.
 *
 * The tiles are rendered twice, which is what the -50% keyframe is written
 * against. The second pass is `aria-hidden`: it is the same eight photographs
 * again, and a screen reader announcing sixteen tiles for eight pieces of work
 * is worse than useless.
 *
 * `down` flips the direction with `marquee-reverse` rather than a second
 * keyframe, so both columns share one animation and one definition of "half".
 */
function Column({
  tiles,
  tone,
  duration,
  down = false,
}: {
  tiles: readonly MarqueeTile[];
  tone: 'navy' | 'bronze';
  duration: string;
  down?: boolean;
}) {
  return (
    <div className="relative overflow-hidden">
      <div
        className={cn('marquee-track-y gap-3 sm:gap-4', down && 'marquee-reverse')}
        style={{ ['--marquee-duration' as string]: duration }}
      >
        {tiles.map((tile) => (
          <Tile key={tile.src} tile={tile} tone={tone} />
        ))}
        {tiles.map((tile) => (
          <Tile key={`${tile.src}-echo`} tile={tile} tone={tone} echo />
        ))}
      </div>
    </div>
  );
}

function Tile({
  tile,
  tone,
  echo = false,
}: {
  tile: MarqueeTile;
  tone: 'navy' | 'bronze';
  echo?: boolean;
}) {
  return (
    <div
      aria-hidden={echo || undefined}
      className={cn(
        'relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[2px] p-1.5 sm:p-2',
        tone === 'navy' ? 'bg-indigo-600' : 'bg-gold-500',
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1px] bg-paper-100">
        <Image
          src={tile.src}
          alt={echo ? '' : tile.alt}
          fill
          /* Two columns inside a slot that is 46vw on desktop and full width
             below it, so each tile is about half of that. */
          sizes="(min-width: 1024px) 23vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default HeroMarquee;
