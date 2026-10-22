import type { Metadata } from 'next';
import { EmbedShell } from '@/components/embed/EmbedShell';
import { RecipeScalerTool } from '@/components/tools/RecipeScalerTool';
import { embedMetadata } from '@/lib/data/embeds';

const slug = '/recipe-scaler/';
export const metadata: Metadata = embedMetadata(slug);

export default function Page() {
  return (
    <EmbedShell slug={slug}>
      <RecipeScalerTool />
    </EmbedShell>
  );
}
