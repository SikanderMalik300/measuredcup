import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';

const SLUG = '/disclaimer/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustFrame slug={SLUG}>
      <p>
        MeasuredCup&apos;s converters give averages for typical US products. Weights vary by brand,
        humidity and how an ingredient is measured. The site doesn&apos;t give nutrition, medical or
        dietary advice. For allergies or medical diets, follow your doctor or dietitian and the product
        label.
      </p>
    </TrustFrame>
  );
}
