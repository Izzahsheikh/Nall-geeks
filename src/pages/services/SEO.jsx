import { useEffect, useRef, useState } from 'react';
import ServicePage from './ServicePage';
import './seo.css';

/* ---------- hooks ---------- */

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

const FLOW = [
  ['Website', 'Your site needs a clear structure search engines can access.'],
  ['Crawl', 'Search engines discover pages, links and content across your website.'],
  ['Understand', 'They interpret what each page is about and who it may be useful for.'],
  ['Index', 'Useful and accessible pages become eligible to appear in search.'],
  ['Rank', 'Search engines decide where relevant pages should appear for a query.'],
  ['Visitor', 'The right search result brings a relevant person into your website.'],
];

const INTENTS = [
  ['Informational', 'Learn something'],
  ['Commercial', 'Compare solutions'],
  ['Navigational', 'Find a specific brand'],
  ['Transactional', 'Take action'],
];

const INTENT_FACTS = [
  ['Intent type', 'Commercial'],
  ['Why', '“best” and “for small business” suggest the person is comparing solutions.'],
  ['Best page match', 'Custom CRM service page'],
  ['Content focus', 'Features, benefits, proof, comparison'],
];

const TECH_ITEMS = [
  ['Crawlability', 'Pages can be reached', 'left'],
  ['Indexing', 'Right pages are eligible', 'left'],
  ['Site Architecture', 'Logical information structure', 'left'],
  ['Internal Links', 'Related pages connected', 'right'],
  ['Mobile', 'Works on every screen', 'right'],
  ['Performance', 'Pages delivered efficiently', 'right'],
];

// Where each connector lands on the screenshot, as a fraction of its height.
const TECH_TARGETS = [0.17, 0.47, 0.79, 0.21, 0.5, 0.79];
const STEP_MS = 2800;
const FLOW_STEP_MS = 3600;

// Dashboard panel each factor points at, as % of the screenshot: [left, top, width, height].
const TECH_PANELS = [
  [2.762, 3.776, 46.51, 26.82],
  [2.762, 33.07, 46.51, 27.86],
  [2.762, 63.41, 46.51, 31.25],
  [50.65, 3.776, 46.51, 33.46],
  [50.65, 39.58, 46.51, 21.88],
  [50.65, 63.8, 46.51, 30.86],
];

const PRINCIPLES = [
  ['01', 'Build the foundation first', 'Technical structure, content and search relevance should support one another.'],
  ['02', 'Optimise for people, not algorithms', 'Useful pages answer real questions clearly before trying to satisfy ranking systems.'],
  ['03', 'Improve continuously', 'Search behaviour, competitors and performance change — the strategy should change with them.'],
];

const OUTCOME_STEPS = [
  ['More visibility', 'Appear for more relevant searches'],
  ['More relevant visits', 'Attract people with stronger intent'],
  ['More qualified enquiries', 'Create more opportunities to talk to potential customers'],
];

/* ---------- how search works ---------- */
/* ---------- signature flow ---------- */

function SiteMock({ className = '' }) {
  return (
    <g className={`sx-site ${className}`}>
      <rect width="400" height="244" rx="8" className="sx-s-frame" />
      <image href="/images/services/crm.png" x="2" y="2" width="396" height="240" preserveAspectRatio="xMidYMid slice" clipPath="url(#siteClip)" />
      <defs>
        <clipPath id="siteClip">
          <rect x="2" y="2" width="396" height="240" rx="7" />
        </clipPath>
      </defs>
    </g>
  );
}

// Crawler route through the CRM: home → deals → pipeline → leads → activity → revenue (coordinates in the site frame).
const CRAWL_NODES = [[28, 49], [20, 110], [110, 95], [110, 172], [335, 172], [283, 95]];
const CRAWL_GAP = 0.5;

const UNDERSTAND_ROWS = [
  ['Page title', 'Custom CRM Software | NallGeeks', 128],
  ['H1', 'Custom CRM Software for Growing Teams', 150],
  ['Content', 'Features, workflows, who it is for', 196],
  ['Internal links', '→ /services/custom-business-software', 230],
  ['Intent', 'Commercial — comparing solutions', 248],
];

