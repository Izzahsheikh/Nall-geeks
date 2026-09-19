import { useEffect } from 'react';

export const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 14.5s5-4.2 5-8.1A5 5 0 0 0 3 6.4c0 3.9 5 8.1 5 8.1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="8" cy="6.4" r="1.7" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

export const BriefcaseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.75" y="4.5" width="12.5" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5.5 4.5V3.4c0-.6.5-1.15 1.15-1.15h2.7c.65 0 1.15.55 1.15 1.15v1.1M1.75 8.5h12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1.5 7h11M8 2.5 12.5 7 8 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BackLink = ({ href, children }) => (
  <a href={href} className="ngc-back">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12.5 7h-11M6 2.5 1.5 7 6 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {children}
  </a>
);

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = title;
    return () => { document.title = previous; };
  }, [title]);
}
