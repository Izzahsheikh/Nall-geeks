/* Shared styles for the Careers listing, job detail and application pages. */
export const css = `
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
