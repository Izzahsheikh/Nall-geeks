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

  /* ── Small shared pieces (also used by the apply page) ── */
  .ngc-section-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 14px;
    display: block;
  }
  .ngc-job-meta {
    display: flex; flex-wrap: wrap; align-items: center;
    gap: 6px 22px;
    font-size: 14px; font-weight: 400;
    color: rgba(0,0,0,0.56);
  }
  .ngc-job-meta span { display: inline-flex; align-items: center; gap: 7px; }
  .ngc-job-meta svg { flex-shrink: 0; color: rgba(0,0,0,0.38); }

  /* ═════════ Light theme: company profile, open positions and job detail pages ═════════ */
  .ng-careers.ngc-light {
    background: #f7f7f7;
    color: #1a1a1a;
    --ngc-surface: #ffffff;
    --ngc-line: rgba(0,0,0,0.09);
    --ngc-text: #1a1a1a;
    --ngc-body: #3f4448;
    --ngc-muted: #5f6468;
    --ngc-faint: #666c71;
    --ngc-orange-text: #a3400e;
    /* The footer has rounded top corners (2.5rem); tuck it up over the page's bottom edge so this page's background, not the body's, shows behind them. */
    margin-bottom: -2.5rem;
    padding-bottom: calc(120px + 2.5rem);
  }

  /* Company logo: the dark mark on a white tile */
  .ngc-logo-tile {
    flex-shrink: 0;
    display: grid; place-items: center;
    background: #fff;
    border: 1px solid var(--ngc-line);
    box-shadow: 0 6px 18px rgba(0,0,0,0.07);
  }
  .ngc-logo-tile img { display: block; width: 100%; height: auto; }
  .ngc-logo-tile--lg { width: 96px; height: 96px; padding: 10px; border-radius: 20px; }
  .ngc-logo-tile--md { width: 64px; height: 64px; padding: 7px; border-radius: 15px; }

  /* Company profile header */
  .ngc-company {
    position: relative;
    display: flex; align-items: center; gap: 28px;
    margin-top: 40px;
    padding: 32px 36px;
    background: var(--ngc-surface);
    border: 1px solid var(--ngc-line);
    border-radius: 22px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 18px 40px -20px rgba(0,0,0,0.14);
  }
  .ngc-company-main { flex: 1; min-width: 0; }
  .ngc-company-head { display: flex; align-items: center; gap: 20px; margin-bottom: 18px; }
  .ng-careers .ngc-company-name {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2rem, 3.2vw, 2.5rem);
    font-weight: 700; line-height: 1.1; letter-spacing: -0.01em;
    color: var(--ngc-text);
  }
  .ng-careers .ngc-company-desc {
    font-size: 16px; line-height: 1.6;
    color: var(--ngc-muted);
    margin-bottom: 18px;
  }
  .ngc-company-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; }
  .ngc-company-location, .ngc-role-location {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 14px; color: var(--ngc-muted);
  }
  .ngc-company-location svg, .ngc-role-location svg { flex-shrink: 0; opacity: 0.85; }
  .ngc-social {
    flex-shrink: 0; align-self: flex-start;
    display: grid; place-items: center;
    width: 40px; height: 40px;
    border-radius: 11px;
    color: #4a5055;
    background: #f7f7f7;
    border: 1px solid var(--ngc-line);
  }

  /* Open positions */
  .ngc-board { margin-top: 72px; }
  .ngc-board-head {
    display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
    padding-bottom: 20px; margin-bottom: 36px;
  }
  .ng-careers .ngc-board-head h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.7rem, 2.6vw, 2.1rem);
    font-weight: 700; letter-spacing: -0.01em; line-height: 1.15;
    color: var(--ngc-text);
  }
  .ngc-board-count { font-size: 14px; color: var(--ngc-muted); white-space: nowrap; }
  .ng-careers .ngc-board-empty { color: var(--ngc-muted); font-size: 16px; }
  .ngc-group + .ngc-group { margin-top: 52px; }
  .ng-careers .ngc-group-title {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.1rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.4;
    color: #1a1a1a;
    margin-bottom: 26px;
  }
  .ngc-role-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

  /* One card per role */
  .ngc-role {
    position: relative;
    display: flex; flex-direction: column; gap: 18px;
    min-height: 176px;
    padding: 24px;
    background: var(--ngc-surface);
    border: 1px solid var(--ngc-line);
    border-radius: 16px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    transition: border-color 0.2s, box-shadow 0.25s, transform 0.2s;
  }
  .ngc-role:hover {
    border-color: rgba(232,98,42,0.55);
    box-shadow: 0 18px 38px -18px rgba(0,0,0,0.22);
    transform: translateY(-2px);
  }
  .ng-careers .ngc-role-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.3rem; font-weight: 700; line-height: 1.25; letter-spacing: -0.01em;
    color: var(--ngc-text);
  }
  /* The title link is stretched over the whole card so the card is one click target. */
  .ngc-role-link { color: inherit; text-decoration: none; transition: color 0.2s; }
  .ngc-role-link::after { content: ''; position: absolute; inset: 0; border-radius: 16px; }
  .ngc-role-link:focus-visible { outline: none; }
  .ngc-role-link:focus-visible::after { outline: 2px solid var(--accent); outline-offset: 3px; }
  .ngc-role:hover .ngc-role-link { color: var(--accent-dark); }
  .ngc-role-foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  /* Looks like a button but isn't one: the stretched title link makes the whole card the click target, so it reacts to the card's hover. */
  .ngc-role-apply {
    flex-shrink: 0;
    padding: 8px 18px; border-radius: 999px;
    font-size: 0.8rem; font-weight: 600; line-height: 1.2; color: #fff;
    background: var(--accent);
    transition: all 0.2s ease;
  }
  .ngc-role:hover .ngc-role-apply { background: var(--accent-dark); box-shadow: 0 4px 12px rgba(197,78,24,0.3); }

  /* Job detail page */
  .ngc-job-page .ngc-narrow { padding-top: 40px; }
  .ngc-light .ngc-back { margin-bottom: 36px; }
  .ngc-job-head { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; }
  .ng-careers .ngc-job-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.9rem, 4vw, 2.75rem);
    font-weight: 700; line-height: 1.12; letter-spacing: -0.01em;
    color: var(--ngc-text);
  }
  .ngc-job-description { margin-top: 48px; padding-top: 40px; border-top: 1px solid var(--ngc-line); }
  .ng-careers .ngc-job-description h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; line-height: 1.2;
    color: var(--ngc-text);
    margin-bottom: 20px;
  }
  .ng-careers .ngc-job-description h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.15rem; font-weight: 700; letter-spacing: -0.005em; line-height: 1.3;
    color: var(--ngc-text);
    margin: 32px 0 14px;
  }
  .ngc-job-description p {
    font-size: 16px; line-height: 1.85;
    color: var(--ngc-body);
    margin-bottom: 16px;
    max-width: 68ch;
  }
  .ngc-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .ngc-list li {
    position: relative;
    padding-left: 26px;
    font-size: 16px; line-height: 1.7;
    color: var(--ngc-body);
    max-width: 68ch;
  }
  .ngc-list li::before {
    content: '';
    position: absolute; left: 4px; top: 0.72em;
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent);
  }

  @media (max-width: 720px) {
    .ngc-company { flex-direction: column; align-items: flex-start; gap: 20px; margin-top: 28px; padding: 24px 22px; }
    .ngc-logo-tile--lg { width: 80px; height: 80px; }
    .ngc-social { position: absolute; top: 22px; right: 22px; }
    .ngc-board { margin-top: 56px; }
    .ngc-board-head { flex-direction: column; align-items: flex-start; gap: 6px; }
    .ngc-role-grid { grid-template-columns: 1fr; }
    .ngc-job-head { gap: 16px; }
  }

  /* Logo and name now share one line and the LinkedIn tile sits top-right; keep them from meeting on narrow phones. */
  @media (max-width: 420px) {
    .ngc-company-head { gap: 14px; }
    .ngc-company .ngc-logo-tile--lg { width: 64px; height: 64px; padding: 8px; border-radius: 16px; }
    .ng-careers .ngc-company-name { font-size: 1.75rem; }
  }
  @media (max-width: 360px) {
    .ngc-company-head { gap: 12px; }
    .ngc-company .ngc-logo-tile--lg { width: 56px; height: 56px; padding: 7px; border-radius: 14px; }
    .ng-careers .ngc-company-name { font-size: 1.5rem; }
  }

  /* ── Job detail + application pages ── */
  .ngc-page { background: #fff; padding: 128px 0 120px; min-height: 80vh; }
  .ngc-narrow { max-width: 820px; margin: 0 auto; }
  .ngc-back {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13.5px; font-weight: 500;
    color: rgba(0,0,0,0.55);
    margin-bottom: 36px;
    transition: color 0.2s;
  }
  .ngc-back:hover { color: var(--accent); }
  .ngc-apply-btn {
    flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 15px 32px;
    font-size: 14px; font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    font-family: inherit;
    box-shadow: 0 6px 18px rgba(232,99,42,0.28);
  }
  .ngc-apply-btn:hover { background: var(--accent-dark); color: #fff; transform: translateY(-1px); }
  @media (max-width: 640px) { .ngc-apply-btn { width: 100%; } }
  .ngc-state { color: rgba(0,0,0,0.55); font-size: 16px; line-height: 1.7; }
  .ngc-state h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    color: #0d0d0d;
    margin-bottom: 14px;
  }
  .ngc-state .ngc-apply-btn { margin-top: 28px; }

  .ngc-apply-page { padding-top: 132px; min-height: 100vh; }
  .ngc-apply-copy .ngc-job-meta { margin-bottom: 36px; }
  .ngc-apply-copy h2 { font-size: clamp(2rem, 3.6vw, 3rem); }
  .ngc-done { align-items: flex-start; gap: 14px; }
  .ngc-done h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.7rem; font-weight: 700;
    color: #0d0d0d;
  }
  .ngc-done p { font-size: 15px; line-height: 1.75; color: rgba(0,0,0,0.6); }
  .ngc-done .ngc-apply-btn { margin-top: 10px; }
  .ngc-hint { font-size: 12px; color: rgba(0,0,0,0.42); line-height: 1.5; }
  .ngc-field-error { font-size: 12.5px; color: #991b1b; }

  /* File pickers */
  .ngc-file {
    position: relative;
    display: flex; align-items: center; gap: 12px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: var(--radius-sm);
    background: #fafafa;
    padding: 7px 8px;
    min-height: 48px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ngc-file:hover { border-color: rgba(0,0,0,0.28); }
  .ngc-file:focus-within { border-color: #555; box-shadow: 0 0 0 3px rgba(0,0,0,0.07); background: #fff; }
  .ngc-file.has-error { border-color: rgba(153,27,27,0.5); }
  .ngc-file-btn {
    flex-shrink: 0;
    cursor: pointer;
    font-size: 13px; font-weight: 600; letter-spacing: 0.01em;
    color: #1a1a1a;
    background: #fff;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 8px 16px;
    transition: background 0.2s, color 0.2s;
  }
  .ngc-file-btn:hover { background: #ececec; color: #1a1a1a; }
  .ngc-file-input {
    position: absolute; width: 1px; height: 1px;
    opacity: 0; overflow: hidden; pointer-events: none;
  }
  .ngc-file-name {
    flex: 1; min-width: 0;
    font-size: 14px; color: rgba(0,0,0,0.35);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ngc-file-name.has-file { color: #1a1a1a; font-weight: 500; }
  .ngc-file-clear {
    flex-shrink: 0;
    width: 26px; height: 26px;
    display: grid; place-items: center;
    border: none; border-radius: 50%;
    background: transparent;
    color: rgba(0,0,0,0.45);
    font-size: 20px; line-height: 1;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    font-family: inherit;
  }
  .ngc-file-clear:hover { background: rgba(0,0,0,0.08); color: #1a1a1a; }

  .ngc-input[readonly] { color: rgba(0,0,0,0.7); background: #f3f3f1; cursor: default; }

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

`;
