'use client';

import Script from 'next/script';

// Google Analytics 4. Loads only when NEXT_PUBLIC_GA_ID is set (build spec A1/A10).
// Consent Mode v2 defaults are set before gtag('js'): the site targets the US, so analytics is
// granted while all ad signals are denied until AdSense is added. Loaded with strategy lazyOnload
// so it never blocks rendering.
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
