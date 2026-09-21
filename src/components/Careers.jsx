import { css } from './careers/styles';
import { COMPANY, POSITIONS, groupedPositions, jobHref } from './careers/positions';
import { PinIcon, LinkedInIcon, CompanyLogo } from './careers/parts';

// The "Internships" heading already says it, so internship cards drop the trailing "Intern" (the job pages keep the full title).
const cardTitle = (title) => title.replace(/\s+intern$/i, '');

function RoleCard({ position }) {
  return (
    <article className="ngc-role">
      <h4 className="ngc-role-title">
        {/* The title link is stretched over the whole card, so the entire card is one click target. */}
        <a href={jobHref(position)} className="ngc-role-link">{cardTitle(position.title)}</a>
      </h4>

      <div className="ngc-role-foot">
        <span className="ngc-role-location"><PinIcon />{position.location}</span>
        <span className="ngc-role-apply" aria-hidden="true">Apply</span>
      </div>
    </article>
  );
}

export default function Careers() {
  const groups = groupedPositions();

  return (
    <main className="ng-careers ngc-light">
      <style>{css}</style>

      <div className="ngc-wrap">
        {/* ═══════════ Company profile ═══════════ */}
        <header className="ngc-company">
          <div className="ngc-company-main">
            <div className="ngc-company-head">
              <CompanyLogo src={COMPANY.logoSrc} />
              <h1 className="ngc-company-name">{COMPANY.name}</h1>
            </div>
            <p className="ngc-company-desc">{COMPANY.description}</p>
            <div className="ngc-company-meta">
              <span className="ngc-company-location"><PinIcon />{COMPANY.location}</span>
            </div>
          </div>

          {/* Visual placeholder only: not a link yet. Wrap it in <a href="…" aria-label="NallGeeks on LinkedIn"> once there's a URL. */}
          <span className="ngc-social" aria-hidden="true"><LinkedInIcon /></span>
        </header>

        {/* ═══════════ Open positions ═══════════ */}
        <section id="open-positions" className="ngc-board" aria-labelledby="ngc-board-title">
          <div className="ngc-board-head">
            <h2 id="ngc-board-title">Open positions</h2>
            <span className="ngc-board-count">
              {POSITIONS.length} open {POSITIONS.length === 1 ? 'role' : 'roles'}
            </span>
          </div>

          {POSITIONS.length === 0 && (
            <p className="ngc-board-empty">There are no open positions right now. Please check back soon.</p>
          )}

          {groups.map((group) => (
            <div className="ngc-group" key={group.type}>
              <h3 className="ngc-group-title">{group.label}</h3>
              <div className="ngc-role-grid">
                {group.positions.map((position) => (
                  <RoleCard key={position.id} position={position} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
