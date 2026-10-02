import ServicePage from './ServicePage';

const processSteps = [
  ['01', 'Research'],
  ['02', 'Persona'],
  ['03', 'User Flow'],
  ['04', 'Wireframes'],
  ['05', 'Interface'],
];

const researchColumns = [
  {
    title: 'User Needs',
    items: ['Clear navigation', 'Relevant information', 'Simple interactions'],
  },
  {
    title: 'Pain Points',
    items: ['Complex journeys', 'Unclear actions', 'Information overload'],
  },
];

const personaGroups = [
  {
    title: 'Goals',
    items: ['Complete tasks efficiently', 'Find relevant information', 'Make decisions confidently'],
  },
  {
    title: 'Needs',
    items: ['Clarity', 'Speed', 'Control'],
  },
  {
    title: 'Frustrations',
    items: ['Too many steps', 'Unclear actions', 'Poor information hierarchy'],
  },
];

const wireframes = [
  { number: '01', title: 'Explore' },
  { number: '02', title: 'Results' },
  { number: '03', title: 'Details' },
];

function UiuxSection({ number, title, description, children }) {
  return (
    <section className="ux-section" aria-labelledby={`ux-section-${number}`}>
      <div className="ux-section-head">
        <span>{number}</span>
        <div>
          <h3 id={`ux-section-${number}`}>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Wireframe({ number, title }) {
  return (
    <article className="ux-wireframe">
      <div className="ux-wireframe-top">
        <span>{number}</span>
        <strong>{title}</strong>
      </div>
      <div className="ux-wireframe-nav">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="ux-wireframe-hero">
        <span></span>
        <span></span>
      </div>
      <div className="ux-wireframe-grid">
        <span></span>
        <span></span>
      </div>
      <div className="ux-wireframe-lines">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="ux-wireframe-form">
        <span></span>
        <span></span>
      </div>
    </article>
  );
}

export default function UIUXDesign() {
  return (
    <ServicePage
      title="UI/UX Design"
      description="We create interfaces that make people feel at ease the moment they land on them. Every layout, every interaction and every detail is designed around how real people actually use things."
      pageClassName="sp--uiux-design"
      hideWork
      hideCta
    >
      <section className="ux-process" aria-labelledby="ux-process-title">
        <div className="sp-inner">
          <div className="sp-label">Our Process</div>
          <h2 className="sp-subtitle" id="ux-process-title">How we approach UI/UX design</h2>
          <p className="ux-process-intro">
            We follow a structured design process that turns user needs and product requirements into clear, functional digital experiences.
          </p>

          <ol className="ux-process-track" aria-label="UI/UX design process">
            {processSteps.map(([number, label]) => (
              <li key={number}>
                <span>{number}</span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>

          <UiuxSection
            number="01"
            title="Research & Discovery"
            description="We begin by understanding the product, its users and the problems the experience needs to solve."
          >
            <div className="ux-research-grid">
              {researchColumns.map((column) => (
                <div className="ux-list-block" key={column.title}>
                  <h4>{column.title}</h4>
                  <ul>
                    {column.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </UiuxSection>

          <UiuxSection
            number="02"
            title="User Persona"
            description="Research helps us define the needs, goals and behaviours that should guide design decisions."
          >
            <div className="ux-persona">
              <div className="ux-persona-label">Primary User</div>
              <div className="ux-persona-grid">
                {personaGroups.map((group) => (
                  <div className="ux-list-block" key={group.title}>
                    <h4>{group.title}</h4>
                    <ul>
                      {group.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </UiuxSection>

          <UiuxSection
            number="03"
            title="User Flow"
            description="We map the steps users take to complete their main goal before designing individual screens."
          >
            <div className="ux-flow" aria-label="Start, explore, select, enough information decision, details or review, complete">
              <div className="ux-flow-node ux-flow-start">Start</div>
              <div className="ux-flow-line"></div>
              <div className="ux-flow-node">Explore</div>
              <div className="ux-flow-line"></div>
              <div className="ux-flow-node ux-flow-key">Select</div>
              <div className="ux-flow-line"></div>
              <div className="ux-flow-decision">Enough information?</div>
              <div className="ux-flow-split">
                <div className="ux-flow-branch">
                  <span>No</span>
                  <div className="ux-flow-line"></div>
                  <div className="ux-flow-node">Details</div>
                </div>
                <div className="ux-flow-branch">
                  <span>Yes</span>
                  <div className="ux-flow-line"></div>
                  <div className="ux-flow-node">Review</div>
                </div>
              </div>
              <div className="ux-flow-join"></div>
              <div className="ux-flow-node ux-flow-key">Complete</div>
            </div>
          </UiuxSection>

          <UiuxSection
            number="04"
            title="Wireframes"
            description="We establish layout, hierarchy and interaction before applying the final visual design."
          >
            <div className="ux-wireframes">
              {wireframes.map((wireframe) => (
                <Wireframe key={wireframe.number} {...wireframe} />
              ))}
            </div>
          </UiuxSection>

          <UiuxSection
            number="05"
            title="Interface Design"
            description="Once the structure is validated, we apply typography, spacing, colour and interaction patterns to create the final interface."
          >
            <div className="ux-interface">
              <div className="ux-interface-stage">
                <span>Wireframe</span>
                <div className="ux-interface-wire">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="ux-interface-arrow" aria-hidden="true"></div>
              <div className="ux-interface-stage">
                <span>Final Interface</span>
                <div className="ux-final-screen">
                  <div className="ux-final-top"></div>
                  <div className="ux-final-title"></div>
                  <div className="ux-final-copy"></div>
                  <div className="ux-final-grid">
                    <span></span>
                    <span></span>
                  </div>
                  <div className="ux-final-action"></div>
                </div>
              </div>
            </div>
          </UiuxSection>
        </div>
      </section>
    </ServicePage>
  );
}
