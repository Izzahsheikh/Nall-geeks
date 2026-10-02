import ServicePage from './ServicePage';

const systems = [
  {
    number: '01',
    shortName: 'CRM',
    name: 'Customer Relationship Management',
    description: 'Keep customer information, conversations, leads and sales activity organised in one place.',
    capabilities: ['Customer records', 'Lead management', 'Sales pipeline', 'Follow-ups & activity'],
  },
  {
    number: '02',
    shortName: 'POS',
    name: 'Point of Sale',
    description: 'Manage everyday sales, products and transactions through a system designed around your business.',
    capabilities: ['Sales processing', 'Product management', 'Inventory updates', 'Transaction records'],
  },
  {
    number: '03',
    shortName: 'ERP',
    name: 'Enterprise Resource Planning',
    description: 'Bring important business operations together so teams can work with consistent information across departments.',
    capabilities: ['Operations', 'Inventory', 'Finance workflows', 'Reporting'],
  },
];

const approachSteps = [
  ['01', 'Understand', 'Business requirements and existing workflows'],
  ['02', 'Structure', 'Features, roles and information architecture'],
  ['03', 'Build', 'Interfaces and system functionality'],
  ['04', 'Refine', 'Review, test and improve'],
];

const workflowSteps = [
  'Customer enquiry',
  'CRM record',
  'Quote / Order',
  'Sale',
  'Inventory updated',
  'Business record',
  'Reporting',
];

const workflowPrinciples = [
  ['WORKFLOWS', 'Processes designed around how your team operates.'],
  ['ROLES', 'Access and permissions based on responsibilities.'],
  ['INFORMATION', 'The data your team actually needs to work with.'],
  ['GROWTH', 'A structure that can evolve as requirements change.'],
];

function SoftwareSection({ eyebrow, title, description, children, className = '' }) {
  return (
    <section className={`sm-section${className ? ` ${className}` : ''}`}>
      <div className="sp-inner">
        {eyebrow && <div className="sp-label">{eyebrow}</div>}
        <h2 className="sp-subtitle">{title}</h2>
        {description && <p className="sm-section-intro">{description}</p>}
        {children}
      </div>
    </section>
  );
}

function DiagramNode({ children, accent = false }) {
  return <div className={`sm-diagram-node${accent ? ' sm-diagram-node--accent' : ''}`}>{children}</div>;
}

export default function SoftwareManagement() {
  return (
    <ServicePage
      title="Custom Business Software"
      description="We design software around the way your business actually works — connecting customers, sales, operations and internal processes in one clear system."
      pageClassName="sp--software-management"
      hideWork
      hideCta
    >
      <div className="sm-page">
        <SoftwareSection
          eyebrow="WHAT WE BUILD"
          title="Systems built around your operations"
          description="From customer relationships to daily sales and internal operations, we build software around the processes your team already relies on."
          className="sm-section--build"
        >
          <div className="sm-systems-grid">
            {systems.map((system) => (
              <article className="sm-system" key={system.shortName}>
                <span className="sm-number">{system.number}</span>
                <h3>{system.shortName}</h3>
                <p className="sm-system-name">{system.name}</p>
                <p>{system.description}</p>
                <ul>
                  {system.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </SoftwareSection>

        <SoftwareSection
          eyebrow="CONNECTED OPERATIONS"
          title="One system, connected information"
          description="Business tools work better when information does not have to be entered, checked and managed in separate places."
        >
          <div className="sm-operations-diagram" aria-label="Conceptual connected operations diagram">
            <div className="sm-diagram-stack">
              <DiagramNode>Customers</DiagramNode>
              <span className="sm-line sm-line--vertical" aria-hidden="true"></span>
              <DiagramNode>CRM</DiagramNode>
              <span className="sm-line sm-line--vertical" aria-hidden="true"></span>
              <DiagramNode accent>Business System</DiagramNode>
            </div>
            <div className="sm-branch-lines" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="sm-branch-grid">
              <div>
                <DiagramNode>POS</DiagramNode>
                <span className="sm-line sm-line--vertical" aria-hidden="true"></span>
                <DiagramNode>Sales</DiagramNode>
              </div>
              <div>
                <DiagramNode>Operations</DiagramNode>
                <span className="sm-line sm-line--vertical" aria-hidden="true"></span>
                <DiagramNode>Inventory</DiagramNode>
              </div>
              <div>
                <DiagramNode>ERP</DiagramNode>
                <span className="sm-line sm-line--vertical" aria-hidden="true"></span>
                <DiagramNode>Reporting</DiagramNode>
              </div>
            </div>
          </div>
        </SoftwareSection>

        <SoftwareSection
          eyebrow="OUR APPROACH"
          title="Built around the business, not the other way around"
          description="Custom software should reflect real workflows. We first understand how the business operates, then define the system around those requirements."
        >
          <ol className="sm-approach">
            {approachSteps.map(([number, title, description]) => (
              <li key={number}>
                <span className="sm-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </SoftwareSection>

        <SoftwareSection eyebrow="CONNECTED WORKFLOW" title="A connected workflow">
          <div className="sm-workflow-layout">
            <ol className="sm-workflow-flow">
              {workflowSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <div className="sm-workflow-copy">
              <span>ONE WORKFLOW</span>
              <p>
                Customer information, sales activity and operational data can move through one structured system
                instead of being repeatedly entered into disconnected tools.
              </p>
            </div>
          </div>
        </SoftwareSection>

        <SoftwareSection
          eyebrow="BUILT FOR YOUR WORKFLOW"
          title="Not every business works the same way."
          description="That is why we do not start with a fixed feature list. The structure, permissions, workflows and functionality of each system are defined around the requirements of the business using it."
          className="sm-section--final"
        >
          <div className="sm-principles-grid">
            {workflowPrinciples.map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </SoftwareSection>
      </div>
    </ServicePage>
  );
}
