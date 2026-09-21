import { useState } from 'react';
import { SERVICE_MENU } from './navbar/serviceMenu';

// Same six services as the navbar's Services dropdown, so the two never drift apart.
const SERVICE_OPTIONS = SERVICE_MENU.map((item) => item.title);

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  services: [],
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [servicesError, setServicesError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Toggle one chip. The list is kept in the same order as the options, whatever order they were clicked in.
  const toggleService = (title) => {
    setForm((f) => {
      const picked = f.services.includes(title) ? f.services.filter((s) => s !== title) : [...f.services, title];
      return { ...f, services: SERVICE_OPTIONS.filter((option) => picked.includes(option)) };
    });
    setServicesError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.services.length === 0) {
      setServicesError(true);
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Request failed');

      setSubmitted(true);
      setForm(initialForm);
      setStatus('idle');
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section-inner">
        <div className="contact-row reveal visible">
          <div className="contact-left">
            <div className="section-eyebrow">Let's Build</div>
            <h2>Bring us your next big idea.</h2>
            <div className="contact-points">
              <div className="contact-point">
                <div className="contact-point-dot"></div>
                <span>A straight answer on timeline and cost</span>
              </div>
              <div className="contact-point">
                <div className="contact-point-dot"></div>
                <span>Direct access to the person building it</span>
              </div>
              <div className="contact-point">
                <div className="contact-point-dot"></div>
                <span>No sales team in between</span>
              </div>
            </div>
            <a href="mailto:contact@nallgeeks.com" className="btn-primary">
              Book a Call →
            </a>
          </div>

          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="contact-services" role="group" aria-labelledby="contact-services-label">
                <span id="contact-services-label" className="contact-services-label">Services</span>
                <div className="contact-chips">
                  {SERVICE_OPTIONS.map((title) => {
                    const selected = form.services.includes(title);
                    return (
                      <button
                        key={title}
                        type="button"
                        className={`contact-chip${selected ? ' selected' : ''}`}
                        aria-pressed={selected}
                        onClick={() => toggleService(title)}
                      >
                        {title}
                      </button>
                    );
                  })}
                </div>
                {servicesError && (
                  <p className="contact-services-error" role="alert">
                    Please choose at least one service so we know how to help.
                  </p>
                )}
              </div>
              <textarea
                name="message"
                placeholder="Tell us about your timeline, budget, and scope..."
                rows="4"
                value={form.message}
                onChange={handleChange}
              />
              <button type="submit" className="contact-submit" disabled={status === 'sending'}>
                {submitted
                  ? "Thanks — we'll be in touch! ✓"
                  : status === 'sending'
                  ? 'Sending...'
                  : status === 'error'
                  ? 'Something went wrong — try again'
                  : 'Book a Call →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
