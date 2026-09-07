import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    console.log('Newsletter subscribe:', email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer id="career" className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-top-title">Stay updated</div>
            <div className="footer-top-desc">Get the latest insights on software and scaling.</div>
          </div>
          <div className="footer-subscribe">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="footer-subscribe-btn" onClick={handleSubscribe}>
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="footer-rule"></div>

        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img
                src="/uploads/PHOTO-2026-08-03-21-23-52.jpg"
                alt="NallGeeks"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span>NallGeeks</span>
            </div>
            <p className="footer-tagline">Engineering software for startups, founders, and growing businesses.</p>
            <p className="footer-legal">Legal Entity: NallGeeks (Private) Limited</p>
            <div className="footer-socials">
              <a href="#" className="footer-social hover-accent">in</a>
              <a href="#" className="footer-social hover-accent">ig</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Services</div>
            <a href="/#services" className="hover-accent">Web Development</a>
            <a href="/#services" className="hover-accent">Backend &amp; API</a>
            <a href="/#services" className="hover-accent">Mobile App Development</a>
            <a href="/#services" className="hover-accent">UI/UX Design</a>
            <a href="/#services" className="hover-accent">Brand &amp; Product Strategy</a>
            <a href="/#services" className="hover-accent">Cloud Infrastructure</a>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Technologies</div>
            <a href="#" className="hover-accent">React</a>
            <a href="#" className="hover-accent">Next.js</a>
            <a href="#" className="hover-accent">React Native</a>
            <a href="#" className="hover-accent">Flutter</a>
            <a href="#" className="hover-accent">Node.js</a>
            <a href="#" className="hover-accent">AWS</a>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <a href="/about" className="hover-accent">About</a>
            <a href="/projects" className="hover-accent">Projects</a>
            <a href="/contact" className="hover-accent">Contact</a>
            <a href="/careers" className="hover-accent">Career</a>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Get In Touch</div>
            <span>contact@nallgeeks.com</span>
            <span>+92-51-0000000</span>
            <span>Islamabad, Pakistan</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 NallGeeks. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
