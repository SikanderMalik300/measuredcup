// Affiliate link with required rel and a visible label (build spec A10). No affiliate links at launch.
export function AffiliateLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      <a href={href} rel="sponsored nofollow noopener" className="link">
        {children}
      </a>
      <span className="text-small text-muted">(Affiliate link)</span>
    </span>
  );
}
