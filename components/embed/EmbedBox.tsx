'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { track } from '@/lib/analytics';
import { embedSnippet } from '@/lib/embed-snippet';

// "Get this calculator for your site" box shown on each embeddable tool page.
export function EmbedBox({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = embedSnippet(slug);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
    track('embed_copy', { slug });
  };

  return (
    <details className="mt-6 rounded-card border border-line p-4 md:p-5">
      <summary className="cursor-pointer font-medium text-ink">Get this calculator for your site</summary>
      <p className="mt-3 text-ink">
        Free to use on any website or blog. Paste this code where you want the calculator. It loads fast, has no
        ads or tracking, and stays up to date.
      </p>
      <textarea
        readOnly
        value={snippet}
        rows={4}
        onFocus={(e) => e.currentTarget.select()}
        className="mt-3 w-full rounded-card border border-line bg-surface p-3 font-mono text-small text-ink"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary" onClick={copy}>
          {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
          Copy code
        </button>
        <a href={`/embed${slug}`} target="_blank" rel="noopener" className="btn-secondary">
          Preview the embed
        </a>
      </div>
    </details>
  );
}
