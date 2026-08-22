import { Section } from '@/components/layout/section';
import { FadeIn, FadeUp, Parallax, Stagger, StaggerItem } from '@/components/motion';
import { Heading } from '@/components/ui/heading';
import { PrintPlate } from '@/components/ui/print-plate';
import { IndexMark, ShowcaseLink, bleedEnd, bleedStart, layerPanel } from '@/components/ui/editorial';
import { products } from '@/lib/content';
import { cn, pad, quoteHref } from '@/lib/utils';
import type { ProductItem } from '@/types';

/**
 * The catalogue, as a sequence rather than a grid.
 *
 * ## What this used to be, and why it changed
 *
 * Nine identical cards, three across: one crop for all of them, one border, one
 * shadow, one badge, one title, one sentence. The docblock that used to sit
 * here argued for the uniform crop on the grounds that "the catalogue is a list
 * of comparable things, and a ragged grid makes the reader work out whether a
 * taller tile means a bigger product".
 *
 * That argument is right about comparability and wrong about what this page is
 * for. Nobody arrives at a print studio's product page to compare nine formats
 * against each other on a like-for-like axis; they arrive knowing roughly what
 * they need — boxes, or books, or bags — and wanting to believe this studio can
 * make it well. Nine equal cards answer the first question nobody asked and
 * actively undermine the second, because a wall of same-sized photographs is
 * what a reseller's catalogue looks like.
 *
 * ## The replacement: three movements of three
 *
 * The nine formats run in three cycles, each cycle a different shape:
 *
 *   **feature** — one format at seven columns with its photograph bleeding off
 *   the outer edge, its copy in a four-column column opposite, and an oversized
 *   numeral behind it. The side alternates each cycle.
 *
 *   **pair** — two formats at five and six columns, one dropped 128px below the
 *   other, with column six left empty between them as white space.
 *
 * So the page reads feature → pair → feature → pair → feature → pair. Each
 * format still gets exactly one photograph and one sentence; what changes is
 * that the reader is moved through them at three different speeds instead of
 * being handed a sheet of nine.
 *
 * Each format keeps **its own crop** — `ratio` in `lib/content.ts` — rather than
 * being forced to a house ratio. A paper bag is portrait and a corrugated case
 * is landscape, and cropping both to 4:3 was throwing away the one piece of
 * information the photograph carried for free.
 *
 * ## Two structural fixes carried over unchanged
 *
 * **The formats have anchor ids.** The footer's product column and five of the
 * legacy WordPress redirects land on `/products#books`, `#boxes`, `#bags`,
 * `#stationery` and `#corrugation`. `scroll-mt-28` clears the fixed header,
 * matching `scroll-padding-top` in `globals.css`.
 *
 * **The band has an `h2`.** Without one the page ran `h1` straight into the
 * `h3` of the first title — a skipped level, and no answer on screen to "what
 * am I looking at" between the hero and the work.
 *
 * ## And one addition
 *
 * Every format now ends on an action. `quoteHref(product.id, 'product')` carries
 * the format into `features/quote/quote-form.tsx`, which already resolves a
 * product id to its title and seeds the brief with it — so a visitor persuaded
 * by the rigid boxes does not have to scroll to the foot of the page and start
 * from a blank field. That machinery existed and this page was not using it.
 */

