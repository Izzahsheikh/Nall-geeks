import { useEffect, useRef, useState } from 'react';
import logoDark from '../assets/nallgeeks-logo-mark.png';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Career' },
  { href: '/contact', label: 'Contact' },
];

const BRAND_TEXT = 'NallGeeks';

// The dark section(s) at the top of a page: the hero, plus the dark strip that follows it on the homepage.
// Pages without one (contact, job pages) start in the light state.
const HERO_SELECTOR = '#hero, .ngc-hero, .abx-hero, [data-nav-hero]';

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [overLight, setOverLight] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(() => {
    if (window.location.pathname === '/about') return '/about';
    if (window.location.pathname === '/contact') return '/contact';
    if (window.location.pathname === '/projects') return '/projects';
    if (window.location.pathname.startsWith('/careers')) return '/careers';
    return window.location.hash ? `/${window.location.hash}` : '/';
  });

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      // Dark while the hero is under the bar, light once the hero has scrolled past it. The switch happens when the
      // hero's bottom edge crosses the middle of the bar, so the bar never sits half over the hero and half over light content.
      const heroBottom = Math.max(
        0,
        ...Array.from(document.querySelectorAll(HERO_SELECTOR), (el) => el.getBoundingClientRect().bottom + y)
      );
      const barMiddle = (navRef.current?.offsetHeight || 72) / 2;
      setOverLight(y + barMiddle >= heroBottom);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 960) setMobileOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  const handleNavClick = (event, href, closeMobile = false) => {
    event.preventDefault();
    setActiveHref(href);

    if (closeMobile) setMobileOpen(false);

    if (href === '/about' || href === '/contact' || href === '/projects' || href === '/careers') {
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
      <nav ref={navRef} className={`navbar${scrolled ? ' scrolled' : ''}${overLight ? ' on-light' : ''}`}>
        <div className="navbar-inner">
          <a href="/" className="navbar-logo" onClick={(e) => handleNavClick(e, '/')}>
            {/* Two marks that crossfade: the cream one reads on the dark bar, the original dark one on the light bar. */}
            <span className="navbar-logo-mark">
              <img className="logo-on-dark" src="/nallgeeks-logo-mark-clean.png" width="1536" height="1024" alt="NallGeeks logo" />
              <img className="logo-on-light" src={logoDark} alt="" aria-hidden="true" />
            </span>
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
          <div className="nav-links-wrap">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link${activeHref === l.href ? ' active' : ''}`}
                aria-current={activeHref === l.href ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, l.href)}
              >
                {l.label}
              </a>
            ))}
          </div>
          <a href="/contact" className="btn-primary navbar-cta" onClick={(e) => handleNavClick(e, '/contact')}>
            Book a Call
          </a>
          <button
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className={`mob-menu${scrolled ? ' scrolled' : ''}`}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`mob-link${activeHref === l.href ? ' active' : ''}`}
              aria-current={activeHref === l.href ? 'page' : undefined}
              onClick={(e) => handleNavClick(e, l.href, true)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/contact"
            className="btn-primary navbar-cta"
            onClick={(e) => handleNavClick(e, '/contact', true)}
          >
            Book a Call
          </a>
        </div>
      )}
    </>
  );
}
