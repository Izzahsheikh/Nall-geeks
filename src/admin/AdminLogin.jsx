import { useState } from 'react';
import logo from '../assets/nallgeeks-logo-mark.png';
import { apiRequest } from './api';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Checking credentials...' });

    try {
      const data = await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStatus({ type: 'success', message: 'Login successful' });
      onLogin(data.admin);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="admin-login-screen">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-brand">
          <img src={logo} alt="NallGeeks logo" />
          <span>NallGeeks Admin</span>
        </div>
        <div>
          <span className="admin-eyebrow">Protected Portal</span>
          <h1>Sign in to manage the website.</h1>
          <p>Projects, messages, applications, and settings are available only after admin login.</p>
        </div>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="admin-primary-action" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Signing in...' : 'Sign In'}
        </button>
        {status.message ? <p className={`admin-form-message ${status.type}`}>{status.message}</p> : null}
      </form>
    </section>
  );
}
