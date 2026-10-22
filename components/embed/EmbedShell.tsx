'use client';

import { useEffect, useRef } from 'react';
import { EmbedContext } from '@/components/tools/embed-context';
import { SITE_URL } from '@/lib/data/site';

// Wraps a tool for /embed/<slug>/: sets embed mode, renders the credit line, and
// reports its height to the parent page so embed.js can size the iframe.
export function EmbedShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const post = () => {
      const height = Math.ceil(document.documentElement.scrollHeight);
      window.parent?.postMessage({ measuredcup: 'height', slug, height }, '*');
    };

    // Reply when embed.js (on the host page) asks for the height.
    const onRequest = (e: MessageEvent) => {
      if (e.data && e.data.measuredcup === 'request') post();
    };

    post();
    const ro = new ResizeObserver(post);
    ro.observe(el);
    window.addEventListener('load', post);
    window.addEventListener('message', onRequest);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', post);
      window.removeEventListener('message', onRequest);
    };
  }, [slug]);

  return (
    <EmbedContext.Provider value={true}>
      <div ref={ref} className="p-4">
        {children}
        <p className="mt-2 text-small text-muted">
          Free converter by{' '}
          <a
            href={`${SITE_URL}${slug}`}
            target="_blank"
            rel="noopener"
            className="font-medium text-brand hover:underline"
          >
            MeasuredCup
          </a>
        </p>
      </div>
    </EmbedContext.Provider>
  );
}
