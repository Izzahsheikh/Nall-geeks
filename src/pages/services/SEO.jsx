import { useEffect, useRef, useState } from 'react';
import ServicePage from './ServicePage';
import './seo.css';

/* ---------- hooks ---------- */

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// mode "sticky": 0→1 while a tall section scrolls past its pinned panel.
// mode "enter": 0→1 as the section travels into the viewport.
function useScrollProgress(mode = 'sticky') {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw =
        mode === 'sticky'
          ? -rect.top / Math.max(rect.height - vh, 1)
          : (vh * 0.85 - rect.top) / (vh * 0.7);
      const next = Math.round(clamp(raw) * 400) / 400;
      setProgress((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode]);
  return [ref, progress];
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView(0.15);
  return (
    <Tag
      ref={ref}
      className={`sx-reveal${inView ? ' is-in' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- data ---------- */

const JOURNEY = ['Website', 'Crawl', 'Understand', 'Index', 'Rank', 'Visitor', 'Improve'];

const FLOW = [
  ['Website', 'A technically sound website gives search engines something reliable to crawl.'],
  ['Crawl', 'Search engines discover pages, links, content and technical signals.'],
  ['Understand', 'Structure and relevance help search engines understand what each page is about.'],
  ['Index', 'Important pages are stored and made eligible to appear in search.'],
  ['Rank', 'Strong relevance, technical foundations and useful content improve visibility.'],
  ['Visitor', 'The objective is not simply rankings — it is qualified traffic that reaches the right page.'],
];

const INTENTS = [
  ['Informational', 'Looking for information'],
  ['Commercial', 'Comparing solutions'],
  ['Navigational', 'Looking for a specific brand or page'],
  ['Transactional', 'Ready to take action'],
];

const INTENT_PATH = [
  ['Search Query', 'best CRM software for small business'],
  ['Intent', 'Commercial'],
  ['Relevant Page', 'Custom CRM service page'],
  ['Useful Content', 'Options, features, proof'],
  ['Next Action', 'Start a conversation'],
];

const HIERARCHY = ['Page', 'Title', 'H1', 'Content', 'Internal links', 'Related pages'];

const TECH_NODES = [
  { label: 'Crawlability', note: 'Pages can be reached', x: 150, y: 70 },
  { label: 'Indexing', note: 'Right pages are eligible', x: 100, y: 230 },
  { label: 'Site Architecture', note: 'Logical information structure', x: 150, y: 390 },
  { label: 'Internal Links', note: 'Related pages connected', x: 850, y: 70 },
  { label: 'Mobile', note: 'Works on every screen', x: 900, y: 230 },
  { label: 'Performance', note: 'Pages delivered efficiently', x: 850, y: 390 },
];

const TECH_METRICS = ['Fast loading', 'Clean architecture', 'Mobile-ready', 'Indexable pages'];

const LOOP = [
  ['Audit', 'Find technical and content issues'],
  ['Research', 'Understand queries, competitors and intent'],
  ['Structure', 'Improve hierarchy and internal relationships'],
  ['Optimise', 'Refine pages, content and metadata'],
  ['Review', 'Measure performance and identify the next opportunity'],
];

const PROVIDE = [
  [
    'Technical',
    ['Technical SEO review', 'Crawl & indexing review', 'Site architecture', 'Internal linking', 'Page structure', 'Performance review'],
  ],
  [
    'Search & Content',
    [
      'Search-topic research',
      'Search intent analysis',
      'On-page optimisation',
      'Content structure',
      'Metadata optimisation',
      'Existing-content improvements',
    ],
  ],
];

const PRINCIPLES = [
  ['01', 'Technical + Content', 'SEO works best when structure and content are designed together.'],
  ['02', 'User First', 'Pages should answer real questions clearly before trying to satisfy algorithms.'],
  ['03', 'Continuous Improvement', 'Search behaviour, competition and performance constantly change.'],
];

const OUTCOMES = [
  { label: 'Visibility', d: 'M0 300 C120 292 200 270 300 232 S470 150 600 96 S760 40 860 28', orange: true },
  { label: 'Relevant traffic', d: 'M0 306 C130 300 220 286 320 256 S480 190 610 148 S770 92 860 74' },
  { label: 'Qualified enquiries', d: 'M0 312 C140 308 240 300 340 280 S500 236 620 204 S780 150 860 130' },
  { label: 'Content discoverability', d: 'M0 316 C150 312 260 306 360 292 S520 262 640 236 S790 196 860 180' },
];

/* ---------- hero graphic ---------- */

function HeroGraphic() {
  const nodes = [
    [280, 70], [130, 190], [280, 190], [430, 190],
    [60, 320], [160, 320], [250, 320], [330, 320], [400, 320], [480, 320],
    [110, 440], [250, 440], [390, 440],
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [2, 7], [3, 8], [3, 9], [5, 10], [7, 11], [8, 12],
  ];
  return (
    <svg className="sx-hero-graphic" viewBox="0 0 560 520" role="presentation">
      {[120, 200, 280].map((r) => (
        <circle key={r} cx="280" cy="70" r={r} className="sx-hero-ring" />
      ))}
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} className="sx-hero-edge" />
      ))}
      <path d="M130 190 Q280 140 430 190" className="sx-hero-edge sx-hero-edge--dash" />
      <path d="M160 320 Q250 370 330 320" className="sx-hero-edge sx-hero-edge--dash" />
      <path id="sx-hero-path" d="M280 70 L280 190 L330 320 L390 440" className="sx-hero-trace" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 7 : 4.5} className={i === 0 ? 'sx-hero-node sx-hero-node--root' : 'sx-hero-node'} />
      ))}
      <circle r="5" className="sx-hero-pulse">
        <animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="linear">
          <mpath href="#sx-hero-path" />
        </animateMotion>
      </circle>
    </svg>
  );
}

/* ---------- journey ---------- */

function Journey() {
  const [ref, progress] = useScrollProgress('enter');
  const reduced = usePrefersReducedMotion();
  const p = reduced ? 1 : progress;
  const active = Math.min(JOURNEY.length - 1, Math.floor(p * JOURNEY.length));
  return (
    <section className="sx-section sx-journey" ref={ref}>
      <div className="sx-wrap">
        <Reveal className="sx-center">
          <div className="sx-eyebrow">How SEO actually works</div>
          <h2 className="sx-h2">SEO is not one task.<br /><em>It is a connected system.</em></h2>
          <p className="sx-lead">
            A website moves through several stages before it can consistently appear for the right searches. We work across every stage.
          </p>
        </Reveal>
        <div className="sx-journey-track">
          <div className="sx-journey-line"><span style={{ transform: `scaleX(${p})` }} /></div>
          <ol>
            {JOURNEY.map((word, i) => (
              <li key={word} className={`${i <= active ? 'is-active' : ''}${i === active ? ' is-current' : ''}`}>
                <span className="sx-journey-dot" />
                <span className="sx-journey-word">{word}</span>
                <span className="sx-journey-num">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- signature flow ---------- */

function SiteMock({ className = '' }) {
  return (
    <g className={`sx-site ${className}`}>
      <rect width="400" height="300" rx="10" className="sx-s-frame" />
      <line x1="0" y1="30" x2="400" y2="30" className="sx-s-line" />
      {[16, 30, 44].map((x) => <circle key={x} cx={x} cy="15" r="3.5" className="sx-s-dot" />)}
      <rect x="70" y="8" width="200" height="14" rx="7" className="sx-s-line" />
      <rect x="20" y="46" width="40" height="8" rx="2" className="sx-s-fill" />
      {[250, 290, 330].map((x) => <rect key={x} x={x} y="47" width="28" height="6" rx="2" className="sx-s-fill" />)}
      <rect x="20" y="80" width="170" height="14" rx="3" className="sx-s-fill sx-s-fill--strong" />
      <rect x="20" y="102" width="120" height="14" rx="3" className="sx-s-fill sx-s-fill--strong" />
      <rect x="20" y="130" width="200" height="6" rx="3" className="sx-s-fill" />
      <rect x="20" y="142" width="170" height="6" rx="3" className="sx-s-fill" />
      <rect x="20" y="162" width="60" height="20" rx="10" className="sx-site-btn" />
      <rect x="250" y="76" width="130" height="110" rx="6" className="sx-s-line" />
      {[20, 144, 268].map((x) => (
        <g key={x}>
          <rect x={x} y="205" width="112" height="70" rx="6" className="sx-s-line" />
          <rect x={x + 12} y="219" width="60" height="6" rx="3" className="sx-s-fill" />
          <rect x={x + 12} y="233" width="84" height="5" rx="2.5" className="sx-s-fill" />
        </g>
      ))}
    </g>
  );
}

const CRAWL_PATH = 'M40 50 L264 50 L100 87 L315 130 L50 172 L76 240 L200 240 L324 240';
const CRAWL_NODES = [[40, 50], [264, 50], [100, 87], [315, 130], [50, 172], [76, 240], [200, 240], [324, 240]];

const UNDERSTAND_ROWS = [
  ['Page title', 'Custom CRM Software | NallGeeks', 130],
  ['H1', 'Custom CRM Software for Growing Teams', 150],
  ['Content', 'Features, workflows, who it is for', 200],
  ['Internal links', '→ /services/custom-business-software', 250],
  ['Intent', 'Commercial — comparing solutions', 270],
];

const INDEX_ROWS = ['/', '/about', '/services/web-development', '/services/custom-crm', '/contact'];

function FlowCanvas({ stage }) {
  const siteTransform = [
    'translate(240px, 70px) scale(1)',
    'translate(240px, 70px) scale(1)',
    'translate(50px, 120px) scale(0.55)',
    'translate(40px, 165px) scale(0.4)',
    'translate(240px, 70px) scale(1)',
    'translate(510px, 90px) scale(0.9)',
  ][stage];
  const rankOrder = stage === 4 ? [0, 1, 2] : [2, 0, 1]; // client, competitor A, competitor B → row index
  const rowY = (row) => 112 + row * 96;

  return (
    <svg className="sx-flow-svg" viewBox="0 0 880 440" role="img" aria-label="Animated diagram: a website is crawled, understood, indexed, ranked and visited.">
      {/* persistent website */}
      <g className={`sx-site-wrap${stage === 4 ? ' is-hidden' : ''}${stage === 5 ? ' is-visitor' : ''}`} style={{ transform: siteTransform }}>
        <SiteMock />
      </g>

      {/* 02 crawl */}
      <g className={`sx-layer${stage === 1 ? ' is-on' : ''}`} transform="translate(240 70)">
        <path d={CRAWL_PATH} className="sx-crawl-path" pathLength="1" />
        {CRAWL_NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" className="sx-crawl-node" style={{ animationDelay: `${0.25 + i * 0.28}s` }} />
        ))}
      </g>

      {/* 03 understand */}
      <g className={`sx-layer${stage === 2 ? ' is-on' : ''}`}>
        {UNDERSTAND_ROWS.map(([label, value, fromY], i) => {
          const y = 80 + i * 66;
          return (
            <g key={label} className="sx-u-row" style={{ transitionDelay: `${0.2 + i * 0.12}s` }}>
              <path d={`M270 ${fromY} C320 ${fromY} 310 ${y} 360 ${y}`} className="sx-link-line" />
              <circle cx="360" cy={y} r="4" className="sx-link-dot" />
              <text x="380" y={y - 12} className="sx-svg-label">{label}</text>
              <text x="380" y={y + 14} className="sx-svg-value">{value}</text>
              <line x1="380" y1={y + 30} x2="840" y2={y + 30} className="sx-s-line" />
            </g>
          );
        })}
      </g>

      {/* 04 index */}
      <g className={`sx-layer${stage === 3 ? ' is-on' : ''}`}>
        <path d="M215 225 L335 225" className="sx-link-line sx-flow-arrow" />
        <path d="M327 218 L337 225 L327 232" className="sx-link-line" />
        <rect x="350" y="50" width="490" height="340" rx="10" className="sx-s-frame" />
        <text x="374" y="86" className="sx-svg-label">Search index</text>
        <line x1="350" y1="104" x2="840" y2="104" className="sx-s-line" />
        {INDEX_ROWS.map((row, i) => {
          const isNew = i === 3;
          return (
            <g key={row} className={isNew ? 'sx-index-new' : ''}>
              {isNew && <rect x="358" y={118 + i * 54} width="474" height="44" rx="6" className="sx-index-hl" />}
              <text x="378" y={146 + i * 54} className={`sx-svg-value${isNew ? ' is-accent' : ''}`}>{row}</text>
              <text x="820" y={146 + i * 54} textAnchor="end" className={`sx-svg-label${isNew ? ' is-accent' : ''}`}>
                {isNew ? 'Indexed' : '✓'}
              </text>
            </g>
          );
        })}
      </g>

      {/* 05 rank */}
      <g className={`sx-layer${stage === 4 ? ' is-on' : ''}`}>
        <rect x="140" y="30" width="600" height="46" rx="23" className="sx-s-frame" />
        <circle cx="168" cy="53" r="7" className="sx-s-line" />
        <line x1="173" y1="58" x2="180" y2="65" className="sx-s-line" />
        <text x="196" y="59" className="sx-svg-value">best CRM software for small business</text>
        {[0, 1, 2].map((n) => (
          <text key={n} x="112" y={rowY(n) + 36} textAnchor="end" className="sx-svg-label">{n + 1}</text>
        ))}
        {[
          { id: 0, client: true, url: 'yourbusiness.com › crm', title: 'Custom CRM for small business teams' },
          { id: 1, url: 'competitor-one.com › software', title: 'Top 10 CRM tools compared' },
          { id: 2, url: 'competitor-two.com › crm', title: 'CRM software pricing guide' },
        ].map((r) => (
          <g key={r.id} className={`sx-result${r.client ? ' is-client' : ''}`} style={{ transform: `translateY(${rowY(rankOrder[r.id])}px)`, transitionDelay: r.client ? '0.5s' : '0.3s' }}>
            <rect x="140" y="0" width="600" height="80" rx="8" className="sx-result-card" />
            {r.client && <rect x="140" y="0" width="4" height="80" className="sx-result-bar" />}
            <text x="164" y="24" className="sx-svg-label">{r.url}</text>
            <text x="164" y="48" className="sx-result-title">{r.title}</text>
            <rect x="164" y="60" width="380" height="6" rx="3" className="sx-s-fill" />
            {r.client && <text x="716" y="24" textAnchor="end" className="sx-svg-label is-accent">Your page</text>}
          </g>
        ))}
      </g>

      {/* 06 visitor */}
      <g className={`sx-layer${stage === 5 ? ' is-on' : ''}`}>
        <g transform="translate(30 150)">
          <rect width="400" height="90" rx="8" className="sx-result-card" />
          <rect width="4" height="90" className="sx-result-bar" />
          <text x="22" y="26" className="sx-svg-label">yourbusiness.com › crm</text>
          <text x="22" y="54" className="sx-result-title">Custom CRM for small business teams</text>
          <rect x="22" y="68" width="190" height="6" rx="3" className="sx-s-fill" />
          <circle cx="360" cy="52" r="14" className="sx-click-ring" />
          <path d="M354 45 L354 65 L360 59 L365 70 L369 68 L364 58 L372 58 Z" className="sx-cursor" />
        </g>
        <path d="M435 195 C470 195 480 150 510 150" className="sx-link-line sx-visit-path" pathLength="1" />
        <text x="510" y="68" className="sx-svg-label is-accent">Qualified visitor</text>
      </g>
    </svg>
  );
}

function SearchFlow() {
  const [ref, progress] = useScrollProgress('sticky');
  const reduced = usePrefersReducedMotion();
  const stage = Math.min(FLOW.length - 1, Math.floor(progress * FLOW.length * 0.999));
  return (
    <section className="sx-flow" ref={ref} style={{ height: `${FLOW.length * 85 + 40}vh` }}>
      <div className="sx-flow-sticky">
        <div className="sx-wrap sx-flow-inner">
          <header className="sx-flow-head">
            <div className="sx-eyebrow">The signature journey</div>
            <h2 className="sx-h2 sx-h2--light">From website to <em>search result</em></h2>
          </header>
          <div className="sx-flow-rail">
            <div className="sx-flow-rail-line"><span style={{ transform: `scaleX(${reduced ? 1 : (stage + 0.5) / FLOW.length})` }} /></div>
            {FLOW.map(([name], i) => (
              <div key={name} className={`sx-flow-rail-item${i === stage ? ' is-current' : ''}${i < stage ? ' is-past' : ''}`}>
                <span className="sx-flow-rail-dot" />
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{name}</strong>
              </div>
            ))}
          </div>
          <div className="sx-flow-canvas"><FlowCanvas stage={stage} /></div>
          <div className="sx-flow-caption" key={stage}>
            <span className="sx-flow-caption-num">{String(stage + 1).padStart(2, '0')}</span>
            <p>{FLOW[stage][1]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- search intent ---------- */

function SearchIntent() {
  const [pathRef, pathIn] = useInView(0.4);
  return (
    <section className="sx-section sx-intent">
      <div className="sx-wrap">
        <div className="sx-intent-grid">
          <Reveal>
            <div className="sx-eyebrow">Search strategy</div>
            <h2 className="sx-h2">Understand what people are <em>actually</em> looking for</h2>
            <div className="sx-searchbar" aria-label="Example search query">
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>best CRM software for small business</span>
              <i className="sx-caret" />
            </div>
            <p className="sx-classify">
              <span className="sx-classify-label">Classified as</span>
              <strong>Commercial</strong>
              <span>— “best” and “for small business” signal someone comparing options.</span>
            </p>
          </Reveal>
          <Reveal delay={150} className="sx-intent-quad">
            {INTENTS.map(([name, desc]) => (
              <div key={name} className={name === 'Commercial' ? 'is-match' : ''}>
                {name === 'Commercial' && <span className="sx-match-tag">Matches the query</span>}
                <h3>{name}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
        <div className={`sx-intent-path${pathIn ? ' is-in' : ''}`} ref={pathRef}>
          <div className="sx-intent-path-line"><span /></div>
          <ol>
            {INTENT_PATH.map(([title, sub], i) => (
              <li key={title} style={{ transitionDelay: `${0.25 + i * 0.25}s` }}>
                <span className="sx-journey-dot" />
                <strong>{title}</strong>
                <p>{sub}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- on-page anatomy ---------- */

function OnPage() {
  return (
    <section className="sx-section sx-onpage">
      <div className="sx-wrap">
        <Reveal className="sx-section-head">
          <div className="sx-eyebrow">On-page SEO</div>
          <h2 className="sx-h2">Clear structure for <em>people and search engines</em></h2>
        </Reveal>
        <div className="sx-onpage-grid">
          <Reveal className="sx-anatomy">
            <div className="sx-browser">
              <div className="sx-browser-bar"><i /><i /><i /><span className="sx-ann-row">
                <b>nallgeeks.com/services/custom-crm</b>
                <em className="sx-ann">Title Tag</em>
              </span></div>
              <div className="sx-pagebody">
                <div className="sx-ann-row sx-page-h1">
                  <h3>Custom CRM Software for Growing Teams</h3>
                  <em className="sx-ann">H1</em>
                </div>
                <div className="sx-ann-row">
                  <p className="sx-page-intro">A CRM shaped around how your team sells, follows up and reports — not the other way round.</p>
                  <em className="sx-ann">Introduction</em>
                </div>
                <div className="sx-ann-row">
                  <h4>Why off-the-shelf tools fall short</h4>
                  <em className="sx-ann">H2</em>
                </div>
                <div className="sx-ann-row">
                  <div className="sx-page-body"><span /><span /><span className="short" /></div>
                  <em className="sx-ann">Body Content</em>
                </div>
                <div className="sx-ann-row">
                  <a className="sx-page-link" href="/services/custom-business-software">See our business software work →</a>
                  <em className="sx-ann">Internal Link</em>
                </div>
                <div className="sx-ann-row">
                  <span className="sx-page-cta">Discuss your project</span>
                  <em className="sx-ann">CTA</em>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150} className="sx-hier">
            <ol>
              {HIERARCHY.map((item, i) => (
                <li key={item} style={{ transitionDelay: `${i * 80}ms` }}>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <p>Good on-page SEO creates meaning, hierarchy and clear relationships between pages.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- technical system map ---------- */

function TechnicalMap() {
  const [ref, inView] = useInView(0.3);
  return (
    <section className="sx-section sx-tech">
      <div className="sx-wrap">
        <Reveal className="sx-center">
          <div className="sx-eyebrow">Technical SEO</div>
          <h2 className="sx-h2">A strong <em>technical foundation</em></h2>
          <p className="sx-lead">
            Search engines need to access, interpret and navigate the site efficiently before content can perform.
          </p>
        </Reveal>
        <div className={`sx-tech-map${inView ? ' is-in' : ''}`} ref={ref}>
          <svg viewBox="0 0 1000 500" role="img" aria-label="System map: a central website connected to crawlability, indexing, architecture, internal links, mobile and performance.">
            {TECH_NODES.map((n, i) => {
              const left = n.x < 500;
              const path = `M${n.x + (left ? 14 : -14)} ${n.y} C${left ? 330 : 670} ${n.y} ${left ? 380 : 620} 230 ${left ? 395 : 605} 230`;
              return (
                <g key={n.label}>
                  <path id={`sx-tech-${i}`} d={path} className="sx-tech-line" pathLength="1" style={{ transitionDelay: `${i * 90}ms` }} />
                  <circle r="4" className="sx-tech-pulse">
                    <animateMotion dur={`${3.4 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                      <mpath href={`#sx-tech-${i}`} />
                    </animateMotion>
                  </circle>
                  <circle cx={n.x} cy={n.y} r="14" className="sx-tech-node" />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" className="sx-tech-index">{i + 1}</text>
                  <text x={left ? n.x - 14 : n.x + 14} y={n.y + (n.y > 300 ? 46 : -40)} textAnchor={left ? 'start' : 'end'} className="sx-tech-label">{n.label}</text>
                  <text x={left ? n.x - 14 : n.x + 14} y={n.y + (n.y > 300 ? 72 : -14)} textAnchor={left ? 'start' : 'end'} className="sx-tech-note">{n.note}</text>
                </g>
              );
            })}
            <g transform="translate(400 130)">
              <rect width="200" height="200" rx="12" className="sx-tech-core" />
              <line x1="0" y1="34" x2="200" y2="34" className="sx-s-line" />
              {[16, 30, 44].map((x) => <circle key={x} cx={x} cy="17" r="3.5" className="sx-s-dot" />)}
              {[0, 1, 2].map((r) => (
                <g key={r}>
                  <rect x="22" y={56 + r * 44} width="156" height="32" rx="5" className="sx-s-line" />
                  <circle cx="40" cy={72 + r * 44} r="4" className={r === 1 ? 'sx-tech-led' : 'sx-s-dot'} />
                  <rect x="56" y={69 + r * 44} width="80" height="6" rx="3" className="sx-s-fill" />
                </g>
              ))}
            </g>
          </svg>
        </div>
        <ul className="sx-metrics">
          {TECH_METRICS.map((m) => <li key={m}>{m}</li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- continuous loop ---------- */

function LoopRing({ progress }) {
  const cx = 260;
  const cy = 260;
  const r = 190;
  const pos = (i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const active = Math.min(LOOP.length - 1, Math.floor(progress * LOOP.length * 0.999));
  return (
    <svg className="sx-loop-svg" viewBox="0 0 520 520" role="img" aria-label="Circular process: audit, research, structure, optimise, review, returning to audit.">
      <circle cx={cx} cy={cy} r={r} className="sx-loop-ring" />
      {LOOP.map((_, i) => {
        const [x1, y1] = pos(i);
        const [x2, y2] = pos((i + 1) % LOOP.length);
        const fill = clamp(progress * LOOP.length - i);
        return (
          <path
            key={i}
            d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`}
            pathLength="1"
            className="sx-loop-arc"
            style={{ strokeDashoffset: 1 - fill }}
          />
        );
      })}
      {LOOP.map(([name], i) => {
        const [x, y] = pos(i);
        const state = i === active ? 'is-current' : i < active ? 'is-past' : '';
        return (
          <g key={name} className={`sx-loop-node ${state}`}>
            <circle cx={x} cy={y} r="30" />
            <text x={x} y={y + 6} textAnchor="middle">{String(i + 1).padStart(2, '0')}</text>
          </g>
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" className="sx-loop-center">Always</text>
      <text x={cx} y={cy + 30} textAnchor="middle" className="sx-loop-center sx-loop-center--em">improving</text>
    </svg>
  );
}

function ContinuousLoop() {
  const [ref, progress] = useScrollProgress('sticky');
  const reduced = usePrefersReducedMotion();
  const p = reduced ? 1 : clamp(progress * 1.15);
  const active = Math.min(LOOP.length - 1, Math.floor(p * LOOP.length * 0.999));
  return (
    <section className="sx-loop" ref={ref}>
      <div className="sx-loop-sticky">
        <div className="sx-wrap sx-loop-grid">
          <div className="sx-loop-copy">
            <div className="sx-eyebrow">Our approach</div>
            <h2 className="sx-h2">SEO is a <em>continuous</em> process</h2>
            <p className="sx-lead">It does not end after launch. Every review feeds the next audit.</p>
            <ol className="sx-loop-steps">
              {LOOP.map(([name, desc], i) => (
                <li key={name} className={i === active ? 'is-current' : i < active ? 'is-past' : ''}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{name}{i === LOOP.length - 1 && <em> → back to Audit</em>}</strong>
                    <p>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <LoopRing progress={p} />
        </div>
      </div>
    </section>
  );
}

/* ---------- provide ---------- */

function Provide() {
  return (
    <section className="sx-section sx-provide">
      <div className="sx-wrap sx-provide-grid">
        <Reveal>
          <div className="sx-eyebrow">SEO services</div>
          <h2 className="sx-h2 sx-h2--xl">What we <em>provide</em></h2>
        </Reveal>
        <div className="sx-provide-cols">
          {PROVIDE.map(([title, items], c) => (
            <Reveal key={title} delay={c * 120} className="sx-provide-col">
              <h3>{title}</h3>
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- principles ---------- */

function Principles() {
  return (
    <section className="sx-section sx-principles">
      <div className="sx-wrap">
        <Reveal className="sx-section-head">
          <div className="sx-eyebrow">Our principles</div>
          <h2 className="sx-h2 sx-h2--light">Search optimisation <em>built into the website</em></h2>
        </Reveal>
        <div className="sx-principle-list">
          {PRINCIPLES.map(([num, title, desc]) => (
            <Reveal key={num} className="sx-principle">
              <span className="sx-principle-bg" aria-hidden="true">{num}</span>
              <span className="sx-principle-num">{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- outcomes ---------- */

function Outcomes() {
  const [ref, inView] = useInView(0.35);
  return (
    <section className="sx-section sx-outcomes">
      <div className="sx-wrap sx-outcomes-grid">
        <Reveal>
          <div className="sx-eyebrow">The outcome</div>
          <h2 className="sx-h2">What better SEO should <em>improve</em></h2>
          <ul className="sx-outcome-list">
            {OUTCOMES.map((o) => (
              <li key={o.label} className={o.orange ? 'is-lead' : ''}>
                <span>{o.label}</span>
                <b aria-hidden="true">↑</b>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className={`sx-chart${inView ? ' is-in' : ''}`} ref={ref}>
          <svg viewBox="0 0 960 380" role="img" aria-label="Illustrative chart: visibility, relevant traffic, qualified enquiries and content discoverability all trending upward.">
            {[60, 140, 220, 300].map((y) => <line key={y} x1="40" x2="920" y1={y} y2={y} className="sx-chart-grid" />)}
            <line x1="40" x2="40" y1="20" y2="340" className="sx-chart-axis" />
            <line x1="40" x2="920" y1="340" y2="340" className="sx-chart-axis" />
            <g transform="translate(40 20)">
              {[...OUTCOMES].reverse().map((o, i) => (
                <path
                  key={o.label}
                  d={o.d}
                  pathLength="1"
                  className={`sx-chart-curve${o.orange ? ' is-lead' : ''}`}
                  style={{ transitionDelay: `${i * 160}ms` }}
                />
              ))}
              {OUTCOMES.map((o) => {
                const end = o.d.trim().split(/\s+/).slice(-2);
                return (
                  <text key={o.label} x="870" y={Number(end[1]) - 10} className={`sx-chart-label${o.orange ? ' is-lead' : ''}`}>
                    {o.label}
                  </text>
                );
              })}
            </g>
            <text x="40" y="368" className="sx-chart-note">Illustrative diagram — not real analytics</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ---------- final CTA ---------- */

function FinalCta() {
  return (
    <section className="sx-cta">
      <Reveal className="sx-wrap sx-cta-inner">
        <div className="sx-eyebrow">Ready to improve your search visibility?</div>
        <h2>Build a website that <em>deserves to be found.</em></h2>
        <p>
          From technical foundations to search intent and content structure, we build SEO into the entire website experience.
        </p>
        <div className="sx-cta-actions">
          <a href="/contact" className="sx-btn sx-btn--primary">Discuss your project →</a>
          <a href="/projects" className="sx-btn sx-btn--ghost">Explore our work</a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- page ---------- */

export default function SEO() {
  return (
    <ServicePage
      title="Search Engine Optimization"
      description="We turn technically strong websites into pages that search engines can understand, trust and rank."
      pageClassName="sp--seo"
      heroActions={<p className="sx-hero-tags">Technical SEO · Search Strategy · Content · On-page Optimisation</p>}
      heroAside={<HeroGraphic />}
      hideWork
      hideCta
    >
      <div className="sx-root">
        <Journey />
        <SearchFlow />
        <SearchIntent />
        <OnPage />
        <TechnicalMap />
        <ContinuousLoop />
        <Provide />
        <Principles />
        <Outcomes />
        <FinalCta />
      </div>
    </ServicePage>
  );
}
