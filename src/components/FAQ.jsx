import { useState } from 'react';

const FAQ_DATA = [
  {
    q: 'How long does a typical project take?',
    a: "Most projects run 6–16 weeks depending on scope. A focused MVP can ship in 4–6 weeks; a full product platform typically takes 3–4 months. We give you a realistic timeline in the first call — not the one you want to hear, the one that's actually achievable.",
  },
  {
    q: 'Do we own the code after the project is done?',
    a: "Yes, fully. All source code, assets, and IP transfer to you on final payment. No retainer, no license, no strings. It's yours to build on, hand off, or open-source as you see fit.",
  },
  {
    q: "What's your pricing model?",
    a: "We work on fixed-scope projects (predictable cost, defined deliverables) or a monthly retainer for ongoing product teams. We don't do hourly billing — it misaligns incentives. You'll get a clear quote upfront, not a surprise invoice at the end.",
  },
  {
    q: 'Do you work with early-stage startups, or only established companies?',
    a: "Both. We've shipped first products for founders with nothing but a napkin sketch, and we've rebuilt performance-critical platforms for funded Series A companies. The deciding factor isn't stage — it's whether there's a real problem worth solving.",
  },
  {
    q: 'What happens after launch?',
    a: "We offer a 30-day bug warranty on every project at no charge. After that, most clients move to a monthly retainer for ongoing iteration, infrastructure monitoring, and feature work. We don't disappear after go-live.",
  },
  {
    q: 'What technologies do you build with?',
    a: "React and Next.js for web, React Native and Flutter for mobile, Node.js and Python for backend, PostgreSQL and MongoDB for data, and AWS for infrastructure. We pick the stack that fits the problem — not the one we're most comfortable with.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx((cur) => (cur === i ? null : i));

  return (
    <section id="faq" className="faq-section">
      <div className="faq-inner">
        <div className="section-head reveal visible">
          <div className="section-eyebrow">Common Questions</div>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div>
          {FAQ_DATA.map((item, i) => (
            <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
              <div className="faq-question" onClick={() => toggle(i)}>
                <span>{item.q}</span>
                <span className="faq-icon">+</span>
              </div>
              <div className={`faq-answer${openIdx === i ? ' open' : ''}`}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
