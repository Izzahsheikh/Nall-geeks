import { useEffect, useRef } from 'react';

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
          paths.forEach((p, i) => {
            if (!p) return;
            setTimeout(() => {
              p.style.transition = 'stroke-dashoffset 1s ease';
              p.style.strokeDashoffset = '0';
            }, i * 120);
          });
          setTimeout(() => {
            paths.forEach((p) => {
              if (p) p.style.animation = 'pathPulse 3s ease-in-out infinite';
            });
          }, paths.length * 120 + 1100);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  const handleEnter = (idx) => {
    pathRefs.current.forEach((p, i) => {
      if (!p) return;
      if (i === idx) {
        p.style.stroke = 'rgba(242,154,74,0.75)';
        p.style.strokeWidth = '2';
      } else {
        p.style.opacity = '0.25';
      }
    });
  };

  const handleLeave = () => {
    pathRefs.current.forEach((p) => {
      if (!p) return;
      p.style.stroke = 'rgba(242,154,74,0.75)';
      p.style.strokeWidth = '1.2';
      p.style.opacity = '1';
    });
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

        <div className="services-hub">
          <div className="services-badge-wrap reveal visible">
            <div className="services-badge">
              <img
                src="/uploads/PHOTO-2026-08-03-21-23-52.jpg"
                alt="NG"
                onError={(e) => {
                  e.currentTarget.outerHTML =
                    '<span style="font-family:Cormorant Garamond,serif;font-weight:800;font-size:1.1rem;color:#F8F4EF">NG</span>';
                }}
              />
            </div>
          </div>

          <svg className="services-svg" viewBox="0 0 1100 210" preserveAspectRatio="xMidYMid meet">
            {PATH_X.map((x, i) => (
              <path
                key={i}
                ref={(el) => (pathRefs.current[i] = el)}
                d={`M 550,20 C 550,110 ${x},110 ${x},195`}
                fill="none"
                stroke="rgba(242,154,74,0.45)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
          </svg>

          <div className="svc-row">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className="svc-card reveal visible"
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
