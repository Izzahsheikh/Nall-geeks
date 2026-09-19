import { useEffect, useState } from 'react';
import { apiRequest } from './api';
import AdminCareers from './AdminCareers';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import AdminMessages from './AdminMessages';
import AdminProfile from './AdminProfile';
import AdminProjects from './AdminProjects';
import AdminSettings from './AdminSettings';
import AdminSidebar from './components/AdminSidebar';

const emptyStats = {
  totalProjects: 0,
  newMessages: 0,
  applications: 0,
  activeProjects: 0,
};

const pageFromPath = (path) => {
  if (path.includes('/admin/projects')) return 'projects';
  if (path.includes('/admin/messages')) return 'messages';
  if (path.includes('/admin/careers')) return 'careers';
  if (path.includes('/admin/profile')) return 'profile';
  if (path.includes('/admin/settings')) return 'settings';
  return 'dashboard';
};

export default function AdminLayout() {
  const [activePage, setActivePage] = useState(() => pageFromPath(window.location.pathname));
  const [admin, setAdmin] = useState(null);
  const [authStatus, setAuthStatus] = useState('checking');
  const [loadError, setLoadError] = useState('');
  const [stats, setStats] = useState(emptyStats);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const loadAdminData = async () => {
    setLoadError('');

    try {
      const [projectData, jobData, messageData, applicationData, statsData] = await Promise.all([
        apiRequest('/api/admin/projects'),
        apiRequest('/api/admin/jobs'),
        apiRequest('/api/admin/messages'),
        apiRequest('/api/admin/applications'),
        apiRequest('/api/admin/stats'),
      ]);

      setProjects(projectData.projects || []);
      setJobs(jobData.jobs || []);
      setMessages(messageData.messages || []);
      setApplications(applicationData.applications || []);
      setStats(statsData.stats || emptyStats);
    } catch (error) {
      setLoadError(error.message);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await apiRequest('/api/admin/me');
        setAdmin(data.admin);
        setAuthStatus('authenticated');
        await loadAdminData();
      } catch {
        setAuthStatus('login');
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const handlePopState = () => setActivePage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = async (nextAdmin) => {
    setAdmin(nextAdmin);
    setAuthStatus('authenticated');
    await loadAdminData();
  };

  const handleNavigate = async (event, page, href) => {
    event.preventDefault();

    if (page === 'logout') {
      await apiRequest('/api/admin/logout', { method: 'POST' });
      window.location.assign('/');
      return;
    }

    setActivePage(page);
    setSelectedMessage(null);
    setSelectedApplication(null);
    window.history.pushState(null, '', href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetMessageStatus = async (message, status) => {
    await apiRequest(`/api/admin/messages/${message.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setSelectedMessage((current) => (current?.id === message.id ? { ...current, status } : current));
    await loadAdminData();
  };

  const handleDeleteMessage = async (message) => {
    const confirmed = window.confirm(`Delete message from ${message.sender}?`);
    if (!confirmed) return;

    await apiRequest(`/api/admin/messages/${message.id}`, { method: 'DELETE' });
    setSelectedMessage(null);
    await loadAdminData();
  };

  if (authStatus === 'checking') {
    return (
      <section className="admin-login-screen">
        <div className="admin-login-card">
          <span className="admin-eyebrow">NallGeeks Admin</span>
          <h1>Checking admin session...</h1>
        </div>
      </section>
    );
  }

  if (authStatus === 'login') {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const sharedProps = {
    stats,
    projects,
    jobs,
    messages,
    applications,
    admin,
    onNavigate: handleNavigate,
    onProjectsChange: loadAdminData,
    onViewMessage: setSelectedMessage,
    onViewApplication: setSelectedApplication,
  };

  return (
    <section className="admin-shell">
      <AdminSidebar activePage={activePage} onNavigate={handleNavigate} admin={admin} />
      <main className="admin-main">
        {loadError ? <p className="admin-form-message error">{loadError}</p> : null}
        {activePage === 'projects' ? <AdminProjects {...sharedProps} /> : null}
        {activePage === 'messages' ? <AdminMessages {...sharedProps} /> : null}
        {activePage === 'careers' ? <AdminCareers {...sharedProps} /> : null}
        {activePage === 'profile' ? <AdminProfile admin={admin} onNavigate={handleNavigate} /> : null}
        {activePage === 'settings' ? <AdminSettings onNavigate={handleNavigate} /> : null}
        {activePage === 'dashboard' ? <AdminDashboard {...sharedProps} /> : null}
      </main>

      {selectedMessage ? (
        <div className="admin-detail-backdrop" role="presentation" onClick={() => setSelectedMessage(null)}>
          <aside className="admin-detail-panel" role="dialog" aria-modal="true" aria-label="Message detail" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-close" onClick={() => setSelectedMessage(null)}>Close</button>
            <span className="admin-eyebrow">Message</span>
            <h2>{selectedMessage.subject}</h2>
            <div className="admin-detail-meta">
              <span>{selectedMessage.sender}</span>
              <span>{selectedMessage.email}</span>
              <span>{selectedMessage.displayDate || selectedMessage.date}</span>
              {selectedMessage.phone ? <span>{selectedMessage.phone}</span> : null}
              {selectedMessage.company ? <span>{selectedMessage.company}</span> : null}
            </div>
            <p>{selectedMessage.body || 'No message body was provided.'}</p>
            <div className="admin-detail-actions">
              <button type="button" onClick={() => handleSetMessageStatus(selectedMessage, selectedMessage.status === 'Unread' ? 'Read' : 'Unread')}>
                Mark as {selectedMessage.status === 'Unread' ? 'read' : 'unread'}
              </button>
              <a href={`mailto:${selectedMessage.email}`}>Reply/Open email</a>
              <button type="button" className="danger" onClick={() => handleDeleteMessage(selectedMessage)}>Delete message</button>
            </div>
          </aside>
        </div>
      ) : null}

      {selectedApplication ? (
        <div className="admin-detail-backdrop" role="presentation" onClick={() => setSelectedApplication(null)}>
          <aside className="admin-detail-panel" role="dialog" aria-modal="true" aria-label="Application detail" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-close" onClick={() => setSelectedApplication(null)}>Close</button>
            <span className="admin-eyebrow">Application</span>
            <h2>{selectedApplication.name}</h2>
            <div className="admin-detail-meta">
              <span>{selectedApplication.position}</span>
              <span>{selectedApplication.email}</span>
              <span>{selectedApplication.displayDate || selectedApplication.date}</span>
              {selectedApplication.phone ? <span>{selectedApplication.phone}</span> : null}
              {selectedApplication.portfolio ? <span>Portfolio: {selectedApplication.portfolio}</span> : null}
              {selectedApplication.linkedin ? <span>LinkedIn: {selectedApplication.linkedin}</span> : null}
              {selectedApplication.resume ? (
                <span>
                  Resume:{' '}
                  <a href={`/api/admin/applications/${selectedApplication.id}/files/resume`} download>
                    {selectedApplication.resume.name}
                  </a>
                </span>
              ) : null}
            </div>
            <p>{selectedApplication.details || 'No extra application details were provided.'}</p>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
