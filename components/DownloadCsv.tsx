'use client';

import { Download } from 'lucide-react';
import { track } from '@/lib/analytics';

export function DownloadCsv({ href }: { href: string }) {
  return (
    <a
      href={href}
      download
      className="btn-primary"
      onClick={() => track('csv_download')}
    >
      <Download size={18} strokeWidth={1.5} aria-hidden="true" className="mr-2" />
      Download CSV
    </a>
  );
}
