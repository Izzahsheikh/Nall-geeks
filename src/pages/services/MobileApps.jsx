import { useLayoutEffect, useRef } from 'react';
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
  const platformRowRef = useRef(null);
  const iosPhoneRef = useRef(null);
  const codeCardRef = useRef(null);
  const androidPhoneRef = useRef(null);
  const connectorSvgRef = useRef(null);

  useLayoutEffect(() => {
    const row = platformRowRef.current;
    const svg = connectorSvgRef.current;
    const iosPhone = iosPhoneRef.current?.querySelector('img');
    const card = codeCardRef.current;
    const androidPhone = androidPhoneRef.current?.querySelector('img');
    if (!row || !svg || !iosPhone || !card || !androidPhone) return undefined;

    const pathEls = [...svg.querySelectorAll('[data-connector]')];
    const updatePaths = () => {
      const rowBox = row.getBoundingClientRect();
      const iosBox = iosPhone.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      const androidBox = androidPhone.getBoundingClientRect();
      const width = rowBox.width;
      const height = rowBox.height;
      if (!width || !height) return;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

      const smoothPath = (startX, startY, endX, endY) => {
        const dx = endX - startX;
        const dy = endY - startY;
        const directionX = Math.sign(dx) || 1;
        const directionY = Math.sign(dy) || 1;
        const radius = Math.min(12, Math.abs(dx) / 7, Math.abs(dy) / 2);
        const bendX = startX + dx * 0.46;
        const firstTurnX = bendX + directionX * radius;
        const secondTurnX = bendX + directionX * radius * 2;
        const firstTurnY = startY + directionY * radius;
        const secondTurnY = endY - directionY * radius;
        return [
          `M ${startX} ${startY}`,
          `H ${bendX}`,
          `Q ${firstTurnX} ${startY} ${firstTurnX} ${firstTurnY}`,
          `V ${secondTurnY}`,
          `Q ${firstTurnX} ${endY} ${secondTurnX} ${endY}`,
          `H ${endX}`,
        ].join(' ');
      };

      const relativeX = (x) => x - rowBox.left;
      const relativeY = (y) => y - rowBox.top;
      const upperCardY = relativeY(cardBox.top + cardBox.height * 0.34);
      const lowerCardY = relativeY(cardBox.top + cardBox.height * 0.66);
      const phoneUpperY = relativeY(iosBox.top + iosBox.height * 0.39);
      const phoneLowerY = relativeY(iosBox.top + iosBox.height * 0.61);
      const androidUpperY = relativeY(androidBox.top + androidBox.height * 0.39);
      const androidLowerY = relativeY(androidBox.top + androidBox.height * 0.61);
      const iosX = relativeX(iosBox.right - 1);
      const cardLeftX = relativeX(cardBox.left + 1);
      const cardRightX = relativeX(cardBox.right - 1);
      const androidX = relativeX(androidBox.left + 1);

      const paths = [
        smoothPath(cardLeftX, upperCardY, iosX, phoneUpperY),
        smoothPath(cardLeftX, lowerCardY, iosX, phoneLowerY),
        smoothPath(cardRightX, upperCardY, androidX, androidUpperY),
        smoothPath(cardRightX, lowerCardY, androidX, androidLowerY),
      ];
      pathEls.forEach((path, index) => path.setAttribute('d', paths[index]));
    };

    const observer = new ResizeObserver(updatePaths);
    [row, iosPhone, card, androidPhone].forEach((element) => observer.observe(element));
    iosPhone.addEventListener('load', updatePaths);
    androidPhone.addEventListener('load', updatePaths);
    window.addEventListener('resize', updatePaths);
    updatePaths();

    return () => {
      observer.disconnect();
      iosPhone.removeEventListener('load', updatePaths);
      androidPhone.removeEventListener('load', updatePaths);
      window.removeEventListener('resize', updatePaths);
    };
  }, []);

  return (
    <section className="ma-showcase" aria-labelledby="ma-showcase-title">
      <div className="ma-wrap">
        <header className="ma-centered-head">
          <span className="ma-eyebrow">One application. Two platforms.</span>
          <h2 id="ma-showcase-title">Built once. Great on both iOS and Android.</h2>
          <p>We develop with a single shared codebase using React Native or Flutter, so your app ships faster while giving users a native-feeling experience on each platform.</p>
        </header>
        <div className="ma-platforms" ref={platformRowRef}>
          <svg className="ma-platform-connectors" ref={connectorSvgRef} aria-hidden="true">
            <defs>
              <marker id="ma-platform-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 z" />
              </marker>
            </defs>
            <path data-connector markerEnd="url(#ma-platform-arrow)" />
            <path data-connector markerEnd="url(#ma-platform-arrow)" />
            <path data-connector markerEnd="url(#ma-platform-arrow)" />
            <path data-connector markerEnd="url(#ma-platform-arrow)" />
          </svg>
          <aside className="ma-platform-notes">
            <span className="ma-platform-mark">
              <img src="/Black%20Apple%20Logo%20on%20Transparent%20Background.png" alt="" aria-hidden="true" />
              <b>iOS</b>
            </span>
            <ul><li>Native navigation</li><li>Smooth gestures</li><li>Apple interface conventions</li></ul>
          </aside>
          <div className="ma-phone ma-phone--ios" ref={iosPhoneRef}>
            <img src="/images/services/iphone-trip2airport.png" alt="Trip2Airport app displayed on an iPhone" />
          </div>
          <div className="ma-code-module" ref={codeCardRef}>
            <span className="ma-code-icon"><Code2 size={25} /></span>
            <strong>React Native / Flutter</strong>
            <span>Shared Codebase</span>
          </div>
          <div className="ma-phone ma-phone--android" ref={androidPhoneRef}>
            <img src="/images/services/android-trip2airport.png" alt="Trip2Airport app displayed on an Android phone" />
          </div>
          <aside className="ma-platform-notes">
            <span className="ma-platform-mark ma-platform-mark--android">
              <img src="/androidLogo.png" alt="" aria-hidden="true" />
              <b>Android</b>
            </span>
            <ul><li>Material design</li><li>Back navigation behavior</li><li>Android features</li></ul>
          </aside>
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
          {CAPABILITIES.map(([Icon, title, text]) => <li key={title}><Icon size={34} strokeWidth={1.8} /><div><h3>{title}</h3><p>{text}</p></div></li>)}
        </ul>
      </div>
    </section>
  );
}

