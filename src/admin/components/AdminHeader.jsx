export default function AdminHeader({ title, eyebrow, children }) {
  return (
    <header className="admin-header">
      <div>
        <span className="admin-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {children ? <div className="admin-header-actions">{children}</div> : null}
    </header>
  );
}
