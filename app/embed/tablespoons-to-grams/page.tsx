import type { Metadata } from 'next';
import { EmbedShell } from '@/components/embed/EmbedShell';
import { TablespoonsToGramsTool } from '@/components/tools/TablespoonsToGramsTool';
import { embedMetadata } from '@/lib/data/embeds';

const slug = '/tablespoons-to-grams/';
export const metadata: Metadata = embedMetadata(slug);

export default function Page() {
  return (
    <EmbedShell slug={slug}>
      <TablespoonsToGramsTool />
    </EmbedShell>
  );
}
