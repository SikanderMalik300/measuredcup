// Reserved-height ad slot that renders nothing until NEXT_PUBLIC_ADSENSE_ID is set (build spec A10).
// No border, no "ad" styling. Positions allowed: after "How to use", after reference tables, sidebar.

export function AdSlot({ position }: { position: 'content' | 'sidebar' }) {
  const enabled = Boolean(process.env.NEXT_PUBLIC_ADSENSE_ID);
  const minHeight = position === 'sidebar' ? 280 : 250;
  return (
    <div
      aria-hidden="true"
      data-ad-slot={position}
      style={{ minHeight }}
      className="w-full"
    >
      {enabled ? null : null}
    </div>
  );
}
