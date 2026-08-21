import { Section } from '@/components/layout/section';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { Heading } from '@/components/ui/heading';
import { processSteps } from '@/lib/content';
import { pad } from '@/lib/utils';

/**
 * How a job moves through the studio.
 *
 * A numbered list on mobile, a five-column band on desktop. The connecting rule
 * is drawn with a border rather than a pseudo-element so it survives wrapping.
 */
export function Process() {
  return (
    <Section id="process" tone="paper" spacing="lg" divided className="scroll-mt-28">
      <FadeUp>
        <Heading
          level={2}
          size="display-lg"
          eyebrow="Process"
          description="Five stages, and you hear from us at each one. Nothing goes to press on an assumption."
          className="measure-tight"
        >
          From brief to delivery
        </Heading>
      </FadeUp>

      <Stagger as="ol" className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <StaggerItem
            key={step.id}
            as="li"
            className="relative border-t border-paper-400 pt-6"
          >
            <span
              aria-hidden
              className="absolute -top-px left-0 h-px w-8 bg-gold-500"
            />

            <span className="block font-mono text-caption tabular-nums text-gold-600">
              {pad(index + 1)}
            </span>

            <h3 className="mt-4 font-display text-heading-lg text-ink-800">{step.title}</h3>
            <p className="mt-3 text-body-sm text-ink-500">{step.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export default Process;
