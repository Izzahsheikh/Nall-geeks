import { useEffect, useRef, useState } from 'react';
import ServicePage from './ServicePage';
import heroImg from '../../assets/services/website.jpeg';

const steps = [
  {
    title: 'Discover',
    text: 'We learn the product, audience, business goals and current friction before designing solutions.',
    deliverables: ['Stakeholder notes', 'User needs', 'Pain points'],
  },
  {
    title: 'Define',
    text: 'We turn discovery into clear priorities so the interface supports the most important tasks first.',
    deliverables: ['User groups', 'Key tasks', 'Content priorities'],
  },
  {
    title: 'Structure',
    text: 'We map how information, actions and screens connect so the product feels predictable.',
    deliverables: ['User flows', 'Screen map', 'Information hierarchy'],
  },
  {
    title: 'Design',
    text: 'We create polished interface direction with typography, components, responsive layouts and states.',
    deliverables: ['High-fidelity screens', 'Component patterns', 'Responsive rules'],
  },
  {
    title: 'Validate',
    text: 'We review the experience against real tasks and refine details before development handoff.',
    deliverables: ['Clickable prototype', 'Design QA notes', 'Developer handoff'],
  },
];

const designServices = [
  ['websites', 'Websites', 'Clear, responsive experiences for modern businesses.'],
  ['apps', 'Web Apps', 'Interfaces for platforms and complex workflows.'],
  ['mobile', 'Mobile', 'Touch-first flows for smaller screens.'],
  ['dashboards', 'Dashboards', 'Data-heavy views with clear hierarchy.'],
  ['systems', 'Design Systems', 'Reusable standards for consistent products.'],
  ['redesign', 'Product Redesign', 'Simpler flows, clearer structure and better usability.'],
];

const deliverables = [
  'User flows',
  'Wireframes',
  'High-fidelity screens',
  'Clickable prototype',
  'Design system',
  'Developer handoff',
];

