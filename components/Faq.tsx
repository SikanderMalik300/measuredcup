import type { FaqItem } from '@/lib/data/pages';

// Accordion using native <details>. Answers are in the HTML (no JS required). Plus/minus via CSS.
export function Faq({ items, heading = 'FAQ' }: { items: FaqItem[]; heading?: string }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading">{heading}</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {items.map((item, i) => (
          <details key={i} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-ink marker:content-['']">
              <span className="font-medium">{item.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-brand"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">–</span>
              </span>
            </summary>
            <div className="prose-measure pb-4 text-ink">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
