export default function Work() {
  return (
    <section id="work" className="work-section">
      <div className="section-inner">
        <div className="section-head reveal visible">
          <div className="section-eyebrow">Selected Work</div>
          <h2>A few things we've built recently.</h2>
          <p>Real products, shipped and running — not concepts.</p>
        </div>

        <div className="proj-row reveal visible">
          {/* OrganicFields */}
          <div className="proj-card">
            <div className="proj-frame">
              <div className="proj-screen" style={{ background: '#1A2E1A' }}>
                <div className="of-topbar">
                  <span>OrganicFields.pk</span>
                </div>
                <div className="of-promo">🌿 LYCHEE SEASON — ORDER NOW →</div>
                <div className="of-body">
                  <div className="of-headline">Fresh from the Farm to Your Home</div>
                  <div className="of-line w70"></div>
                  <div className="of-line w50"></div>
                  <div className="of-cta">Order Now →</div>
                </div>
              </div>
            </div>
            <div className="proj-name">OrganicFields.pk</div>
            <div className="proj-type">E-Commerce App</div>
          </div>

          {/* Zylo */}
          <div className="proj-card offset">
            <div className="proj-frame">
              <div className="proj-screen" style={{ background: '#080B14' }}>
                <div className="zylo-topbar">
                  <span className="zylo-topbar-title">
                    Zylo <span className="zylo-ai-badge">AI</span>
                  </span>
                  <span className="zylo-topbar-meta">This Week</span>
                </div>
                <div className="zylo-body">
                  <div className="zylo-focus-label">DAILY FOCUS</div>
                  <div className="zylo-task">
                    <div className="zylo-task-dot"></div>
                    <div style={{ flex: 1 }}>
                      <div className="zylo-task-title">Let AI handle everything</div>
                      <div className="zylo-tags">
                        <span className="zylo-tag orange">Create Task</span>
                        <span className="zylo-tag violet">Draft</span>
                      </div>
                    </div>
                  </div>
                  <div className="zylo-block">
                    <div className="phone-line" style={{ width: '80%' }}></div>
                    <div className="phone-line sm" style={{ width: '60%' }}></div>
                  </div>
                  <div className="zylo-block">
                    <div className="phone-line" style={{ width: '70%' }}></div>
                    <div className="phone-line sm" style={{ width: '45%' }}></div>
                  </div>
                  <div className="zylo-add">+ Add Task</div>
                </div>
              </div>
            </div>
            <div className="proj-name">Zylo</div>
            <div className="proj-type">Productivity App</div>
          </div>

          {/* RankGrad */}
          <div className="proj-card">
            <div className="proj-frame">
              <div className="proj-screen" style={{ background: '#fff' }}>
                <div className="rg-topbar">
                  <span className="rg-brand">
                    <span>▪</span>RankGrad
                  </span>
                  <div className="rg-nav">
                    <span>Sign In</span>
                    <span>Get Started</span>
                  </div>
                </div>
                <div className="rg-body">
                  <div className="rg-tagline">Pakistan's #1 Merit-Based Platform</div>
                  <div className="rg-headline">Screened Jobs &amp; Internships for Top Graduates</div>
                  <div className="rg-listings">
                    <div className="rg-listing">
                      <div className="rg-listing-icon"></div>
                      <div className="rg-listing-lines">
                        <div className="rg-listing-line" style={{ width: '80%' }}></div>
                        <div className="rg-listing-line sm" style={{ width: '50%' }}></div>
                      </div>
                      <span className="rg-apply">Apply</span>
                    </div>
                    <div className="rg-listing">
                      <div className="rg-listing-icon"></div>
                      <div className="rg-listing-lines">
                        <div className="rg-listing-line" style={{ width: '65%' }}></div>
                        <div className="rg-listing-line sm" style={{ width: '40%' }}></div>
                      </div>
                      <span className="rg-apply">Apply</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="proj-name">RankGrad</div>
            <div className="proj-type">Hiring Platform</div>
          </div>
        </div>

        <div className="work-cta reveal visible">
          <a href="#contact" className="btn-ghost light">
            See all projects →
          </a>
        </div>
      </div>
    </section>
  );
}
