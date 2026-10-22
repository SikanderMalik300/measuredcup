// Thin analytics wrapper. Does nothing unless GA4 (gtag) is present. Safe to call anywhere client-side.

type EventName =
  | 'tool_used'
  | 'tool_result_shown'
  | 'copy_result'
  | 'share_link'
  | 'print'
  | 'csv_download'
  | 'outbound_click'
  | 'embed_copy';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params ?? {});
  }
}
