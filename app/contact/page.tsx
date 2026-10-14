import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';
import { ContactForm } from '@/components/ContactForm';
import { SITE_EMAIL } from '@/lib/data/site';

const SLUG = '/contact/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustFrame slug={SLUG}>
      <p>
        Spotted a number that looks wrong, or a tool you&apos;d like us to build? Send a message below.
        We read every one and usually reply within 3 business days.
      </p>
      <ContactForm />
      <p className="mt-4 text-small text-muted">
        Email: <a href={`mailto:${SITE_EMAIL}`} className="link">{SITE_EMAIL}</a>
      </p>
    </TrustFrame>
  );
}
