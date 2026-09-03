import { useEffect, useRef, useState } from 'react';

const WORDS = ['Yours.', 'Fast.', 'Scalable.', 'Profitable.'];
const TICKER_ITEMS = ['NEXORA', 'HELIX', 'FORMA', 'PULSE', 'ORGANICFIELDS', 'RANKGRAD', 'CDS', 'ZYLO'];

function useCountUp(target, format, duration = 1500, delay = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        setValue(Math.round(easeOut(p) * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return format(value);
}

function TickerGroup() {
  return (
    <span className="ticker-group">
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3rem' }}>
          <span className="ticker-item">{item}</span>
          <span className="ticker-dot">·</span>
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

  const revenue = useCountUp(124, (v) => `$${v}K`);
  const users = useCountUp(8420, (v) => v.toLocaleString());
  const orders = useCountUp(1893, (v) => v.toLocaleString());
  const uptime = useCountUp(999, (v) => (v / 10).toFixed(1) + '%');

  return (
    <section id="hero" className="hero">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-eyebrow reveal visible">Software Engineering Studio</div>
          <h1 className="hero-title reveal visible">
            We build software
            <br />
            that's{' '}
            <span
              className="hero-word"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? 'translateY(-12px)' : 'translateY(0)',
              }}
            >
              {WORDS[wordIdx]}
            </span>
          </h1>
          <p className="hero-desc reveal visible">
            We are a software engineering company building web, mobile, and custom platforms for startups and funded founders.
          </p>
          <div className="hero-ctas reveal visible">
            <a href="/contact" className="btn-primary">
              Start a Project →
            </a>
            <a href="#services" className="btn-outline">
              Learn More
            </a>
          </div>
        </div>

        <div className="hero-right reveal visible">
          <div className="dash-card">
            <div className="dash-header">
              <span className="dash-title">Analytics Dashboard</span>
              <span className="dash-live">● LIVE</span>
            </div>
            <div className="dash-stats">
              <div className="dash-stat">
                <div className="dash-stat-label">Revenue</div>
                <div className="dash-stat-value">{revenue}</div>
                <div className="dash-stat-delta">
                  <span className="pulse-dot"></span>12.4% this month
                </div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-label">Active Users</div>
                <div className="dash-stat-value">{users}</div>
                <div className="dash-stat-delta">
                  <span className="pulse-dot"></span>8.1% this week
                </div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-label">Orders</div>
                <div className="dash-stat-value">{orders}</div>
                <div className="dash-stat-delta orange">
                  <span className="pulse-dot orange"></span>23.7% this week
                </div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-label">Uptime</div>
                <div className="dash-stat-value">{uptime}</div>
                <div className="dash-stat-delta">
                  <span className="pulse-dot"></span>All systems online
                </div>
              </div>
            </div>
            <div className="dash-chart">
              <div className="dash-chart-label">Weekly Growth</div>
              <div className="dash-bars">
                {[35, 50, 65, 55, 80, 100, 88].map((h, i) => (
                  <div key={i} className="dash-bar" style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.3 + i * 0.08 }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ticker-section">
        <div className="ticker-eyebrow">Selected Work</div>
        <div className="ticker-rule"></div>
        <div className="ticker-wrap">
          <div className="ticker-track">
            <TickerGroup />
            <TickerGroup />
          </div>
        </div>
      </div>
    </section>
  );
}
