import { useEffect, useRef, useState } from 'react';
import logo from '../assets/nallgeeks-logo-ng-only.png';

const SERVICES = [
  { num: '01', icon: '</>', title: 'Web Development', desc: 'We write lean, fast code. No plugin bloat — just clean builds that load instantly.' },
  { num: '02', icon: '📱', title: 'Mobile Apps', desc: 'One codebase, two platforms. No lag, no glitches — just apps that work.' },
  { num: '03', icon: '🎨', title: 'UI/UX Design', desc: 'Design that earns trust before a single word is read.' },
  { num: '04', icon: '⊞', title: 'Custom Software', desc: 'Tools shaped around your workflow — not the other way around.' },
  { num: '05', icon: '☁', title: 'Cloud & DevOps', desc: 'Monitoring, auto-scaling, rollback before an outage — not after.' },
  { num: '06', icon: '🤖', title: 'AI & Automation', desc: 'Eliminate the repetitive. Build AI into your product or process.' },
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
          paths.forEach((p, i) => {
            if (!p) return;
            p.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease, stroke 0.35s ease, stroke-width 0.35s ease';
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

  const handleEnter = (idx) => {
    setActiveIdx(idx);
  };

  const handleLeave = () => {
    setActiveIdx(null);
  };

  return (
    <section id="services" className="services-section" ref={sectionRef}>
      <div className="section-inner">
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
              <img
                src={logo}
                alt="NallGeeks logo"
              />
            </div>
          </div>

          <svg className="services-svg" viewBox="0 0 1100 210" preserveAspectRatio="xMidYMid meet">
            {PATH_X.map((x, i) => {
              const pathState = activeIdx === i ? ' active' : activeIdx !== null ? ' muted' : '';
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
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
              >
                <div className="svc-card-top">
                  <span className="svc-num">{s.num}</span>
                  <span className="svc-icon">{s.icon}</span>
                </div>
                <div className="svc-title">{s.title}</div>
                <div className="svc-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
