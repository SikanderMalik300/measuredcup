import Link from 'next/link';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

export function AuthorBox({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div className="card flex items-start gap-4 p-6">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-small font-medium"
        style={{ background: 'var(--band-3)', color: 'var(--brand)' }}
      >
        SM
      </span>
      <div>
        <p>
          <Link href="/authors/sikander-malik/" prefetch={false} className="link">
            Sikander Malik
          </Link>
        </p>
        <p className="text-small text-muted">Founder, builds MeasuredCup&apos;s converters</p>
        <p className="mt-1 text-small text-muted">Last updated {formatDate(lastUpdated)}</p>
        <p className="mt-1 text-small">
          <Link href="/editorial-policy/" prefetch={false} className="link">
            Editorial policy
          </Link>
        </p>
      </div>
    </div>
  );
}
