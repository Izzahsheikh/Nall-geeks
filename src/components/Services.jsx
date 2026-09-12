import { useEffect, useRef, useState } from 'react';
import logo from '../assets/nallgeeks-logo-mark.png';

const SERVICES = [
  {
    num: '01',
    icon: '</>',
    label: 'WEB DEVELOPMENT',
    title: 'Fast, resilient web platforms built to scale.',
    desc: 'We engineer performant web applications using clean architecture and modern technology stacks. From initial build to production launch, we focus on responsive execution, lean codebases, and long-term maintainability.',
    cta: 'View projects →',
  },
  {
    num: '02',
    icon: '📱',
    label: 'MOBILE APPS',
    title: 'Native-grade mobile applications for iOS and Android.',
    desc: 'We build fluid, reliable mobile products optimised for real-world performance. Combining responsive UI design with solid system architecture, we deliver apps that launch fast, run smoothly, and adapt to every screen size.',
    cta: 'View projects →',
  },
  {
    num: '03',
    icon: '🎨',
    label: 'UI / UX DESIGN',
    title: 'Thoughtful interface design centred on user clarity and function.',
    desc: 'Visual design sets expectations, but workflow structure determines retention. We map complex systems into intuitive user journeys, building unified design systems that reduce friction and elevate product usability.',
    cta: 'View projects →',
  },
  {
    num: '04',
    icon: '⊞',
    label: 'SOFTWARE MANAGEMENT',
    title: 'End-to-end platform care, proactive maintenance, and infrastructure stability.',
    desc: 'Long-term software health demands continuous oversight. We manage performance monitoring, routine security patches, infrastructure updates, and system scaling so your platform stays secure, reliable, and online around the clock.',
    cta: 'View projects →',
  },
  {
    num: '05',
    icon: '🔍',
    label: 'SEARCH ENGINE OPTIMISATION',
    title: 'Rank higher, get found faster, and stay visible.',
    desc: 'We optimise your site for the search engines that drive real traffic — refining technical foundations, content architecture, and authority signals to move you up the rankings and keep you there.',
    cta: 'View projects →',
  },
  {
    num: '06',
    icon: '🤖',
    label: 'AI & AUTOMATION',
    title: 'Eliminate the repetitive. Build intelligence into your product.',
    desc: 'We design and integrate AI-driven workflows that reduce manual load and surface smarter decisions. Whether embedded in your product or wired into your processes, automation compounds — the earlier you start, the more you gain.',
    cta: 'View projects →',
  },
];

const PATH_X = [90, 275, 457, 643, 825, 1010];

