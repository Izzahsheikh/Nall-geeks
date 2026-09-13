import { useEffect, useRef, useState } from 'react';
import heroBg from '../assets/heroProject.jpeg';

/* ─── Google Fonts ─────────────────────────────────── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap';
document.head.appendChild(fontLink);

/* ─── Project data ─────────────────────────────────── */
const videoShowcases = [
  {
    id: 'ngpartitions',
    videoSrc: '/uploads/projects/ngpartitions.mp4',
    number: '01',
    total: '04',
    client: 'N&G Partitions LTD',
    category: 'Commercial Interiors / Web',
    tagline: 'Precision Interior Specialists',
    description:
      'A considered digital presence for a UK commercial interiors specialist, designed around clarity, restraint and architectural precision. The experience turns technical services and project work into a structured visual story built to communicate trust from the first interaction.',
    approach:
      'Clear information architecture, restrained visual language and conversion-focused interaction.',
    url: 'https://ngpartitions.co.uk',
    role: 'Web Design · Development',
    focus: 'Brand Positioning · UX · Conversion',
    stack: 'React · Tailwind · CMS',
    tags: ['React', 'Tailwind', 'CMS', 'UK Commercial'],
    stat1: { value: '10+', label: 'Years Delivering' },
    stat2: { value: 'UK', label: 'Wide Coverage' },
    theme: 'light',
  },
  {
    id: 'gogotyre',
    videoSrc: '/uploads/projects/gogotyres.mp4',
    number: '02',
    total: '04',
    client: 'GoGo Tyre Norwich',
    category: 'Automotive / Web',
    tagline: 'Tyres Fitted the Modern Way',
    description:
      'A dark, performance-driven identity for a Norwich tyre garage that leads with speed and trust. Every design decision — from the bold typographic hierarchy to the mobile-first layout — serves one goal: get local customers from search to booked appointment in seconds.',
    approach:
      'Performance-first layout, local SEO structure, and a no-friction mobile conversion flow.',
    url: 'https://gogotyre.co.uk',
    role: 'Web Design · SEO · Dev',
    focus: 'Local Search · Mobile UX · Conversion',
    stack: 'React · SEO · Mobile-First',
    tags: ['React', 'SEO', 'Local Business', 'Mobile-First'],
    stat1: { value: '20min', label: 'Avg Fit Time' },
    stat2: { value: '7 days', label: 'Walk-ins Welcome' },
    theme: 'dark',
  },
  {
    id: 'trip2airport',
    videoSrc: '/uploads/projects/trip2Airport.mp4',
    number: '03',
    total: '04',
    client: 'Trip2Airport',
    category: 'Transport / Web',
    tagline: 'Airport Transfers, Simplified',
    description:
      'A booking-first web experience for a professional airport transfer service. The design strips away friction at every stage — clear pricing, fast load, and a mobile experience that guides passengers from landing page to confirmed booking without a single unnecessary step.',
    approach:
      'Conversion-led structure, trust signals at key decision points, and a streamlined booking journey.',
    url: 'https://www.trip2airport.co.uk/',
    role: 'Web Design · Development',
    focus: 'UX · Booking Flow · Mobile',
    stack: 'React · Booking · Transport',
    tags: ['React', 'Booking', 'Transport', 'Mobile-First'],
    stat1: { value: '24/7', label: 'Available' },
    stat2: { value: '100%', label: 'On-Time Focus' },
    theme: 'light',
  },
  {
    id: 'motnorwich',
    videoSrc: '/uploads/projects/MotNorwich.mp4',
    number: '04',
    total: '04',
    client: 'MOT Norwich',
    category: 'Automotive / Web',
    tagline: 'Trusted MOT & Car Servicing',
    description:
      'A trust-first digital presence for a local Norwich garage. The site is built to rank in local search, convert mobile visitors quickly, and communicate the garage\'s straightforward, reliable approach to car care — without noise or unnecessary complexity.',
    approach:
      'Local SEO structure, mobile-first design, and clear service communication built for trust.',
    url: 'https://mot-norwich.co.uk/',
    role: 'Web Design · SEO · Dev',
    focus: 'Local SEO · Trust · Conversion',
    stack: 'React · SEO · Automotive',
    tags: ['React', 'SEO', 'Local Business', 'Automotive'],
    stat1: { value: 'Local', label: 'Norwich-Based' },
    stat2: { value: 'Fast', label: 'Turnaround' },
    theme: 'dark',
  },
];

