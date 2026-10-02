import ServicePage from './ServicePage';

const automationAreas = [
  {
    number: '01',
    title: 'Lead Management',
    description: 'Capture, organise and route incoming leads.',
  },
  {
    number: '02',
    title: 'Customer Support',
    description: 'Handle common requests and direct conversations to the right place.',
  },
  {
    number: '03',
    title: 'Documents & Data',
    description: 'Extract, organise and transfer information from documents and forms.',
  },
  {
    number: '04',
    title: 'Communication',
    description: 'Automate routine emails, notifications and follow-ups.',
  },
  {
    number: '05',
    title: 'Reporting',
    description: 'Collect information from relevant sources and prepare recurring reports.',
  },
  {
    number: '06',
    title: 'Internal Operations',
    description: 'Connect repetitive tasks across everyday business workflows.',
  },
];

const uspPoints = [
  {
    number: '01',
    title: 'Workflow First',
    description: 'We start with the process that needs improving, not with an AI tool looking for a problem.',
  },
  {
    number: '02',
    title: 'Custom Automation',
    description: 'Automations are structured around the business rules, systems and people involved in the workflow.',
  },
  {
    number: '03',
    title: 'Human Checkpoints',
    description: 'Where judgement or approval matters, human review can remain part of the process.',
  },
  {
    number: '04',
    title: 'Connected Systems',
    description: 'Automation can move information between existing tools instead of creating another isolated place to manage.',
  },
];

const approachSteps = [
  ['01', 'Identify', 'Find repetitive or disconnected work.'],
  ['02', 'Map', 'Understand triggers, decisions, data and outcomes.'],
  ['03', 'Automate', 'Build and connect the required workflow.'],
  ['04', 'Test', 'Check normal cases, exceptions and human handoffs.'],
  ['05', 'Refine', 'Improve the workflow based on real use.'],
];

function Section({ eyebrow, title, description, children }) {
  return (
    <section className="ai-section">
      <div className="sp-inner">
        <div className="sp-label">{eyebrow}</div>
        <h2 className="sp-subtitle">{title}</h2>
        {description && <p className="ai-section-intro">{description}</p>}
        {children}
      </div>
    </section>
  );
}

function Node({ children, accent = false }) {
  return <div className={`ai-node${accent ? ' ai-node--accent' : ''}`}>{children}</div>;
}

function Connector() {
  return <span className="ai-connector" aria-hidden="true"></span>;
}

function LeadFlow() {
  return (
    <article className="ai-flow ai-flow--lead">
      <h3>Lead Handling</h3>
      <div className="ai-flow-body ai-flow-body--lead">
        <div className="ai-flow-stack">
          <Node>Website Form</Node>
          <Connector />
          <Node>New Lead</Node>
          <Connector />
          <Node accent>AI Qualification</Node>
        </div>
        <div className="ai-branch ai-branch--two">
          <div>
            <span>Qualified</span>
            <Connector />
            <Node>Sales Team</Node>
          </div>
          <div>
            <span>Needs Review</span>
            <Connector />
            <Node>Manual Review</Node>
          </div>
        </div>
        <div className="ai-flow-stack">
          <Connector />
          <Node>CRM</Node>
          <Connector />
          <Node>Assign to Team</Node>
          <Connector />
          <Node>Follow-up</Node>
        </div>
      </div>
    </article>
  );
}

function SupportFlow() {
  return (
    <article className="ai-flow ai-flow--support">
      <h3>Customer Support</h3>
      <div className="ai-flow-body">
        <div className="ai-flow-stack">
          <Node>Customer Message</Node>
          <Connector />
          <Node accent>AI Understands Request</Node>
          <Connector />
          <Node>Request Type</Node>
        </div>
        <div className="ai-branch ai-branch--three">
          <div>
            <span>Common Question</span>
            <Connector />
            <Node accent>AI Reply</Node>
          </div>
          <div>
            <span>Account Request</span>
            <Connector />
            <Node>Workflow</Node>
          </div>
          <div>
            <span>Complex Issue</span>
            <Connector />
            <Node>Human Team</Node>
          </div>
        </div>
      </div>
    </article>
  );
}

function DocumentFlow() {
  return (
    <article className="ai-flow ai-flow--document">
      <h3>Document Processing</h3>
      <div className="ai-flow-body ai-flow-body--document">
        <div className="ai-flow-stack">
          <Node>Document / Form</Node>
          <Connector />
          <Node accent>AI Extraction</Node>
          <Connector />
          <Node>Validate Information</Node>
        </div>
        <div className="ai-exception">
          <span>Validation Failed</span>
          <Connector />
          <Node>Human Review</Node>
        </div>
        <div className="ai-flow-stack">
          <Connector />
          <Node>Structured Data</Node>
          <Connector />
          <Node>Business System</Node>
        </div>
      </div>
    </article>
  );
}

