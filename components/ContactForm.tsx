'use client';

import { useState } from 'react';
import { SITE_EMAIL } from '@/lib/data/site';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass = 'h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] text-ink';

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <input type="hidden" name="access_key" value={accessKey} />
      {/* Honeypot */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div>
        <label htmlFor="name" className="block text-small font-medium text-muted">Name</label>
        <input id="name" name="name" required className={inputClass + ' mt-1'} />
      </div>
      <div>
        <label htmlFor="email" className="block text-small font-medium text-muted">Email</label>
        <input id="email" name="email" type="email" required className={inputClass + ' mt-1'} />
      </div>
      <div>
        <label htmlFor="message" className="block text-small font-medium text-muted">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-card border border-line bg-surface p-3 text-[16px] text-ink"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>

      <div aria-live="polite">
        {status === 'ok' && <p className="text-ink">Thanks. Your message is on its way.</p>}
        {status === 'error' && (
          <p className="text-ink">
            That didn&apos;t send. Please email{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="link">{SITE_EMAIL}</a> instead.
          </p>
        )}
      </div>
    </form>
  );
}
