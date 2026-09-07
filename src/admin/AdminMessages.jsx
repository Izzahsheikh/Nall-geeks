import AdminHeader from './components/AdminHeader';
import MessageRow from './components/MessageRow';

export default function AdminMessages({ messages, onViewMessage }) {
  return (
    <div className="admin-page-panel">
      <AdminHeader title="Messages" eyebrow="Contact Submissions" />

      <div className="admin-table-card">
        <div className="admin-table-head">
          <span>Sender</span>
          <span>Subject</span>
          <span>Date</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        <div className="admin-list">
          {messages.map((message) => (
            <MessageRow key={message.id} message={message} onView={onViewMessage} />
          ))}
        </div>
      </div>
    </div>
  );
}
