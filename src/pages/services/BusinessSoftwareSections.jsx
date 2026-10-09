import { useState } from 'react';
import { Users, ShoppingCart, Package, Settings, Database, Plug, ShieldCheck, GitBranch, ArrowRight, BarChart3, Receipt, Workflow, ScanSearch, Layers, Code2, Rocket, LifeBuoy, TrendingUp } from 'lucide-react';
import './business-software-sections.css';

const modules = [
  { title: 'CRM', Icon: Users, items: ['Customers', 'Leads', 'Follow-ups'] },
  { title: 'POS', Icon: ShoppingCart, items: ['Sales', 'Payments', 'Receipts'] },
  { title: 'ERP', Icon: Package, items: ['Inventory', 'Purchasing', 'Finance'] },
  { title: 'Custom Modules', Icon: Settings, items: ['Workflows', 'Approvals', 'Reporting'] },
];
const capabilities = [
  { title: 'Shared Data', Icon: Database, text: 'Connected departments, sharing consistent information across modules' },
  { title: 'Business Logic', Icon: GitBranch, text: 'Rules and processes specific to the company' },
  { title: 'API Integrations', Icon: Plug, text: 'Connections with existing business tools' },
  { title: 'Roles & Permissions', Icon: ShieldCheck, text: 'Controlled access for different users' },
];
function Section({ eyebrow, title, children, className = '', intro }) {
  return <section className={`cbs-refine ${className}`}><div className="cbs-wrap">
    <header className="bs-heading"><span className="bs-eyebrow">{eyebrow}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</header>{children}
  </div></section>;
}
function Icon({ icon: Glyph }) { return <span className="bs-icon"><Glyph size={23} strokeWidth={1.7} aria-hidden="true" /></span>; }

