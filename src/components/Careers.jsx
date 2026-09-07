import { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  position: '',
  email: '',
  phone: '',
  portfolio: '',
  details: '',
};

export default function Careers() {
  const [openings, setOpenings] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [jobsStatus, setJobsStatus] = useState('loading');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Could not load jobs');
        const data = await response.json();
        const jobs = data.jobs || [];
        setOpenings(jobs);
        setForm((current) => ({ ...current, position: current.position || jobs[0]?.title || '' }));
        setJobsStatus('ready');
      } catch (error) {
        console.error('Careers jobs load error:', error);
        setJobsStatus('error');
      }
    };

    loadJobs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSelectPosition = (position) => {
    setForm((current) => ({ ...current, position }));
    document.querySelector('#career-application')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Application failed');

      setForm({ ...initialForm, position: openings[0]?.title || '' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error('Career application error:', error);
      setStatus('error');
    }
  };

  return (
    <section className="careers-page">
      <div className="section-inner">
        <div className="careers-hero reveal visible">
          <span className="section-eyebrow">Careers at NallGeeks</span>
          <h2>Build serious work with a small, sharp team.</h2>
          <p>
            We look for people who care about clean execution, clear communication, and digital work
            that keeps serving clients after launch.
          </p>
        </div>

        {jobsStatus === 'loading' ? <p className="work-state">Loading open roles...</p> : null}
        {jobsStatus === 'error' ? <p className="work-state">Open roles are unavailable right now.</p> : null}
        {jobsStatus === 'ready' && openings.length === 0 ? <p className="work-state">No open roles right now.</p> : null}

        <div className="careers-openings reveal visible">
          {openings.map((opening) => (
            <article className="career-opening" key={opening.id}>
              <div>
                <span>{opening.type}</span>
                <h3>{opening.title}</h3>
                <p>{opening.summary}</p>
              </div>
              <div className="career-opening-meta">
                <strong>{opening.location}</strong>
                <button type="button" onClick={() => handleSelectPosition(opening.title)}>
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="career-application-section reveal visible" id="career-application">
          <div className="career-application-copy">
            <span className="section-eyebrow">Apply Now</span>
            <h3>Tell us where you fit.</h3>
            <p>
              Send a short application and it will appear inside the NallGeeks Admin Careers panel
              for review.
            </p>
          </div>

          <form className="career-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
              <select name="position" value={form.position} onChange={handleChange} required>
                {openings.map((opening) => (
                  <option key={opening.title}>{opening.title}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
              <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} />
            </div>
            <input
              name="portfolio"
              type="url"
              placeholder="Portfolio or LinkedIn URL"
              value={form.portfolio}
              onChange={handleChange}
            />
            <textarea
              name="details"
              rows="5"
              placeholder="Share your experience, availability, and why you want to work with NallGeeks."
              value={form.details}
              onChange={handleChange}
            />
            <button type="submit" className="contact-submit" disabled={status === 'sending' || openings.length === 0}>
              {status === 'sending'
                ? 'Submitting...'
                : status === 'success'
                ? 'Application submitted'
                : status === 'error'
                ? 'Something went wrong'
                : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
