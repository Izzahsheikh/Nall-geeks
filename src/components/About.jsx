import aboutHeroVideo from '../assets/Camera_pans_across_digital_lands…_202609021757.mp4';
import logo from '../assets/nallgeeks-logo-mark.png';

const RELATIONSHIP_STAGES = [
  {
    title: 'Understand',
    text: 'We learn the business, the users, and the real problem before deciding what should be built.',
  },
  {
    title: 'Collaborate & Build',
    text: 'We keep decisions clear, share progress often, and turn the idea into a polished working product.',
  },
  {
    title: 'Support',
    text: 'After launch, we stay available for improvements, fixes, scaling, and the next smart step.',
  },
];

export default function About() {
  return (
    <section id="about" className="about-page">
      <div className="section-inner">
        <div className="about-hero reveal">
          <video className="about-hero-video" autoPlay muted loop playsInline aria-hidden="true">
            <source src={aboutHeroVideo} type="video/mp4" />
          </video>
          <div className="about-hero-content">
            <div className="section-eyebrow">About NallGeeks</div>
            <h2>There’s More to Us Than What We Build.</h2>
            <p>
              NallGeeks is a software engineering studio shaped by clear thinking, careful execution,
              and long-term partnership. Our work starts with vision, is protected by commitment,
              and becomes stronger through close client relationships.
            </p>
          </div>
        </div>

        <div className="about-editorial about-vision reveal" data-delay="80">
          <div className="about-copy">
            <div className="about-number">01</div>
            <div className="section-eyebrow">Our Vision</div>
            <h3>Build software that feels intentional from the first click.</h3>
            <p>
              We believe great digital products are not just assembled. They are understood, shaped,
              refined, and made useful for the people who rely on them every day.
            </p>
          </div>

          <div className="about-vision-visual" aria-hidden="true">
            <div className="vision-line top"></div>
            <div className="vision-mark">
              <img src={logo} alt="" />
            </div>
            <div className="vision-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="vision-line bottom"></div>
          </div>
        </div>

        <div className="about-editorial about-commitment reveal" data-delay="120">
          <div className="about-commitment-left">
            <div className="about-number">02</div>
            <div className="section-eyebrow">Our Commitment</div>
            <div className="commitment-statement" aria-label="We build it. We stand behind it.">
              <span className="commitment-line commitment-build">We build it.</span>
              <span className="commitment-connector" aria-hidden="true">
                <span></span>
              </span>
              <span className="commitment-line commitment-stand">We stand behind it.</span>
            </div>
          </div>

          <div className="about-commitment-right">
            <div className="commitment-kicker">Build → Stand Behind → Continue</div>
            <p>
              NallGeeks does not simply hand over a website, software product, or digital solution
              and disappear. We remain available for support, maintenance, improvements, and
              technical or operational help when the work needs to keep moving.
            </p>
          </div>
        </div>

        <div className="about-editorial about-relationship reveal" data-delay="160">
          <div className="about-copy">
            <div className="about-number">03</div>
            <div className="section-eyebrow">Client Relationship</div>
            <h3>We do not just deliver and disappear.</h3>
            <p>
              We work beside clients through discovery, decisions, delivery, and what comes after.
              The best products are built through collaboration that lasts longer than a launch date.
            </p>
          </div>

          <div className="relationship-flow" aria-label="Understand to Collaborate and Build to Support">
            <div className="relationship-line" aria-hidden="true"></div>
            {RELATIONSHIP_STAGES.map((stage, index) => (
              <div className="relationship-stage" key={stage.title} style={{ '--stage-index': index }}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{stage.title}</strong>
                <p>{stage.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-final-cta reveal" data-delay="120">
          <div>
            <h3>Okay, enough about us. What are you building?</h3>
            <p>Tell us what you are planning, and we will help turn it into something real.</p>
          </div>
          <a href="/contact" className="btn-primary">
            Book a Call →
          </a>
        </div>
      </div>
    </section>
  );
}