function CommunicationFlow() {
  return (
    <article className="ai-flow ai-flow--compact">
      <h3>Communication</h3>
      <div className="ai-flow-row">
        {['Trigger', 'Customer / Lead Data', 'Generate Message', 'Send', 'Response', 'Update Record'].map((item, index) => (
          <div className="ai-flow-row-item" key={item}>
            <Node accent={index === 2}>{item}</Node>
            {index < 5 && <span className="ai-row-connector" aria-hidden="true"></span>}
          </div>
        ))}
      </div>
    </article>
  );
}

function ReportingFlow() {
  return (
    <article className="ai-flow ai-flow--compact">
      <h3>Reporting</h3>
      <div className="ai-flow-row ai-flow-row--reporting">
        {['Business Data', 'Collect', 'Organise', 'Analyse', 'Prepare Report', 'Deliver to Team'].map((item, index) => (
          <div className="ai-flow-row-item" key={item}>
            <Node accent={index === 3}>{item}</Node>
            {index < 5 && <span className="ai-row-connector" aria-hidden="true"></span>}
          </div>
        ))}
      </div>
    </article>
  );
}

function IntegrationDiagram() {
  return (
    <div className="ai-integration-diagram">
      <div className="ai-tool-grid" aria-label="Input systems">
        {['Forms', 'CRM', 'Email', 'Documents', 'Spreadsheets', 'Internal Systems'].map((tool) => (
          <span key={tool}>{tool}</span>
        ))}
      </div>
      <Connector />
      <div className="ai-layer">Automation Layer</div>
      <Connector />
      <div className="ai-tool-grid" aria-label="Automation outputs">
        {['Notifications', 'Updated Records', 'Tasks', 'Reports', 'Follow-ups'].map((output) => (
          <span key={output}>{output}</span>
        ))}
      </div>
    </div>
  );
}

export default function AIAutomation() {
  return (
    <ServicePage
      title="AI Automation"
      description="We automate repetitive business processes by connecting AI, data and the tools your team already uses — reducing manual work and keeping everyday operations moving."
      pageClassName="sp--ai-automation"
      hideWork
      hideCta
    >
      <div className="ai-automation-page">
        <Section
          eyebrow="What We Automate"
          title="Automation where work slows down"
          description="Different teams face different repetitive tasks. We design focused automations around the workflows that consume time, require repeated manual input or move information between systems."
        >
          <div className="ai-area-grid">
            {automationAreas.map((area) => (
              <article className="ai-area" key={area.number}>
                <span>{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="How It Works"
          title="Different processes. Different automations."
          description="Each automation is designed around a specific workflow rather than forcing every process into the same system."
        >
          <div className="ai-flow-grid">
            <LeadFlow />
            <SupportFlow />
            <DocumentFlow />
            <CommunicationFlow />
            <ReportingFlow />
          </div>
        </Section>

        <Section
          eyebrow="Integrations"
          title="Connect the tools around the workflow"
          description="Automation can sit between the systems a business already uses, moving information and triggering actions when required."
        >
          <IntegrationDiagram />
        </Section>

        <Section
          eyebrow="AI + Automation"
          title="AI where judgement is useful. Automation where rules are enough."
        >
          <div className="ai-compare">
            <div>
              <h3>Automation</h3>
              <p>Best for predictable actions and defined rules.</p>
              <ul>
                <li>Move data</li>
                <li>Send notifications</li>
                <li>Create records</li>
                <li>Trigger tasks</li>
                <li>Update systems</li>
              </ul>
            </div>
            <div>
              <h3>AI</h3>
              <p>Useful when information needs to be interpreted.</p>
              <ul>
                <li>Understand messages</li>
                <li>Extract information</li>
                <li>Classify requests</li>
                <li>Summarise content</li>
                <li>Generate drafts</li>
              </ul>
            </div>
          </div>
          <div className="ai-understand-flow" aria-label="AI plus automation: understand, decide, act">
            <Node accent>Understand</Node>
            <span className="ai-row-connector" aria-hidden="true"></span>
            <Node>Decide</Node>
            <span className="ai-row-connector" aria-hidden="true"></span>
            <Node>Act</Node>
          </div>
        </Section>

        <Section eyebrow="Why NalGeeks" title="Automation designed around the process">
          <div className="ai-usp-grid">
            {uspPoints.map((point) => (
              <article className="ai-usp" key={point.number}>
                <span>{point.number}</span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section eyebrow="Our Approach" title="From repetitive task to working automation">
          <ol className="ai-approach">
            {approachSteps.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </Section>

        <section className="ai-final" aria-label="Automation service summary">
          <div className="sp-inner">
            <div className="ai-final-diagram">
              <div>
                <h3>Input</h3>
                <p>Message</p>
                <p>Document</p>
                <p>Form</p>
                <p>Data</p>
                <p>Event</p>
              </div>
              <Connector />
              <div>
                <h3>Understand / Rules</h3>
                <p>AI interpretation</p>
                <p>+ Workflow logic</p>
              </div>
              <Connector />
              <div>
                <h3>Action</h3>
                <p>Update</p>
                <p>Route</p>
                <p>Notify</p>
                <p>Generate</p>
                <p>Record</p>
              </div>
              <Connector />
              <div>
                <h3>Human When Needed</h3>
                <p>Review</p>
                <p>Approve</p>
                <p>Handle exception</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ServicePage>
  );
}
