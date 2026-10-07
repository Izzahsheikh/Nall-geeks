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
  {
    num: '01',
    label: 'Discover',
    heading: 'Your Website Is the Starting Point',
    desc: 'Your pages, content and structure create the foundation of your search presence.',
  },
  {
    num: '02',
    label: 'Crawl',
    heading: 'Search Engines Discover Your Website',
    desc: 'Search engines explore your pages and follow links to discover your content.',
  },
  {
    num: '03',
    label: 'Understand',
    heading: 'Your Content Is Understood',
    desc: 'Search engines analyse each page to understand its topic, purpose and relevance.',
  },
  {
    num: '04',
    label: 'Index',
    heading: 'Relevant Pages Enter the Index',
    desc: 'Useful pages are organised and stored so they can appear in relevant searches.',
  },
  {
    num: '05',
    label: 'Rank',
    heading: 'Your Pages Compete for Visibility',
    desc: 'Search engines evaluate relevance, quality and authority to decide where pages appear.',
  },
  {
    num: '06',
    label: 'Reach',
    heading: 'The Right Person Finds You',
    desc: 'A relevant search connects a potential customer with the right page on your website.',
  },
];

const INTENTS = [
  ['Informational', 'Learn something'],
  ['Commercial', 'Compare solutions'],
  ['Navigational', 'Find a specific brand'],
  ['Transactional', 'Take action'],
];

