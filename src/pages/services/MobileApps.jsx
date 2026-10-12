import { useLayoutEffect } from 'react';
import { Smartphone, Code2, LayoutGrid, Gauge, Cpu, LockKeyhole, CreditCard, Bell, RefreshCw, Database, ArrowRight } from 'lucide-react';
import ServicePage from './ServicePage';
import './mobile-apps.css';

const PROJECTS = [
  {
    title: 'N&G Partitions Mobile',
    description: 'A polished interiors app with service expertise, project browsing and clear enquiry paths.',
    image: '/images/services/mobileapp1.jpeg',
    alt: 'N&G Partitions mobile app displayed on two smartphone screens',
    tags: ['Mobile UI', 'Projects', 'Enquiries'],
  },
  {
    title: 'Trip2Airport Booking',
    description: 'A booking-focused airport transfer app with quick ride selection and destination pricing.',
    image: '/images/services/mobileapp2.jpeg',
    alt: 'Trip2Airport airport transfer booking app displayed on mobile',
    tags: ['Booking', 'Travel', 'iOS & Android'],
  },
];

const CAPABILITIES = [
  [Smartphone, 'Native-feeling interactions', 'Platform-specific navigation, gestures and transitions.'],
  [LayoutGrid, 'Adaptive layouts', 'Works seamlessly across different screen sizes.'],
  [Gauge, 'High performance', 'Responsive interactions and smooth scrolling.'],
  [Cpu, 'Device integration', 'Camera, location, notifications and more.'],
];

const FEATURES = [
  [LockKeyhole, 'Authentication', 'Secure user access'],
  [CreditCard, 'Payments', 'In-app and online payments'],
  [Bell, 'Push Notifications', 'Keep users engaged'],
  [RefreshCw, 'Real-Time Updates', 'Live data and sync'],
];

