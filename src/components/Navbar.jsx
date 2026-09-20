import { useEffect, useRef, useState } from 'react';
import { SERVICE_MENU, SERVICES_HREF, ChevronDown, ArrowRight } from './navbar/serviceMenu';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services', hasMenu: true },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Career' },
  { href: '/contact', label: 'Contact' },
];

const BRAND_TEXT = 'NallGeeks';

// A dark hero at the top of the page. The bar is transparent over it; pages without one (contact, job pages) have a light
// background at the top, where transparent bar + white links would be unreadable, so they get the glass bar from the start.
const HERO_SELECTOR = '#hero, .abx-hero, [data-nav-hero]';

const SCROLL_THRESHOLD = 50;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [glass, setGlass] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // desktop dropdown under "Services"
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // the same list, expanded inside the mobile menu
  const closeTimer = useRef(null);
  const skipFocusOpen = useRef(false);
  const [activeHref, setActiveHref] = useState(() => {
    if (window.location.pathname === '/about') return '/about';
    if (window.location.pathname === '/contact') return '/contact';
    if (window.location.pathname === '/projects') return '/projects';
    if (window.location.pathname.startsWith('/careers')) return '/careers';
    return window.location.hash ? `/${window.location.hash}` : '/';
  });

  useEffect(() => {
    const update = () => {
      const pastTop = window.scrollY >= SCROLL_THRESHOLD;
      setScrolled(pastTop);
      setGlass(pastTop || !document.querySelector(HERO_SELECTOR));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
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

  // Small delay on close so the pointer can cross the gap between "Services" and the panel without the panel vanishing.
  const openServices = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  // Focus arriving on "Services" opens the menu, except when we just moved it there ourselves to close the menu (Escape).
  const handleServicesFocus = () => {
    if (skipFocusOpen.current) return;
    openServices();
  };
  const closeServices = (delay = 120) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), delay);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Arriving on a URL with a #hash (e.g. "/#services" from another page): the browser tries to scroll before React has drawn the
  // section, so it stays at the top. Scroll once the page is mounted.
  useEffect(() => {
    const { hash } = window.location;
    if (!hash || hash === '#') return;
    try {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    } catch {
      /* not a valid selector: ignore */
    }
  }, []);
  useEffect(() => {
    if (!mobileOpen) setMobileServicesOpen(false);
  }, [mobileOpen]);

  const handleNavClick = (event, href, closeMobile = false) => {
    event.preventDefault();
    setActiveHref(href);
    setServicesOpen(false);

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
      <nav className={`navbar${scrolled ? ' scrolled' : ''}${glass ? ' glass' : ''}`}>
        <div className="navbar-inner">
          <a href="/" className="navbar-logo" onClick={(e) => handleNavClick(e, '/')}>
            <span className="navbar-logo-mark">
              <img src="/nallgeeks-logo-mark.png" width="1665" height="944" alt="NallGeeks logo" />
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
            {LINKS.map((l) => {
              const link = (
                <a
                  key={l.href}
                  href={l.href}
                  className={`nav-link${activeHref === l.href ? ' active' : ''}`}
                  aria-current={activeHref === l.href ? 'page' : undefined}
                  aria-haspopup={l.hasMenu ? 'true' : undefined}
                  aria-expanded={l.hasMenu ? servicesOpen : undefined}
                  onClick={(e) => handleNavClick(e, l.href)}
                >
                  {l.label}
                </a>
              );
              if (!l.hasMenu) return link;

              return (
                <div
                  key={l.href}
                  className={`nav-item${servicesOpen ? ' open' : ''}`}
                  onMouseEnter={openServices}
                  onMouseLeave={() => closeServices()}
                  onFocus={handleServicesFocus}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) closeServices(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Escape') return;
                    clearTimeout(closeTimer.current);
                    setServicesOpen(false);
                    skipFocusOpen.current = true;
                    e.currentTarget.querySelector('.nav-link')?.focus();
                    setTimeout(() => { skipFocusOpen.current = false; }, 0);
                  }}
                >
                  {link}
                  {/* Hover/focus dropdown (desktop only: the whole link group is hidden below 960px). */}
                  <div className="nav-dropdown" aria-hidden={!servicesOpen} inert={!servicesOpen}>
                    <div className="nav-dropdown-panel">
                      <ul className="nav-dd-list">
                        {SERVICE_MENU.map((item) => (
                          <li key={item.title}>
                            <a href={SERVICES_HREF} className="nav-dd-item" onClick={(e) => handleNavClick(e, SERVICES_HREF)}>
                              <span className="nav-dd-icon">{item.icon}</span>
                              <span className="nav-dd-text">
                                <span className="nav-dd-title">{item.title}</span>
                                <span className="nav-dd-desc">{item.description}</span>
                              </span>
                              <span className="nav-dd-arrow"><ArrowRight /></span>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="nav-dd-footer">
                        <a href={SERVICES_HREF} className="nav-dd-all" onClick={(e) => handleNavClick(e, SERVICES_HREF)}>
                          View all services <ArrowRight />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
          {LINKS.map((l) =>
            l.hasMenu ? (
              <div key={l.href} className="mob-group">
                <button
                  type="button"
                  className={`mob-toggle${mobileServicesOpen ? ' open' : ''}`}
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mob-services"
                  onClick={() => setMobileServicesOpen((v) => !v)}
                >
                  {l.label}
                  <span className="mob-chevron"><ChevronDown /></span>
                </button>
                <div id="mob-services" className={`mob-sub${mobileServicesOpen ? ' open' : ''}`} inert={!mobileServicesOpen}>
                  <div className="mob-sub-inner">
                    <ul className="mob-sub-list">
                      {SERVICE_MENU.map((item) => (
                        <li key={item.title}>
                          <a href={SERVICES_HREF} className="mob-sub-item" onClick={(e) => handleNavClick(e, SERVICES_HREF, true)}>
                            <span className="nav-dd-icon">{item.icon}</span>
                            <span className="nav-dd-text">
                              <span className="nav-dd-title">{item.title}</span>
                              <span className="nav-dd-desc">{item.description}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                      <li>
                        <a href={SERVICES_HREF} className="mob-sub-all" onClick={(e) => handleNavClick(e, SERVICES_HREF, true)}>
                          View all services <ArrowRight />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className={`mob-link${activeHref === l.href ? ' active' : ''}`}
                aria-current={activeHref === l.href ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, l.href, true)}
              >
                {l.label}
              </a>
            )
          )}
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
