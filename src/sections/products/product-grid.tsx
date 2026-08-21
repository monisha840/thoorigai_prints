import { Section, SectionHeader } from '@/components/layout/section';
import { FadeUp, Float, Stagger, StaggerItem } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { PrintPlate } from '@/components/ui/print-plate';
import { products } from '@/lib/content';
import { pad } from '@/lib/utils';

/**
 * The product catalogue grid.
 *
 * Three-up on desktop, two-up on tablet, one-up on phone.
 *
 * Every tile is cropped to one ratio rather than to each item's own. The
 * catalogue is a list of comparable things, and a ragged grid makes the reader
 * work out whether a taller tile means a bigger product. `4:3` suits this
 * library, which is nearly all landscape studio photography — a portrait crop
 * would cut the ends off the wider group shots.
 *
 * ## Two structural fixes live here
 *
 * **The tiles have anchor ids.** The footer's product column and five of the
 * legacy WordPress redirects land on `/products#books`, `#boxes`, `#bags`,
 * `#stationery` and `#corrugation`. None of those ids existed, so every one of
 * those links quietly resolved to the top of the page. `scroll-mt-28` clears
 * the fixed header, matching `scroll-padding-top` in `globals.css`.
 *
 * **The band has an `h2`.** Without one the page ran `h1` straight into the
 * `h3` of the first card title — a skipped level, and no answer on screen to
 * "what am I looking at" between the hero and a wall of nine photographs.
 */
export function ProductGrid() {
  return (
    <Section id="catalogue" tone="raised" spacing="lg" divided className="scroll-mt-28">
      <SectionHeader>
        <Heading
          level={2}
          size="display-lg"
          eyebrow="The catalogue"
          description="Nine formats we produce week in, week out. Each one is made to your dimensions, on the stock and with the finish the job calls for — these are the shapes, not a fixed range."
        >
          Made to order, by format
        </Heading>
      </SectionHeader>

      {/* Quick-jump strip, the same one `/services` carries. Nine tiles is two
          screens on a phone, and a visitor who arrived from the footer looking
          for boxes should not have to scroll past books to find them. */}
      <FadeUp delay={0.08} className="mt-10">
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

      <Stagger stream as="ul" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <StaggerItem
            key={product.id}
            as="li"
            id={product.id}
            className="h-full scroll-mt-28"
          >
            {/*
              The catalogue tiles rest on air, as the homepage's do. `index`
              desynchronises the row — nine tiles rising in lockstep read as one
              object rather than nine separate printed pieces. Depth is held at
              0.5, a step under the homepage: these tiles are larger, and the
              same travel on a bigger card reads as drift.
            */}
            <Float index={index} depth={0.5} className="h-full">
              <Card padding="none" interactive className="group h-full">
                {product.image ? (
                  <PrintPlate
                    image={product.image}
                    ratio="landscape"
                    // Three-up at `lg`, two-up at `sm`, one-up below.
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className="rounded-none border-0 border-b shadow-none"
                    overlay={
                      <span className="pointer-events-none absolute left-4 top-4 font-mono text-caption tabular-nums text-paper-100 mix-blend-difference">
                        {pad(index + 1)}
                      </span>
                    }
                  />
                ) : null}

                <CardBody className="p-6">
                  <Badge size="sm" variant="neutral">
                    {product.category}
                  </Badge>
                  <CardTitle className="mt-4 text-heading-lg">{product.title}</CardTitle>
                  <p className="mt-3 text-body-sm text-ink-500">{product.summary}</p>
                </CardBody>
              </Card>
            </Float>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export default ProductGrid;
