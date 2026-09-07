import AdminHeader from './components/AdminHeader';
import StatCard from './components/StatCard';
import MessageRow from './components/MessageRow';
import ApplicationRow from './components/ApplicationRow';

export default function AdminDashboard({ stats, messages, applications, onNavigate, onViewMessage, onViewApplication }) {
  return (
    <div className="admin-page-panel">
      <AdminHeader title="Welcome back, Admin" eyebrow="Dashboard">
        <button type="button" className="admin-primary-action" onClick={(event) => onNavigate(event, 'projects', '/admin/projects')}>
          + Add Project
        </button>
      </AdminHeader>

      <p className="admin-intro">
        A focused view of NallGeeks projects, client messages, and new career activity.
      </p>

      <section className="admin-stat-grid" aria-label="Admin overview statistics">
        <StatCard label="Total Projects" value={stats.totalProjects} note="Published and in review" />
        <StatCard label="New Messages" value={stats.newMessages} note="Waiting for response" />
        <StatCard label="Applications" value={stats.applications} note="Across open roles" />
        <StatCard label="Active Projects" value={stats.activeProjects} note="Currently moving" />
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-section-block">
          <div className="admin-section-heading">
            <h2>Recent Messages</h2>
            <button type="button" onClick={(event) => onNavigate(event, 'messages', '/admin/messages')}>View all</button>
          </div>
          <div className="admin-list compact">
            {messages.slice(0, 2).map((message) => (
              <MessageRow key={message.id} message={message} onView={onViewMessage} />
            ))}
          </div>
        </div>

        <div className="admin-section-block">
          <div className="admin-section-heading">
            <h2>Recent Career Applications</h2>
            <button type="button" onClick={(event) => onNavigate(event, 'careers', '/admin/careers')}>View all</button>
          </div>
          <div className="admin-list compact">
            {applications.slice(0, 2).map((application) => (
              <ApplicationRow key={application.id} application={application} onView={onViewApplication} />
            ))}
          </div>
        </div>
      </section>

      <section className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div>
          <button type="button" onClick={(event) => onNavigate(event, 'projects', '/admin/projects')}>Add Project</button>
          <button type="button" onClick={(event) => onNavigate(event, 'messages', '/admin/messages')}>View Messages</button>
          <button type="button" onClick={(event) => onNavigate(event, 'careers', '/admin/careers')}>View Applications</button>
        </div>
      </section>
    </div>
  );
}
