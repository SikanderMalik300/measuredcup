import { SOURCES } from '@/lib/data/site';
import type { SourceRef } from '@/lib/data/pages';

export function Sources({ sources }: { sources: SourceRef[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading">Sources</h2>
      <ul className="mt-3 space-y-2 text-small">
        {sources.map((s) => {
          const src = SOURCES[s.key];
          return (
            <li key={s.key}>
              <a href={src.url} className="link" rel="noopener">
                {src.name}
              </a>
              {s.note ? ` (${s.note})` : ''} · accessed {src.accessed}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