export function ProductGrid() {
  return (
    <Section
      id="catalogue"
      tone="raised"
      spacing="lg"
      divided
      className="relative isolate scroll-mt-28 overflow-hidden"
    >
      <FadeUp>
        <Heading
          level={2}
          size="display-lg"
          eyebrow="The catalogue"
          description="Nine formats we produce week in, week out. Each one is made to your dimensions, on the stock and with the finish the job calls for - these are the shapes, not a fixed range."
          className="measure-tight"
        >
          Made to order, by format
        </Heading>
      </FadeUp>

      {/* Quick-jump strip. Nine formats is several screens, and a visitor who
          arrived from the footer looking for boxes should not have to scroll
          past books to find them. */}
      <FadeUp delay={0.08} className="mt-12">
        <nav aria-label="Formats on this page">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-paper-400 pt-6">
            {products.map((product, index) => (
              <li key={product.id}>
                <a
                  href={`#${product.id}`}
                  className="group inline-flex items-baseline gap-2.5 py-1.5 text-body-sm text-ink-500 motion-tint hover:text-ink-900"
                >
                  <span className="font-mono text-caption tabular-nums text-ink-300 motion-tint group-hover:text-gold-600">
                    {pad(index + 1)}
                  </span>
                  {product.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </FadeUp>

      {/*
        `items-start` keeps each format at its own height and lets the dropped
        member of a pair actually sit lower, instead of both being stretched to
        the taller of the two. `stream` gives every format its own trigger — the
        sequence is six screens tall and a group cascade would finish four
        screens below the fold.
      */}
      <Stagger
        as="ul"
        stream
        className="mt-16 grid grid-cols-2 items-start gap-x-5 gap-y-20 sm:gap-x-8 lg:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10"
      >
        {products.map((product, index) => {
          const role = index % 3;
          /* Cycle 0 leads left, cycle 1 leads right, cycle 2 leads left. */
          const flipped = Math.floor(index / 3) % 2 === 1;

          if (role === 0) {
            return (
              <StaggerItem
                key={product.id}
                as="li"
                id={product.id}
                className="col-span-2 scroll-mt-28 lg:col-span-12 lg:my-12"
              >
                <FormatFeature product={product} index={index} flipped={flipped} />
              </StaggerItem>
            );
          }

          return (
            <StaggerItem
              key={product.id}
              as="li"
              id={product.id}
              className={cn(
                'col-span-1 scroll-mt-28',
                role === 1 ? 'lg:col-span-5' : 'lg:col-span-6 lg:col-start-7 lg:mt-32',
              )}
            >
              <FormatPane product={product} index={index} />
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

/* -------------------------------------------------------------------------
 * The feature — one format, at spread size
 * ---------------------------------------------------------------------- */

function FormatFeature({
  product,
  index,
  flipped,
}: {
  product: ProductItem;
  index: number;
  flipped: boolean;
}) {
  return (
    <div className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <FadeIn
        className={cn(
          flipped ? 'lg:order-2 lg:col-span-7 lg:col-start-6' : 'lg:order-1 lg:col-span-7',
        )}
      >
        <Parallax offset={flipped ? -12 : 12}>
          <div className={cn('relative', flipped ? bleedEnd : bleedStart)}>
            {/* The second plane — an offset ground, out of register with the
                photograph the way a proof sits under its sheet. */}
            <span
              aria-hidden
              className={cn(
                layerPanel,
                'hidden lg:block',
                flipped ? '-bottom-6 -left-6 top-6 w-1/2' : '-bottom-6 -right-6 top-6 w-1/2',
              )}
            />

            {product.image ? (
              <PrintPlate
                image={product.image}
                ratio="wide"
                frame="bleed"
                sizes="(min-width: 1280px) 62vw, (min-width: 1024px) 60vw, 100vw"
                tone={product.image.ground === 'dark' ? 'ink' : 'paper'}
                marks
                parallax
              />
            ) : null}
          </div>
        </Parallax>
      </FadeIn>

      <div
        className={cn(
          'relative',
          flipped ? 'lg:order-1 lg:col-span-4 lg:col-start-1' : 'lg:order-2 lg:col-span-4 lg:col-start-9',
        )}
      >
        <IndexMark
          value={pad(index + 1)}
          className="absolute -top-10 left-0 text-[7rem] lg:-left-6 lg:-top-16 lg:text-[11rem]"
        />

        <FadeUp className="relative">
          <span className="font-sans text-eyebrow font-semibold uppercase text-gold-700">
            {product.category}
          </span>

          <h3 className="mt-3 font-display text-display-sm font-normal text-ink-800">
            {product.title}
          </h3>

          <p className="measure mt-5 text-body-lg text-ink-500">{product.summary}</p>

          <ShowcaseLink href={quoteHref(product.id, 'product')} arrow="up" className="mt-8">
            Quote {product.title.toLowerCase()}
          </ShowcaseLink>
        </FadeUp>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * The pane — one format in a pair
 * ---------------------------------------------------------------------- */

function FormatPane({ product, index }: { product: ProductItem; index: number }) {
  return (
    <article className="group" data-cursor="product">
      <FadeIn>
        {product.image ? (
          <PrintPlate
            image={product.image}
            /* The item's own crop — `PrintPlate` takes the names, and
               `lib/content.ts` uses the same three. */
            ratio={product.ratio ?? 'landscape'}
            frame="bleed"
            sizes="(min-width: 1024px) 46vw, 45vw"
            tone={product.image.ground === 'dark' ? 'ink' : 'paper'}
            className="product-lift product-sheen shadow-[0_22px_54px_-32px_rgba(38,34,54,0.5)]"
            imageClassName="product-bright"
          />
        ) : null}
      </FadeIn>

      <div className="mt-6 border-t border-paper-400 pt-5">
        <div className="flex items-baseline gap-3">
          <IndexMark value={pad(index + 1)} variant="rule" />
          <span className="font-sans text-eyebrow font-semibold uppercase text-ink-400">
            {product.category}
          </span>
        </div>

        <h3 className="mt-3 font-display text-heading-lg font-normal text-ink-800 lg:text-display-sm">
          {product.title}
        </h3>

        <p className="mt-3 max-w-[46ch] text-body-md text-ink-500">{product.summary}</p>

        <ShowcaseLink href={quoteHref(product.id, 'product')} arrow="up" className="mt-6">
          Quote {product.title.toLowerCase()}
        </ShowcaseLink>
      </div>
    </article>
  );
}

export default ProductGrid;
