import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';
import { CORRECTIONS } from '@/lib/data/corrections';

const SLUG = '/editorial-policy/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustFrame slug={SLUG} showUpdated>
      <p>
        <strong className="font-medium">Who writes:</strong> Sikander Malik writes and edits every
        page.
      </p>
      <p>
        <strong className="font-medium">How tools are built:</strong> formulas are written as code with
        automated tests. Every number comes from a cited source.
      </p>
      <p>
        <strong className="font-medium">AI use:</strong> we use AI tools to help draft code and copy. A
        person checks every number against its source and edits every page before it&apos;s published.
      </p>
      <p>
        <strong className="font-medium">Updates:</strong> each page shows a Last updated date that
        changes only when the content changes.
      </p>
      <p>
        <strong className="font-medium">Corrections:</strong> we fix errors as soon as we confirm them
        and log them below with the date, the page, the old value and the new value.
      </p>
      <p>
        <strong className="font-medium">Ads and affiliate links:</strong> the site may show ads and may
        link to kitchen tools through affiliate programs. This never changes a number on the site.
        Affiliate links are labeled.
      </p>

      <h2>Corrections log</h2>
      {CORRECTIONS.length === 0 ? (
        <p>No corrections yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Date</th>
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Page</th>
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">What was wrong</th>
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">What it is now</th>
              </tr>
            </thead>
            <tbody>
              {CORRECTIONS.map((c, i) => (
                <tr key={i} className="border-b border-line">
                  <td className="px-3 py-2 text-ink">{c.date}</td>
                  <td className="px-3 py-2 text-ink">{c.page}</td>
                  <td className="px-3 py-2 text-ink">{c.wasWrong}</td>
                  <td className="px-3 py-2 text-ink">{c.nowIs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TrustFrame>
  );
}
