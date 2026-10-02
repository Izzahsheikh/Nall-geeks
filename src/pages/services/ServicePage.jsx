import { useEffect, useRef, useState } from 'react';

/*
 * Shared layout for the six /services/* pages: header, "Our Work" photo grid, and optional CTA band.
 * The Navbar and Footer are rendered by App.jsx around every page, so they aren't repeated here.
 *
 * `photos` is an optional list of up to three { src, alt, width, height } objects (width/height are the file's pixel size, so the browser
 * can reserve space). A photo slot without one shows the "coming soon" placeholder. Passing any photos also switches the grid to the
 * photo layout: whole screenshots shown at a fixed ratio, 3 columns on desktop, 2 on tablet, 1 on phones.
 */
const SLOTS = [0, 1, 2];

function renderServiceTitle(title) {
  const words = title.trim().split(/\s+/);

  if (words.length < 2) return title;

  const lastWord = words.pop();

  return (
    <>
      {words.join(' ')} <em>{lastWord}</em>
    </>
  );
}

export default function ServicePage({
  title,
  description,
  photos = [],
  projects = [],
  processSteps = [],
  buildTypes = [],
  hideCta = false,
}) {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const processRef = useRef(null);
  const hasWebDevelopmentContent = processSteps.length > 0;

  useEffect(() => {
    if (!hasWebDevelopmentContent) return undefined;

    if (!('IntersectionObserver' in window)) {
      setVisibleSteps(processSteps.map((_, index) => index));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      const newlyVisible = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => Number(entry.target.dataset.stepIndex));

      if (newlyVisible.length) {
        setVisibleSteps((current) => [...new Set([...current, ...newlyVisible])]);
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -32px 0px' });

    const steps = processRef.current?.querySelectorAll('.sp-process-step') ?? [];
    steps.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, [hasWebDevelopmentContent, processSteps]);

  return (
    <main className={`sp${hasWebDevelopmentContent ? ' sp--web-development' : ''}`}>
      <section className="sp-header">
        <div className="sp-inner">
          <div className="sp-eyebrow">Services</div>
          <h1 className="sp-title">{renderServiceTitle(title)}</h1>
          <p className="sp-desc">{description}</p>

        </div>
      </section>

      {hasWebDevelopmentContent && (
        <>
          <section className="sp-process" aria-labelledby="sp-process-title" ref={processRef}>
            <div className="sp-inner">
              <div className="sp-label">A clear path from idea to launch</div>
              <h2 className="sp-subtitle" id="sp-process-title">How We Build Your Website</h2>
              <ol className="sp-process-grid">
                {processSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <li
                      className={`sp-process-step${visibleSteps.includes(index) ? ' is-visible' : ''}`}
                      key={step.number}
                      data-step-index={index}
                      style={{ '--step-delay': `${index * 100}ms` }}
                    >
                      <span className="sp-step-marker" aria-hidden="true">
                        <StepIcon size={20} strokeWidth={1.8} />
                      </span>
                      <span className="sp-step-number" aria-hidden="true">{step.number}</span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section className="sp-build" aria-labelledby="sp-build-title">
            <div className="sp-inner">
              <div className="sp-label">Built around your goals</div>
              <h2 className="sp-subtitle" id="sp-build-title">What we build</h2>
              <div className="sp-build-grid">
                {buildTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <article className="sp-build-card" key={type.title}>
                      <TypeIcon size={23} strokeWidth={1.8} aria-hidden="true" />
                      <div>
                        <h3>{type.title}</h3>
                        <p>{type.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="sp-work">
        <div className="sp-inner">
          <div className="sp-label">Our Work</div>
          <h2 className="sp-subtitle">A few things we've built</h2>
          <div className={`sp-grid${photos.length ? ' sp-grid--photos' : ''}${projects.length ? ' sp-grid--projects' : ''}`}>
            {SLOTS.map((slot) => (
              projects[slot] && photos[slot] ? (
                <article className="sp-project" key={slot}>
                  <div className="sp-project-image">
                    <img
                      className="sp-card-img"
                      src={photos[slot].src}
                      alt={photos[slot].alt || ''}
                      width={photos[slot].width}
                      height={photos[slot].height}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="sp-project-content">
                    <h3>{projects[slot].name}</h3>
                    <p>{projects[slot].description}</p>
                    <ul className="sp-tags" aria-label="Project features">
                      {projects[slot].tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                </article>
              ) : (
                <div className={`sp-card${photos[slot] ? ' sp-card--photo' : ''}`} key={slot}>
                  {photos[slot] ? (
                    <img className="sp-card-img" src={photos[slot].src} alt={photos[slot].alt || ''} width={photos[slot].width} height={photos[slot].height} loading="lazy" decoding="async" />
                  ) : (
                    <>
                      <span className="sp-card-icon" aria-hidden="true">📷</span>
                      <span className="sp-card-text">Project photo coming soon</span>
                    </>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {!hideCta && (
        <div className="sp-inner sp-cta-wrap">
          <section className="sp-cta">
            <div>
              <h2>Ready to build something?</h2>
              <p>Let's talk about what you need.</p>
            </div>
            <a href="/contact" className="sp-cta-btn">Book a Call →</a>
          </section>
        </div>
      )}
    </main>
  );
}
