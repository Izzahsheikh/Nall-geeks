import { useEffect, useMemo, useState } from 'react';

export default function Projects() {
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
        console.error('Projects page load error:', error);
        setStatus('error');
      }
    };

    loadProjects();
  }, []);

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured),
    [projects]
  );
  const leadProject = featuredProjects[0] || projects[0];
  const remainingProjects = projects.filter((project) => project.id !== leadProject?.id);

  return (
    <section className="projects-page">
      <div className="section-inner">
        <div className="projects-hero reveal visible">
          <span className="section-eyebrow">NallGeeks Projects</span>
          <h2>Work built to keep moving after launch.</h2>
          <p>
            A closer look at the websites, apps, platforms, and digital systems shaped by NallGeeks.
            Every project here is managed from the admin portal and reflected on the public website.
          </p>
        </div>

        {status === 'loading' ? <p className="work-state">Loading projects...</p> : null}
        {status === 'error' ? <p className="work-state">Projects are unavailable right now.</p> : null}
        {status === 'ready' && projects.length === 0 ? <p className="work-state">No projects have been published yet.</p> : null}

        {leadProject ? (
          <article className="projects-featured reveal visible">
            <div className="projects-featured-media project-preview">
              {leadProject.imageUrl ? (
                <img src={leadProject.imageUrl} alt={`${leadProject.name} project preview`} />
              ) : (
                <div className="project-preview-fallback">
                  <span>{leadProject.category}</span>
                  <strong>{leadProject.name.slice(0, 2).toUpperCase()}</strong>
                </div>
              )}
            </div>
            <div className="projects-featured-copy">
              <span className="admin-status">{leadProject.status}</span>
              <h3>{leadProject.name}</h3>
              <p>{leadProject.fullDescription || leadProject.shortDescription}</p>
              <div className="projects-meta">
                <span>{leadProject.category}</span>
                {leadProject.featured ? <span>Featured</span> : null}
              </div>
              {leadProject.projectUrl ? (
                <a href={leadProject.projectUrl} className="btn-primary" target="_blank" rel="noreferrer">
                  View Project
                </a>
              ) : null}
            </div>
          </article>
        ) : null}

        {remainingProjects.length ? (
          <div className="projects-grid reveal visible">
            {remainingProjects.map((project) => (
              <article className="projects-card" key={project.id}>
                <div className="projects-card-media project-preview">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={`${project.name} project preview`} />
                  ) : (
                    <div className="project-preview-fallback">
                      <span>{project.category}</span>
                      <strong>{project.name.slice(0, 2).toUpperCase()}</strong>
                    </div>
                  )}
                </div>
                <div className="projects-card-copy">
                  <span>{project.category}</span>
                  <h3>{project.name}</h3>
                  <p>{project.shortDescription}</p>
                  {project.projectUrl ? (
                    <a href={project.projectUrl} target="_blank" rel="noreferrer">
                      View Project
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
