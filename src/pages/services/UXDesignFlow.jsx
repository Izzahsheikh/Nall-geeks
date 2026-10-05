import { useEffect, useRef, useState } from 'react';
import './uxflow.css';

const STAGES = [
  {
    num: '01',
    nav: 'Research',
    title: 'Research',
    subtitle: 'Understand before we design',
    body: 'We begin by understanding the business, its users and the problems the product needs to solve.',
    points: ['Business goals', 'User needs', 'Problems to solve'],
    image: '/images/services/UiUx/research.png',
    alt: 'Research documentation and findings',
  },
  {
    num: '02',
    nav: 'Persona',
    title: 'User Persona',
    subtitle: 'Design around real users',
    body: 'Research is translated into a focused user profile so decisions are based on actual needs instead of assumptions.',
    points: ['Goals', 'Needs', 'Behaviour'],
    image: '/images/services/UiUx/persona.png',
    alt: 'User persona document',
  },
  {
    num: '03',
    nav: 'Structure',
    title: 'Structure',
    subtitle: 'Shape the experience',
    body: 'We organise pages, hierarchy and user journeys before working on the interface itself.',
    points: ['Information architecture', 'Navigation', 'User journey'],
    image: '/images/services/UiUx/architeture.png',
    alt: 'Information architecture and site structure diagram',
  },
  {
    num: '04',
    nav: 'Wireframe',
    title: 'Wireframe',
    subtitle: 'Plan before polishing',
    body: 'We define layout, content hierarchy and interaction patterns without distracting visual styling.',
    points: ['Layout', 'Hierarchy', 'Key interactions'],
    image: '/images/services/UiUx/wireframe.png',
    alt: 'Low-fidelity wireframe screens',
  },
  {
    num: '05',
    nav: 'Prototype',
    title: 'Prototype',
    subtitle: 'Turn screens into an experience',
    body: 'Key screens are connected so the flow and interactions can be reviewed before final refinement.',
    points: ['Navigation', 'Interactions', 'Flow testing'],
    image: '/images/services/UiUx/prototye.png',
    alt: 'Interactive prototype screens',
  },
  {
    num: '06',
    nav: 'Refine',
    title: 'Final Refinement',
    subtitle: 'Polish every detail',
    body: 'After validating the structure and flow, the interface is refined into the finished product.',
    points: ['Visual polish', 'Consistency', 'Final experience'],
    image: '/images/services/UiUx/GoGo Tyres Website Journey.png',
    alt: 'Final refined design — GoGo Tyres website',
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

export default function UXDesignFlow() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabShown, setTabShown] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const h = () => setTabShown(!document.hidden);
    document.addEventListener('visibilitychange', h);
    return () => document.removeEventListener('visibilitychange', h);
  }, []);

  useEffect(() => {
    if (!visible || !tabShown || held || reduced) return undefined;
    const t = setTimeout(() => setActive((a) => (a + 1) % STAGES.length), 4500);
    return () => clearTimeout(t);
  }, [visible, tabShown, held, reduced, active]);

  return (
    <section
      className="uxf-section"
      ref={sectionRef}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      <div className="uxf-wrap">

        {/* heading */}
        <header className="uxf-head">
          <div className="uxf-eyebrow">Our Design Process</div>
          <h2 className="uxf-h2">
            How we turn an idea into a<br />
            <em>polished digital experience</em>
          </h2>
          <p className="uxf-lead">
            A structured process from understanding the problem to refining the final interface.
          </p>
        </header>

        {/* progress nav */}
        <nav className="uxf-nav" aria-label="Design process steps">
          <div className="uxf-nav-line" aria-hidden="true" />
          {STAGES.map((s, i) => (
            <button
              key={s.num}
              type="button"
              className={`uxf-nav-item${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
              onClick={() => setActive(i)}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="uxf-nav-dot" aria-hidden="true" />
              <span className="uxf-nav-num">{s.num}</span>
              <span className="uxf-nav-label">{s.nav}</span>
            </button>
          ))}
        </nav>

        {/* body */}
        <div className="uxf-body">

          {/* left: step info — all items stacked, crossfade */}
          <div className="uxf-info" aria-live="polite" aria-atomic="true">
            {STAGES.map((s, i) => (
              <div
                key={s.num}
                className={`uxf-info-item${i === active ? ' is-active' : ''}`}
                aria-hidden={i !== active}
              >
                <span className="uxf-num">{s.num}</span>
                <h3 className="uxf-title">{s.title}</h3>
                <p className="uxf-subtitle">{s.subtitle}</p>
                <p className="uxf-body-text">{s.body}</p>
                <ul className="uxf-points">
                  {s.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* right: image — all items stacked, crossfade */}
          <div className="uxf-visual">
            {STAGES.map((s, i) => (
              <div
                key={s.num}
                className={`uxf-img-wrap${i === active ? ' is-active' : ''}`}
                aria-hidden={i !== active}
              >
                <img
                  src={s.image}
                  alt={s.alt}
                  className="uxf-img"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
