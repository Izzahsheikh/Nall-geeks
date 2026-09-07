export default function ApplicationRow({ application, onView }) {
  return (
    <article className="admin-list-row admin-application-row">
      <div className="admin-list-main">
        <strong>{application.name}</strong>
        <span>{application.email}</span>
      </div>
      <div className="admin-list-subject">{application.position}</div>
      <span>{application.displayDate || application.date}</span>
      <span className={`admin-status ${application.status.toLowerCase()}`}>{application.status}</span>
      <button type="button" onClick={() => onView(application)}>View Application</button>
    </article>
  );
}
