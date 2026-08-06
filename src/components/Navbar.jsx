import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#career', label: 'Career' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#hero" className="navbar-logo">
            <img src="/uploads/PHOTO-2026-08-03-21-23-52.jpg" alt="NallGeeks" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span>NallGeeks</span>
          </a>
          <div className="nav-links-wrap">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link hover-accent">
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 22px' }}>
              Book a Call
            </a>
          </div>
          <button className="hamburger" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mob-menu">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <div style={{ padding: '1rem 5%' }}>
            <a
              href="#contact"
              className="btn-primary"
              onClick={() => setMobileOpen(false)}
              style={{ display: 'inline-block' }}
            >
              Book a Call
            </a>
          </div>
        </div>
      )}
    </>
  );
}
