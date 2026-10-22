import type { Metadata } from 'next';

// Minimal chrome-free shell for iframe embeds. No header, footer, analytics or cookie banner.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white">{children}</div>;
}
