export default function ProjectRow({ project, onEdit, onDelete }) {
  return (
    <article className="admin-project-row">
      <div className="admin-project-thumb">
        {project.imageUrl ? <img src={project.imageUrl} alt="" /> : project.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="admin-project-main">
        <strong>{project.name}</strong>
        <span>{project.category}</span>
      </div>
      <span className={`admin-status ${project.status.toLowerCase().replace(/\s+/g, '-')}`}>{project.status}</span>
      <a className="admin-url" href={project.projectUrl}>{project.projectUrl || 'No URL yet'}</a>
      <div className="admin-row-actions">
        <button type="button" onClick={() => onEdit(project)}>Edit</button>
        <button type="button" className="danger" onClick={() => onDelete(project)}>Delete</button>
      </div>
    </article>
  );
}