const PAGE_CSS = `
/* UI/UX Design page improvements.
   Every rule is prefixed with .ux2-page so it overrides App.css
   without touching the other service pages. */

/* ---------- Hero image (replaces the grey wireframe mockup) ---------- */
.ux2-page .ux2-hero-figure {
  margin: 0;
  width: 100%;
  max-width: 460px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  background: #1f2428;
  animation: ux2-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.ux2-page .ux2-hero-figure img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 11 / 8;
  object-fit: cover;
}

@keyframes ux2-rise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .ux2-page .ux2-hero-figure {
    max-width: 100%;
    margin-top: 32px;
  }
}

/* ---------- Process tabs ---------- */
.ux2-page .ux2-stepper {
  border: 1px solid #e8e1d9;
  border-radius: 16px;
  overflow: hidden;            /* keeps tab corners inside the rounded card */
  background: #fff;
}

.ux2-page .ux2-tabs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-bottom: 1px solid #e8e1d9;
  background: #fff;
}

.ux2-page .ux2-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 20px;
  border: 0;
  border-right: 1px solid #eee7df;
  border-radius: 0;
  background: transparent;
  color: #7a7a7a;
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  outline: none;               /* removes the orange box that stuck out */
  transition: background 0.2s ease, color 0.2s ease;
}

.ux2-page .ux2-tab:last-child { border-right: 0; }

.ux2-page .ux2-tab span {
  color: #b8b0a6;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
}

.ux2-page .ux2-tab:hover {
  background: #fbf7f3;
  color: #1f2428;
}

/* active tab: orange bar on the bottom, light warm background */
.ux2-page .ux2-tab[aria-selected='true'] {
  background: #fbf7f3;
  color: #1f2428;
}

.ux2-page .ux2-tab[aria-selected='true'] span { color: #e8742a; }

.ux2-page .ux2-tab[aria-selected='true']::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: #e8742a;
}

/* keyboard focus stays INSIDE the tab so it never overflows */
.ux2-page .ux2-tab:focus-visible {
  outline: 2px solid #e8742a;
  outline-offset: -3px;
}

/* ---------- Tab panel ---------- */
.ux2-page .ux2-panel[hidden] { display: none; }   /* hidden attr must win */

.ux2-page .ux2-panel {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: start;
  padding: 36px 32px;
  animation: ux2-fade 0.35s ease both;
}

.ux2-page .ux2-panel p {
  margin: 0;
  max-width: 520px;
  font-size: 1.05rem;
  line-height: 1.7;
  color: #4a4f55;
}

.ux2-page .ux2-panel ul {
  list-style: none;
  margin: 0;
  padding: 0 0 0 32px;
  border-left: 1px solid #eee7df;
  display: grid;
  gap: 14px;
}

.ux2-page .ux2-panel li {
  position: relative;
  padding-left: 26px;
  font-weight: 600;
  color: #1f2428;
}

.ux2-page .ux2-panel li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.35em;
  width: 10px;
  height: 6px;
  border-left: 2px solid #e8742a;
  border-bottom: 2px solid #e8742a;
  transform: rotate(-45deg);
}

@keyframes ux2-fade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .ux2-page .ux2-tabs {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .ux2-page .ux2-tab {
    flex: 0 0 150px;
    scroll-snap-align: start;
  }
  .ux2-page .ux2-panel {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 28px 22px;
  }
  .ux2-page .ux2-panel ul {
    padding: 20px 0 0;
    border-left: 0;
    border-top: 1px solid #eee7df;
  }
}

/* ---------- General polish ---------- */
.ux2-page .ux2-section { padding: 96px 0; }

@media (max-width: 700px) {
  .ux2-page .ux2-section { padding: 56px 0; }
}

.ux2-page .ux2-card {
  border: 1px solid #e8e1d9;
  border-radius: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ux2-page .ux2-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 36px rgba(31, 36, 40, 0.1);
}

/* ---------- Final CTA: white background, dark text, one orange word ---------- */
.ux2-page .ux2-final-cta {
  background: #fff;
  background-image: none;
  border-top: 1px solid #eee7df;
  padding: 96px 0;
}

.ux2-page .ux2-final-cta::before,
.ux2-page .ux2-final-cta::after { display: none; }

.ux2-page .ux2-final-cta h2 {
  color: #1f2428;
  max-width: 760px;
}

.ux2-page .ux2-final-cta h2 em {
  font-style: italic;
  color: #e8742a;
}

.ux2-page .ux2-final-cta p {
  color: #555;
  max-width: 560px;
}

@media (max-width: 700px) {
  .ux2-page .ux2-final-cta { padding: 56px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ux2-page .ux2-hero-figure,
  .ux2-page .ux2-panel { animation: none; }
  .ux2-page .ux2-card { transition: none; }
}
`;

function Section({ eyebrow, title, text, tone = 'light', children }) {
  return (
    <section className={`ux2-section ux2-section--${tone} ux2-reveal`}>
      <div className="sp-inner">
        <div className="ux2-section-head">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children }) {
  return <div className="ux2-eyebrow">{children}</div>;
}

