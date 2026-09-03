const TESTIMONIALS = [
  {
    text: "We'd worked with three agencies before NallGeeks. None of them shipped. NallGeeks delivered a production-ready platform in 7 weeks — and the code was actually clean.",
    name: 'Hamza R.',
    role: 'Founder @ OrganicFields',
    gradient: 'linear-gradient(135deg,#E46822,#F28A45)'
  },
  {
    text: 'Our app went from Figma file to App Store in 11 weeks. The team communicated daily, never disappeared, and never missed a deadline. That\'s rare.',
    name: 'Sara M.',
    role: 'Co-Founder @ Vayora',
    gradient: 'linear-gradient(135deg,#2D3235,#F28A45)',
  },
  {
    text: 'They rebuilt our entire frontend. Core Web Vitals jumped from 41 to 97. Bounce rate dropped 34% in the first month. Numbers don\'t lie.',
    name: 'Usman K.',
    role: 'CTO @ RankGrad',
   gradient: 'linear-gradient(135deg,#25292C,#E46822)',
  },
];

export default function Testimonials() {
  return (
    <section className="testi-section">
      <div className="section-inner">
        <div className="section-head reveal visible">
          <div className="section-eyebrow">What Clients Say</div>
          <h2>Teams that trusted us to ship.</h2>
        </div>
        <div className="testi-row reveal visible">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card">
              <div className="testi-quote-mark">"</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-person">
                <div className="testi-avatar" style={{ background: t.gradient }}></div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
