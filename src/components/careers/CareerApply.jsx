import { useEffect, useState } from 'react';
import { css } from './styles';
import { COMPANY, getPosition, jobHref } from './positions';
import { PinIcon, BriefcaseIcon, BackLink, useDocumentTitle } from './parts';

const initialForm = { name: '', email: '', phone: '', portfolio: '', linkedin: '', details: '' };

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const FILE_RULES = {
  resume: { label: 'Resume', extensions: ['pdf', 'doc', 'docx'] },
};

const listFormats = (extensions) => {
  const names = extensions.map((ext) => ext.toUpperCase());
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} or ${names.at(-1)}` : names[0];
};

const extensionOf = (name) => name.split('.').pop().toLowerCase();

/* Returns an error message, or '' if the file is acceptable. */
const checkFile = (kind, file) => {
  const { label, extensions } = FILE_RULES[kind];
  if (!extensions.includes(extensionOf(file.name))) {
    return `${label} must be a ${listFormats(extensions)} file.`;
  }
  if (file.size > MAX_FILE_BYTES) return `${label} file must be 4 MB or smaller.`;
  if (file.size === 0) return `${label} file is empty.`;
  return '';
};

const readAsPayload = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

function FileField({ id, label, accept, hint, file, error, onPick, onClear }) {
  return (
    <div className="ngc-field">
      <span className="ngc-label" id={`${id}-label`}>
        {label}
      </span>
      <div className={`ngc-file${error ? ' has-error' : ''}`}>
        <label className="ngc-file-btn" htmlFor={id}>{file ? 'Change file' : 'Choose file'}</label>
        <input
          id={id}
          type="file"
          className="ngc-file-input"
          accept={accept}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (picked) onPick(picked);
            e.target.value = '';
          }}
        />
        <span className={`ngc-file-name${file ? ' has-file' : ''}`} title={file?.name}>
          {file ? file.name : 'No file chosen'}
        </span>
        {file && (
          <button type="button" className="ngc-file-clear" aria-label={`Remove ${label} file`} onClick={onClear}>
            ×
          </button>
        )}
      </div>
      <span className="ngc-hint" id={`${id}-hint`}>{hint}</span>
      {error && <span className="ngc-field-error" role="alert">{error}</span>}
    </div>
  );
}

export default function CareerApply({ jobId }) {
  const job = getPosition(jobId);

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [files, setFiles] = useState({ resume: null });
  const [fileErrors, setFileErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useDocumentTitle(job ? `Apply — ${job.title} — ${COMPANY.name} Careers` : null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
  };

  const pickFile = (kind, file) => {
    const error = checkFile(kind, file);
    setFileErrors((c) => ({ ...c, [kind]: error }));
    setFiles((c) => ({ ...c, [kind]: error ? null : file }));
  };

  const clearFile = (kind) => {
    setFiles((c) => ({ ...c, [kind]: null }));
    setFileErrors((c) => ({ ...c, [kind]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    if (!files.resume) {
      setFileErrors((c) => ({ ...c, resume: c.resume || 'Please attach your resume.' }));
      document.getElementById('ng-resume')?.focus();
      return;
    }

    setStatus('sending');
    setErrorMessage('');
    try {
      const resume = await readAsPayload(files.resume);
      const res = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, position: job.title, resume }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'failed');
      }
      setForm(initialForm);
      setFiles({ resume: null });
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message === 'failed' ? '' : err.message);
      setStatus('error');
    }
  };

  const submitLabel = { sending: 'Sending…', error: 'Try again', idle: 'Send application', success: 'Send application' }[status];

  if (!job) {
    return (
      <main className="ng-careers ngc-page">
        <style>{css}</style>
        <div className="ngc-wrap">
          <div className="ngc-narrow">
            <BackLink href="/careers#open-positions">All openings</BackLink>
            <div className="ngc-state">
              <h1>This role isn't open anymore</h1>
              <p>The position you're looking for may have been filled or removed.</p>
              <a href="/careers#open-positions" className="ngc-apply-btn">See open positions</a>
            </div>
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
              <span className="ngc-section-label">Apply · {job.category}</span>
              <h2>Apply for <em>{job.title}</em></h2>
              <div className="ngc-job-meta">
                <span><PinIcon />{job.location}</span>
                <span><BriefcaseIcon />{job.type}</span>
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
                  <label className="ngc-label" htmlFor="ng-portfolio">Portfolio link</label>
                  <input id="ng-portfolio" name="portfolio" type="url" placeholder="https://"
                    className="ngc-input" value={form.portfolio} onChange={handleChange} />
                </div>

                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-linkedin">LinkedIn</label>
                  <input id="ng-linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/..."
                    className="ngc-input" value={form.linkedin} onChange={handleChange} />
                </div>

                <FileField
                  id="ng-resume"
                  label="Resume"
                  accept=".pdf,.doc,.docx"
                  hint="PDF, DOC or DOCX · up to 4 MB"
                  file={files.resume}
                  error={fileErrors.resume}
                  onPick={(f) => pickFile('resume', f)}
                  onClear={() => clearFile('resume')}
                />

                <div className="ngc-field">
                  <label className="ngc-label" htmlFor="ng-details">About you</label>
                  <textarea id="ng-details" name="details" rows="5"
                    className="ngc-textarea"
                    placeholder="Tell us about your experience, availability, and why you'd like to work with NallGeeks."
                    value={form.details} onChange={handleChange} />
                </div>

                {status === 'error' && (
                  <p className="ngc-alert error" role="alert">
                    {errorMessage || "Couldn't send your application. Check your connection and try again."}
                  </p>
                )}

                <button
                  type="submit"
                  className="ngc-submit"
                  disabled={status === 'sending'}
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
