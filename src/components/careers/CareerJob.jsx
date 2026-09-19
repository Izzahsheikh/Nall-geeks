import { useEffect } from 'react';
import { css } from './styles';
import { useOpenings, applyHref } from './shared';
import { PinIcon, BriefcaseIcon, BackLink, useDocumentTitle } from './parts';

export default function CareerJob({ jobId }) {
  const { openings, status } = useOpenings();
  const job = openings.find((o) => o.key === jobId);

  useDocumentTitle(job ? `${job.title} — NallGeeks Careers` : null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const paragraphs = job?.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) || [];

  return (
    <main className="ng-careers ngc-page">
      <style>{css}</style>
      <div className="ngc-wrap">
        <div className="ngc-narrow">
          <BackLink href="/careers#open-positions">All openings</BackLink>

          {status === 'loading' && <div className="ngc-skeleton" />}

          {status === 'ready' && !job && (
            <div className="ngc-state">
              <h1>This role isn't open anymore</h1>
              <p>The position you're looking for may have been filled or removed.</p>
              <a href="/careers#open-positions" className="ngc-apply-btn">See open positions</a>
            </div>
          )}

          {job && (
            <>
              <header className="ngc-detail-head">
                <div>
                  <span className="ngc-job-dept">{job.department}</span>
                  <h1 className="ngc-detail-title">{job.title}</h1>
                  <div className="ngc-job-meta">
                    <span><PinIcon />{job.location}</span>
                    <span><BriefcaseIcon />{job.employment}</span>
                  </div>
                </div>
                <a href={applyHref(job)} className="ngc-apply-btn">Apply for this Job</a>
              </header>

              <section className="ngc-detail-section">
                <h2>About the role</h2>
                {(paragraphs.length ? paragraphs : [job.summary]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>

              {job.responsibilities.length > 0 && (
                <section className="ngc-detail-section">
                  <h2>Responsibilities</h2>
                  <ul className="ngc-list">
                    {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </section>
              )}

              {job.qualifications.length > 0 && (
                <section className="ngc-detail-section">
                  <h2>Qualifications</h2>
                  <ul className="ngc-list">
                    {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
