import AdminHeader from './components/AdminHeader';

export default function AdminProfile({ admin, onNavigate }) {
  return (
    <div className="admin-page-panel">
      <AdminHeader title="Admin Profile" eyebrow="Profile" />

      <section className="admin-profile-card">
        <div className="admin-profile-hero">
          <div className="admin-profile-avatar">A</div>
          <div>
            <span className="admin-eyebrow">Administrator</span>
            <h2>NallGeeks Admin</h2>
            <p>{admin?.email || 'admin@nallgeeks.com'}</p>
          </div>
        </div>
        <button type="button" className="admin-primary-action">Edit Profile</button>
      </section>

      <section className="admin-settings-grid">
        <div className="admin-setting-block">
          <span className="admin-eyebrow">Security</span>
          <h2>Change Password</h2>
          <p>Keep account access protected with a strong password and regular updates.</p>
          <button type="button">Change Password</button>
        </div>
        <div className="admin-setting-block">
          <span className="admin-eyebrow">Session</span>
          <h2>Logout</h2>
          <p>End the current admin session on this device.</p>
          <button type="button" className="danger" onClick={(event) => onNavigate(event, 'logout', '/')}>Logout</button>
        </div>
      </section>
    </div>
  );
}
