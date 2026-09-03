import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import logo from '../assets/nallgeeks-logo-mark.png';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/#work', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/#career', label: 'Career' },
  { href: '/contact', label: 'Contact' },
];

const BRAND_TEXT = 'NallGeeks';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(() => {
    if (window.location.pathname === '/about') return '/about';
    if (window.location.pathname === '/contact') return '/contact';
    return window.location.hash ? `/${window.location.hash}` : '/';
  });
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

  const handleNavClick = (event, href, closeMobile = false) => {
    event.preventDefault();
    setActiveHref(href);

    if (closeMobile) setMobileOpen(false);

    if (href === '/about' || href === '/contact') {
      if (window.location.pathname === href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      window.location.assign(href);
      return;
    }

    if (href === '/') {
      if (window.location.pathname !== '/') {
        window.location.assign('/');
        return;
      }

      const hero = document.querySelector('#hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '/');
      return;
    }

    const targetHash = href.replace('/', '');
    if (window.location.pathname !== '/') {
      window.location.assign(href);
      return;
    }

    const target = document.querySelector(targetHash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="/" className="navbar-logo" onClick={(e) => handleNavClick(e, '/')}>
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
                onClick={(e) => handleNavClick(e, l.href)}
              >
                {l.label}
              </a>
            ))}
          </div>
          <a href="/contact" className="btn-primary navbar-cta" onClick={(e) => handleNavClick(e, '/contact')}>
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
              onClick={(e) => handleNavClick(e, l.href, true)}
            >
              {l.label}
            </a>
          ))}
          <div style={{ padding: '1rem 5%' }}>
            <a
              href="/contact"
              className="btn-primary"
              onClick={(e) => handleNavClick(e, '/contact', true)}
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