function CompleteSolutions() {
  return (
    <section className="ma-solutions" aria-labelledby="ma-solutions-title">
      <div className="ma-wrap">
        <header className="ma-solutions-head">
          <span className="ma-eyebrow">Complete solutions</span>
          <h2 id="ma-solutions-title">More than just an interface.</h2>
          <p>We build complete mobile applications with secure backends, seamless integrations and all the features your app needs.</p>
        </header>
        <div className="ma-architecture" role="group" aria-label="Mobile application workflow and platform features">
          <svg className="ma-architecture-connectors" viewBox="0 0 1000 353" preserveAspectRatio="none" aria-hidden="true">
            <g className="ma-connectors-wide">
              <path d="M860 172 V222 H125 M375 222 V253 M625 222 V253 M875 222 V253" />
            </g>
            <g className="ma-connectors-compact">
              <path d="M860 172 V222 H250 M250 222 H750 M250 222 V253 M750 222 V253" />
            </g>
          </svg>
          <div className="ma-architecture-main">
            <article className="ma-system-card">
              <Smartphone aria-hidden="true" />
              <h3>Mobile App</h3>
              <p>iOS &amp; Android</p>
            </article>
            <span className="ma-flow-arrow" aria-hidden="true"><ArrowRight /></span>
            <article className="ma-system-card">
              <Cpu aria-hidden="true" />
              <h3>Secure APIs</h3>
              <p>Connects your app to backend services</p>
            </article>
            <span className="ma-flow-arrow" aria-hidden="true"><ArrowRight /></span>
            <article className="ma-system-card">
              <Database aria-hidden="true" />
              <h3>Backend &amp; Database</h3>
              <p>Stores and manages your data</p>
            </article>
          </div>
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
