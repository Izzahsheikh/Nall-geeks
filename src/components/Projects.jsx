import { useEffect, useMemo, useState } from 'react';

const videoShowcases = [
  {
    id: 'ngpartitions',
    videoSrc: '/uploads/projects/ngpartitions.mp4',
    client: 'N&G Partitions LTD',
    category: 'Commercial Interiors / Web',
    title: 'Precision Interior Specialists',
    description:
      'A clean, architectural website built for N&G Partitions — a UK commercial interiors company delivering drylining, suspended ceilings, SFS and acoustic solutions. The site reflects the same discipline and restraint the client brings to every site: structured layout, restrained typography, and a project portfolio that speaks through imagery rather than noise.',
    url: 'https://ngpartitions.co.uk',
    tags: ['React', 'Tailwind', 'CMS', 'UK Commercial'],
    stat1: { value: '10+', label: 'Years Delivering' },
    stat2: { value: 'UK', label: 'Wide Coverage' },
    theme: 'light',
  },
  {
    id: 'gogotyre',
    videoSrc: '/uploads/projects/gogotyres.mp4',
    client: 'GoGo Tyre Norwich',
    category: 'Automotive / Web',
    title: 'Tyres Fitted the Modern Way',
    description:
      'A bold, high-converting website for GoGo Tyre — a Norwich-based tyre garage specialising in leverless, rim-safe fitting. The design leans dark and performance-driven, matching the brand\'s identity: fast, modern, and no-nonsense. Built to rank locally, convert on mobile, and communicate trust from the first scroll.',
    url: 'https://gogotyre.co.uk',
    tags: ['React', 'SEO', 'Local Business', 'Mobile-First'],
    stat1: { value: '20min', label: 'Avg Fit Time' },
    stat2: { value: '7 days', label: 'Walk-ins Welcome' },
    theme: 'dark',
  },
  {
    id: 'trip2airport',
    videoSrc: '/uploads/projects/trip2Airport.mp4',
    client: 'Trip2Airport',
    category: 'Transport / Web',
    title: 'Airport Transfers, Simplified',
    description:
      'A sleek, conversion-focused website for Trip2Airport — a professional airport transfer service built to make booking fast and friction-free. Clean layout, clear pricing, and a mobile-first experience that gets passengers from search to booked in seconds.',
    url: 'https://www.trip2airport.co.uk/',
    tags: ['React', 'Booking', 'Transport', 'Mobile-First'],
    stat1: { value: '24/7', label: 'Available' },
    stat2: { value: '100%', label: 'On-Time Focus' },
    theme: 'light',
  },
  {
    id: 'motnorwich',
    videoSrc: '/uploads/projects/MotNorwich.mp4',
    client: 'MOT Norwich',
    category: 'Automotive / Web',
    title: 'Trusted MOT & Car Servicing',
    description:
      'A straightforward, trust-first website for MOT Norwich — a local garage offering MOT testing, servicing, and repairs. Built to rank in local search, convert mobile visitors, and clearly communicate the garage\'s reliability and no-fuss approach to car care.',
    url: 'https://mot-norwich.co.uk/',
    tags: ['React', 'SEO', 'Local Business', 'Automotive'],
    stat1: { value: 'Local', label: 'Norwich-Based' },
    stat2: { value: 'Fast', label: 'Turnaround' },
    theme: 'dark',
  },
];

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
        {/* Hero */}
        <div className="projects-hero reveal visible">
          <span className="section-eyebrow">NallGeeks Projects</span>
          <h2>Work built to keep moving after launch.</h2>
          <p>
            A closer look at the websites, apps, platforms, and digital systems shaped by NallGeeks.
            Every project here is managed from the admin portal and reflected on the public website.
          </p>
        </div>

        {/* Video Showcases — 4 projects */}
        <div className="video-showcases">
          {videoShowcases.map((project) => (
            <div
              key={project.id}
              className={`video-showcase reveal visible ${project.theme === 'dark' ? 'showcase-dark' : 'showcase-light'}`}
            >
              {/* Video Side */}
              <div className="showcase-video-wrap">
                <video
                  src={project.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="showcase-video"
                />
              </div>

              {/* Copy Side */}
              <div className="showcase-copy">
                <span className="showcase-category">{project.category}</span>
                <h3 className="showcase-client">{project.client}</h3>
                <h4 className="showcase-title">{project.title}</h4>
                <p className="showcase-desc">{project.description}</p>

                <div className="showcase-stats">
                  <div className="showcase-stat">
                    <strong>{project.stat1.value}</strong>
                    <span>{project.stat1.label}</span>
                  </div>
                  <div className="showcase-stat">
                    <strong>{project.stat2.value}</strong>
                    <span>{project.stat2.label}</span>
                  </div>
                </div>

                <div className="showcase-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="showcase-tag">{tag}</span>
                  ))}
                </div>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary showcase-btn"
                >
                  View Live Site →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Divider before API projects */}
        <div className="projects-divider">
          <span className="section-eyebrow">More Work</span>
        </div>

        {/* API-loaded projects */}
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