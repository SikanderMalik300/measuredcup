'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { track } from '@/lib/analytics';
import { embedSnippet } from '@/lib/embed-snippet';
import { getEmbed } from '@/lib/data/embeds';

// Live iframe preview plus the copyable snippet, used on the landing page.
export function EmbedPreview({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const { title, height } = getEmbed(slug);
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
    <div className="mt-4">
      <iframe
        src={`/embed${slug}`}
        title={title}
        data-measuredcup
        width="100%"
        height={height}
        loading="lazy"
        className="rounded-card border border-line bg-white"
        style={{ maxWidth: 640, width: '100%' }}
      />
      <textarea
        readOnly
        value={snippet}
        rows={4}
        onFocus={(e) => e.currentTarget.select()}
        className="mt-3 w-full rounded-card border border-line bg-surface p-3 font-mono text-small text-ink"
      />
      <div className="mt-3">
        <button type="button" className="btn-secondary" onClick={copy}>
          {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
          Copy code
        </button>
      </div>
    </div>
  );
}
