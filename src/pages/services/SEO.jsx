import ServicePage from './ServicePage';

const foundations = [
  {
    number: '01',
    title: 'Technical SEO',
    description: 'Improve crawlability, indexing, site structure and technical foundations.',
  },
  {
    number: '02',
    title: 'On-Page SEO',
    description: 'Refine page titles, headings, content structure and internal relationships.',
  },
  {
    number: '03',
    title: 'Search Strategy',
    description: 'Understand relevant topics, queries and the intent behind what people search for.',
  },
  {
    number: '04',
    title: 'Content',
    description: 'Structure useful content around real questions and search needs.',
  },
];

const searchFlow = [
  ['Website', ''],
  ['Crawl', 'Can important pages be accessed?'],
  ['Understand', 'Is the page structure and topic clear?'],
  ['Index', 'Can the page be considered for relevant searches?'],
  ['Search Query', 'What is the person actually looking for?'],
  ['Relevant Result', 'Does the page provide a useful match?'],
  ['Visitor', ''],
];

const intentTypes = [
  ['Informational', 'Looking to learn'],
  ['Commercial', 'Comparing available options'],
  ['Navigational', 'Looking for a specific website or page'],
  ['Transactional', 'Ready to take an action'],
];

const technicalItems = [
  ['Crawlability', 'Can important pages be reached?'],
  ['Indexing', 'Are the correct pages available for indexing?'],
  ['Site Structure', 'Is information organised logically?'],
  ['Internal Links', 'Are related pages properly connected?'],
  ['Mobile', 'Does the experience work correctly across screen sizes?'],
  ['Performance', 'Are pages delivered efficiently?'],
  ['Metadata', 'Does each page clearly describe its purpose?'],
];

const processSteps = [
  ['01', 'Audit', 'Review the existing website and identify technical and content issues.'],
  ['02', 'Research', 'Understand search behaviour, topics, competitors and intent.'],
  ['03', 'Structure', 'Improve hierarchy, pages and internal relationships.'],
  ['04', 'Optimise', 'Refine technical elements and page content.'],
  ['05', 'Review', 'Monitor performance and identify further improvements.'],
];

const services = [
  {
    title: 'Technical',
    items: [
      'Technical SEO review',
      'Crawl and indexing review',
      'Site architecture',
      'Internal linking',
      'Page structure',
      'Performance review',
    ],
  },
  {
    title: 'Search & Content',
    items: [
      'Search/topic research',
      'Search intent analysis',
      'On-page optimisation',
      'Content structure',
      'Metadata optimisation',
      'Existing content improvements',
    ],
  },
];

const principles = [
  {
    number: '01',
    title: 'Technical + Content',
    description: 'We consider both how a website is built and what its pages communicate.',
  },
  {
    number: '02',
    title: 'User First',
    description: 'Pages should answer real questions clearly rather than being written only for search engines.',
  },
  {
    number: '03',
    title: 'Continuous Improvement',
    description: 'Search performance is reviewed and refined as the website and search behaviour evolve.',
  },
];

function SeoSection({ eyebrow, title, description, children }) {
  return (
    <section className="seo-section">
      <div className="sp-inner">
        <div className="sp-label">{eyebrow}</div>
        <h2 className="sp-subtitle">{title}</h2>
        {description && <p className="seo-section-intro">{description}</p>}
        {children}
      </div>
    </section>
  );
}

function SeoNode({ children, accent = false }) {
  return <div className={`seo-node${accent ? ' seo-node--accent' : ''}`}>{children}</div>;
}

function SeoConnector() {
  return <span className="seo-connector" aria-hidden="true"></span>;
}

