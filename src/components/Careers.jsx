import { useEffect, useMemo, useRef, useState } from 'react';
import careerpageBg from '../assets/careerpageBackground.jpeg';

/* ─── Internship tracks ────────────────────────────────────────────── */
const INTERN_TRACKS = [
  { value: 'Web Development' },
  { value: 'Mobile Apps' },
  { value: 'UI/UX Design' },
  { value: 'Software Management' },
  { value: 'Search Engine Optimization', label: 'SEO' },
];
const trackLabel = (t) => t.label || t.value;

/* ─── Fallback jobs (used when /api/jobs is down) ───────────────────── */
const FALLBACK_OPENINGS = [
  {
    id: 'graphic-designer',
    type: 'Full-time · Design',
    title: 'Graphic Designer',
    location: 'Remote / Islamabad',
    summary:
      'Create visual identities, digital experiences, campaign assets and brand materials across NallGeeks and our client work.',
    tags: ['Brand Identity', 'Digital Design', 'Social', 'Art Direction'],
  },
  {
    id: 'internship',
    type: 'Internship · Multiple tracks',
    title: 'Internship',
    location: 'Remote',
    summary:
      'Work alongside our core team on real client projects while developing practical skills and building your portfolio.',
  },
];

const isInternRole = (title = '') => /intern/i.test(title);

const DEPARTMENTS = [
  { test: /design|brand|ux|ui/i, label: 'Design' },
  { test: /mobile|android|ios|flutter/i, label: 'Mobile' },
  { test: /seo|market|growth|content/i, label: 'Growth' },
  { test: /develop|engineer|front|back|stack|web/i, label: 'Engineering' },
  { test: /manage|product|project|delivery/i, label: 'Delivery' },
  { test: /intern/i, label: 'Internship' },
];

const TAG_PRESETS = [
  { test: /design|brand|ux|ui|creative|art/i, tags: ['Brand Identity', 'Digital Design', 'Social', 'Art Direction'] },
  { test: /mobile|android|ios|flutter/i, tags: ['React Native', 'Flutter', 'App Store'] },
  { test: /seo|market|growth|content/i, tags: ['Technical SEO', 'Content', 'Analytics'] },
  { test: /develop|engineer|front|back|stack|web/i, tags: ['React', 'APIs', 'Performance'] },
  { test: /manage|product|project|delivery/i, tags: ['Scoping', 'QA', 'Delivery'] },
];

const EMPLOYMENT = /full[\s-]?time|part[\s-]?time|contract|freelance|internship|intern/i;
const titleCase = (v) =>
  v.replace(/full[\s-]?time/i, 'Full-time')
   .replace(/part[\s-]?time/i, 'Part-time')
   .replace(/^intern$/i, 'Internship');

function parseOpening(opening) {
  const chunks = String(opening.type || '').split(/[·|,]/).map(s => s.trim()).filter(Boolean);
  const intern = isInternRole(opening.title);
  const rawEmp = chunks.find(c => EMPLOYMENT.test(c));
  const employment = titleCase(rawEmp || (intern ? 'Internship' : 'Full-time'));
  const rawDept = chunks.find(c => c !== rawEmp);
  const department =
    rawDept || DEPARTMENTS.find(d => d.test.test(opening.title || ''))?.label || 'Team';
  const explicitTags = Array.isArray(opening.tags)
    ? opening.tags
    : typeof opening.tags === 'string'
      ? opening.tags.split(/[,·]/).map(t => t.trim()).filter(Boolean)
      : null;
  const haystack = `${opening.title || ''} ${department}`;
  const tags = explicitTags?.length
    ? explicitTags
    : TAG_PRESETS.find(p => p.test.test(haystack))?.tags || [];
  return {
    key: opening.id || opening.title,
    title: opening.title,
    summary: opening.summary,
    location: opening.location || 'Remote',
    department,
    employment,
    tags,
  };
}

const initialForm = {
  name: '', position: '', track: '',
  email: '', phone: '', portfolio: '', details: '',
};

