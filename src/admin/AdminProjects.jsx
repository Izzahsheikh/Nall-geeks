import { useMemo, useState } from 'react';
import { apiRequest, fileToDataUrl } from './api';
import AdminHeader from './components/AdminHeader';
import ProjectRow from './components/ProjectRow';

const emptyProject = {
  name: '',
  category: '',
  shortDescription: '',
  fullDescription: '',
  projectUrl: '',
  status: 'Active',
  featured: false,
  order: 1,
};

export default function AdminProjects({ projects, onProjectsChange }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    [projects]
  );

  const openAddForm = () => {
    setEditingProject(null);
    setForm({ ...emptyProject, order: projects.length + 1 });
    setImageFile(null);
    setStatus({ type: 'idle', message: '' });
    setFormOpen(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name || '',
      category: project.category || '',
      shortDescription: project.shortDescription || '',
      fullDescription: project.fullDescription || '',
      projectUrl: project.projectUrl || '',
      status: project.status || 'Active',
      featured: Boolean(project.featured),
      order: project.order || 1,
    });
    setImageFile(null);
    setStatus({ type: 'idle', message: '' });
    setFormOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.category.trim() || !form.shortDescription.trim()) {
      setStatus({ type: 'error', message: 'Project name, category, and short description are required.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Saving project...' });

    try {
      const imageData = imageFile ? await fileToDataUrl(imageFile) : '';
      await apiRequest(editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects', {
        method: editingProject ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...form,
          order: Number(form.order || 0),
          imageData,
          imageName: imageFile?.name || '',
        }),
      });

      await onProjectsChange();
      setStatus({ type: 'success', message: editingProject ? 'Project updated.' : 'Project added.' });
      setFormOpen(false);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(`Delete ${project.name}? This will remove it from the public Projects section.`);
    if (!confirmed) return;

    try {
      await apiRequest(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
      await onProjectsChange();
      setStatus({ type: 'success', message: 'Project deleted.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="admin-page-panel">
      <AdminHeader title="Project Management" eyebrow="Projects">
        <button type="button" className="admin-primary-action" onClick={openAddForm}>+ Add New Project</button>
      </AdminHeader>

      {status.message ? <p className={`admin-form-message ${status.type}`}>{status.message}</p> : null}

      {formOpen ? (
        <form className="admin-project-form" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <div>
              <span className="admin-eyebrow">{editingProject ? 'Edit Project' : 'Add Project'}</span>
              <h2>{editingProject ? editingProject.name : 'Create a portfolio entry'}</h2>
            </div>
            <button type="button" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>

          <div className="admin-form-grid">
            <label>
              Project Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Category
              <input name="category" value={form.category} onChange={handleChange} required />
            </label>
            <label>
              Project URL
              <input name="projectUrl" type="url" value={form.projectUrl} onChange={handleChange} placeholder="https://example.com" />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Active</option>
                <option>Live</option>
                <option>In Review</option>
                <option>Draft</option>
              </select>
            </label>
            <label>
              Display Order
              <input name="order" type="number" min="1" value={form.order} onChange={handleChange} />
            </label>
            <label>
              Project Image
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
            </label>
          </div>

          <label>
            Short Description
            <textarea name="shortDescription" rows="3" value={form.shortDescription} onChange={handleChange} required />
          </label>
          <label>
            Full Description
            <textarea name="fullDescription" rows="5" value={form.fullDescription} onChange={handleChange} />
          </label>
          <label className="admin-toggle">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            <span>Feature this project</span>
          </label>

          <button type="submit" className="admin-primary-action" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Saving...' : 'Save Project'}
          </button>
        </form>
      ) : null}

      <div className="admin-table-card">
        <div className="admin-table-head projects">
          <span>Project</span>
          <span>Status</span>
          <span>URL</span>
          <span>Actions</span>
        </div>
        <div className="admin-project-list">
          {sortedProjects.map((project) => (
            <ProjectRow key={project.id} project={project} onEdit={openEditForm} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
