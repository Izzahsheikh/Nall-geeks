import { useEffect } from 'react';
import { css } from './styles';
import { COMPANY, getPosition, applyHref } from './positions';
import { BackLink, CompanyLogo, RoleDescription, useDocumentTitle } from './parts';

export default function CareerJob({ jobId }) {
  const job = getPosition(jobId);

  useDocumentTitle(job ? `${job.title} — ${COMPANY.name} Careers` : null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="ng-careers ngc-light ngc-job-page">
      <style>{css}</style>
      <div className="ngc-wrap">
        <div className="ngc-narrow">
          <BackLink href="/careers#open-positions">All openings</BackLink>

          {!job ? (
            <div className="ngc-state">
              <h1>This role isn't open anymore</h1>
              <p>The position you're looking for may have been filled or removed.</p>
              <a href="/careers#open-positions" className="ngc-apply-btn">See open positions</a>
            </div>
          ) : (
            <>
              <header className="ngc-job-head">
                <CompanyLogo src={COMPANY.logoSrc} size="md" />
                <h1 className="ngc-job-title">{job.title}</h1>
              </header>

              <a href={applyHref(job)} className="ngc-apply-btn">Apply</a>

              <section className="ngc-job-description">
                <h2>Role Description</h2>
                <RoleDescription blocks={job.description} />
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
