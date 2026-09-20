/*
 * Items in the navbar's "Services" dropdown.
 *
 * The titles mirror the six services shown in the Services section on the homepage (Services.jsx). The homepage rows below
 * that section have no anchors of their own, so every item leads to the Services section itself (`/#services`), the same
 * place the footer's service links and the "Services" nav item already go.
 */

export const SERVICES_HREF = '/#services';

// The icons are the exact glyphs the homepage service cards use (the `icon` values in Services.jsx: plain characters and emoji), so the
// dropdown and the cards match. Sized to sit inside the orange tile; `color` only affects the text glyphs (</> and ⊞), emoji keep their own.
const glyph = (character) => (
  <span aria-hidden="true" style={{ fontSize: '20px', lineHeight: 1, whiteSpace: 'nowrap' }}>
    {character}
  </span>
);

export const SERVICE_MENU = [
  {
    title: 'Web Development',
    description: 'Custom web applications built for speed, scale, and performance.',
    icon: glyph("</>"),
  },
  {
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile apps for iOS and Android.',
    icon: glyph("📱"),
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that users love to engage with.',
    icon: glyph("🎨"),
  },
  {
    title: 'Software Management',
    description: 'Tools shaped around your workflow, not the other way around.',
    icon: glyph("⊞"),
  },
  {
    title: 'Search Engine Optimization',
    description: 'Rank higher and get found faster on the search engines that matter.',
    icon: glyph("🔍"),
  },
  {
    title: 'AI & Automation',
    description: 'Eliminate the repetitive by building AI into your product or process.',
    icon: glyph("🤖"),
  },
];

export const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
