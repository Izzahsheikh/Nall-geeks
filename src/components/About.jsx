import { useEffect, useRef } from 'react';
import aboutHeroVideo from '../assets/Camera_pans_across_digital_lands…_202609021757.mp4';

/*
  About — self-contained.
  Styling is scoped under `.ng-about` and uses the site's existing CSS
  variables (--accent, --font-display, --footer, ...) so it inherits the
  same palette and type as the rest of the site. It does NOT reuse the old
  `.about-*` class names, so it won't collide with the current stylesheet.
  You can safely delete the old `.about-*` rules from your CSS once this is in.
*/

const PROCESS = [
  {
    n: '01',
    title: 'Understand',
    text: 'We learn the business, the users, and the real problem before deciding what should be built.',
  },
  {
    n: '02',
    title: 'Collaborate & build',
    text: 'Decisions stay clear, progress is shared often, and the idea becomes a polished, working product.',
  },
  {
    n: '03',
    title: 'Support',
    text: 'After launch we stay available for improvements, fixes, scaling, and the next smart step.',
  },
];

export default function About() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = root.querySelectorAll('[data-reveal]');

    if (prefersReduced) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ng-about" ref={rootRef}>
      <style>{css}</style>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="abx-hero">
        <video
          className="abx-hero__video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={aboutHeroVideo} type="video/mp4" />
        </video>
        <div className="abx-hero__scrim" aria-hidden="true" />

        <div className="abx-inner abx-hero__content" data-reveal>
          <span className="abx-eyebrow abx-eyebrow--light">About NallGeeks</span>
          <h1 className="abx-hero__title">
            There’s more to us<br />than what we build.
          </h1>
          <p className="abx-hero__lead">
            A software engineering studio shaped by clear thinking, careful execution,
            and partnerships that outlast the launch date.
          </p>
        </div>
      </section>

      {/* ── VISION ───────────────────────────────────────── */}
      <section className="abx-section abx-vision">
        <div className="abx-inner abx-split">
          <div className="abx-split__copy" data-reveal>
            <span className="abx-eyebrow">Our vision</span>
            <h2 className="abx-h2">
              Build software that feels intentional from the first click.
            </h2>
            <p className="abx-lead">
              Great digital products aren’t assembled — they’re understood, shaped,
              and refined until they’re genuinely useful for the people who depend
              on them every day.
            </p>
          </div>

          {/* clean plate — just the mark */}
          <div className="abx-plate" data-reveal aria-hidden="true">
            <div className="abx-plate__mark">
              <img src="/nallgeeks-logo-mark.png" width="1665" height="944" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMITMENT (dark focal moment) ───────────────── */}
      <section className="abx-section abx-commitment">
        <div className="abx-inner abx-split abx-split--wide-right">
          <div className="abx-split__copy" data-reveal>
            <span className="abx-eyebrow abx-eyebrow--light">Our commitment</span>
            <p className="abx-flow">Build → stand behind → keep going</p>
            <p className="abx-lead abx-lead--light">
              We don’t hand over a product and disappear. We stay available for support,
              maintenance, and the improvements that come after launch — for as long as
              the work needs to keep moving.
            </p>
          </div>

          <div className="abx-statement" data-reveal>
            <span className="abx-statement__line">We build it.</span>
            <span className="abx-statement__connector" aria-hidden="true">
              <i className="dot" />
              <i className="bar" />
            </span>
            <span className="abx-statement__line">We stand behind it.</span>
          </div>
        </div>
      </section>

      {/* ── PROCESS (a real sequence → numbering earns it) ── */}
      <section className="abx-section abx-process">
        <div className="abx-inner">
          <div className="abx-process__head" data-reveal>
            <span className="abx-eyebrow">How we work with you</span>
            <h2 className="abx-h2">
              We work beside clients — before, during, and after launch.
            </h2>
            <p className="abx-lead">
              The best products come out of collaboration that lasts longer than
              a launch date.
            </p>
          </div>

          <div className="abx-steps">
            <span className="abx-steps__rail" aria-hidden="true" />
            {PROCESS.map((step, i) => (
              <div
                className="abx-step"
                key={step.n}
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="abx-step__n">{step.n}</span>
                <h3 className="abx-step__title">{step.title}</h3>
                <p className="abx-step__text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="abx-section abx-cta-wrap">
        <div className="abx-inner">
          <div className="abx-cta" data-reveal>
            <div>
              <h2 className="abx-cta__title">Enough about us. What are you building?</h2>
              <p className="abx-cta__text">
                Tell us what you’re planning and we’ll help turn it into something real.
              </p>
            </div>
            <a href="/contact" className="abx-btn">Book a call</a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── styles ───────────────────────── */
const css = `
.ng-about{
  --ax-ink: var(--primary, #24282B);
  --ax-body: var(--secondary, #3A4043);
  --ax-muted: var(--muted, #6B7075);
  --ax-accent: var(--accent, #F28A45);
  --ax-cta: var(--cta, #E46822);
  --ax-cta-h: var(--cta-hover, #C95418);
  --ax-line: var(--border, #D9DCDD);
  --ax-bg: var(--bg, #F7F5F2);
  --ax-alt: var(--alt-bg, #EFECE7);
  --ax-dark: var(--footer, #23272A);
  --ax-on-dark: var(--footer-text, #E7E8E8);
  --ax-serif: var(--font-display, "Fraunces", Georgia, serif);
  --ax-sans: var(--font-body, ui-sans-serif, system-ui, sans-serif);
  --ax-mono: var(--font-mono, ui-monospace, "SFMono-Regular", monospace);
  --ax-max: 1200px;
  --ax-pad: clamp(20px, 5vw, 64px);

  background: var(--ax-bg);
  color: var(--ax-ink);
  font-family: var(--ax-sans);
}
.ng-about *{ box-sizing: border-box; }

.ng-about .abx-inner{
  max-width: var(--ax-max);
  margin-inline: auto;
  padding-inline: var(--ax-pad);
  width: 100%;
}

/* reveal */
.ng-about [data-reveal]{
  opacity: 0;
  transform: translateY(26px);
  transition: opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1);
}
.ng-about [data-reveal].in{ opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce){
  .ng-about [data-reveal]{ opacity: 1; transform: none; transition: none; }
}

/* shared type */
.ng-about .abx-eyebrow{
  display: inline-block;
  font-family: var(--ax-mono);
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ax-cta);
  margin-bottom: 1.1rem;
}
.ng-about .abx-eyebrow--light{ color: var(--ax-accent); }

.ng-about .abx-h2{
  font-family: var(--ax-serif);
  font-weight: 600;
  font-size: clamp(2rem, 4.4vw, 3.35rem);
  line-height: 1.05;
  letter-spacing: -.02em;
  color: var(--ax-ink);
  margin: 0 0 1.25rem;
}
.ng-about .abx-lead{
  font-family: var(--ax-sans);
  font-size: 1.06rem;
  line-height: 1.75;
  color: var(--ax-body);
  max-width: 54ch;
  margin: 0;
}
.ng-about .abx-lead--light{ color: rgba(231,232,232,.82); }

.ng-about .abx-section{ padding-block: clamp(72px, 10vw, 132px); }

/* ── hero ── */
.ng-about .abx-hero{
  position: relative;
  min-height: 92vh;
  display: grid;
  align-items: center;
  overflow: hidden;
  background: var(--ax-dark);
}
.ng-about .abx-hero__video{
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; z-index: 0;
}
.ng-about .abx-hero__scrim{
  position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(180deg, rgba(20,22,24,.35) 0%, rgba(20,22,24,.15) 42%, rgba(20,22,24,.78) 100%),
    radial-gradient(120% 80% at 20% 30%, rgba(20,22,24,.2), transparent 60%);
}
.ng-about .abx-hero__content{
  position: relative; z-index: 2;
  padding-top: 72px;
}
.ng-about .abx-hero__title{
  font-family: var(--ax-serif);
  font-weight: 600;
  font-size: clamp(2.6rem, 6.4vw, 5.4rem);
  line-height: 1.02;
  letter-spacing: -.025em;
  color: #fff;
  margin: 0 0 1.4rem;
  text-wrap: balance;
}
.ng-about .abx-hero__lead{
  font-family: var(--ax-sans);
  font-size: clamp(1.02rem, 1.4vw, 1.2rem);
  line-height: 1.7;
  color: rgba(255,255,255,.9);
  max-width: 52ch;
  margin: 0;
}

/* ── shared split grid ── */
.ng-about .abx-split{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: center;
}
.ng-about .abx-split--wide-right{ grid-template-columns: 0.82fr 1.18fr; align-items: start; }
@media (max-width: 860px){
  .ng-about .abx-split,
  .ng-about .abx-split--wide-right{ grid-template-columns: 1fr; gap: 2.75rem; }
}

/* ── vision ── */
.ng-about .abx-vision{ background: var(--ax-bg); }

/* bare mark — no card. The current artwork has little transparent padding, so it is drawn at 81.35% of the box to keep the
   visible NG the same width as the previous mark (a plain 100% would be ~23% larger). */
.ng-about .abx-plate{
  position: relative;
  aspect-ratio: 5 / 4;
  display: grid;
  place-items: center;
}
.ng-about .abx-plate__mark{ width: min(66%, 300px); }
.ng-about .abx-plate__mark img{
  width: 81.35%; height: auto; display: block; margin-inline: auto;
  filter: drop-shadow(0 16px 28px rgba(33,30,25,.12));
}

/* ── commitment (dark) ── */
.ng-about .abx-commitment{
  background: var(--ax-dark);
  color: var(--ax-on-dark);
}
.ng-about .abx-flow{
  font-family: var(--ax-mono);
  font-size: .74rem; font-weight: 600; letter-spacing: .1em;
  color: var(--ax-accent);
  margin: 0 0 1.1rem;
}
.ng-about .abx-statement{
  font-family: var(--ax-serif);
  font-weight: 600;
  letter-spacing: -.02em;
  line-height: 1;
}
.ng-about .abx-statement__line{
  display: block;
  font-size: clamp(2.6rem, 6.6vw, 5rem);
  color: #fff;
}
.ng-about .abx-statement__connector{
  display: flex; align-items: center; gap: 12px;
  margin: 1.35rem 0;
}
.ng-about .abx-statement__connector .dot{
  width: 11px; height: 11px; border-radius: 50%;
  background: var(--ax-accent);
  box-shadow: 0 0 18px rgba(242,138,69,.6);
  flex: 0 0 auto;
  transform: scale(0);
  transition: transform .4s ease .15s;
}
.ng-about .abx-statement__connector .bar{
  height: 2px; flex: 1;
  background: linear-gradient(90deg, var(--ax-accent), rgba(242,138,69,.15), transparent);
  transform: scaleX(0); transform-origin: left;
  transition: transform .8s cubic-bezier(.22,1,.36,1) .22s;
}
.ng-about .abx-statement.in .dot{ transform: scale(1); }
.ng-about .abx-statement.in .bar{ transform: scaleX(1); }

/* ── process ── */
.ng-about .abx-process{ background: var(--ax-alt); }
.ng-about .abx-process__head{ max-width: 62ch; margin-bottom: clamp(2.75rem, 6vw, 4.25rem); }

.ng-about .abx-steps{
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.ng-about .abx-steps__rail{
  position: absolute; top: 46px; left: 12%; right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--ax-line), transparent);
  z-index: 0;
}
@media (max-width: 860px){
  .ng-about .abx-steps{ grid-template-columns: 1fr; }
  .ng-about .abx-steps__rail{ display: none; }
}
.ng-about .abx-step{
  position: relative; z-index: 1;
  background: linear-gradient(180deg, #fff, var(--ax-bg));
  border: 1px solid var(--ax-line);
  border-radius: 16px;
  padding: 30px 26px 30px;
  transition: opacity .7s ease, transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, border-color .35s ease;
}
.ng-about .abx-step:hover{
  transform: translateY(-6px);
  border-color: rgba(242,138,69,.5);
  box-shadow: 0 22px 46px -22px rgba(228,104,34,.35);
}
.ng-about .abx-step__n{
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--ax-mono);
  font-size: .8rem; font-weight: 700; letter-spacing: .06em;
  color: var(--ax-cta);
  margin-bottom: 1rem;
}
.ng-about .abx-step__n::before{
  content: ""; width: 8px; height: 8px; border-radius: 50%;
  background: var(--ax-accent);
}
.ng-about .abx-step__title{
  font-family: var(--ax-serif);
  font-weight: 600; font-size: 1.4rem; letter-spacing: -.01em;
  color: var(--ax-ink);
  margin: 0 0 .6rem;
}
.ng-about .abx-step__text{
  font-family: var(--ax-sans);
  font-size: .97rem; line-height: 1.65;
  color: var(--ax-body);
  margin: 0;
}

/* ── cta ── */
.ng-about .abx-cta-wrap{ background: var(--ax-bg); padding-block: clamp(40px, 6vw, 80px) clamp(72px, 10vw, 120px); }
.ng-about .abx-cta{
  display: flex; align-items: center; justify-content: space-between;
  gap: 2.5rem; flex-wrap: wrap;
  background: radial-gradient(120% 160% at 100% 0%, #2c3134 0%, var(--ax-dark) 55%);
  border-radius: 22px;
  padding: clamp(2.25rem, 5vw, 3.75rem);
  box-shadow: 0 34px 70px -34px rgba(20,22,24,.5);
}
.ng-about .abx-cta__title{
  font-family: var(--ax-serif);
  font-weight: 600; font-size: clamp(1.7rem, 3.4vw, 2.7rem);
  line-height: 1.08; letter-spacing: -.02em;
  color: #fff; margin: 0 0 .7rem; max-width: 18ch;
}
.ng-about .abx-cta__text{
  font-family: var(--ax-sans);
  color: rgba(231,232,232,.78);
  font-size: 1rem; line-height: 1.65; margin: 0; max-width: 42ch;
}
.ng-about .abx-btn{
  flex: 0 0 auto;
  display: inline-flex; align-items: center;
  background: var(--ax-cta); color: #fff;
  font-family: var(--ax-sans); font-weight: 600; font-size: 1rem;
  padding: 15px 30px; border-radius: 10px;
  text-decoration: none; white-space: nowrap;
  transition: background .2s ease, transform .2s ease;
}
.ng-about .abx-btn:hover{ background: var(--ax-cta-h); transform: translateY(-2px); }
`;