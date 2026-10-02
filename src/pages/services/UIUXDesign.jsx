import ServicePage from './ServicePage';

const processSteps = [
  ['01', 'Discover'],
  ['02', 'Define'],
  ['03', 'Structure'],
  ['04', 'Design'],
  ['05', 'Validate'],
];

const discoveryColumns = [
  {
    title: 'What we understand',
    items: ['User needs', 'Business goals', 'Existing pain points', 'Behaviour patterns', 'Product requirements'],
  },
  {
    title: 'What this helps us define',
    items: ['Primary user groups', 'Key tasks', 'Experience priorities', 'Content hierarchy', 'Design direction'],
  },
];

const structureItems = [
  {
    title: 'Structure',
    items: [
      ['01', 'Information hierarchy', 'Organising content based on importance and user intent.'],
      ['02', 'Interaction patterns', 'Defining predictable ways users navigate and complete actions.'],
      ['03', 'Responsive behaviour', 'Planning how layouts adapt across different screen sizes.'],
    ],
  },
  {
    title: 'Visual Design',
    items: [
      ['01', 'Typography', 'Clear hierarchy and readable content.'],
      ['02', 'Colour & contrast', 'Purposeful colour choices that support usability and brand identity.'],
      ['03', 'Components', 'Reusable interface elements that create consistency across the product.'],
      ['04', 'States & feedback', 'Clear hover, active, loading, error and success behaviour.'],
    ],
  },
];

const capabilities = [
  ['Websites', 'Clear, responsive experiences for modern businesses and services.'],
  ['Web Applications', 'Interfaces for dashboards, platforms and complex digital workflows.'],
  ['Mobile Experiences', 'User-focused interfaces designed around smaller screens and touch interactions.'],
  ['Dashboards', 'Structured data-heavy interfaces with clear hierarchy and navigation.'],
  ['Design Systems', 'Reusable components, typography, spacing and interaction standards.'],
  ['Product Redesign', 'Improving existing products by simplifying flows, hierarchy and usability.'],
];

function SectionHeader({ eyebrow, number, title, description }) {
  return (
    <div className="ux-section-header">
      {(eyebrow || number) && <div className="sp-label">{eyebrow || number}</div>}
      <h2 className="sp-subtitle">{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function FlowNode({ children, accent = false }) {
  return <div className={`ux-flow-node${accent ? ' ux-flow-node--accent' : ''}`}>{children}</div>;
}

function FlowConnector({ branch = false }) {
  return <span className={`ux-flow-connector${branch ? ' ux-flow-connector--branch' : ''}`} aria-hidden="true"></span>;
}

export default function UIUXDesign() {
  return (
    <ServicePage
      title="UI/UX Design"
      description="We design clear, intuitive digital experiences built around how people actually think, navigate and interact."
      pageClassName="sp--uiux-design"
      hideWork
      hideCta
    >
      <div className="ux-page">
        <section className="ux-process">
          <div className="sp-inner">
            <SectionHeader
              eyebrow="OUR PROCESS"
              title="From understanding the problem to designing the experience."
              description="Our process combines research, structure, interaction and visual design to create digital products that are useful, intuitive and ready to build."
            />

            <ol className="ux-process-track" aria-label="UI/UX design process">
              {processSteps.map(([number, label]) => (
                <li key={number}>
                  <span>{number}</span>
                  <strong>{label}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ux-section ux-section--discover">
          <div className="sp-inner">
            <SectionHeader
              title="Discover & Define"
              description="We start by understanding the product, its users, business requirements and the problems the experience needs to solve."
            />
            <div className="ux-discovery-grid">
              {discoveryColumns.map((column) => (
                <div className="ux-list-block" key={column.title}>
                  <h3>{column.title}</h3>
                  <ul>
                    {column.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ux-section ux-section--structure">
          <div className="sp-inner">
            <SectionHeader
              number="02"
              title="Structure the Experience"
              description="Before designing individual screens, we define how information, actions and screens connect across the product."
            />
            <div className="ux-product-flow" aria-label="Product experience flow">
              <div className="ux-product-flow-main">
                <FlowNode>Entry</FlowNode>
                <FlowConnector />
                <FlowNode accent>Primary Action</FlowNode>
                <FlowConnector />
                <FlowNode>Explore / Search</FlowNode>
                <FlowConnector />
                <FlowNode>Select</FlowNode>
                <FlowConnector />
                <FlowNode>Review</FlowNode>
                <FlowConnector />
                <FlowNode accent>Complete</FlowNode>
              </div>
              <div className="ux-product-flow-branch">
                <FlowConnector branch />
                <FlowNode>Support information</FlowNode>
                <FlowConnector />
                <FlowNode>Return to selection</FlowNode>
              </div>
            </div>
          </div>
        </section>

        <section className="ux-section ux-section--interface">
          <div className="sp-inner">
            <SectionHeader
              number="03"
              title="From Structure to Interface"
              description="Once the experience is clear, we translate it into a visual system that makes every screen consistent, understandable and easy to use."
            />
            <div className="ux-interface-grid">
              {structureItems.map((group) => (
                <div className="ux-interface-column" key={group.title}>
                  <h3>{group.title}</h3>
                  <div>
                    {group.items.map(([number, title, description]) => (
                      <article key={title}>
                        <span>{number}</span>
                        <div>
                          <h4>{title}</h4>
                          <p>{description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ux-section ux-section--capabilities">
          <div className="sp-inner">
            <SectionHeader eyebrow="CAPABILITIES" title="What we design" />
            <div className="ux-capabilities-grid">
              {capabilities.map(([title, description]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ux-final">
          <div className="sp-inner">
            <div className="ux-final-inner">
              <h2>Design that makes the product easier to use.</h2>
              <p>Good interface design should reduce friction, clarify decisions and make complex products feel simple.</p>
              <a href="/contact">Discuss your project</a>
            </div>
          </div>
        </section>
      </div>
    </ServicePage>
  );
}