export default function SEO() {
  return (
    <ServicePage
      title="Search Engine Optimization"
      description="We improve how websites are structured, understood and discovered in search — combining technical SEO, content strategy and continuous optimisation."
      pageClassName="sp--seo"
      hideWork
      hideCta
    >
      <div className="seo-page">
        <SeoSection
          eyebrow="SEO FOUNDATIONS"
          title="What we optimise"
          description="Effective search visibility starts with a website that is technically clear, well structured and relevant to what people are searching for."
        >
          <div className="seo-foundation-grid">
            {foundations.map((item) => (
              <article className="seo-editorial-item" key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </SeoSection>

        <SeoSection
          eyebrow="HOW SEARCH WORKS"
          title="From website to search result"
          description="Before a page can appear for a relevant search, it needs to be accessible, understandable and properly structured."
        >
          <div className="seo-search-flow">
            {searchFlow.map(([label, note], index) => (
              <div className="seo-search-step" key={label}>
                <SeoNode accent={['Crawl', 'Understand', 'Index', 'Relevant Result'].includes(label)}>{label}</SeoNode>
                {note && <p>{note}</p>}
                {index < searchFlow.length - 1 && <SeoConnector />}
              </div>
            ))}
          </div>
        </SeoSection>

        <SeoSection
          eyebrow="SEARCH STRATEGY"
          title="Understand what people are actually looking for"
          description="Good SEO starts with understanding the reason behind a search, not simply repeating keywords."
        >
          <div className="seo-intent-layout">
            <div className="seo-intent-flow">
              <SeoNode>Search Query</SeoNode>
              <p>custom CRM software</p>
              <SeoConnector />
              <SeoNode accent>Intent</SeoNode>
              <p>Find a business solution</p>
              <SeoConnector />
              <SeoNode>Relevant Page</SeoNode>
              <p>Custom Business Software</p>
              <SeoConnector />
              <SeoNode>Useful Content</SeoNode>
              <p>Clear explanation of CRM services</p>
              <SeoConnector />
              <SeoNode>Next Action</SeoNode>
              <p>Explore the service</p>
            </div>
            <div className="seo-intent-types">
              {intentTypes.map(([title, description]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </SeoSection>

        <SeoSection
          eyebrow="ON-PAGE SEO"
          title="Clear structure for people and search engines"
          description="We organise pages so their purpose, hierarchy and relationships are easy to understand."
        >
          <div className="seo-page-structure">
            <div className="seo-page-artifact">
              <h3>Page Title</h3>
              <div>
                <strong>H1</strong>
                <p>Primary topic</p>
              </div>
              <p>Introductory content</p>
              <div>
                <strong>H2</strong>
                <p>Important section</p>
              </div>
              <p>Relevant supporting content</p>
              <div>
                <strong>H2</strong>
                <p>Related section</p>
              </div>
              <p>Supporting content</p>
              <SeoConnector />
              <strong>Internal Link</strong>
              <p>Related service / page</p>
            </div>
            <div className="seo-hierarchy">
              {['Page', 'Title', 'H1', 'H2 Sections', 'Content', 'Internal Links', 'Related Pages'].map((item, index) => (
                <div key={item}>
                  <SeoNode accent={index === 0 || index === 5}>{item}</SeoNode>
                  {index < 6 && <SeoConnector />}
                </div>
              ))}
            </div>
          </div>
        </SeoSection>

        <SeoSection
          eyebrow="TECHNICAL SEO"
          title="A strong technical foundation"
          description="Search optimisation also depends on how efficiently the website can be accessed, understood and navigated."
        >
          <div className="seo-technical-list">
            {technicalItems.map(([title, description]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </SeoSection>

        <SeoSection eyebrow="OUR APPROACH" title="SEO is a continuous process">
          <ol className="seo-process">
            {processSteps.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </SeoSection>

        <SeoSection eyebrow="SEO SERVICES" title="What we provide">
          <div className="seo-services-grid">
            {services.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </SeoSection>

        <SeoSection eyebrow="OUR PRINCIPLES" title="Search optimisation built into the website">
          <div className="seo-principles">
            {principles.map((principle) => (
              <article key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </SeoSection>
      </div>
    </ServicePage>
  );
}
