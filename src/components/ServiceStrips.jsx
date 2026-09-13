import webImg from '../assets/services/website.jpeg';
import mobileImg from '../assets/services/mobileApp.png';
import uiImg from '../assets/services/UI.png';
import cloudImg from '../assets/services/cloud.jpeg';

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
            <h3>Fast, resilient web platforms built to scale.</h3>
            <p>
              We engineer performant web applications using clean architecture and modern technology stacks. From
              initial build to production launch, we focus on responsive execution, lean codebases, and long-term
              maintainability.
            </p>
            <a href="/projects" className="btn-ghost">View projects →</a>
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
            <h3>Native-grade mobile applications for iOS and Android.</h3>
            <p>
              We build fluid, reliable mobile products optimized for real-world performance. By combining responsive
              UI design with solid system architecture, we deliver apps that launch fast, run smoothly, and adapt to
              every screen size.
            </p>
            <a href="/projects" className="btn-ghost">View projects →</a>
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
            <h3>Thoughtful interface design centered on user clarity and function.</h3>
            <p>
              Visual design sets expectations, but workflow structure determines retention. We map complex systems
              into intuitive user journeys, building unified design systems that reduce user friction and elevate
              product usability.
            </p>
            <a href="/projects" className="btn-ghost">View projects →</a>
          </div>
          <div className="strip-visual">
            <img src={uiImg} alt="UI/UX Design" className="strip-img" />
          </div>
        </div>

        {/* Software Management */}
        <div className="strip-row flip reveal visible" style={{ borderBottom: 'none' }}>
          <div className="strip-text">
            <div className="strip-tag">
              <div className="strip-tag-icon">⊞</div>
              <span className="strip-tag-label">Software Management</span>
            </div>
            <h3>End-to-end platform care, proactive maintenance, and infrastructure stability.</h3>
            <p>
              Long-term software health demands continuous oversight. We manage performance monitoring, routine
              security patches, infrastructure updates, and system scaling so your platform stays secure, reliable,
              and online around the clock.
            </p>
            <a href="/projects" className="btn-ghost">View projects →</a>
          </div>
          <div className="strip-visual">
            <img src={cloudImg} alt="Software Management" className="strip-img" />
          </div>
        </div>

      </div>
    </section>
  );
}