/* ─── Reveal hook ──────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Browser Frame ────────────────────────────────── */
function BrowserFrame({ videoSrc, theme, url }) {
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <div style={{
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: theme === 'dark'
        ? '0 40px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)'
        : '0 32px 72px rgba(23,23,23,0.16), 0 4px 16px rgba(23,23,23,0.08)',
      border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(23,23,23,0.1)',
      background: '#1a1a1a',
      transition: 'box-shadow 0.35s ease, transform 0.35s ease',
    }} className="browser-frame-wrap">
      <div style={{
        background: theme === 'dark' ? '#1f1f1f' : '#f0eeec',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
      }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA41', display: 'inline-block' }} />
        <div style={{
          flex: 1, marginLeft: 8,
          background: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          borderRadius: 6, height: 22,
          display: 'flex', alignItems: 'center', paddingLeft: 10,
        }}>
          <span style={{ fontSize: 10, color: theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', fontFamily: 'Manrope, sans-serif' }}>
            🔒 {displayUrl}
          </span>
        </div>
      </div>
      <div style={{ aspectRatio: '16/10', background: '#000', overflow: 'hidden' }}>
        <video src={videoSrc} autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

/* ─── Project Card ─────────────────────────────────── */
function ProjectCard({ project, index }) {
  const [ref, visible] = useReveal(0.08);
  const isEven = index % 2 === 1;
  const lightBg = '#F7F5F0';
  const darkBg = '#171717';

  return (
    <article ref={ref} style={{
      background: isEven ? darkBg : lightBg,
      color: isEven ? '#F7F5F0' : '#171717',
      padding: 'clamp(3rem, 6vw, 5.5rem) clamp(1.5rem, 6%, 5rem)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex',
        flexDirection: isEven ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 'clamp(2.5rem, 6vw, 5rem)',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#F36B21', marginBottom: '1.25rem' }}>
            {project.number} / {project.total}
          </div>
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: isEven ? 'rgba(247,245,240,0.5)' : '#66635F', marginBottom: '0.75rem' }}>
            {project.category}
          </div>
          <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.08, fontWeight: 400, marginBottom: '0.5rem', color: isEven ? '#F7F5F0' : '#171717' }}>
            {project.client}
          </h2>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', fontWeight: 300, color: isEven ? 'rgba(247,245,240,0.6)' : '#66635F', marginBottom: '1.5rem', letterSpacing: '0.01em' }}>
            {project.tagline}
          </p>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(0.88rem, 1.1vw, 0.97rem)', lineHeight: 1.8, color: isEven ? 'rgba(247,245,240,0.72)' : '#66635F', marginBottom: '1.75rem', maxWidth: 480 }}>
            {project.description}
          </p>
          <div style={{ borderLeft: '2px solid #F36B21', paddingLeft: '1rem', marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F36B21', marginBottom: '0.4rem' }}>The Approach</div>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem', lineHeight: 1.65, color: isEven ? 'rgba(247,245,240,0.6)' : '#66635F', margin: 0 }}>
              {project.approach}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${isEven ? 'rgba(247,245,240,0.12)' : '#E7E2DA'}` }}>
            {[{ label: 'Role', value: project.role }, { label: 'Focus', value: project.focus }, { label: 'Stack', value: project.stack }].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F36B21', marginBottom: '0.3rem' }}>{label}</div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.78rem', fontWeight: 500, color: isEven ? 'rgba(247,245,240,0.75)' : '#66635F', lineHeight: 1.4, maxWidth: 130 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.75rem' }}>
            {[project.stat1, project.stat2].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: isEven ? '#F7F5F0' : '#171717', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: isEven ? 'rgba(247,245,240,0.45)' : '#66635F', marginTop: '0.3rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.72rem', fontWeight: 600, padding: '0.3rem 0.85rem', borderRadius: 999, background: isEven ? 'rgba(247,245,240,0.1)' : 'rgba(23,23,23,0.07)', color: isEven ? 'rgba(247,245,240,0.7)' : '#66635F', letterSpacing: '0.03em' }}>{tag}</span>
            ))}
          </div>
          <a href={project.url} target="_blank" rel="noreferrer" className="project-cta-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.04em', color: '#fff', background: '#F36B21', padding: '13px 24px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s ease, transform 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#d85e18'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F36B21'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            View Live Site <span style={{ transition: 'transform 0.2s ease' }}>→</span>
          </a>
        </div>
        <div style={{ flex: '1 1 420px', minWidth: 0 }}>
          <BrowserFrame videoSrc={project.videoSrc} theme={project.theme} url={project.url} />
        </div>
      </div>
    </article>
  );
}

/* ─── Final CTA ────────────────────────────────────── */
function FinalCTA() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} style={{
      background: '#F7F5F0',
      padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6%, 5rem)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F36B21', marginBottom: '1.5rem' }}>
          Have something worth building?
        </div>
        <h2 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 'clamp(2.4rem, 6vw, 5rem)', lineHeight: 1.06, fontWeight: 400, color: '#171717', marginBottom: '1.5rem', maxWidth: 680 }}>
          Let's make it<br />
          <span style={{ color: '#F36B21', fontStyle: 'italic' }}>work beautifully.</span>
        </h2>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(0.95rem, 1.3vw, 1.08rem)', lineHeight: 1.75, color: '#66635F', marginBottom: '2.5rem', maxWidth: 540 }}>
          From first idea to final launch, we build digital experiences designed to look sharp, communicate clearly and keep working long after launch.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff', background: '#F36B21', padding: '14px 28px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s ease, transform 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#d85e18'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F36B21'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Start a Project →</a>
          <a href="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#171717', border: '1.5px solid #E7E2DA', padding: '14px 28px', borderRadius: 8, textDecoration: 'none', transition: 'border-color 0.2s ease, transform 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F36B21'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E7E2DA'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Book a Call →</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Hero ─────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      background: '#171717',
      padding: 'calc(72px + 5rem) clamp(1.5rem, 6%, 5rem) 6rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        zIndex: 0,
      }} />

      {/* FIX 1: Overlay — removed the #F7F5F0 hard stop, fade now stays dark */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(180deg, rgba(23,23,23,0.3) 0%, rgba(23,23,23,0.15) 40%, rgba(23,23,23,0.7) 100%),
          linear-gradient(90deg, rgba(23,23,23,0.92) 0%, rgba(23,23,23,0.75) 30%, rgba(23,23,23,0.15) 62%, rgba(23,23,23,0.05) 100%)
        `,
        zIndex: 1,
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#F36B21',
          marginBottom: '1.5rem',
        }}>
          NailGeeks Projects
        </div>

        {/* FIX 2: Headline — tightened clamp so it doesn't overpower */}
        <h1 style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: 'clamp(2.6rem, 5.5vw, 5rem)',
          lineHeight: 1.06,
          fontWeight: 400,
          color: '#F7F5F0',
          maxWidth: 720,
          marginBottom: '1.75rem',
          letterSpacing: '-0.01em',
        }}>
          Work built to keep<br />
          moving after launch.
        </h1>

        {/* FIX 3: Description — full brightness, not faded */}
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
          lineHeight: 1.75,
          color: 'rgba(247,245,240,0.92)',
          maxWidth: 480,
          marginBottom: '2.5rem',
          fontWeight: 400,
        }}>
          A closer look at the websites, apps and digital systems shaped by NailGeeks.
        </p>
      </div>
    </section>
  );
}

/* ─── Main export ──────────────────────────────────── */
export default function Projects() {
  return (
    <div style={{ fontFamily: 'Manrope, sans-serif' }}>
      <Hero />
      <div>
        {videoShowcases.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
      <FinalCTA />
    </div>
  );
}