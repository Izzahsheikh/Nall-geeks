/*
 * Shared layout for the six /services/* pages: header, "Our Work" photo grid, and the Book a Call band.
 * The Navbar and Footer are rendered by App.jsx around every page, so they aren't repeated here.
 *
 * `photos` is an optional list of up to three { src, alt, width, height } objects (width/height are the file's pixel size, so the browser
 * can reserve space). A photo slot without one shows the "coming soon" placeholder. Passing any photos also switches the grid to the
 * photo layout: whole screenshots shown at a fixed ratio, 3 columns on desktop, 2 on tablet, 1 on phones.
 */
const SLOTS = [0, 1, 2];

export default function ServicePage({ title, description, photos = [] }) {
  return (
    <main className="sp">
      <section className="sp-header">
        <div className="sp-inner">
          <h1 className="sp-title">{title}</h1>
          <p className="sp-desc">{description}</p>
        </div>
      </section>

      <section className="sp-work">
        <div className="sp-inner">
          <div className="sp-label">Our Work</div>
          <h2 className="sp-subtitle">A few things we've built</h2>
          <div className={`sp-grid${photos.length ? ' sp-grid--photos' : ''}`}>
            {SLOTS.map((slot) => (
              <div className={`sp-card${photos[slot] ? ' sp-card--photo' : ''}`} key={slot}>
                {/* Replace with <img> tag when project photo is ready */}
                {photos[slot] ? (
                  <img className="sp-card-img" src={photos[slot].src} alt={photos[slot].alt || ''} width={photos[slot].width} height={photos[slot].height} loading="lazy" decoding="async" />
                ) : (
                  <>
                    <span className="sp-card-icon" aria-hidden="true">📷</span>
                    <span className="sp-card-text">Project photo coming soon</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sp-inner sp-cta-wrap">
        <section className="sp-cta">
          <div>
            <h2>Ready to build something?</h2>
            <p>Let's talk about what you need.</p>
          </div>
          <a href="/contact" className="sp-cta-btn">Book a Call →</a>
        </section>
      </div>
    </main>
  );
}
