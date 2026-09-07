import logo from '../../assets/nallgeeks-logo-mark.png';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin' },
  { id: 'projects', label: 'Projects', href: '/admin/projects' },
  { id: 'messages', label: 'Messages', href: '/admin/messages' },
  { id: 'careers', label: 'Careers', href: '/admin/careers' },
  { id: 'profile', label: 'Profile', href: '/admin/profile' },
  { id: 'settings', label: 'Settings', href: '/admin/settings' },
  { id: 'logout', label: 'Logout', href: '/admin/logout' },
];

export default function AdminSidebar({ activePage, onNavigate, admin }) {
  return (
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/admin" onClick={(event) => onNavigate(event, 'dashboard', '/admin')}>
        <img src={logo} alt="NallGeeks logo" />
        <span>NallGeeks</span>
      </a>

      <nav className="admin-nav" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={activePage === item.id ? 'active' : ''}
            onClick={(event) => onNavigate(event, item.id, item.href)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="admin-profile-mini">
        <div className="admin-avatar">A</div>
        <div>
          <strong>Admin</strong>
          <span>{admin?.email || 'Administrator'}</span>
        </div>
      </div>
    </aside>
  );
}
