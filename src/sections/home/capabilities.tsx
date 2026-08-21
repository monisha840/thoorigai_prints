import { ArrowUpRight } from 'lucide-react';

import { Section, SectionHeader } from '@/components/layout/section';
import { Stagger, StaggerItem } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { services } from '@/lib/content';

/**
 * What the studio runs. A four-up grid on desktop, two-up on tablet, stacked on
 * phone — the standard card grid the rest of the site reuses.
 */
export function Capabilities() {
  return (
    <Section id="capabilities" tone="raised" spacing="lg" divided>
      <SectionHeader
        action={
          <Button href="/services" variant="secondary" iconAfter={<ArrowUpRight />}>
            All services
          </Button>
        }
      >
        <Heading
          level={2}
          size="display-lg"
          eyebrow="Capabilities"
          description="Six disciplines, one building. The quantity picks the process — not the other way round."
        >
          What we run
        </Heading>
      </SectionHeader>

      <Stagger stream as="ul" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <StaggerItem key={service.id} as="li" className="h-full">
              <Card href={service.href} padding="lg" className="h-full">
                {Icon ? (
                  <span className="mb-7 grid size-11 place-items-center rounded-full border border-paper-400 text-gold-600 motion-tint group-hover:border-gold-400 group-hover:bg-gold-50">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                ) : null}

                <CardBody>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.summary}</CardDescription>

                  {service.specs?.length ? (
                    <CardFooter className="flex-wrap gap-2">
                      {service.specs.map((spec) => (
                        <Badge key={spec} size="sm" variant="neutral">
                          {spec}
                        </Badge>
                      ))}
                    </CardFooter>
                  ) : null}
                </CardBody>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

export default Capabilities;