const INTENT_EXAMPLES = [
  ['what is CRM software', 'Informational', 'The user wants to understand the topic.', 'CRM guide / educational article', 'Explanation, examples, guidance'],
  ['best CRM software for small business', 'Commercial', '“Best” and “for small business” suggest comparison between solutions.', 'Custom CRM service page', 'Features, benefits, proof, comparison'],
  ['NallGeeks CRM services', 'Navigational', 'The user knows the brand and wants a specific page.', 'CRM services page', 'Clear navigation and relevant service information'],
  ['hire CRM developers', 'Transactional', 'The user is ready to contact or purchase.', 'CRM enquiry / contact page', 'Offer, proof, CTA, contact'],
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
const STEP_MS = 2500;
const FLOW_STEP_MS = 3500;

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

function stageClass(i, active, prev) {
  if (i === active) return ' is-active';
  if (i === prev) return ' is-leaving';
  return '';
}

// Crawl discovery points mapped to the CRM interface layout (400×244 space)
const CRAWL_NODES = [[28, 49], [20, 110], [110, 95], [110, 172], [335, 172], [283, 95]];
const CRAWL_GAP_S = 0.38;

function SearchFlowOverlay({ stage, prevStage }) {
  const on = (s) => stage === s;
  const leaving = (s) => prevStage === s && stage !== s;
  const cls = (s) =>
    `sx-ov-layer${on(s) ? ' is-on' : leaving(s) ? ' is-leaving' : ''}`;

  return (
    <svg
      className="sx-ov"
      viewBox="0 0 400 244"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
    >
      {/* 02 Crawl — thin discovery lines through website structure */}
      <g className={cls(1)}>
        {CRAWL_NODES.slice(1).map(([x, y], i) => {
          const [px, py] = CRAWL_NODES[i];
          return (
            <path
              key={i}
              d={`M${px} ${py} L${x} ${y}`}
              pathLength="1"
              className="sx-ov-crawl-path"
              style={{ animationDelay: `${0.35 + i * CRAWL_GAP_S}s` }}
            />
          );
        })}
        {CRAWL_NODES.map(([x, y], i) => (
          <g key={i} className="sx-ov-crawl-node" style={{ animationDelay: `${0.22 + i * CRAWL_GAP_S}s` }}>
            <circle cx={x} cy={y} r="7" className="sx-ov-node-ring" />
            <circle cx={x} cy={y} r="2.5" className="sx-ov-node-dot" />
          </g>
        ))}
      </g>

      {/* 03 Understand — external pointer labels with thin lines */}
      <g className={cls(2)}>
        {/* PAGE TITLE */}
        <circle cx={95} cy={13} r={6} className="sx-ov-ud-glow" style={{ animationDelay: '0.05s' }} />
        <circle cx={95} cy={13} r={2.5} className="sx-ov-ud-dot" style={{ animationDelay: '0.1s' }} />
        <line x1={98} y1={13} x2={237} y2={13} className="sx-ov-ud-line" style={{ animationDelay: '0.12s' }} />
        <rect x={237} y={6} width={52} height={14} rx={2} className="sx-ov-ud-lbg" style={{ animationDelay: '0.28s' }} />
        <text x={241} y={16} className="sx-ov-ud-label" style={{ animationDelay: '0.3s' }}>PAGE TITLE</text>
        {/* CONTENT */}
        <circle cx={130} cy={98} r={6} className="sx-ov-ud-glow" style={{ animationDelay: '0.6s' }} />
        <circle cx={130} cy={98} r={2.5} className="sx-ov-ud-dot" style={{ animationDelay: '0.65s' }} />
        <line x1={133} y1={97} x2={237} y2={80} className="sx-ov-ud-line" style={{ animationDelay: '0.68s' }} />
        <rect x={237} y={73} width={44} height={14} rx={2} className="sx-ov-ud-lbg" style={{ animationDelay: '0.82s' }} />
        <text x={241} y={83} className="sx-ov-ud-label" style={{ animationDelay: '0.84s' }}>CONTENT</text>
        {/* INTERNAL LINKS */}
        <circle cx={80} cy={210} r={6} className="sx-ov-ud-glow" style={{ animationDelay: '1.15s' }} />
        <circle cx={80} cy={210} r={2.5} className="sx-ov-ud-dot" style={{ animationDelay: '1.2s' }} />
        <line x1={83} y1={210} x2={237} y2={206} className="sx-ov-ud-line" style={{ animationDelay: '1.22s' }} />
        <rect x={237} y={199} width={72} height={14} rx={2} className="sx-ov-ud-lbg" style={{ animationDelay: '1.36s' }} />
        <text x={241} y={209} className="sx-ov-ud-label" style={{ animationDelay: '1.38s' }}>INTERNAL LINKS</text>
      </g>

      {/* 04 Index — compact panel on right side */}
      <g className={cls(3)}>
        <rect x={262} y={12} width={130} height={158} rx={4} className="sx-ov-panel" />
        <text x={270} y={26} className="sx-ov-panel-hd">Search index</text>
        <line x1={262} y1={33} x2={392} y2={33} className="sx-ov-panel-rule" />
        {['/about', '/services/web-dev', '/services/crm', '/contact'].map((url, i) => {
          const isNew = i === 2;
          const rowY = 38 + i * 32;
          return (
            <g key={url} className={`sx-ov-idx-row${isNew ? ' is-new' : ''}`} style={{ transitionDelay: `${0.1 + i * 0.13}s` }}>
              {isNew && <rect x={264} y={rowY - 2} width={126} height={22} rx={2} className="sx-ov-idx-hl" />}
              <text x={270} y={rowY + 12} className="sx-ov-idx-url">{url}</text>
            </g>
          );
        })}
      </g>

      {/* 05 Rank — split-screen SERP left, CRM dashboard right, rows clipped to panel */}
      <g className={cls(4)}>
        <defs>
          <clipPath id="sx-rk-rows">
            <rect x={6} y={37} width={168} height={200} />
          </clipPath>
        </defs>
        {/* SERP panel — 42% width */}
        <rect x={6} y={6} width={168} height={232} rx={4} className="sx-ov-panel" />
        {/* Website panel frame — 53% width, shows CRM dashboard behind */}
        <rect x={182} y={6} width={212} height={232} rx={4} className="sx-rank-site-frame" />
        {/* Search bar */}
        <rect x={12} y={14} width={156} height={17} rx={8} className="sx-ov-serp-input" />
        <text x={28} y={24} className="sx-ov-serp-query">custom CRM software</text>
        {/* Rule below search bar */}
        <line x1={6} y1={36} x2={174} y2={36} className="sx-ov-panel-rule" />
        {/* Animated rows — clipped so nothing exits the panel */}
        <g clipPath="url(#sx-rk-rows)">
          {/* Competitor A — row 1, drops to row 2 */}
          <g className="sx-ov-serp-row sx-rank-rival-a" style={{ transitionDelay: '0.3s' }}>
            <text x={14} y={52} className="sx-ov-serp-rank-num">01</text>
            <text x={14} y={65} className="sx-ov-serp-url">competitor.com</text>
            <text x={14} y={77} className="sx-ov-serp-title">CRM Tools for Growing Teams</text>
            <rect x={14} y={82} width={86} height={2.5} rx={1.5} className="sx-ov-serp-stub" />
          </g>
          {/* Competitor B — row 2, drops to row 3 */}
          <g className="sx-ov-serp-row sx-rank-rival-b" style={{ transitionDelay: '0.2s' }}>
            <text x={14} y={110} className="sx-ov-serp-rank-num">02</text>
            <text x={14} y={123} className="sx-ov-serp-url">reviews.com</text>
            <text x={14} y={135} className="sx-ov-serp-title">Best CRM Platforms</text>
            <rect x={14} y={140} width={68} height={2.5} rx={1.5} className="sx-ov-serp-stub" />
          </g>
          {/* Client — row 3, rises to row 1 (−116px = 2 × 58px row height) */}
          <g className="sx-ov-serp-row is-client sx-rank-client" style={{ transitionDelay: '0.44s' }}>
            <rect x={7} y={154} width={166} height={58} rx={2} className="sx-ov-serp-hl" />
            <rect x={7} y={154} width={3} height={58} className="sx-ov-serp-side" />
            <text x={14} y={168} className="sx-ov-serp-rank-num sx-serp-rank-client">03</text>
            <text x={14} y={181} className="sx-ov-serp-url">yourbusiness.com › crm</text>
            <text x={14} y={193} className="sx-ov-serp-title is-client">Custom CRM Software</text>
            <rect x={14} y={199} width={104} height={2.5} rx={1.5} className="sx-ov-serp-stub" />
          </g>
        </g>
        {/* Subtle orange outline at position 1 — appears when rise completes */}
        <rect x={7} y={38} width={166} height={58} rx={2} className="sx-rank-winner-frame" />
      </g>

      {/* 06 Reach — compact card, cursor clicks result, visitor arrives on full dashboard */}
      <g className={cls(5)}>
        {/* Compact search result card — fades out at 2.1s leaving full dashboard */}
        <g className="sx-ov-visitor-panel">
          <rect x={8} y={8} width={180} height={68} rx={4} className="sx-ov-panel" />
          <rect x={8} y={8} width={3} height={68} rx={1.5} className="sx-ov-serp-side" />
          <text x={16} y={24} className="sx-ov-serp-url">yourbusiness.com › crm</text>
          <text x={16} y={37} className="sx-ov-serp-title is-client">Custom CRM Software</text>
          <rect x={16} y={43} width={108} height={2.5} rx={1.5} className="sx-ov-serp-stub" />
          <rect x={16} y={49} width={76} height={2.5} rx={1.5} className="sx-ov-serp-stub" />
        </g>
        {/* Click ring — centered on result title */}
        <circle cx={90} cy={36} r={10} className="sx-ov-click-ring" />
        {/* Cursor — enters from lower-right, clicks the result */}
        <path d="M0 0 L0 16 L5 11 L9 20 L12 18 L8 10 L15 10 Z" className="sx-ov-cursor" />
        {/* Visit arc — card edge to dashboard interior */}
        <path d="M190 38 C228 38 256 85 292 118" pathLength="1" className="sx-ov-visit-path" />
        {/* Qualified visitor badge — appears then fades before stage advances */}
        <g className="sx-ov-visit-badge-group">
          <rect x={8} y={83} width={120} height={17} rx={3} className="sx-ov-visit-lbg" />
          <circle cx={17} cy={91.5} r={2.5} className="sx-ov-visit-dot" />
          <text x={23} y={95} className="sx-ov-visit-label">QUALIFIED VISITOR</text>
        </g>
      </g>
    </svg>
  );
}

function SearchFlowPreview({ stage, prevStage }) {
  return (
    <div className="sx-flow-preview">
      <div className="sx-flow-preview-bar">yourbusiness.com</div>
      <div className="sx-flow-preview-canvas">
        <img
          src="/images/services/crm.png"
          alt="Your website — the foundation of your search presence"
          width="400"
          height="244"
          loading="eager"
          decoding="async"
        />
        <SearchFlowOverlay stage={stage} prevStage={prevStage} />
      </div>
    </div>
  );
}

function SearchFlow() {
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const { active: stage, select, hold, release } = useCycle(sectionRef, FLOW.length, FLOW_STEP_MS);
  const [prevStage, setPrevStage] = useState(-1);
  const prevRef = useRef(-1);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev !== stage) {
      setPrevStage(prev);
      prevRef.current = stage;
    }
  }, [stage]);

  useEffect(() => {
    if (!tabsRef.current) return;
    const tab = tabsRef.current.children[stage];
    if (tab) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [stage]);

  return (
    <section
      className="sx-flow"
      id="sx-how"
      ref={sectionRef}
      onMouseEnter={() => hold(stage)}
      onMouseLeave={release}
    >
      <div className="sx-wrap">
        <header className="sx-flow-head">
          <div className="sx-eyebrow">How search works</div>
          <h2 className="sx-h2">From website to <em>search result</em></h2>
          <p className="sx-flow-head-sub">See how search engines move from discovering a website to showing it to the right visitor.</p>
        </header>
        <div className="sx-flow-grid">
          {/* left: stage copy */}
          <div className="sx-flow-stages" aria-live="polite">
            {FLOW.map((s, i) => (
              <div
                key={s.num}
                className={`sx-flow-stage${stageClass(i, stage, prevStage)}`}
                aria-hidden={i !== stage}
              >
                <span className="sx-flow-stage-meta">
                  <b>{s.num}</b> {s.label.toUpperCase()}
                </span>
                <h3 className="sx-flow-stage-heading">{s.heading}</h3>
                <p className="sx-flow-stage-desc">{s.desc}</p>
              </div>
            ))}
          </div>
          {/* right: browser-frame preview with stage animations */}
          <div className="sx-flow-canvas">
            <SearchFlowPreview stage={stage} prevStage={prevStage} />
          </div>
          {/* bottom: rectangular tabs */}
          <ol className="sx-flow-tabs" ref={tabsRef}>
            {FLOW.map((s, i) => (
              <li key={s.num} className={i === stage ? 'is-active' : undefined}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  onMouseEnter={() => hold(i)}
                  aria-current={i === stage ? 'step' : undefined}
                >
                  <span className="sx-flow-tab-num">{s.num}</span>
                  <span className="sx-flow-tab-name">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- search strategy ---------- */

function SearchIntent() {
  const [ref, inView] = useInView(0.18);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(1);
  const [manualTick, setManualTick] = useState(0);
  const [queryKey, setQueryKey] = useState(0);
  const manualRef = useRef(false);
  const [query, intent, why, match, focus] = INTENT_EXAMPLES[active];

  useEffect(() => {
    if (!inView || reduced) return undefined;
    const delay = manualRef.current ? 1500 : 3600;
    const timer = setTimeout(() => {
      manualRef.current = false;
      setActive((current) => (current + 1) % INTENT_EXAMPLES.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, reduced, active, manualTick]);

  const chooseIntent = (index) => {
    manualRef.current = true;
    setActive(index);
    setManualTick((tick) => tick + 1);
    setQueryKey((key) => key + 1);
  };

  return (
    <section className="sx-section sx-intent">
      <div className="sx-wrap">
        <Reveal className="sx-intent-head">
          <div className="sx-eyebrow">Search strategy</div>
          <h2 className="sx-h2">Understand what people are <em>actually</em> looking for</h2>
          <p className="sx-lead">A search query reveals intention. SEO connects that intention to the right page.</p>
        </Reveal>

        <div ref={ref} className={`sx-intent-flow${inView ? ' is-in' : ''}`}>
          <div className="sx-intent-panel">
          <div className="sx-searchbar" aria-label={`Example search query: ${query}`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span key={queryKey} className="sx-query-text">{query}</span>
          </div>
          <dl className="sx-facts">
            {[["Intent type", intent], ["Why", why], ["Best page match", match], ["Content focus", focus]].map(([label, value], i) => (
              <div key={label} className={i === 0 ? 'is-key' : ''}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          </div>

        <ul className="sx-selector">
          {INTENTS.map(([name, desc], i) => (
            <li key={name} className={i === active ? 'is-active' : ''} aria-current={i === active ? 'true' : undefined}>
              <button type="button" onClick={() => chooseIntent(i)}>
                <h3>{name}</h3>
                <p>{desc}</p>
              </button>
            </li>
          ))}
        </ul>
        </div>
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
        <a href="/contact" className="sx-btn">Improve My Visibility</a>
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