function Icon({ name }) {
  return (
    <svg className="ux2-card-icon" viewBox="0 0 32 32" aria-hidden="true">
      {name === 'websites' && (
        <>
          <rect x="5" y="7" width="22" height="18" rx="3" />
          <path d="M5 12h22M10 18h7M10 22h11" />
        </>
      )}
      {name === 'apps' && (
        <>
          <rect x="6" y="7" width="20" height="18" rx="3" />
          <path d="M11 13h10M11 17h5M11 21h8M21 17h1" />
        </>
      )}
      {name === 'mobile' && (
        <>
          <rect x="10" y="5" width="12" height="22" rx="3" />
          <path d="M14 23h4M14 9h4" />
        </>
      )}
      {name === 'dashboards' && (
        <>
          <rect x="5" y="6" width="22" height="20" rx="3" />
          <path d="M10 12h5v5h-5zM18 12h4M18 16h4M10 21h12" />
        </>
      )}
      {name === 'systems' && (
        <>
          <rect x="6" y="7" width="8" height="8" rx="2" />
          <rect x="18" y="7" width="8" height="8" rx="2" />
          <rect x="6" y="19" width="8" height="6" rx="2" />
          <path d="M18 21h8M18 25h5" />
        </>
      )}
      {name === 'redesign' && (
        <>
          <path d="M8 20a8 8 0 0 1 12-10l2 2" />
          <path d="M24 12h-6V6" />
          <path d="M24 14a8 8 0 0 1-12 10l-2-2" />
          <path d="M8 22h6v4" />
        </>
      )}
    </svg>
  );
}

