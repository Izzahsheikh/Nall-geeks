import { useEffect, useRef, useState } from 'react';
import heroBg from '../assets/services/heroForHomePage.jpeg';

const WORDS = ['High Performance.', 'Pixel Perfect.', 'Production Ready.', 'Scalable.'];
const TICKER_ITEMS = [
  { label: 'NgPartitions', url: 'https://ngpartitions.co.uk/' },
  { label: 'GogoTyres',    url: 'https://www.gogotyre.co.uk/' },
  { label: 'Trip2Airport', url: 'https://www.trip2airport.co.uk/' },
  { label: 'DanMoT',       url: 'https://mot-norwich.co.uk/' },
];

function TickerItem({ label, url }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2.5rem' }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 500,
          letterSpacing: '0.02em',
          color: hovered ? '#F36B21' : 'rgba(247,245,240,0.9)',
          textShadow: hovered ? '0 0 16px rgba(243,107,33,0.55)' : 'none',
          transition: 'color 0.35s ease, text-shadow 0.35s ease',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        {label}
      </a>
      <span style={{ color: 'rgba(247,245,240,0.18)', fontSize: '1rem' }}>{'·'}</span>
    </span>
  );
}

const REPEATED_ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

function TickerGroup() {
  return (
    <span className="ticker-group">
      {REPEATED_ITEMS.map((item, i) => (
        <TickerItem key={i} label={item.label} url={item.url} />
      ))}
    </span>
  );
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setFading(false);
      }, 420);
    }, 2800);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <section
        id="hero"
        className="hero"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#171717',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '8rem',
          paddingBottom: '8rem',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            zIndex: 0,
          }}
        />

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              // Bottom stop stays dark so the hero still joins the #171717 ticker strip without a seam.
              'linear-gradient(180deg, rgba(23,23,23,0.32) 0%, rgba(23,23,23,0.18) 35%, rgba(23,23,23,0.9) 100%)',
              'linear-gradient(90deg, rgba(23,23,23,0.72) 0%, rgba(23,23,23,0.48) 38%, rgba(23,23,23,0.16) 68%, rgba(23,23,23,0.05) 100%)',
            ].join(', '),
            zIndex: 1,
          }}
        />

        {/* Lighter gray tone behind the text (matches the Projects hero); fades out before the image */}
        <div className="hero-left-tint" />

        <div className="hero-grid" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="hero-left">

            {/* Eyebrow — now neutral white, not orange */}
            <div
              className="hero-eyebrow reveal visible"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: 'rgba(247,245,240,0.5)',  // ← was #F36B21, now muted white
                textTransform: 'uppercase',
                marginBottom: '1.4rem',
              }}
            >
              Software Studio for Ambitious Brands
            </div>

            {/* Headline */}
            <h1
              className="hero-title reveal visible"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(2.2rem, 5vw, 3.9rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: '#ffffff',
                letterSpacing: '-0.01em',
                marginBottom: '1.75rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.85)',
              }}
            >
              We design and engineer
              <br />
              software that is
              <br />
              {/* Orange is now reserved ONLY for this rotating word — maximum impact */}
              <span
                style={{
                  display: 'inline-block',
                  color: '#e8622a',
                  fontStyle: 'italic',
                  opacity: fading ? 0 : 1,
                  transform: fading ? 'translateY(-10px)' : 'translateY(0)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  // Flat colour only. Must be explicit: text-shadow inherits, so without it the word would pick up the h1's dark shadow.
                  textShadow: 'none',
                  willChange: 'opacity, transform',
                }}
              >
                {WORDS[wordIdx]}
              </span>
            </h1>

            {/* Body copy */}
            <p
              className="hero-desc reveal visible"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '46ch',   // ← slightly wider than before (was 42ch)
                marginBottom: '2.5rem',
              }}
            >
              NallGeeks takes your product from architecture to deployment —
              web, mobile, and cloud. Built for founders who can't afford
              to ship twice.
            </p>

            {/* CTAs */}
            <div
              className="hero-ctas reveal visible"
              style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}
            >
              {/* Primary — orange fill, unchanged */}
              <a
                href="/contact"
                className="btn-primary"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                {'Start a Project \u2192'}
              </a>

              {/* Secondary — now visually clear: solid white border + legible text */}
              <a
                href="#projects"
                className="btn-outline"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  color: 'rgba(247,245,240,0.92)',           // ← was 0.75, now more visible
                  borderColor: 'rgba(247,245,240,0.45)',     // ← was 0.22, now clearly visible border
                  background: 'rgba(247,245,240,0.06)',      // ← subtle fill so it reads as a button
                }}
              >
                View Projects
              </a>
            </div>
          </div>

          <div className="hero-right reveal visible" />
        </div>
      </section>

      {/* Ticker */}
      <div
        style={{
          background: '#171717',
          borderTop: '1px solid rgba(247,245,240,0.08)',
          padding: '2.25rem 0',
        }}
      >
        <div className="ticker-section" style={{ position: 'relative' }}>
          <div
            style={{
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              color: 'rgba(247,245,240,0.4)',   // ← was orange, now subtle white label
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            Selected Work
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '8rem',
                background: 'linear-gradient(90deg, #171717 0%, transparent 100%)',
                zIndex: 2, pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute', right: 0, top: 0, bottom: 0,
                width: '8rem',
                background: 'linear-gradient(270deg, #171717 0%, transparent 100%)',
                zIndex: 2, pointerEvents: 'none',
              }}
            />
            <div className="ticker-wrap">
              <div className="ticker-track">
                <TickerGroup />
                <TickerGroup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}