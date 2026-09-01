import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import logo from '../assets/nallgeeks-logo-ng-only.png';

const LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#career', label: 'Career' },
  { href: '#contact', label: 'Contact' },
];

const BRAND_TEXT = 'NallGeeks';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#hero');
  const [spotlight, setSpotlight] = useState({ left: 0, width: 0 });
  const linksWrapRef = useRef(null);
  const linkRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const updateSpotlight = () => {
      const wrap = linksWrapRef.current;
      const activeLink = linkRefs.current[activeHref];

      if (!wrap || !activeLink) return;

      const wrapRect = wrap.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      setSpotlight({
        left: linkRect.left - wrapRect.left,
        width: linkRect.width,
      });
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);

    return () => window.removeEventListener('resize', updateSpotlight);
  }, [activeHref]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#hero" className="navbar-logo">
            <img src={logo} alt="NallGeeks logo" />
            <span className="navbar-wordmark" aria-label={BRAND_TEXT}>
              {BRAND_TEXT.split('').map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="brand-letter"
                  aria-hidden="true"
                  style={{ '--letter-index': index }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </a>
          <div className="nav-links-wrap" ref={linksWrapRef}>
            <span
              className="nav-spotlight"
              style={{
                transform: `translateX(${spotlight.left}px)`,
                width: `${spotlight.width}px`,
              }}
            />
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                ref={(el) => {
                  linkRefs.current[l.href] = el;
                }}
                className={`nav-link hover-accent${activeHref === l.href ? ' active' : ''}`}
                onClick={() => setActiveHref(l.href)}
              >
                {l.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="btn-primary navbar-cta" onClick={() => setActiveHref('#contact')}>
            Book a Call
          </a>
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
            <a
              key={l.href}
              href={l.href}
              className={activeHref === l.href ? 'active' : ''}
              onClick={() => {
                setActiveHref(l.href);
                setMobileOpen(false);
              }}
            >
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