function Card({ icon, title, text }) {
  return (
    <article className="ux2-card">
      <Icon name={icon} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Stepper() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);

  const focusTab = (index) => {
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab((index + 1) % steps.length);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab((index - 1 + steps.length) % steps.length);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusTab(steps.length - 1);
    }
  };

  return (
    <div className="ux2-stepper">
      <div className="ux2-tabs" role="tablist" aria-label="UI/UX design process">
        {steps.map((step, index) => (
          <button
            ref={(node) => { tabRefs.current[index] = node; }}
            type="button"
            role="tab"
            id={`ux2-tab-${index}`}
            aria-selected={active === index}
            aria-controls={`ux2-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            className="ux2-tab"
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            key={step.title}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {step.title}
          </button>
        ))}
      </div>

      {steps.map((step, index) => (
        <div
          role="tabpanel"
          id={`ux2-panel-${index}`}
          aria-labelledby={`ux2-tab-${index}`}
          hidden={active !== index}
          className="ux2-panel"
          key={step.title}
        >
          <p>{step.text}</p>
          <ul aria-label={`${step.title} deliverables`}>
            {step.deliverables.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="ux2-flow" aria-label="Experience flow from entry to completion">
      <svg className="ux2-flow-svg ux2-flow-svg--desktop" viewBox="0 0 1120 320" role="img" aria-labelledby="ux2-flow-title">
        <title id="ux2-flow-title">Entry to complete experience flow</title>
        <defs>
          <marker id="ux2-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" />
          </marker>
        </defs>
        <g className="ux2-flow-lines">
          <path d="M140 132H200" />
          <path d="M340 132H400" />
          <path d="M540 132H600" />
          <path d="M720 132H780" />
          <path d="M900 132H960" />
          <path d="M660 168V224" />
          <path d="M740 256H780V132H720" />
        </g>
        <g className="ux2-flow-node">
          <rect x="20" y="96" width="120" height="72" rx="10" />
          <text x="80" y="138">Entry</text>
        </g>
        <g className="ux2-flow-node ux2-flow-node--key">
          <rect x="200" y="96" width="140" height="72" rx="10" />
          <text x="270" y="128">Primary</text>
          <text x="270" y="148">action</text>
        </g>
        <g className="ux2-flow-node">
          <rect x="400" y="96" width="140" height="72" rx="10" />
          <text x="470" y="128">Explore</text>
          <text x="470" y="148">Search</text>
        </g>
        <g className="ux2-flow-node">
          <rect x="600" y="96" width="120" height="72" rx="10" />
          <text x="660" y="138">Select</text>
        </g>
        <g className="ux2-flow-node">
          <rect x="780" y="96" width="120" height="72" rx="10" />
          <text x="840" y="138">Review</text>
        </g>
        <g className="ux2-flow-node">
          <rect x="580" y="224" width="160" height="64" rx="10" />
          <text x="660" y="262">Support info</text>
        </g>
        <g className="ux2-flow-node ux2-flow-node--key">
          <rect x="960" y="96" width="140" height="72" rx="10" />
          <text x="1030" y="138">Complete</text>
        </g>
      </svg>

      <svg className="ux2-flow-svg ux2-flow-svg--mobile" viewBox="0 0 360 640" role="img" aria-labelledby="ux2-flow-mobile-title">
        <title id="ux2-flow-mobile-title">Entry to complete experience flow</title>
        <defs>
          <marker id="ux2-arrow-mobile" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" />
          </marker>
        </defs>
        <g className="ux2-flow-lines ux2-flow-lines--mobile">
          <path d="M180 78V118" />
          <path d="M180 178V218" />
          <path d="M180 278V318" />
          <path d="M180 378V418" />
          <path d="M180 478V518" />
          <path d="M236 350H306V450H236" />
        </g>
        {[
          ['Entry', 34],
          ['Primary action', 134, true],
          ['Explore', 234],
          ['Select', 334],
          ['Review', 434],
          ['Complete', 534, true],
        ].map(([label, y, key]) => (
          <g className={`ux2-flow-node${key ? ' ux2-flow-node--key' : ''}`} key={label}>
            <rect x="84" y={y} width="192" height="56" rx="10" />
            <text x="180" y={Number(y) + 35}>{label}</text>
          </g>
        ))}
        <g className="ux2-flow-node">
          <rect x="222" y="394" width="120" height="56" rx="10" />
          <text x="282" y="418">Support</text>
          <text x="282" y="438">info</text>
        </g>
      </svg>
      <p>We use structure to clarify the main path, then add support only where people need help making a decision.</p>
    </div>
  );
}

/* Replaces the old grey wireframe mockup with the real website screenshot. */
function HeroImage() {
  return (
    <figure className="ux2-hero-figure">
      <img
        src={heroImg}
        alt="A website interface designed by NallGeeks"
        width="880"
        height="640"
        fetchpriority="high"
        decoding="async"
      />
    </figure>
  );
}

function HeroActions() {
  return (
    <>
      <a className="ux2-hero-btn" href="/contact">Book a Call</a>
      <a className="ux2-hero-link" href="/projects">See our work</a>
    </>
  );
}

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.ux2-reveal'));
    if (!elements.length) return undefined;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export default function UIUXDesign() {
  useReveal();

  return (
    <ServicePage
      title="UI/UX Design"
      description="We design clear, intuitive digital experiences built around how people actually think, navigate and interact."
      pageClassName="sp--uiux-design ux2-page"
      heroActions={<HeroActions />}
      heroAside={<HeroImage />}
      hideWork
      hideCta
    >
      <style>{PAGE_CSS}</style>

      <Section
        eyebrow="Process"
        title="A focused path from problem to polished interface."
        text="Each phase reduces uncertainty: first we understand the work, then we shape the flow, design the interface and validate the result."
      >
        <Stepper />
      </Section>

      <Section
        eyebrow="Structure"
        title="How we structure experiences"
        text="A product should make the primary path obvious while keeping supporting information close enough to help."
        tone="soft"
      >
        <FlowDiagram />
      </Section>

      <Section
        eyebrow="Capabilities"
        title="What we design"
        text="Interface design for the digital products and service experiences your team needs to launch, improve or scale."
      >
        <div className="ux2-card-grid">
          {designServices.map(([icon, title, text]) => (
            <Card icon={icon} title={title} text={text} key={title} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Deliverables"
        title="What you get"
        text="Clear design assets your team can review, build from and continue using after handoff."
        tone="soft"
      >
        <ul className="ux2-deliverables">
          {deliverables.map((item) => (
            <li key={item}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4.5 10.5 8.2 14 15.8 6" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <section className="ux2-final-cta ux2-reveal">
        <div className="sp-inner">
          <h2>Design the product your users can understand <em>quickly.</em></h2>
          <p>Tell us what you are building and we will help shape a clearer, calmer experience.</p>
          <a href="/contact">Book a Call</a>
        </div>
      </section>
    </ServicePage>
  );
}