export function SoftwareArchitecture() {
  const [active, setActive] = useState(null);
  return <Section eyebrow="System Architecture" title="CRM, POS, ERP — and everything the business needs around them." intro="Purpose-built modules. One shared foundation, shaped around the way your company works.">
    <div className="bs-architecture">
      <div className="bs-modules">{modules.map(({ title, Icon: Glyph, items }, i) => <article key={title} tabIndex={0} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} className={`bs-module${active === i ? ' is-active' : ''}`}>
        <Icon icon={Glyph}/><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
      </article>)}</div>
      <svg className="bs-architecture-lines" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
        {modules.map((m, i) => <g key={m.title} className={active === i ? 'is-active' : ''}><path className="bs-route" d={`M${125 + i * 250},0 V80`}/><circle className="bs-signal" r="3"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="4s" begin={`${-i}s`} repeatCount="indefinite"/><animateMotion dur="4s" begin={`${-i}s`} repeatCount="indefinite" path={`M${125 + i * 250},0 V80`}/></circle></g>)}
      </svg>
      <div className={`bs-foundation${active !== null ? ' is-active' : ''}`}><div className="bs-foundation-head"><span className="bs-eyebrow">Shared software foundation</span><span className="bs-foundation-note">One consistent system</span></div>
        <div className="bs-capabilities">{capabilities.map(({ title, Icon: Glyph, text }) => <article key={title}><Glyph size={21} strokeWidth={1.7} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </div>
  </Section>;
}

const results = [
  { title: 'Inventory Updated', text: 'Stock adjusted automatically', Icon: Package },
  { title: 'Finance Updated', text: 'Payment or invoice recorded as appropriate', Icon: Receipt },
  { title: 'Reporting Updated', text: 'Business data reflected in reports', Icon: BarChart3 },
];
export function SoftwareWorkflow() {
  const paths = ['M230,195 H320', 'M580,195 H640 Q650,195 650,185 V65 Q650,55 660,55 H720', 'M580,195 H720', 'M580,195 H640 Q650,195 650,205 V325 Q650,335 660,335 H720'];
  return <Section className="bs-workflow-section" eyebrow="Connected Workflow" title="See how one action moves through the business." intro="A validated order triggers the right updates across your connected modules.">
    <div className="bs-workflow-head"><span>Customer Places Order</span><ArrowRight aria-hidden="true" size={18}/><span>Order Processing</span><ArrowRight aria-hidden="true" size={18}/><span>Automatic Updates</span></div>
    <div className="bs-workflow">
      <svg className="bs-workflow-lines" viewBox="0 0 1000 390" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="bs-workflow-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1,1 L7,4 L1,7" fill="none" stroke="#527c78" strokeWidth="1.3"/></marker></defs>{paths.map((path, i) => <g key={path}><path d={path} className="bs-route" markerEnd="url(#bs-workflow-arrow)"/><circle className="bs-signal" r="3"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.1;0.15;0.8;0.85;1" dur="5s" begin={`${i ? -2 : 0}s`} repeatCount="indefinite"/><animateMotion dur="5s" begin={`${i ? -2 : 0}s`} repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.1;0.85;1" calcMode="linear" path={path}/></circle></g>)}</svg>
      <article className="bs-flow-card bs-order"><Icon icon={ShoppingCart}/><h3>Customer Places Order</h3><p>Order details enter the system.</p></article>
      <article className="bs-flow-card bs-processing"><Icon icon={Workflow}/><h3>Order Processing</h3><p>Validate the order and apply your business rules.</p><span className="bs-flow-note">Continue after validation</span></article>
      <div className="bs-results">{results.map(({ title, text, Icon: Glyph }) => <article className="bs-result" key={title}><Icon icon={Glyph}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </div>
    <p className="bs-workflow-footnote"><ShieldCheck size={16} aria-hidden="true"/>Payment status changes only when confirmation is received.</p>
  </Section>;
}

const benefits = [
  ['Built Around You', 'Software designed for your actual processes.', Settings],
  ['Fully Integrated', 'Connect your existing tools, systems, and business data.', Plug],
  ['Smarter Automation', 'Reduce repetitive tasks and manual handoffs.', Workflow],
  ['Better Visibility', 'Understand operations through connected data and reporting.', BarChart3],
  ['Secure Access', 'Give team members appropriate permissions and access.', ShieldCheck],
  ['Ready for Growth', 'Build a system that can evolve as your business expands.', TrendingUp],
];
export function SoftwareBenefits() {
  return <Section className="bs-benefits-section" eyebrow="Why Custom Software" title="Built for your business. Ready for what's next."><div className="bs-benefits">{benefits.map(([title, text, Glyph]) => <article key={title}><Icon icon={Glyph}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></Section>;
}
const stages = [
  ['Discover', 'Understand workflows, goals, and requirements.', ScanSearch],
  ['Plan & Architect', 'Define modules, data structure, integrations, and access rules.', Layers],
  ['Build & Test', 'Develop the software, integrate systems, and verify functionality.', Code2],
  ['Launch', 'Deploy, migrate necessary data, and onboard users.', Rocket],
  ['Support & Improve', 'Maintain, refine, and expand the solution as needed.', LifeBuoy],
];
export function SoftwareProcess() {
  return <Section className="bs-process-section" eyebrow="Development Process" title="How we design and build your system."><ol className="bs-timeline">{stages.map(([title, text, Glyph], i) => <li key={title}><span className="bs-stage-number">{String(i + 1).padStart(2, '0')}</span><Glyph size={22} strokeWidth={1.7} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></li>)}</ol></Section>;
}
export function SoftwareCta() {
  return <section className="cbs-refine bs-closing"><div className="cbs-wrap bs-closing-layout"><div><span className="bs-eyebrow">Custom Software</span><h2>Your workflow shouldn't have to fit someone else's software.</h2></div><div><p>Tell us how your business operates. We'll help define the system that should support it.</p><a className="bs-cta-link" href="/contact">Discuss Your System<ArrowRight size={18} aria-hidden="true"/></a></div></div></section>;
}
