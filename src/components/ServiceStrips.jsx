import webImg from '../assets/services/website.jpeg';
import mobileImg from '../assets/services/mobileApp.jpeg';
import uiImg from '../assets/services/UI.png';
import cloudImg from '../assets/services/cloud.png';

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
            <a href="/projects" className="btn-ghost">See our projects →</a>
          </div>
          <div className="strip-visual">
            <img src={webImg} alt="Web Development" className="strip-img" />
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
            <a href="/projects" className="btn-ghost">See our projects →</a>
          </div>
          <div className="strip-visual">
            <img src={mobileImg} alt="Mobile Apps" className="strip-img" />
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
            <a href="/projects" className="btn-ghost">See our projects →</a>
          </div>
          <div className="strip-visual">
            <img src={uiImg} alt="UI/UX Design" className="strip-img" />
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
            <a href="/projects" className="btn-ghost">See our projects →</a>
          </div>
          <div className="strip-visual">
            <img src={cloudImg} alt="Cloud & DevOps" className="strip-img" />
          </div>
        </div>

      </div>
    </section>
  );
}