import AdminHeader from './components/AdminHeader';

export default function AdminSettings({ onNavigate }) {
  return (
    <div className="admin-page-panel">
      <AdminHeader title="Settings" eyebrow="Admin Settings" />

      <section className="admin-settings-grid">
        <div className="admin-setting-block">
          <span className="admin-eyebrow">Website</span>
          <h2>Website Settings</h2>
          <p>Manage public website information, portfolio visibility, and contact details.</p>
          <button type="button">Manage Website</button>
        </div>
        <div className="admin-setting-block">
          <span className="admin-eyebrow">Account</span>
          <h2>Admin Account</h2>
          <p>Update account identity, email, password, and access preferences.</p>
          <button type="button">Account Settings</button>
        </div>
        <div className="admin-setting-block">
          <span className="admin-eyebrow">Notifications</span>
          <h2>Notification Preferences</h2>
          <p>Choose how message, project, and application alerts should be handled.</p>
          <label className="admin-toggle">
            <input type="checkbox" defaultChecked />
            <span>Email alerts</span>
          </label>
        </div>
        <div className="admin-setting-block">
          <span className="admin-eyebrow">Session</span>
          <h2>Logout</h2>
          <p>Leave the dashboard and return to the public website.</p>
          <button type="button" className="danger" onClick={(event) => onNavigate(event, 'logout', '/')}>Logout</button>
        </div>
      </section>
    </div>
  );
}