const INDEX_ROWS = ['about', 'services/web-development', 'services/custom-crm', 'contact'];

const SERP_RESULTS = [
  { id: 0, client: true, url: 'yourbusiness.com › crm', title: 'Custom CRM for small business teams' },
  { id: 1, url: 'competitor-one.com › software', title: 'Top 10 CRM tools compared' },
  { id: 2, url: 'competitor-two.com › crm', title: 'CRM software pricing guide' },
];

// Row each result starts in before the client page moves up (client, competitor A, competitor B).
const RANK_FROM = [2, 0, 1];

const SITE_POSITIONS = [
  'translate(150px, 43px) scale(1.45)',
  'translate(150px, 43px) scale(1.45)',
  'translate(50px, 120px) scale(0.55)',
  'translate(34px, 150px) scale(0.6)',
  'translate(150px, 43px) scale(1.45)',
  'translate(510px, 90px) scale(0.9)',
];

function FlowCanvas({ stage }) {
  const rowY = (row) => 112 + row * 100;
  const wrapClass = ['sx-site-wrap', stage === 3 && 'is-index', stage === 4 && 'is-hidden', stage === 5 && 'is-visitor']
    .filter(Boolean)
    .join(' ');

  return (
    <svg className="sx-flow-svg" viewBox="0 0 880 440" role="img" aria-label="Animated diagram: a website is crawled, understood, indexed, ranked and visited.">
      {/* persistent website */}
      <g className={wrapClass} style={{ transform: SITE_POSITIONS[stage] }}>
        <g className="sx-site-nudge">
          <SiteMock />
        </g>
      </g>

      {/* 02 crawl: a crawler follows links between a few meaningful points */}
      <g transform="translate(150 43) scale(1.45)">
        <g className={`sx-layer${stage === 1 ? ' is-on' : ''}`}>
          {CRAWL_NODES.slice(1).map(([x, y], i) => {
            const [px, py] = CRAWL_NODES[i];
            return (
              <path
                key={`s${i}`}
                d={`M${px} ${py} L${x} ${y}`}
                pathLength="1"
                className="sx-crawl-seg"
                style={{ animationDelay: `${0.3 + i * CRAWL_GAP}s` }}
              />
            );
          })}
          {CRAWL_NODES.map(([x, y], i) => (
            <g key={`n${i}`} className="sx-crawl-node" style={{ animationDelay: `${0.15 + i * CRAWL_GAP}s` }}>
              <circle cx={x} cy={y} r="6.5" className="sx-crawl-ring" />
              <circle cx={x} cy={y} r="2.8" className="sx-crawl-dot" />
            </g>
          ))}
        </g>
      </g>

      {/* 03 understand */}
      <g className={`sx-layer${stage === 2 ? ' is-on' : ''}`}>
        {UNDERSTAND_ROWS.map(([label, value, fromY], i) => {
          const y = 80 + i * 66;
          const delay = 0.25 + i * 0.55;
          return (
            <g key={label}>
              <path d={`M270 ${fromY} C320 ${fromY} 310 ${y} 360 ${y}`} pathLength="1" className="sx-link-line sx-u-line" style={{ animationDelay: `${delay}s` }} />
              <circle cx="360" cy={y} r="4" className="sx-link-dot sx-u-dot" style={{ animationDelay: `${delay + 0.4}s` }} />
              <g className="sx-u-text" style={{ transitionDelay: `${delay + 0.45}s` }}>
                <text x="380" y={y - 12} className="sx-svg-label">{label}</text>
                <text x="380" y={y + 14} className="sx-svg-value">{value}</text>
                <line x1="380" y1={y + 30} x2="840" y2={y + 30} className="sx-s-line" />
              </g>
            </g>
          );
        })}
      </g>

      {/* 04 index */}
      <g className={`sx-layer${stage === 3 ? ' is-on' : ''}`}>
        <path d="M262 225 L336 225" className="sx-link-line sx-flow-arrow" />
        <path d="M328 218 L338 225 L328 232" className="sx-link-line" />
        <rect x="350" y="50" width="490" height="270" rx="10" className="sx-s-frame" />
        <text x="374" y="86" className="sx-svg-label">Search index</text>
        <line x1="350" y1="104" x2="840" y2="104" className="sx-s-line" />
        {INDEX_ROWS.map((row, i) => {
          const isNew = i === 2;
          return (
            <g key={row} className="sx-index-row" style={{ transitionDelay: `${0.25 + i * 0.14}s` }}>
              {isNew && <rect x="358" y={116 + i * 48} width="474" height="40" rx="5" className="sx-index-hl" />}
              <text x="378" y={141 + i * 48} className={`sx-svg-value${isNew ? ' sx-index-new-text' : ''}`}>{row}</text>
            </g>
          );
        })}
      </g>

      {/* 05 rank: a plain results page — position is the only story */}
      <g className={`sx-layer${stage === 4 ? ' is-on' : ''}`}>
        <rect x="110" y="22" width="500" height="46" rx="23" className="sx-s-frame sx-serp-bar" />
        <circle cx="140" cy="45" r="7" className="sx-s-line" />
        <line x1="145" y1="50" x2="152" y2="57" className="sx-s-line" />
        <text x="168" y="52" className="sx-svg-value">best CRM software for small business</text>
        {[0, 1, 2].map((n) => (
          <text key={n} x="86" y={rowY(n) + 38} textAnchor="end" className="sx-svg-label">{n + 1}</text>
        ))}
        {SERP_RESULTS.map((r, i) => (
          <g
            key={r.id}
            className={`sx-result${r.client ? ' is-client' : ''}`}
            style={{ '--from': `${rowY(RANK_FROM[r.id])}px`, '--to': `${rowY(r.id)}px` }}
          >
            <g className="sx-result-in" style={{ animationDelay: `${0.25 + i * 0.25}s` }}>
              <line x1="110" y1="-8" x2="610" y2="-8" className="sx-s-line sx-result-rule" />
              {r.client && (
                <g className="sx-result-hl">
                  <rect x="110" y="-8" width="500" height="92" className="sx-result-tint" />
                  <rect x="110" y="-8" width="3" height="92" className="sx-result-bar" />
                  <text x="596" y="12" textAnchor="end" className="sx-svg-label is-accent">Most relevant</text>
                </g>
              )}
              <text x="128" y="12" className="sx-svg-label">{r.url}</text>
              <text x="128" y="42" className="sx-result-title">{r.title}</text>
              <rect x="128" y="56" width="400" height="6" rx="3" className="sx-s-fill" />
              <rect x="128" y="68" width="300" height="6" rx="3" className="sx-s-fill" />
            </g>
          </g>
        ))}
        <g className="sx-signals">
          <rect x="672" y="112" width="168" height="196" rx="6" className="sx-s-frame sx-signal-box" />
          <text x="692" y="144" className="sx-svg-label">Ranking signals</text>
          {['Relevance', 'Quality', 'Authority'].map((t, i) => (
            <g key={t}>
              <line x1="672" y1={158 + i * 40} x2="840" y2={158 + i * 40} className="sx-s-line" />
              <circle cx="692" cy={178 + i * 40} r="3" className="sx-link-dot" />
              <text x="708" y={184 + i * 40} className="sx-svg-value">{t}</text>
            </g>
          ))}
          <line x1="672" y1="278" x2="840" y2="278" className="sx-s-line" />
          <text x="692" y="300" className="sx-signal-result">↑ Stronger position</text>
        </g>
      </g>

      {/* 06 visitor: result → click → website → qualified visitor */}
      <g className={`sx-layer${stage === 5 ? ' is-on' : ''}`}>
        <g transform="translate(28 150)">
          <g className="sx-v-card">
            <rect width="420" height="90" rx="6" className="sx-result-card" />
            <rect width="3" height="90" className="sx-result-bar" />
            <text x="22" y="26" className="sx-svg-label">yourbusiness.com › crm</text>
            <text x="22" y="54" className="sx-result-title">Custom CRM for small business teams</text>
            <rect x="22" y="68" width="220" height="6" rx="3" className="sx-s-fill" />
          </g>
          <circle cx="330" cy="62" r="14" className="sx-click-ring" />
          <g className="sx-cursor-move">
            <path d="M0 0 L0 20 L6 14 L11 25 L15 23 L10 13 L18 13 Z" className="sx-cursor" />
          </g>
        </g>
        <path d="M456 195 C486 195 490 150 512 150" pathLength="1" className="sx-link-line sx-visit-path" />
        <text x="512" y="68" className="sx-svg-label is-accent sx-visitor-label">Qualified visitor</text>
      </g>
    </svg>
  );
}

