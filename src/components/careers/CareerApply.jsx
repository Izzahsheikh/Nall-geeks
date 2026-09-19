import { useEffect, useState } from 'react';
import { css } from './styles';
import { INTERN_TRACKS, trackLabel, isInternRole, useOpenings, jobHref } from './shared';
import { PinIcon, BriefcaseIcon, BackLink, useDocumentTitle } from './parts';

const initialForm = { name: '', email: '', phone: '', portfolio: '', details: '' };

const trackFromQuery = () => {
  const track = new URLSearchParams(window.location.search).get('track');
  return INTERN_TRACKS.some((t) => t.value === track) ? track : '';
};

export default function CareerApply({ jobId }) {
  const { openings, status: jobsStatus } = useOpenings();
  const job = openings.find((o) => o.key === jobId);

  const [form, setForm] = useState(initialForm);
  const [track, setTrack] = useState(trackFromQuery);
  const [status, setStatus] = useState('idle');

  useDocumentTitle(job ? `Apply — ${job.title} — NallGeeks Careers` : null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const isInternship = job ? isInternRole(job.title) : false;
  const needsTrack = isInternship && !track;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job || needsTrack) return;
    setStatus('sending');
    const position = isInternship ? `${job.title} — ${track}` : job.title;
    try {
      const res = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, position }),
      });
      if (!res.ok) throw new Error('failed');
      setForm(initialForm);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const submitLabel = { sending: 'Sending…', error: 'Try again', idle: 'Send application', success: 'Send application' }[status];

  if (jobsStatus === 'loading' || !job) {
    return (
      <main className="ng-careers ngc-page">
        <style>{css}</style>
        <div className="ngc-wrap">
          <div className="ngc-narrow">
            <BackLink href="/careers#open-positions">All openings</BackLink>
            {jobsStatus === 'loading' ? (
              <div className="ngc-skeleton" />
            ) : (
              <div className="ngc-state">
                <h1>This role isn't open anymore</h1>
                <p>The position you're looking for may have been filled or removed.</p>
                <a href="/careers#open-positions" className="ngc-apply-btn">See open positions</a>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ng-careers">
      <style>{css}</style>
      <section className="ngc-apply-section ngc-apply-page">
        <div className="ngc-wrap">
          <BackLink href={jobHref(job)}>Back to job description</BackLink>
          <div className="ngc-apply-inner">
            {/* Left */}
            <div className="ngc-apply-copy">
              <span className="ngc-section-label">Apply · {job.department}</span>
              <h2>Apply for <em>{job.title}</em></h2>
              <div className="ngc-job-meta">
                <span><PinIcon />{job.location}</span>
                <span><BriefcaseIcon />{job.employment}</span>
              </div>
              <ol className="ngc-steps">
                {['Tell us about your experience.', 'Share your portfolio or LinkedIn.', "We'll review and get back to you."].map((step, i) => (
                  <li key={i} className="ngc-step">
                    <span className="ngc-step-num">0{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Form */}
            {status === 'success' ? (
              <div className="ngc-form ngc-done" role="status">
                <h3>Application received</h3>
                <p>Thanks for applying. We'll review your application and be in touch if there's a fit.</p>
                <a href="/careers#open-positions" className="ngc-apply-btn">Back to all openings</a>
              </div>
            ) : (
              <form className="ngc-form" onSubmit={handleSubmit}>
                <div className="ngc-form-row">
                  <div className="ngc-field">
                    <label className="ngc-label" htmlFor="ng-name">Full name</label>
                    <input id="ng-name" name="name" type="text" placeholder="Your name"
                      className="ngc-input" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="ngc-field">
                    <label className="ngc-label" htmlFor="ng-position">Position</label>
                    <input id="ng-position" type="text" className="ngc-input"
                      value={job.title} readOnly />
                  </div>
                </div>

                {isInternship && (
                  <div className="ngc-track-group">
                    <span className="ngc-label">Which track fits you?</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} role="group" aria-label="Internship track">
                      {INTERN_TRACKS.map((t) => (
                        <button
                          type="button"
                          key={t.value}
                          className={`ngc-track-toggle${track === t.value ? ' active' : ''}`}
                          aria-pressed={track === t.value}
                          onClick={() => setTrack(t.value)}
                        >
                          {trackLabel(t)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ngc-form-row">
                  <div className="ngc-field">
                    <label className="ngc-label" htmlFor="ng-email">Email address</label>
                    <input id="ng-email" name="email" type="email" placeholder="you@example.com"
                      className="ngc-input" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="ngc-field">
                    <label className="ngc-label" htmlFor="ng-phone">Phone number</label>
                    <input id="ng-phone" name="phone" type="tel" placeholder="+92 …"
                      className="ngc-input" value={form.phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-portfolio">Portfolio / LinkedIn</label>
                  <input id="ng-portfolio" name="portfolio" type="url" placeholder="https://"
                    className="ngc-input" value={form.portfolio} onChange={handleChange} />
                </div>

                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-details">About you</label>
                  <textarea id="ng-details" name="details" rows="5"
                    className="ngc-textarea"
                    placeholder="Tell us about your experience, availability, and why you'd like to work with NallGeeks."
                    value={form.details} onChange={handleChange} />
                </div>

                {needsTrack && (
                  <p className="ngc-alert warn" role="alert">
                    Pick a track above before submitting your internship application.
                  </p>
                )}
                {status === 'error' && (
                  <p className="ngc-alert error" role="alert">
                    Couldn't send your application. Check your connection and try again.
                  </p>
                )}

                <button
                  type="submit"
                  className="ngc-submit"
                  disabled={status === 'sending' || needsTrack}
                >
                  {submitLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
