export default function MessageRow({ message, onView }) {
  return (
    <article className="admin-list-row">
      <div className="admin-list-main">
        <strong>{message.sender}</strong>
        <span>{message.email}</span>
      </div>
      <div className="admin-list-subject">{message.subject}</div>
      <span>{message.displayDate || message.date}</span>
      <span className={`admin-status ${message.status.toLowerCase()}`}>{message.status}</span>
      <button type="button" onClick={() => onView(message)}>View</button>
    </article>
  );
}
