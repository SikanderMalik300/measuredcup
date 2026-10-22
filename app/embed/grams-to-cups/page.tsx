import type { Metadata } from 'next';
import { EmbedShell } from '@/components/embed/EmbedShell';
import { GramsToCupsTool } from '@/components/tools/GramsToCupsTool';
import { embedMetadata } from '@/lib/data/embeds';

const slug = '/grams-to-cups/';
export const metadata: Metadata = embedMetadata(slug);

export default function Page() {
  return (
    <EmbedShell slug={slug}>
      <GramsToCupsTool />
    </EmbedShell>
  );
}
