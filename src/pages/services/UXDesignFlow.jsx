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

const TOTAL = STAGES.length;
const STAGE_MS = 4500;

function stageClass(index, activeIndex, previousIndex) {
  if (index === activeIndex) return ' is-active';
  if (index === previousIndex) return ' is-leaving';
  return '';
}

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

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

export default function UXDesignFlow() {
  const [{ activeIndex, previousIndex }, setStage] = useState({ activeIndex: 0, previousIndex: -1 });
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(sectionRef);

  const goTo = (index) => {
    if (index === activeIndex) return;
    setStage({ activeIndex: index, previousIndex: activeIndex });
  };

  useEffect(() => {
    if (reduced || !inView) return undefined;
    const t = setTimeout(() => {
      setStage({ activeIndex: (activeIndex + 1) % TOTAL, previousIndex: activeIndex });
    }, STAGE_MS);
    return () => clearTimeout(t);
  }, [activeIndex, inView, reduced]);

  useEffect(() => {
    const list = tabsRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const item = list.children[activeIndex];
    if (!item) return;
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [activeIndex, reduced]);

  return (
    <section className="uxp-section" ref={sectionRef} aria-labelledby="uxp-title">
      <div className="uxp-wrap">

        <header className="uxp-head">
          <div className="uxp-eyebrow">Our Design Process</div>
          <h2 className="uxp-h2" id="uxp-title">
            How we turn an idea into a<br /><em>polished digital experience</em>
          </h2>
          <p className="uxp-lead">
            A structured process from understanding the problem to refining the final interface.
          </p>
        </header>

        <div className="uxp-flow">

          {/* Left: stage copy */}
          <div className="uxp-stages" aria-live="polite" aria-atomic="true">
            {STAGES.map((s, i) => (
              <div
                key={s.num}
                className={`uxp-stage${stageClass(i, activeIndex, previousIndex)}`}
                aria-hidden={i !== activeIndex}
              >
                <span className="uxp-stage-meta"><b>{s.num}</b> {s.nav.toUpperCase()}</span>
                <h3 className="uxp-stage-heading">{s.title}</h3>
                <p className="uxp-stage-sub">{s.subtitle.toUpperCase()}</p>
                <p className="uxp-stage-desc">{s.body}</p>
                <ul className="uxp-stage-points">
                  {s.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* Right: process image */}
          <div className="uxp-visual">
            {STAGES.map((s, i) => (
              <div
                key={s.num}
                className={`uxp-layer${stageClass(i, activeIndex, previousIndex)}`}
                aria-hidden={i !== activeIndex}
              >
                <img
                  src={s.image}
                  alt={s.alt}
                  className="uxp-img"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>

          {/* Step navigation tabs */}
          <ol
            className="uxp-tabs"
            aria-label="Design process steps"
            ref={tabsRef}
          >
            {STAGES.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={s.num} className={isActive ? 'is-active' : undefined}>
                  <button
                    type="button"
                    aria-current={isActive ? 'step' : undefined}
                    onClick={() => goTo(i)}
                  >
                    <span className="uxp-tab-num">{s.num}</span>
                    <span className="uxp-tab-name">{s.nav}</span>
                  </button>
                </li>
              );
            })}
          </ol>

        </div>
      </div>
    </section>
  );
}