function SearchFlow() {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const { active: stage, select, hold, release } = useCycle(sectionRef, FLOW.length, FLOW_STEP_MS);

  // After the last stage the canvas settles back in rather than snapping.
  const prevStage = useRef(0);
  const [restarting, setRestarting] = useState(false);
  useEffect(() => {
    const wrapped = prevStage.current === FLOW.length - 1 && stage === 0;
    prevStage.current = stage;
    if (!wrapped) return undefined;
    setRestarting(true);
    const t = setTimeout(() => setRestarting(false), 900);
    return () => clearTimeout(t);
  }, [stage]);

  // On narrow screens the stepper scrolls sideways; keep the active step in view.
  useEffect(() => {
    const item = railRef.current?.children[stage + 1];
    item?.scrollIntoView?.({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [stage]);
  return (
    <section className="sx-flow" id="sx-how" ref={sectionRef}>
      <div className="sx-wrap">
        <header className="sx-flow-head">
          <div className="sx-eyebrow">How search works</div>
          <h2 className="sx-h2">From website to <em>search result</em></h2>
        </header>
        <div className="sx-flow-rail-wrap">
          <div className="sx-flow-rail" ref={railRef}>
            <div className="sx-flow-rail-line"><span style={{ transform: `scaleX(${stage / (FLOW.length - 1)})` }} /></div>
            {FLOW.map(([name], i) => (
              <button
                type="button"
                key={name}
                className={`sx-flow-rail-item${i === stage ? ' is-current' : ''}${i < stage ? ' is-past' : ''}`}
                aria-current={i === stage ? 'step' : undefined}
                onMouseEnter={() => hold(i)}
                onMouseLeave={release}
                onFocus={() => hold(i)}
                onBlur={release}
                onClick={() => select(i)}
              >
                <span className="sx-flow-rail-dot" />
                <span className="sx-flow-rail-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{name}</strong>
              </button>
            ))}
          </div>
        </div>
        <div className={`sx-flow-canvas${restarting ? ' is-restarting' : ''}`}><FlowCanvas stage={stage} /></div>
        <div className="sx-flow-caption" key={stage}>
          <span className="sx-flow-caption-num">{String(stage + 1).padStart(2, '0')}</span>
          <p>{FLOW[stage][1]}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- search strategy ---------- */

function SearchIntent() {
  return (
    <section className="sx-section sx-intent">
      <div className="sx-wrap">
        <Reveal className="sx-intent-head">
          <div className="sx-eyebrow">Search strategy</div>
          <h2 className="sx-h2">Understand what people are <em>actually</em> looking for</h2>
          <p className="sx-lead">A search query reveals intention. SEO connects that intention to the right page.</p>
        </Reveal>

        <Reveal className="sx-intent-panel" delay={100}>
          <div className="sx-searchbar" aria-label="Example search query">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>best CRM software for small business</span>
            <i className="sx-caret" />
          </div>
          <dl className="sx-facts">
            {INTENT_FACTS.map(([label, value], i) => (
              <div key={label} className={i === 0 ? 'is-key' : ''}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ul className="sx-selector">
          {INTENTS.map(([name, desc]) => (
            <li key={name} className={name === 'Commercial' ? 'is-active' : ''} aria-current={name === 'Commercial' ? 'true' : undefined}>
              <h3>{name}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- technical foundation ---------- */

// Autoplay through `count` steps, looping forever. Pauses while off screen, in a hidden tab, or held by the pointer.
function useCycle(ref, count, stepMs) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tabShown, setTabShown] = useState(true);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);

  useEffect(() => {
    const update = () => setTabShown(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!visible || !tabShown || held || reduced) return undefined;
    const timer = setTimeout(() => setActive((prev) => (prev + 1) % count), stepMs);
    return () => clearTimeout(timer);
  }, [visible, tabShown, held, reduced, active, tick, count, stepMs]);

  const select = (index) => {
    setActive(index);
    setTick((prev) => prev + 1);
  };
  const hold = (index) => {
    setHeld(true);
    select(index);
  };
  const release = () => setHeld(false);

  return { active, tick, select, hold, release };
}

function TechnicalFoundation() {
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const itemRefs = useRef([]);
  const [paths, setPaths] = useState([]);
  const { active, tick, hold, release } = useCycle(stageRef, TECH_ITEMS.length, STEP_MS);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const img = imgRef.current.getBoundingClientRect();
      if (window.innerWidth <= 900) {
        setPaths([]);
        return;
      }
      setPaths(
        TECH_ITEMS.map(([, , side], i) => {
          const r = itemRefs.current[i].getBoundingClientRect();
          const left = side === 'left';
          const x1 = (left ? r.right + 14 : r.left - 14) - s.left;
          const y1 = r.top + r.height / 2 - s.top;
          const x2 = (left ? img.left : img.right) - s.left;
          const y2 = img.top + img.height * TECH_TARGETS[i] - s.top;
          const dx = (x2 - x1) * 0.55;
          return { d: `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`, x2, y2 };
        })
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    const imgEl = imgRef.current.querySelector('img');
    imgEl.addEventListener('load', measure);
    return () => {
      ro.disconnect();
      imgEl.removeEventListener('load', measure);
    };
  }, []);

  const renderItems = (side) =>
    TECH_ITEMS.map(([label, note, itemSide], i) =>
      itemSide !== side ? null : (
        <div
          key={label}
          ref={(el) => { itemRefs.current[i] = el; }}
          className={`sx-tech-item sx-tech-item--${side}${i === active ? ' is-active' : ''}`}
          tabIndex={0}
          onMouseEnter={() => hold(i)}
          onMouseLeave={release}
          onFocus={() => hold(i)}
          onBlur={release}
        >
          <span className="sx-tech-num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{label}</h3>
          <p>{note}</p>
        </div>
      )
    );

  return (
    <section className="sx-section sx-tech">
      <div className="sx-wrap">
        <Reveal className="sx-center sx-tech-head">
          <h2 className="sx-h2">A strong <em>technical foundation</em></h2>
          <p className="sx-lead">
            Search engines need to access, interpret and navigate your site efficiently before content can perform.
          </p>
        </Reveal>
      </div>
      <Reveal className="sx-tech-stage" delay={100}>
        <div className="sx-tech-grid" ref={stageRef}>
          <div className="sx-tech-col">{renderItems('left')}</div>
          <div className="sx-tech-shot" ref={imgRef}>
            <img
              className="sx-tech-img"
              src="/images/services/CrmSystempic1.jpeg"
              alt="A technical SEO dashboard showing crawlability, indexing, site architecture, internal links, mobile and performance."
              width="1376"
              height="768"
            />
            {TECH_PANELS.map(([l, t, w, h], i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`sx-tech-panel${i === active ? ' is-active' : ''}`}
                style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }}
              />
            ))}
          </div>
          <div className="sx-tech-col">{renderItems('right')}</div>
          <svg className="sx-tech-lines" aria-hidden="true">
            {paths.map((p, i) => (
              <g key={i}>
                <path d={p.d} className="sx-tech-base" />
                <path d={p.d} pathLength="1" className={`sx-tech-live${i === active ? ' is-active' : ''}`} />
                <circle cx={p.x2} cy={p.y2} r="4" className={`sx-tech-end${i === active ? ' is-active' : ''}`} />
                {i === active && (
                  <circle r="4.5" className="sx-tech-dot" key={tick}>
                    <animateMotion dur="1.2s" begin="0.1s" fill="freeze" path={p.d} calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1" />
                  </circle>
                )}
              </g>
            ))}
          </svg>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- services ---------- */

const CARDS = [
  [
    '01',
    'Technical SEO',
    'Make the website accessible, understandable and efficient.',
    ['Technical SEO review', 'Crawl & indexing review', 'Site architecture', 'Internal linking', 'Page structure', 'Performance review'],
  ],
  [
    '02',
    'Search Strategy',
    'Understand what your audience searches for and why.',
    ['Search-topic research', 'Search intent analysis', 'Opportunity mapping', 'Page targeting'],
  ],
  [
    '03',
    'Content & On-page SEO',
    'Create useful pages that match real search intent.',
    ['Content structure', 'On-page optimisation', 'Search-focused copy', 'Metadata & page hierarchy', 'Content opportunity review'],
  ],
];

function Provide() {
  return (
    <section className="sx-section sx-provide">
      <div className="sx-wrap">
        <Reveal className="sx-center">
          <div className="sx-eyebrow">SEO services</div>
          <h2 className="sx-h2">Everything required to make search <em>work together</em></h2>
          <p className="sx-lead">SEO is strongest when technical health, search intent and content are improved as one system.</p>
        </Reveal>
        <div className="sx-cards">
          {CARDS.map(([num, title, desc, items], i) => (
            <Reveal key={num} delay={i * 120} className="sx-card">
              <span className="sx-card-num">{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
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

/* ---------- approach ---------- */

function Approach() {
  return (
    <section className="sx-section sx-approach">
      <div className="sx-wrap">
        <Reveal className="sx-approach-head">
          <div className="sx-eyebrow">Our approach</div>
          <h2 className="sx-h2">SEO designed around <em>how people search</em></h2>
        </Reveal>
        <div className="sx-principles">
          {PRINCIPLES.map(([num, title, desc], i) => (
            <Reveal key={num} delay={i * 140} className="sx-principle">
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

/* ---------- outcome ---------- */

function Outcome() {
  const [ref, inView] = useInView(0.3);
  return (
    <section className="sx-section sx-outcome">
      <div className="sx-wrap">
        <Reveal>
          <div className="sx-eyebrow">The outcome</div>
          <h2 className="sx-h2 sx-h2--xl">Better SEO should create <em>real business momentum.</em></h2>
        </Reveal>

        <div className={`sx-momentum${inView ? ' is-in' : ''}`} ref={ref}>
          <div className="sx-momentum-line"><span /></div>
          <ol>
            {OUTCOME_STEPS.map(([title, note], i) => (
              <li key={title} style={{ transitionDelay: `${0.3 + i * 0.5}s` }}>
                <span className="sx-momentum-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{title}</strong>
                <p>{note}</p>
              </li>
            ))}
          </ol>
        </div>
        <Reveal className="sx-outcome-foot">
          <p>And stronger content discoverability across the website.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- final CTA ---------- */

function FinalCta() {
  return (
    <section className="sx-cta">
      <Reveal className="sx-wrap sx-cta-inner">
        <div className="sx-cta-head">
          <div className="sx-eyebrow">Ready to improve your search presence?</div>
          <h2>Make your website easier<br />to <em>find, understand and choose.</em></h2>
        </div>
        <div className="sx-cta-side">
          <p>Tell us where you want to grow and we’ll identify where search can create the strongest opportunity.</p>
          <a href="/contact" className="sx-btn">Start an SEO Conversation</a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- page ---------- */

export default function SEO() {
  return (
    <ServicePage
      eyebrow="Search Engine Optimisation"
      title={<>Be found by the people<br /><em>already looking</em> for you.</>}
      description="We improve the technical structure, search relevance and content of your website so the right people can discover it — and take action."
      pageClassName="sp--seo"
      heroActions={
        <>
          <a href="/contact" className="sx-btn">Improve My Visibility</a>
          <a href="#sx-how" className="sx-textlink">Explore our approach ↓</a>
        </>
      }
      hideWork
      hideCta
    >
      <div className="sx-root">
        <SearchFlow />
        <SearchIntent />
        <TechnicalFoundation />
        <Provide />
        <Approach />
        <Outcome />
        <FinalCta />
      </div>
    </ServicePage>
  );
}
