import { useMemo, useState } from 'react';
import { apiRequest } from './api';
import AdminHeader from './components/AdminHeader';
import ApplicationRow from './components/ApplicationRow';

const emptyJob = {
  title: '',
  type: 'Full-time',
  department: '',
  location: '',
  summary: '',
  description: '',
  responsibilities: '',
  qualifications: '',
  status: 'Open',
  order: 1,
};

export default function AdminCareers({ jobs, applications, onProjectsChange, onViewApplication }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(emptyJob);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    [jobs]
  );

  const openAddForm = () => {
    setEditingJob(null);
    setForm({ ...emptyJob, order: jobs.length + 1 });
    setStatus({ type: 'idle', message: '' });
    setFormOpen(true);
  };

  const openEditForm = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || '',
      type: job.type || 'Full-time',
      department: job.department || '',
      location: job.location || '',
      summary: job.summary || '',
      description: job.description || '',
      responsibilities: (job.responsibilities || []).join('\n'),
      qualifications: (job.qualifications || []).join('\n'),
      status: job.status || 'Open',
      order: job.order || 1,
    });
    setStatus({ type: 'idle', message: '' });
    setFormOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim() || !form.summary.trim()) {
      setStatus({ type: 'error', message: 'Job title, location, and summary are required.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Saving job...' });

    try {
      await apiRequest(editingJob ? `/api/admin/jobs/${editingJob.id}` : '/api/admin/jobs', {
        method: editingJob ? 'PUT' : 'POST',
        body: JSON.stringify({ ...form, order: Number(form.order || 0) }),
      });
      await onProjectsChange();
      setFormOpen(false);
      setStatus({ type: 'success', message: editingJob ? 'Job updated.' : 'Job added.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (job) => {
    const confirmed = window.confirm(`Delete ${job.title}? This will remove it from the public Careers page.`);
    if (!confirmed) return;

    try {
      await apiRequest(`/api/admin/jobs/${job.id}`, { method: 'DELETE' });
      await onProjectsChange();
      setStatus({ type: 'success', message: 'Job deleted.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="admin-page-panel">
      <AdminHeader title="Careers" eyebrow="Jobs & Applications">
        <button type="button" className="admin-primary-action" onClick={openAddForm}>+ Add New Job</button>
      </AdminHeader>

      {status.message ? <p className={`admin-form-message ${status.type}`}>{status.message}</p> : null}

      {formOpen ? (
        <form className="admin-project-form" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <div>
              <span className="admin-eyebrow">{editingJob ? 'Edit Job' : 'Add Job'}</span>
              <h2>{editingJob ? editingJob.title : 'Create a career opening'}</h2>
            </div>
            <button type="button" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>

          <div className="admin-form-grid">
            <label>
              Job Title
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <label>
              Job Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Project-based</option>
                <option>Remote</option>
              </select>
            </label>
            <label>
              Department
              <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering, Design" />
            </label>
            <label>
              Location
              <input name="location" value={form.location} onChange={handleChange} required />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Open</option>
                <option>Closed</option>
                <option>Draft</option>
              </select>
            </label>
            <label>
              Display Order
              <input name="order" type="number" min="1" value={form.order} onChange={handleChange} />
            </label>
          </div>

          <label>
            Short Summary
            <textarea name="summary" rows="3" value={form.summary} onChange={handleChange} required />
          </label>
          <label>
            Full Description
            <textarea name="description" rows="5" value={form.description} onChange={handleChange} />
          </label>
          <label>
            Responsibilities (one per line)
            <textarea name="responsibilities" rows="5" value={form.responsibilities} onChange={handleChange} />
          </label>
          <label>
            Qualifications (one per line)
            <textarea name="qualifications" rows="5" value={form.qualifications} onChange={handleChange} />
          </label>

          <button type="submit" className="admin-primary-action" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Saving...' : 'Save Job'}
          </button>
        </form>
      ) : null}

      <section className="admin-section-block admin-careers-block">
        <div className="admin-section-heading">
          <h2>Job Openings</h2>
          <span>{sortedJobs.length} total</span>
        </div>
        <div className="admin-job-list">
          {sortedJobs.map((job) => (
            <article className="admin-job-row" key={job.id}>
              <div>
                <strong>{job.title}</strong>
                <span>{job.type} · {job.location}</span>
                <p>{job.summary}</p>
              </div>
              <span className={`admin-status ${job.status.toLowerCase()}`}>{job.status}</span>
              <div className="admin-row-actions">
                <button type="button" onClick={() => openEditForm(job)}>Edit</button>
                <button type="button" className="danger" onClick={() => handleDelete(job)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-table-card">
        <div className="admin-table-head">
          <span>Applicant</span>
          <span>Position</span>
          <span>Date</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        <div className="admin-list">
          {applications.map((application) => (
            <ApplicationRow key={application.id} application={application} onView={onViewApplication} />
          ))}
        </div>
      </div>
    </div>
  );
}
