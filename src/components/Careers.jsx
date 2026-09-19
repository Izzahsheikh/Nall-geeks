import { useEffect, useRef } from 'react';
import careerpageBg from '../assets/careerpageBackground.jpeg';
import { css } from './careers/styles';
import { INTERN_TRACKS, trackLabel, useOpenings, jobHref, applyHref } from './careers/shared';
import { PinIcon, BriefcaseIcon, ArrowIcon } from './careers/parts';

const HERO_STATS = [
  { value: '12+', label: 'Projects' },
  { value: '4', label: 'Countries' },
  { value: '100%', label: 'Remote' },
];

export default function Careers() {
  const { roles, internship, status: jobsStatus } = useOpenings();
  const pageRef = useRef(null);

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
  }, [jobsStatus, roles.length]);

  const scrollTo = (id) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main className="ng-careers" ref={pageRef} style={{ background: '#fff', paddingTop: 0 }}>
      <style>{css}</style>

      {/* ════════════════ HERO ════════════════ */}
      <section className="ngc-hero">
        <div className="ngc-hero-left">
          <div className="ngc-hero-content" data-reveal>
            <span className="ngc-tag">Join NallGeeks</span>

            <h1>
              Build work you're <em>proud</em> to put your name on.
            </h1>

            <p className="ngc-hero-lead">
              We're a small studio that designs and builds for clients who want
              work that actually holds up after launch.
            </p>

            <ul className="ngc-hero-stats">
              {HERO_STATS.map(({ value, label }) => (
                <li key={label}>
                  <strong>{value}</strong> {label}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="ngc-hero-scroll"
              onClick={() => scrollTo('#open-positions')}
            >
              View open positions
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1.5 7.5 7 13l5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="ngc-hero-right">
          <div className="ngc-hero-card" data-reveal>
            <img className="ngc-hero-img" src={careerpageBg} alt="" />
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
              No roles open right now — check back soon.
            </p>
          )}

          <div className="ngc-job-list">
            {roles.map((role) => (
              <article key={role.key} className="ngc-job-card" data-reveal>
                <div className="ngc-job-main">
                  <span className="ngc-job-dept">{role.department}</span>
                  <h3 className="ngc-job-title">
                    <a href={jobHref(role)} className="ngc-job-link">{role.title}</a>
                  </h3>
                  <div className="ngc-job-meta">
                    <span><PinIcon />{role.location}</span>
                    <span><BriefcaseIcon />{role.employment}</span>
                  </div>
                </div>
                <span className="ngc-job-arrow" aria-hidden="true"><ArrowIcon /></span>
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
                      onClick={() => window.location.assign(applyHref(internship, track.value))}
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
    </main>
  );
}
