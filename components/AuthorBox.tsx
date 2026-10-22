import Link from 'next/link';
import { AuthorPhoto } from './AuthorPhoto';
import { formatDate } from './content';

export function AuthorBox({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div className="card flex items-start gap-4 p-6">
      <AuthorPhoto size={40} />
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
