import WebsiteBuildProcess from './WebsiteBuildProcess';

/*
 * Shared layout for the six /services/* pages: header, "Our Work" photo grid, and optional CTA band.
 * The Navbar and Footer are rendered by App.jsx around every page, so they aren't repeated here.
 *
 * `photos` is an optional list of { src, alt, width, height } objects (width/height are the file's pixel size, so the browser
 * can reserve space). When projects are supplied, only project/photo pairs are rendered so the grid never leaves empty slots.
 */
function renderServiceTitle(title) {
  if (typeof title !== 'string') return title;

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
  eyebrow = 'Services',
  description,
  children = null,
  photos = [],
  projects = [],
  processSteps = [],
  buildTypes = [],
  platformSection = null,
  pageClassName = '',
  heroActions = null,
  heroAside = null,
  hideWork = false,
  hideCta = false,
}) {
  const hasWebDevelopmentContent = processSteps.length > 0;
  const workItems = projects.length
    ? projects
        .map((project, index) => ({ project, photo: photos[index] }))
        .filter(({ project, photo }) => project && photo)
    : photos.map((photo) => ({ photo })).filter(({ photo }) => photo);
  const workColumns = Math.min(Math.max(workItems.length, 1), 3);

  return (
    <main className={`sp${hasWebDevelopmentContent ? ' sp--web-development' : ''}${pageClassName ? ` ${pageClassName}` : ''}`}>
      <section className="sp-header" data-nav-hero>
        <div className={`sp-inner sp-hero-layout${heroAside ? ' sp-hero-layout--split' : ''}`}>
          <div className="sp-hero-copy">
            <div className="sp-eyebrow">{eyebrow}</div>
            <h1 className="sp-title">{renderServiceTitle(title)}</h1>
            <p className="sp-desc">{description}</p>
            {heroActions && <div className="sp-hero-actions">{heroActions}</div>}
          </div>
          {heroAside && <div className="sp-hero-aside" aria-hidden="true">{heroAside}</div>}
        </div>
      </section>

      {hasWebDevelopmentContent && <WebsiteBuildProcess />}

      {platformSection && (
        <section className="sp-platform" aria-labelledby="sp-platform-title">
          <div className="sp-inner">
            <div className="sp-label">{platformSection.eyebrow}</div>
            <h2 className="sp-subtitle" id="sp-platform-title">{platformSection.title}</h2>
            <p className="sp-platform-intro">{platformSection.intro}</p>
            <div className="sp-platform-grid">
              {platformSection.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <article className="sp-platform-card" key={item.title}>
                    <span className="sp-platform-icon" aria-hidden="true">
                      <ItemIcon size={22} strokeWidth={1.8} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {children}

      {!hideWork && (
        <section className={`sp-work${hasWebDevelopmentContent ? ' reveal' : ''}`}>
          <div className="sp-inner">
            {hasWebDevelopmentContent ? (
              <header className="sp-work-head">
                <div className="sp-label">Our Work</div>
                <h2 className="sp-subtitle">What We’ve Built</h2>
                <p>A selection of recent websites, designed and built end to end.</p>
              </header>
            ) : (
              <>
                <div className="sp-label">Our Work</div>
                <h2 className="sp-subtitle">A few things we've built</h2>
              </>
            )}
            <div
              className={`sp-grid${photos.length ? ' sp-grid--photos' : ''}${projects.length ? ' sp-grid--projects' : ''}`}
              style={{ '--sp-work-columns': workColumns }}
            >
              {workItems.map(({ project, photo }) => (
                project ? (
                  <article className="sp-project" key={project.name}>
                    <div className="sp-project-image">
                      <img
                        className="sp-card-img"
                        src={photo.src}
                        alt={photo.alt || ''}
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="sp-project-content">
                      {project.category && <span className="sp-project-category">{project.category}</span>}
                      <h3>{project.name}</h3>
                      {project.description && <p>{project.description}</p>}
                      {project.tags?.length > 0 && (
                        <ul className="sp-tags" aria-label="Project features">
                          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                        </ul>
                      )}
                    </div>
                  </article>
                ) : (
                  <div className="sp-card sp-card--photo" key={photo.src}>
                    <img className="sp-card-img" src={photo.src} alt={photo.alt || ''} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {hasWebDevelopmentContent && (
        <section className="sp-build reveal" aria-labelledby="sp-build-title">
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
      )}

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
