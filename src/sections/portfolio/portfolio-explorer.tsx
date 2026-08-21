'use client';

import { useMemo, useState } from 'react';

import { Section, SectionHeader } from '@/components/layout/section';
import { Heading } from '@/components/ui/heading';
import { projects, type FilterId } from '@/lib/portfolio';
import { PortfolioFilters } from './portfolio-filters';
import { ProjectShowcase } from './project-showcase';

/**
 * Owns the filter state and nothing else.
 *
 * The rail and the showcase are separate components because they are separate
 * ideas, but they share one piece of state — so exactly one client boundary
 * sits above both, and the section header, plates and copy underneath stay
 * server-rendered.
 */
export function PortfolioExplorer() {
  const [active, setActive] = useState<FilterId>('all');

  const visible = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  return (
    <Section
      id="work"
      tone="paper"
      spacing="lg"
      divided
      /* The showcase rows bleed their plates past the container gutter. The
         clip is what turns that overflow into a deliberate run-off rather than
         32px of image hanging over the page edge at `xl`. */
      className="overflow-hidden"
    >
      <SectionHeader>
        <Heading
          level={2}
          size="display-lg"
          eyebrow="Selected work"
          description="Eight jobs we can show. Each one names the process, the stock and the finish."
        >
          The evidence
        </Heading>
      </SectionHeader>

      <PortfolioFilters active={active} onChange={setActive} className="mt-12" />

      <div className="mt-16 md:mt-20">
        <ProjectShowcase projects={visible} activeFilter={active} />
      </div>
    </Section>
  );
}

export default PortfolioExplorer;
