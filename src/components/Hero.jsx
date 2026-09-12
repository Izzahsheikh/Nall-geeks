import { useEffect, useRef, useState } from 'react';
import heroBg from '../assets/services/heroForHomePage.jpeg';

const WORDS = ['Yours.', 'Fast.', 'Scalable.', 'Profitable.'];
const TICKER_ITEMS = ['NEXORA', 'HELIX', 'FORMA', 'PULSE', 'ORGANICFIELDS', 'RANKGRAD', 'CDS', 'ZYLO'];

function TickerGroup() {
  return (
    <span className="ticker-group">
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3rem' }}>
          <span className="ticker-item" style={{ color: 'rgba(247,245,240,0.55)' }}>{item}</span>
          <span className="ticker-dot" style={{ color: 'rgba(247,245,240,0.3)' }}>·</span>
        </span>
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
    }, 2600);
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
          paddingBottom: '5rem',
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

        {/* Directional overlay: dark on left for text, resolving fully to solid charcoal at the bottom edge (no fade-to-light here — that happens in the strip below instead) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(23,23,23,0.55) 0%, rgba(23,23,23,0.4) 35%, rgba(23,23,23,0.85) 100%),
              linear-gradient(90deg, rgba(23,23,23,0.92) 0%, rgba(23,23,23,0.7) 35%, rgba(23,23,23,0.25) 65%, rgba(23,23,23,0.1) 100%)
            `,
            zIndex: 1,
          }}
        />

        <div className="hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-left">
            <div className="hero-eyebrow reveal visible" style={{ color: '#F36B21' }}>
              Software Engineering Studio
            </div>
            <h1 className="hero-title reveal visible" style={{ color: '#F7F5F0' }}>
              We build software
              <br />
              that's{' '}
              <span
                className="hero-word"
                style={{
                  opacity: fading ? 0 : 1,
                  transform: fading ? 'translateY(-12px)' : 'translateY(0)',
                  color: '#F36B21',
                }}
              >
                {WORDS[wordIdx]}
              </span>
            </h1>
            <p className="hero-desc reveal visible" style={{ color: 'rgba(247,245,240,0.72)' }}>
              We are a software engineering company building web, mobile, and custom platforms for startups and funded founders.
            </p>
            <div className="hero-ctas reveal visible">
              <a href="/contact" className="btn-primary">
                Start a Project →
              </a>
              <a
                href="#services"
                className="btn-outline"
                style={{ color: '#F7F5F0', borderColor: 'rgba(247,245,240,0.35)' }}
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="hero-right reveal visible" />
        </div>
      </section>

      {/* Ticker lives in its own solid section — guaranteed contrast, real breathing room */}
      <div
        style={{
          background: '#171717',
          borderTop: '1px solid rgba(247,245,240,0.08)',
          padding: '2.75rem 0',
        }}
      >
        <div className="ticker-section" style={{ position: 'relative' }}>
          <div className="ticker-eyebrow" style={{ color: '#F36B21' }}>
            Selected Work
          </div>
          <div className="ticker-rule" style={{ background: 'rgba(247,245,240,0.18)' }}></div>
          <div className="ticker-wrap">
            <div className="ticker-track">
              <TickerGroup />
              <TickerGroup />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}