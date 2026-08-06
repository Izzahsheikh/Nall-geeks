export default function ServiceStrips() {
  return (
    <section className="strips-section">
      <div className="strips-inner">
        {/* Web Development */}
        <div className="strip-row reveal visible">
          <div className="strip-text">
            <div className="strip-tag">
              <div className="strip-tag-icon">{'</>'}</div>
              <span className="strip-tag-label">Web Development</span>
            </div>
            <h3>Sub-second web apps that hit 100 on Core Web Vitals.</h3>
            <p>
              Most agencies stack plugins until your site crawls. We write lean code that loads fast — no shortcuts, no
              caching band-aids.
            </p>
            <a href="#work" className="btn-ghost">
              See our projects →
            </a>
          </div>
          <div className="strip-visual">
            <div className="browser-card">
              <div className="browser-window">
                <div className="browser-dots">
                  <div className="browser-dot"></div>
                  <div className="browser-dot gray"></div>
                  <div className="browser-dot gray"></div>
                  <div className="browser-url">
                    <span>nallgeeks.com</span>
                  </div>
                </div>
                <div className="browser-line"></div>
                <div className="browser-line small"></div>
                <div className="browser-boxes">
                  <div className="browser-box accent"></div>
                  <div className="browser-box"></div>
                  <div className="browser-box"></div>
                </div>
              </div>
              <div className="score-row">
                <div className="score-chip orange">Performance: 100</div>
                <div className="score-chip dark">SEO: 100</div>
                <div className="score-chip dark">A11y: 98</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Apps */}
        <div className="strip-row flip reveal visible">
          <div className="strip-text">
            <div className="strip-tag">
              <div className="strip-tag-icon">📱</div>
              <span className="strip-tag-label">Mobile Apps</span>
            </div>
            <h3>One app, built once. Works great on iPhone and Android.</h3>
            <p>
              No lag. No glitches. No moments where it feels like a website in a wrapper. Just something that works the
              way people expect.
            </p>
            <a href="#work" className="btn-ghost">
              See our projects →
            </a>
          </div>
          <div className="strip-visual">
            <div className="phone-frame-wrap">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-topbar">NallGeeks App</div>
                  <div className="phone-body">
                    <div className="phone-block">Dashboard</div>
                    <div className="phone-row">
                      <div className="phone-avatar"></div>
                      <div style={{ flex: 1 }}>
                        <div className="phone-line" style={{ width: '70%' }}></div>
                        <div className="phone-line sm" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="phone-row">
                      <div className="phone-avatar violet"></div>
                      <div style={{ flex: 1 }}>
                        <div className="phone-line" style={{ width: '55%' }}></div>
                        <div className="phone-line sm" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="phone-cta-row">
                      <div className="phone-cta orange">iOS</div>
                      <div className="phone-cta gray">Android</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UI/UX */}
        <div className="strip-row reveal visible">
          <div className="strip-text">
            <div className="strip-tag">
              <div className="strip-tag-icon">🎨</div>
              <span className="strip-tag-label">UI/UX Design</span>
            </div>
            <h3>Designs that are easy to use, not just easy to look at.</h3>
            <p>
              Pretty is table stakes. We design for the moment a user figures something out without being told —
              that's what retention looks like.
            </p>
            <a href="#work" className="btn-ghost">
              See our projects →
            </a>
          </div>
          <div className="strip-visual">
            <div className="ux-card">
              <div className="ux-inner">
                <div className="ux-title">User Flow</div>
                <div className="ux-flow">
                  <div className="ux-step active">Onboard</div>
                  <div className="ux-connector"></div>
                  <div className="ux-step inactive">Explore</div>
                  <div className="ux-connector"></div>
                  <div className="ux-step inactive">Convert</div>
                </div>
                <div className="ux-preview">
                  <div className="ux-preview-line" style={{ width: '80%' }}></div>
                  <div className="ux-preview-line" style={{ width: '55%' }}></div>
                  <div className="ux-preview-line" style={{ width: '65%', marginBottom: 0 }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud/DevOps */}
        <div className="strip-row flip reveal visible" style={{ borderBottom: 'none' }}>
          <div className="strip-text">
            <div className="strip-tag">
              <div className="strip-tag-icon">☁</div>
              <span className="strip-tag-label">Cloud & DevOps</span>
            </div>
            <h3>Deployments that don't wake you up at 3am.</h3>
            <p>
              Most teams find out their infrastructure is fragile during an outage. We set up monitoring,
              auto-scaling, and rollback before that happens.
            </p>
            <a href="#work" className="btn-ghost">
              See our projects →
            </a>
          </div>
          <div className="strip-visual">
            <div className="infra-card">
              <div className="infra-head">
                <span className="infra-title">Infrastructure</span>
                <span className="infra-status">
                  <span className="pulse-dot"></span>All Operational
                </span>
              </div>
              <div className="infra-list">
                <div className="infra-row">
                  <span className="infra-row-name">API Gateway</span>
                  <span className="infra-badge green">99.9% uptime</span>
                </div>
                <div className="infra-row">
                  <span className="infra-row-name">Database Cluster</span>
                  <span className="infra-badge green">Healthy</span>
                </div>
                <div className="infra-row">
                  <span className="infra-row-name">Auto-scaling</span>
                  <span className="infra-badge orange">Active</span>
                </div>
                <div className="infra-row">
                  <span className="infra-row-name">CDN Nodes</span>
                  <span className="infra-badge green">12 regions live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