export default function Services() {
  const sectionRef = useRef(null);
  const pathRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    const paths = pathRefs.current;
    paths.forEach((p) => {
      if (!p) return;
      try {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
      } catch {
        p.style.strokeDasharray = '600';
        p.style.strokeDashoffset = '600';
      }
    });

    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          paths.forEach((p) => {
            if (!p) return;
            p.style.transition =
              'stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease, stroke 0.35s ease, stroke-width 0.35s ease';
            p.style.strokeDashoffset = '0';
            p.style.animation = 'pathPulse 3.8s ease-in-out infinite';
          });
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" className="services-section" ref={sectionRef}>
      <div className="section-inner">

        {/* ── Hub diagram (unchanged structure) ── */}
        <div className="section-head reveal visible">
          <div className="section-eyebrow">What We Do</div>
          <h2>
            From idea to interface,
            <br />
            one team does it all.
          </h2>
        </div>

        <div className={`services-hub${isVisible ? ' is-visible' : ''}`}>
          <div className="services-badge-wrap">
            <div className="services-badge">
              <img src={logo} alt="NallGeeks logo" />
            </div>
          </div>

          <svg
            className="services-svg"
            viewBox="0 0 1100 210"
            preserveAspectRatio="xMidYMid meet"
          >
            {PATH_X.map((x, i) => {
              const pathState =
                activeIdx === i ? ' active' : activeIdx !== null ? ' muted' : '';
              const d = `M 550,20 C 550,110 ${x},110 ${x},195`;
              return (
                <g key={i}>
                  <path
                    className={`service-path-glow${pathState}`}
                    d={d}
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    ref={(el) => (pathRefs.current[i] = el)}
                    className={`service-path${pathState}`}
                    d={d}
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    className={`service-path-flow${pathState}`}
                    d={d}
                    fill="none"
                    strokeLinecap="round"
                    style={{ '--path-index': i, '--path-delay': `${i * 0.28}s` }}
                  />
                </g>
              );
            })}
          </svg>

          <div className="svc-row">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className={`svc-card${isVisible ? ' is-visible' : ''}${activeIdx === i ? ' active' : ''}`}
                style={{ '--svc-index': i }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <div className="svc-card-top">
                  <span className="svc-num">{s.num}</span>
                  <span className="svc-icon">{s.icon}</span>
                </div>
                <div className="svc-title">{s.title.split('.')[0]}.</div>
                <div className="svc-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detailed service feature rows ── */}
        <div className="svc-features">
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              className={`svc-feature-row${i % 2 === 1 ? ' svc-feature-row--reverse' : ''}`}
            >
              {/* Text side */}
              <div className="svc-feature-text">
                <p className="svc-feature-label">{s.label}</p>
                <h3 className="svc-feature-heading">{s.title}</h3>
                <p className="svc-feature-body">{s.desc}</p>
                <a href="#projects" className="svc-feature-cta">{s.cta}</a>
              </div>

              {/* Visual side — placeholder replaced per brief */}
              <div className="svc-feature-visual svc-feature-visual--placeholder">
                <div className="svc-visual-inner">
                  <span className="svc-visual-icon">{s.icon}</span>
                  <span className="svc-visual-num">{s.num}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Typography + feature-row styles ── */}
      <style>{`
        /* ── Google Fonts import ── */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap');

        .services-section {
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Section head */
        .section-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent, #f97316);
          margin-bottom: 1rem;
        }

        .section-head h2 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--text-primary, #0f0f0f);
        }

        /* ── Card grid labels / titles ── */
        .svc-num {
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--accent, #f97316);
          opacity: 0.8;
        }

        .svc-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(0.88rem, 1.1vw, 1rem);
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: var(--text-primary, #0f0f0f);
          margin-top: 0.5rem;
        }

        .svc-desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          line-height: 1.65;
          color: var(--text-secondary, #555);
          margin-top: 0.5rem;
        }

        /* ── Feature rows ── */
        .svc-features {
          margin-top: 6rem;
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        .svc-feature-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .svc-feature-row--reverse {
          direction: rtl;
        }

        .svc-feature-row--reverse > * {
          direction: ltr;
        }

        .svc-feature-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent, #f97316);
          margin: 0 0 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .svc-feature-label::before {
          content: '';
          display: inline-block;
          width: 1.5rem;
          height: 2px;
          background: var(--accent, #f97316);
          border-radius: 2px;
          flex-shrink: 0;
        }

        .svc-feature-heading {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.5rem, 2.5vw, 2.1rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
          color: var(--text-primary, #0f0f0f);
          margin: 0 0 1.25rem;
          max-width: 22ch;
        }

        .svc-feature-body {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.75;
          color: var(--text-secondary, #4b4b4b);
          margin: 0 0 2rem;
          max-width: 52ch;
        }

        .svc-feature-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary, #0f0f0f);
          text-decoration: none;
          border: 1.5px solid var(--border, #d1d5db);
          border-radius: 100px;
          padding: 0.6rem 1.4rem;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }

        .svc-feature-cta:hover {
          border-color: var(--accent, #f97316);
          color: var(--accent, #f97316);
          background: rgba(249,115,22,0.04);
        }

        /* ── Visual placeholder ── */
        .svc-feature-visual--placeholder {
          background: linear-gradient(135deg, #f5f5f5 0%, #ebebeb 100%);
          border-radius: 16px;
          aspect-ratio: 16 / 10;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
          position: relative;
        }

        .svc-feature-visual--placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 24px,
            rgba(0,0,0,0.025) 24px,
            rgba(0,0,0,0.025) 25px
          );
        }

        .svc-visual-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .svc-visual-icon {
          font-size: 2.5rem;
          opacity: 0.35;
          line-height: 1;
        }

        .svc-visual-num {
          font-family: 'Sora', sans-serif;
          font-size: 4rem;
          font-weight: 700;
          color: #0f0f0f;
          opacity: 0.07;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .svc-feature-row,
          .svc-feature-row--reverse {
            grid-template-columns: 1fr;
            direction: ltr;
            gap: 2rem;
          }

          .svc-features {
            gap: 4rem;
          }

          .svc-feature-visual--placeholder {
            aspect-ratio: 16 / 7;
          }
        }

        @media (max-width: 600px) {
          .svc-feature-heading {
            font-size: 1.4rem;
          }

          .svc-feature-body {
            font-size: 0.94rem;
          }
        }
      `}</style>
    </section>
  );
}