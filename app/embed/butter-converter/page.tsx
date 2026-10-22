import type { Metadata } from 'next';
import { EmbedShell } from '@/components/embed/EmbedShell';
import { ButterConverterTool } from '@/components/tools/ButterConverterTool';
import { embedMetadata } from '@/lib/data/embeds';

const slug = '/butter-converter/';
export const metadata: Metadata = embedMetadata(slug);

export default function Page() {
  return (
    <EmbedShell slug={slug}>
      <ButterConverterTool />
    </EmbedShell>
  );
}