function PlatformShowcase() {
  return (
    <section className="ma-showcase" aria-labelledby="ma-showcase-title">
      <div className="ma-wrap">
        <header className="ma-centered-head">
          <span className="ma-eyebrow">One application. Two platforms.</span>
          <h2 id="ma-showcase-title">Built once. Great on both iOS and Android.</h2>
          <p>We develop with a single shared codebase using React Native or Flutter, so your app ships faster while giving users a native-feeling experience on each platform.</p>
        </header>
        <div className="ma-platforms">
          <aside className="ma-platform-notes">
            <span className="ma-platform-mark">
              <img src="/Black%20Apple%20Logo%20on%20Transparent%20Background.png" alt="" aria-hidden="true" />
              <b>iOS</b>
            </span>
            <ul><li>Native navigation</li><li>Smooth gestures</li><li>Apple interface conventions</li></ul>
          </aside>
          <div className="ma-phone ma-phone--ios" role="img" aria-label="N&G Partitions app shown on an iPhone">
            <div className="ma-phone-screen" />
            <span className="ma-phone-island" />
          </div>
          <div className="ma-code-module">
            <span className="ma-code-icon"><Code2 size={25} /></span>
            <strong>React Native / Flutter</strong>
            <span>Shared Codebase</span>
          </div>
          <div className="ma-phone ma-phone--android" role="img" aria-label="N&G Partitions app shown on an Android phone">
            <div className="ma-phone-screen" />
            <span className="ma-phone-camera" />
          </div>
          <aside className="ma-platform-notes">
            <span className="ma-platform-mark ma-platform-mark--android">
              <img src="/androidLogo.png" alt="" aria-hidden="true" />
              <b>Android</b>
            </span>
            <ul><li>Material design</li><li>Back navigation behavior</li><li>Android features</li></ul>
          </aside>
          <svg className="ma-platform-connectors" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
            <path d="M388 144 H400" />
            <path d="M388 216 H400" />
            <path d="M626 144 H639" />
            <path d="M626 216 H639" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function PlatformExperience() {
  return (
    <section className="ma-experience" aria-labelledby="ma-experience-title">
      <div className="ma-wrap">
        <header className="ma-section-head">
          <div><span className="ma-eyebrow">Platform experience</span><h2 id="ma-experience-title">Built to feel right<br />on every platform.</h2></div>
          <p>We follow platform guidelines and best practices to make sure your app feels natural, responsive and reliable on both iOS and Android.</p>
        </header>
        <ul className="ma-capabilities">
          {CAPABILITIES.map(([Icon, title, text]) => <li key={title}><Icon size={30} strokeWidth={1.8} /><div><h3>{title}</h3><p>{text}</p></div></li>)}
        </ul>
      </div>
    </section>
  );
}

function CompleteSolutions() {
  return (
    <section className="ma-solutions" aria-labelledby="ma-solutions-title">
      <div className="ma-wrap ma-solution-layout">
        <header className="ma-section-head ma-solution-copy">
          <div><span className="ma-eyebrow">Complete solutions</span><h2 id="ma-solutions-title">More than just<br />an interface.</h2></div>
          <p>We build complete mobile applications with secure backends, seamless integrations and all the features your app needs.</p>
        </header>
        <div className="ma-architecture" aria-label="Mobile app connected to secure APIs, backend and database, and app features">
          <div className="ma-architecture-main">
            <article className="ma-system-card"><Smartphone /><h3>Mobile App</h3><p>iOS & Android</p></article>
            <span className="ma-flow-arrow"><ArrowRight /></span>
            <article className="ma-system-card"><Cpu /><h3>Secure APIs</h3><p>Connects your app<br />to backend services</p></article>
            <span className="ma-flow-arrow"><ArrowRight /></span>
            <article className="ma-system-card"><Database /><h3>Backend & Database</h3><p>Stores and manages<br />your data</p></article>
          </div>
          <span className="ma-branch-line" aria-hidden="true">
            <svg viewBox="0 0 40 216" preserveAspectRatio="none"><path d="M0 108 H20 M20 24 V192 M20 24 H40 M20 80 H40 M20 136 H40 M20 192 H40" /></svg>
          </span>
          <ul className="ma-feature-list">
            {FEATURES.map(([Icon, title, text]) => <li key={title}><Icon size={22} /><div><h3>{title}</h3><p>{text}</p></div></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function OurWork() {
  return (
    <section className="ma-work" aria-labelledby="ma-work-title">
      <div className="ma-wrap">
        <header className="ma-work-head"><div><span className="ma-eyebrow">Our work</span><h2 id="ma-work-title">A few things we’ve built.</h2></div></header>
        <div className="ma-projects">
          {PROJECTS.map((project) => <article className="ma-project" key={project.title}>
            <div className="ma-project-image"><img src={project.image} alt={project.alt} loading="lazy" decoding="async" /></div>
            <div className="ma-project-copy"><h3>{project.title}</h3><p>{project.description}</p><ul>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
          </article>)}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return <section className="ma-final-cta"><div className="ma-wrap"><div><span className="ma-eyebrow">Ready to build?</span><h2>Have an app idea worth building?</h2><p>From the first screen to a reliable iOS and Android experience,<br className="ma-desktop-break" /> we can help turn it into a product.</p></div><a href="/contact">Discuss Your App <ArrowRight size={17} /></a></div></section>;
}

export default function MobileApps() {
  useLayoutEffect(() => {
    // The shared fixed navbar is designed for the top of this hero; don't let a browser-restored scroll offset
    // carry it down over the platform heading after a refresh or return to this service route.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <ServicePage
      title="Mobile Apps"
      description="We design and develop mobile applications for iOS and Android that feel native, load instantly and keep users coming back. From concept to launch, we handle it all."
      pageClassName="sp--mobile-apps"
      hideWork
      hideCta
      heroActions={<a href="/contact" className="ma-hero-cta">Discuss Your App <ArrowRight size={16} /></a>}
    >
      <div className="ma-page">
        <PlatformShowcase />
        <PlatformExperience />
        <CompleteSolutions />
        <OurWork />
        <FinalCta />
      </div>
    </ServicePage>
  );
}
