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
  <a href={href} className="ngc-back"><span aria-hidden="true">&lt;</span> {children}</a>
);

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = title;
    return () => { document.title = previous; };
  }, [title]);
}

export const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

/* The company mark on a light tile, so the (dark) logo reads on the page's dark background. */
export const CompanyLogo = ({ src, size = 'lg' }) => (
  <span className={`ngc-logo-tile ngc-logo-tile--${size}`}>
    <img src={src} width="1665" height="944" alt="NallGeeks logo" />
  </span>
);

/* Renders the description blocks from positions.js: strings are paragraphs, {heading} a sub-heading, {list} a bulleted list. */
export function RoleDescription({ blocks }) {
  return blocks.map((block, i) => {
    if (typeof block === 'string') return <p key={i}>{block}</p>;
    if (block.heading) return <h3 key={i}>{block.heading}</h3>;
    if (block.list) {
      return (
        <ul key={i} className="ngc-list">
          {block.list.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      );
    }
    return null;
  });
}
