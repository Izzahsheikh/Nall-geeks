import { useEffect, useState } from 'react';

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Could not load projects');
        const data = await response.json();
        setProjects(data.projects || []);
        setStatus('ready');
      } catch (error) {
        console.error('Projects load error:', error);
        setStatus('error');
      }
    };

    loadProjects();
  }, []);

  return (
    <section id="work" className="work-section">
      <div className="section-inner">
        <div className="section-head reveal visible">
          <div className="section-eyebrow">Selected Work</div>
          <h2>A few things we've built recently.</h2>
          <p>Real products, shipped and running — not concepts.</p>
        </div>

        {status === 'loading' ? (
          <p className="work-state">Loading projects...</p>
        ) : null}

        {status === 'error' ? (
          <p className="work-state">Projects are unavailable right now.</p>
        ) : null}

        {status === 'ready' && projects.length === 0 ? (
          <p className="work-state">No projects have been published yet.</p>
        ) : null}

        <div className="proj-row reveal visible">
          {projects.slice(0, 3).map((project, index) => (
            <article key={project.id} className={`proj-card${index % 2 === 1 ? ' offset' : ''}`}>
              <div className="proj-phone-frame">
                <div className="proj-phone-speaker"></div>
                <div className="proj-phone-screen project-preview">
                  <div className="proj-phone-status">
                    <span>{project.name}</span>
                    <span>{project.status}</span>
                  </div>
                  <div className="proj-phone-content">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={`${project.name} project preview`} />
                    ) : (
                      <div className="project-preview-fallback">
                        <span>{project.category}</span>
                        <strong>{project.name.slice(0, 2).toUpperCase()}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="proj-name">{project.name}</div>
              <div className="proj-type">{project.category}</div>
              {project.projectUrl ? (
                <a href={project.projectUrl} className="proj-link" target="_blank" rel="noreferrer">
                  View Project
                </a>
              ) : null}
            </article>
          ))}
        </div>

        <div className="work-cta reveal visible">
          <a href="/projects" className="btn-ghost light">
            See all projects →
          </a>
        </div>
      </div>
    </section>
  );
}