/* ─── Inline styles ─────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ng-careers {
    font-family: 'Inter', system-ui, sans-serif;
    color: #111;
    --accent: #e8632a;
    --accent-dark: #c54e18;
    --accent-light: rgba(232,99,42,0.10);
    --radius: 14px;
    --radius-sm: 8px;
  }

  /* ── Wrap ── */
  .ngc-wrap { max-width: 1180px; margin: 0 auto; padding: 0 48px; }
  @media (max-width: 768px) { .ngc-wrap { padding: 0 20px; } }

  /* ── Hero ── */
  .ngc-hero {
    position: relative;
    min-height: 92vh;
    display: flex;
    align-items: center;
    padding: 140px 0 72px;
    overflow: hidden;
  }
  .ngc-hero-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    transform: scale(1.04);
    transition: transform 8s ease;
  }
  .ngc-hero-bg.loaded { transform: scale(1); }
  .ngc-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      160deg,
      rgba(6,6,6,0.88) 0%,
      rgba(6,6,6,0.72) 40%,
      rgba(6,6,6,0.30) 100%
    );
  }
  .ngc-hero-content {
    position: relative; z-index: 2;
    max-width: 680px;
  }
  .ngc-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 28px;
  }
  .ngc-tag::before {
    content: '';
    display: block; width: 28px; height: 1px;
    background: var(--accent);
  }
  .ngc-hero h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.8rem, 6.4vw, 5rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.01em;
    color: #fff;
    margin-bottom: 28px;
  }
  .ngc-hero h1 em {
    font-style: normal;
    color: var(--accent);
  }
  .ngc-hero-lead {
    font-size: 17px;
    line-height: 1.75;
    color: rgba(255,255,255,0.65);
    max-width: 500px;
    margin-bottom: 44px;
  }
  .ngc-hero-scroll {
    display: inline-flex; align-items: center; gap: 12px;
    background: none; border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.75);
    font-size: 13px; font-weight: 500;
    padding: 14px 26px;
    margin-top: 16px;
    border-radius: 50px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    font-family: inherit;
  }
  .ngc-hero-scroll:hover {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
  }
  .ngc-hero-scroll svg { transition: transform 0.2s; }
  .ngc-hero-scroll:hover svg { transform: translateY(3px); }

  /* ── Positions section ── */
  .ngc-positions {
    background: #fff;
    padding: 120px 0 140px;
  }
  .ngc-section-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 14px;
    display: block;
  }
  .ngc-section-h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.01em;
    color: #0d0d0d;
  }
  .ngc-pos-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
    margin-bottom: 64px;
  }
  .ngc-pos-header p {
    color: rgba(0,0,0,0.4);
    font-size: 15px;
    line-height: 1.6;
    max-width: 260px;
  }

  /* Job card — restructured for breathing room */
  .ngc-job-card {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 32px;
    align-items: start;
    padding: 44px;
    border-radius: var(--radius);
    border: 1px solid rgba(0,0,0,0.07);
    background: #fafafa;
    margin-bottom: 20px;
    transition: background 0.25s, border-color 0.25s, transform 0.2s;
    cursor: default;
  }
  .ngc-job-card:hover {
    background: #fff7f3;
    border-color: rgba(232,99,42,0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(232,99,42,0.08);
  }
  .ngc-job-main { min-width: 0; }
  .ngc-dept-pill {
    display: inline-block;
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-light);
    border: 1px solid rgba(232,99,42,0.2);
    border-radius: 6px;
    padding: 4px 11px;
    margin-bottom: 20px;
  }
  .ngc-job-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.4rem, 2.5vw, 1.8rem);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.01em;
    color: #0d0d0d;
    margin-bottom: 26px;
  }
  .ngc-job-meta {
    display: flex; align-items: center; gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 26px;
  }
  .ngc-meta-pill {
    font-size: 12.5px; font-weight: 500; color: rgba(0,0,0,0.62);
    background: rgba(0,0,0,0.06);
    border-radius: 20px;
    padding: 5px 16px;
  }
  .ngc-meta-dot { display: none; }
  .ngc-meta-loc {
    font-size: 12.5px; font-weight: 500; color: rgba(0,0,0,0.62);
    background: rgba(0,0,0,0.06);
    border-radius: 20px;
    padding: 5px 16px;
  }
  .ngc-job-summary {
    font-size: 14.5px; line-height: 1.8;
    color: rgba(0,0,0,0.68);
    max-width: 520px;
    margin-bottom: 22px;
  }
  .ngc-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .ngc-tag-chip {
    font-size: 12px; font-weight: 500; color: rgba(0,0,0,0.58);
    border: 1px solid rgba(0,0,0,0.14);
    border-radius: var(--radius-sm);
    padding: 4px 12px;
  }
  .ngc-apply-btn {
    flex-shrink: 0;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 15px 32px;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    letter-spacing: 0.02em;
    transition: background 0.2s, transform 0.15s;
    font-family: inherit;
  }
  .ngc-apply-btn:hover {
    background: var(--accent-dark);
    transform: translateY(-1px);
  }
  @media (max-width: 640px) {
    .ngc-job-card { grid-template-columns: 1fr; }
    .ngc-apply-btn { width: 100%; text-align: center; }
  }

  /* Internship block */
  .ngc-intern-block {
    margin-top: 44px;
    background: linear-gradient(135deg, #fdf1eb 0%, #fff8f5 100%);
    border: 1px solid rgba(232,99,42,0.18);
    border-radius: 20px;
    padding: 52px 56px;
    display: flex;
    gap: 60px;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .ngc-intern-intro { flex: 0 0 240px; }
  .ngc-intern-intro h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.65rem; font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.25;
    color: #0d0d0d;
    margin-bottom: 12px;
  }
  .ngc-intern-intro p {
    font-size: 14px; line-height: 1.75;
    color: rgba(0,0,0,0.5);
  }
  .ngc-intern-tracks { flex: 1; min-width: 240px; }
  .ngc-tracks-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(0,0,0,0.3);
    margin-bottom: 18px;
    display: block;
  }
  .ngc-track-pills { display: flex; flex-wrap: wrap; gap: 10px; }
  .ngc-track-pill {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 50px;
    color: rgba(0,0,0,0.7);
    font-size: 13px; font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .ngc-track-pill:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    transform: translateY(-1px);
  }

  /* ── Application ── */
  .ngc-apply-section {
    background: #f5f4f1;
    padding: 120px 0;
  }
  .ngc-apply-inner {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 80px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .ngc-apply-inner { grid-template-columns: 1fr; gap: 48px; }
  }
  .ngc-apply-copy h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.15;
    color: #0d0d0d;
    margin-bottom: 20px;
  }
  .ngc-apply-copy h2 em {
    font-style: normal;
    color: var(--accent);
  }
  .ngc-apply-copy > p {
    font-size: 15px; line-height: 1.75;
    color: rgba(0,0,0,0.5);
    margin-bottom: 44px;
  }
  .ngc-steps { list-style: none; }
  .ngc-step {
    display: flex; align-items: flex-start; gap: 18px;
    padding: 18px 0;
    border-top: 1px solid rgba(0,0,0,0.07);
    font-size: 15px; color: rgba(0,0,0,0.6);
    line-height: 1.6;
  }
  .ngc-step:last-child { border-bottom: 1px solid rgba(0,0,0,0.07); }
  .ngc-step-num {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    color: var(--accent);
    margin-top: 3px;
    min-width: 24px;
  }

  /* Form */
  .ngc-form {
    background: #fff;
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.07);
    padding: 44px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    box-shadow: 0 4px 60px rgba(0,0,0,0.05);
  }
  .ngc-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 600px) { .ngc-form-row { grid-template-columns: 1fr; } }
  .ngc-field { display: flex; flex-direction: column; gap: 7px; }
  .ngc-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(0,0,0,0.4);
  }
  .ngc-input, .ngc-select, .ngc-textarea {
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: var(--radius-sm);
    padding: 13px 15px;
    font-size: 14px; color: #111;
    outline: none;
    background: #fafafa;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .ngc-input::placeholder, .ngc-textarea::placeholder { color: rgba(0,0,0,0.28); }
  .ngc-input:focus, .ngc-select:focus, .ngc-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(232,99,42,0.1);
    background: #fff;
  }
  .ngc-textarea { resize: vertical; min-height: 120px; }

  /* Track selector inside form */
  .ngc-track-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ngc-track-toggle {
    padding: 9px 18px;
    border-radius: 50px;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.12);
    background: #fff;
    color: rgba(0,0,0,0.65);
    transition: all 0.15s;
    font-family: inherit;
  }
  .ngc-track-toggle.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .ngc-track-toggle:not(.active):hover {
    border-color: rgba(232,99,42,0.4);
    color: var(--accent);
  }

  /* Submit button */
  .ngc-submit {
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    padding: 17px 28px;
    font-size: 15px; font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    font-family: inherit;
    letter-spacing: 0.01em;
  }
  .ngc-submit:hover:not(:disabled) {
    background: var(--accent-dark);
    transform: translateY(-1px);
  }
  .ngc-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .ngc-submit.success { background: #1a7a3b; }

  /* Alerts */
  .ngc-alert {
    font-size: 13px; border-radius: var(--radius-sm);
    padding: 13px 16px; margin: 0;
  }
  .ngc-alert.success { color: #1a5c2e; background: #edf9f2; border: 1px solid rgba(26,90,46,0.15); }
  .ngc-alert.error { color: #991b1b; background: #fff2f2; border: 1px solid rgba(153,27,27,0.15); }
  .ngc-alert.warn { color: var(--accent-dark); background: #fff5f0; }

  /* Scroll reveal */
  [data-reveal] { opacity: 0; transform: translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; }
  [data-reveal].is-in { opacity: 1; transform: none; }
  [data-reveal][style*='--d'] { transition-delay: var(--d, 0ms); }

  @media (prefers-reduced-motion: reduce) {
    [data-reveal] { opacity: 1 !important; transform: none !important; }
    .ngc-hero-bg { transition: none; }
  }

  /* Loading skeleton */
  .ngc-skeleton {
    height: 140px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius);
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const initialForm2 = { ...initialForm };

export default function Careers() {
  const [openings, setOpenings] = useState([]);
  const [form, setForm] = useState(initialForm2);
  const [jobsStatus, setJobsStatus] = useState('loading');
  const [status, setStatus] = useState('idle');
  const pageRef = useRef(null);
  const heroBgRef = useRef(null);

  /* Load jobs */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        const jobs = data.jobs || [];
        const list = jobs.length > 0 ? jobs : FALLBACK_OPENINGS;
        setOpenings(list);
        setForm(c => ({ ...c, position: c.position || list[0]?.title || '' }));
        setJobsStatus('ready');
      } catch {
        setOpenings(FALLBACK_OPENINGS);
        setForm(c => ({ ...c, position: c.position || FALLBACK_OPENINGS[0].title }));
        setJobsStatus('ready');
      }
    };
    load();
  }, []);

  /* Hero bg pan-in */
  useEffect(() => {
    const t = setTimeout(() => heroBgRef.current?.classList.add('loaded'), 100);
    return () => clearTimeout(t);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll('[data-reveal]:not(.is-in)'));
    if (!nodes.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(n => n.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );
    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, [jobsStatus, openings.length]);

  const parsed = useMemo(() => openings.map(parseOpening), [openings]);
  const roles = parsed.filter(r => !isInternRole(r.title));
  const internship = parsed.find(r => isInternRole(r.title));

  const isInternship = isInternRole(form.position);
  const needsTrack = isInternship && !form.track;

  const scrollTo = (id) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(c => {
      const next = { ...c, [name]: value };
      if (name === 'position' && !isInternRole(value)) next.track = '';
      return next;
    });
  };

  const handleSelectPosition = (title, track = '') => {
    setForm(c => ({
      ...c,
      position: title,
      track: isInternRole(title) ? track || c.track : '',
    }));
    scrollTo('#career-application');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (needsTrack) return;
    setStatus('sending');
    const position = isInternship ? `${form.position} — ${form.track}` : form.position;
    const { track, ...rest } = form;
    try {
      const res = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, position }),
      });
      if (!res.ok) throw new Error('failed');
      setForm({ ...initialForm2, position: openings[0]?.title || '' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setStatus('error');
    }
  };

  const submitLabel = { sending: 'Sending…', success: 'Application sent', error: 'Try again', idle: 'Send application' }[status];

  return (
    <main className="ng-careers" ref={pageRef} style={{ background: '#fff' }}>
      <style>{css}</style>

      {/* ════════════════ HERO ════════════════ */}
      <section className="ngc-hero">
        <div
          ref={heroBgRef}
          className="ngc-hero-bg"
          style={{ backgroundImage: `url(${careerpageBg})` }}
        />
        <div className="ngc-hero-overlay" />

        <div className="ngc-wrap" style={{ width: '100%' }}>
          <div className="ngc-hero-content" data-reveal>
            <span className="ngc-tag">Join NallGeeks</span>

            <h1>
              Build work you're<br />
              <em>proud</em> to put your<br />
              name on.
            </h1>

            <p className="ngc-hero-lead">
              We're a small studio that designs and builds for clients who want
              work that actually holds up after launch. You build it, you defend
              it, you watch it go live.
            </p>

            <button
              type="button"
              className="ngc-hero-scroll"
              onClick={() => scrollTo('#open-positions')}
            >
              View open positions
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1.5 7.5 7 13l5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ OPEN POSITIONS ════════════════ */}
      <section id="open-positions" className="ngc-positions">
        <div className="ngc-wrap">
          <div className="ngc-pos-header" data-reveal>
            <div>
              <span className="ngc-section-label">Open Positions</span>
              <h2 className="ngc-section-h2">Where you'll fit in</h2>
            </div>
            <p>Real work, real clients, real impact from day one.</p>
          </div>

          {jobsStatus === 'loading' && <div className="ngc-skeleton" />}

          {jobsStatus === 'ready' && roles.length === 0 && (
            <p style={{ color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
              No roles open right now — send an open application below.
            </p>
          )}

          <div>
            {roles.map((role) => (
              <article key={role.key} className="ngc-job-card" data-reveal>
                <div className="ngc-job-main">
                  <span className="ngc-dept-pill">{role.department}</span>
                  <h3 className="ngc-job-title">{role.title}</h3>
                  <div className="ngc-job-meta">
                    <span className="ngc-meta-pill">{role.employment}</span>
                    <span className="ngc-meta-dot">·</span>
                    <span className="ngc-meta-loc">{role.location}</span>
                  </div>
                  <p className="ngc-job-summary">{role.summary}</p>
                  {role.tags.length > 0 && (
                    <div className="ngc-tags">
                      {role.tags.map(tag => (
                        <span key={tag} className="ngc-tag-chip">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="ngc-apply-btn"
                  onClick={() => handleSelectPosition(role.title)}
                  aria-label={`Apply for ${role.title}`}
                >
                  Apply now
                </button>
              </article>
            ))}
          </div>

          {/* Internship */}
          {internship && (
            <div className="ngc-intern-block" data-reveal style={{ '--d': '60ms' }}>
              <div className="ngc-intern-intro">
                <span className="ngc-section-label">Internships</span>
                <h3>Start here.<br />Learn by doing.</h3>
                <p>
                  Work on real projects alongside our core team and build a
                  portfolio that speaks for itself.
                </p>
              </div>
              <div className="ngc-intern-tracks">
                <span className="ngc-tracks-label">Pick a track to apply</span>
                <div className="ngc-track-pills">
                  {INTERN_TRACKS.map(track => (
                    <button
                      type="button"
                      key={track.value}
                      className="ngc-track-pill"
                      onClick={() => handleSelectPosition(internship.title, track.value)}
                    >
                      {trackLabel(track)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ APPLICATION ════════════════ */}
      <section id="career-application" className="ngc-apply-section">
        <div className="ngc-wrap">
          <div className="ngc-apply-inner">
            {/* Left */}
            <div className="ngc-apply-copy" data-reveal>
              <span className="ngc-section-label">Apply</span>
              <h2>Think you'd be a good fit? <em>Let's talk.</em></h2>
              <p>
                Tell us what you do, what you're good at, and what you'd like
                to build with us. If there's a strong fit, our team will be in touch.
              </p>
              <ol className="ngc-steps">
                {['Tell us about your experience.', 'Share your portfolio or LinkedIn.', "We'll review and get back to you."].map((step, i) => (
                  <li key={i} className="ngc-step">
                    <span className="ngc-step-num">0{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Form */}
            <form className="ngc-form" onSubmit={handleSubmit} data-reveal style={{ '--d': '100ms' }}>
              <div className="ngc-form-row">
                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-name">Full name</label>
                  <input id="ng-name" name="name" type="text" placeholder="Your name"
                    className="ngc-input" value={form.name} onChange={handleChange} required />
                </div>
                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-position">Position</label>
                  <select id="ng-position" name="position" className="ngc-select"
                    value={form.position} onChange={handleChange} required>
                    {openings.map(o => {
                      const intern = isInternRole(o.title);
                      const isSelectedIntern = intern && form.position === o.title;
                      const label = intern
                        ? `Internship${isSelectedIntern && form.track ? ` — ${form.track}` : ''}`
                        : o.title;
                      return <option key={o.id || o.title} value={o.title}>{label}</option>;
                    })}
                  </select>
                </div>
              </div>

              {isInternship && (
                <div className="ngc-track-group">
                  <span className="ngc-label">Which track fits you?</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} role="group" aria-label="Internship track">
                    {INTERN_TRACKS.map(track => (
                      <button
                        type="button"
                        key={track.value}
                        className={`ngc-track-toggle${form.track === track.value ? ' active' : ''}`}
                        aria-pressed={form.track === track.value}
                        onClick={() => setForm(c => ({ ...c, track: track.value }))}
                      >
                        {trackLabel(track)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="ngc-form-row">
                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-email">Email address</label>
                  <input id="ng-email" name="email" type="email" placeholder="you@example.com"
                    className="ngc-input" value={form.email} onChange={handleChange} required />
                </div>
                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-phone">Phone number</label>
                  <input id="ng-phone" name="phone" type="tel" placeholder="+92 …"
                    className="ngc-input" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="ngc-field">
                <label className="ngc-label" htmlFor="ng-portfolio">Portfolio / LinkedIn</label>
                <input id="ng-portfolio" name="portfolio" type="url" placeholder="https://"
                  className="ngc-input" value={form.portfolio} onChange={handleChange} />
              </div>

              <div className="ngc-field">
                <label className="ngc-label" htmlFor="ng-details">About you</label>
                <textarea id="ng-details" name="details" rows="5"
                  className="ngc-textarea"
                  placeholder="Tell us about your experience, availability, and why you'd like to work with NallGeeks."
                  value={form.details} onChange={handleChange} />
              </div>

              {needsTrack && (
                <p className="ngc-alert warn" role="alert">
                  Pick a track above before submitting your internship application.
                </p>
              )}
              {status === 'success' && (
                <p className="ngc-alert success" role="status">
                  Application received. We'll be in touch if there's a fit.
                </p>
              )}
              {status === 'error' && (
                <p className="ngc-alert error" role="alert">
                  Couldn't send your application. Check your connection and try again.
                </p>
              )}

              <button
                type="submit"
                className={`ngc-submit${status === 'success' ? ' success' : ''}`}
                disabled={status === 'sending' || needsTrack || openings.length === 0}
              >
                {submitLabel}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}