import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';
import { SITE_EMAIL } from '@/lib/data/site';

const SLUG = '/privacy/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA_ID);
  const adsEnabled = Boolean(process.env.NEXT_PUBLIC_ADSENSE_ID);
  return (
    <TrustFrame slug={SLUG}>
      <p>Effective date: October 14, 2026.</p>
      <p>
        MeasuredCup is a set of free kitchen converters. We keep data collection to a minimum and
        don&apos;t sell personal information. This page explains what we use and why.
      </p>

      <h2>Hosting and analytics</h2>
      <p>
        The site is hosted on Cloudflare Pages, which also acts as our content delivery network.
        Cloudflare processes basic request data (such as IP address) to serve pages and protect the
        site. We use Cloudflare Web Analytics to count visits. It does not use cookies and does not
        track you across sites.
      </p>

      <h2>Contact form</h2>
      <p>
        Our contact form is handled by Web3Forms. When you send a message, your name, email and message
        are passed to Web3Forms and emailed to us so we can reply. We use them only to answer you.
      </p>

      {gaEnabled && (
        <>
          <h2>Google Analytics</h2>
          <p>
            This site uses Google Analytics 4 to understand which pages are useful. Data is retained for
            14 months. In the EEA, the UK and Switzerland we ask for consent before loading it, and you
            can opt out with the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" className="link" rel="noopener">
              Google Analytics opt-out browser add-on
            </a>
            .
          </p>
        </>
      )}

      {adsEnabled && (
        <>
          <h2>Advertising</h2>
          <p>
            This site shows ads through Google AdSense. Google and its partners may use cookies to serve
            ads based on your prior visits. You can manage ad personalization at{' '}
            <a href="https://adssettings.google.com" className="link" rel="noopener">adssettings.google.com</a>{' '}
            and{' '}
            <a href="https://www.aboutads.info" className="link" rel="noopener">aboutads.info</a>.
          </p>
        </>
      )}

      <h2>Your choices</h2>
      <p>
        You can block cookies in your browser and still use every tool on the site, since the
        converters run on your device. For any privacy question, email{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="link">{SITE_EMAIL}</a>.
      </p>
    </TrustFrame>
  );
}
