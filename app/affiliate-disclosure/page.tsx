import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';

const SLUG = '/affiliate-disclosure/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustFrame slug={SLUG}>
      <p>
        Some links on MeasuredCup may be affiliate links. If you buy through them, we may earn a small
        commission at no extra cost to you. We only link to products relevant to the page, and affiliate
        relationships never change a number in our tools.
      </p>
      <p className="text-small text-muted">No affiliate links at launch.</p>
    </TrustFrame>
  );
}
