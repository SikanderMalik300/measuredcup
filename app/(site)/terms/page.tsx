import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';
import { SITE_EMAIL } from '@/lib/data/site';

const SLUG = '/terms/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustFrame slug={SLUG}>
      <p>Effective date: October 14, 2026.</p>
      <p>
        MeasuredCup is free to use. By using the site you agree to these plain terms.
      </p>
      <p>
        <strong className="font-medium">No warranty.</strong> The tools are provided as is, without any
        warranty. The values are averages for typical US products and may not match your brand.
      </p>
      <p>
        <strong className="font-medium">No liability.</strong> We are not liable for recipe outcomes or
        any loss from using the site. Weigh with a kitchen scale when a recipe needs to be exact.
      </p>
      <p>
        <strong className="font-medium">Data license.</strong> The ingredient CSV is free to reuse with
        a link to MeasuredCup under CC BY 4.0. The underlying USDA data is public domain.
      </p>
      <p>
        <strong className="font-medium">Contact.</strong> Questions about these terms go to{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="link">{SITE_EMAIL}</a>. See also our{' '}
        <Link href="/disclaimer/" prefetch={false} className="link">disclaimer</Link>.
      </p>
    </TrustFrame>
  );
}
