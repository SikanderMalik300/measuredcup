import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AnswerCard({
  value,
  sentence,
  href,
  linkLabel,
}: {
  value: string;
  sentence: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="card p-6">
      <p className="tabular text-[22px] font-semibold text-ink">{value}</p>
      <p className="mt-2 text-ink">{sentence}</p>
      <Link
        href={href}
        prefetch={false}
        className="mt-3 inline-flex items-center gap-1 text-small text-brand hover:text-brand-hover"
      >
        {linkLabel}
        <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </div>
  );
}
