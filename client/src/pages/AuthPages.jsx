import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/auth.css';

const logo = '/assets/images/ateneo-logo.png';

function Shell({ mode, children }) {
  const isRegister = mode === 'register';
  const features = isRegister
    ? ['Register your account', 'Submit your documents', 'Track your printing requests']
    : ['Upload documents easily', 'Customize your printing preferences', 'Track your printing requests'];

  return <div className="adnu-auth">
    <header className="adnu-header">
      <Link to="/login" className="adnu-brand"><img src={logo} alt="Ateneo de Naga University seal" /><span>ADNU-PRINTS</span></Link>
      <span className="adnu-caption">Campus printing made simple</span>
    </header>
    <main className="adnu-layout">
      <section className="adnu-welcome">
        <div className="adnu-welcome-content">
          <p className="adnu-eyebrow">ATENEO DE NAGA UNIVERSITY</p>
          <h1>{isRegister ? <>PRINT SMARTER,<br />START HERE.</> : <>PRINT SMARTER,<br />STUDY BETTER.</>}</h1>
          <p className="adnu-intro">Your campus printing companion. Submit print requests, customize your prints, and track your orders in one convenient place.</p>
          <div className="adnu-features">{features.map((f, i) => <div className="adnu-feature" key={f}><span>{String(i + 1).padStart(2, '0')}</span>{f}</div>)}</div>
        </div>
      </section>
      <section className="adnu-form-panel">{children}</section>
    </main>
  </div>;
}

function ErrorText({ message }) {
  return message ? <div className="adnu-error" role="alert">{message}</div> : null;
}

function errorMessage(error) {
  if (!error.response) return 'Cannot reach Campus Prints API. Check that the Express server is running.';
  return error.response.data?.error || 'Something went wrong. Please try again.';
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      navigate(data.user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  return <Shell mode="login"><div className="adnu-card">
    <h2>Welcome Back!</h2><p className="adnu-subtitle">Log in to your Campus Prints account.</p>
    <ErrorText message={error} />
    <form onSubmit={submit}>
      <label htmlFor="login-email">Email Address</label>
      <input id="login-email" type="email" placeholder="Enter your school email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} />
      <label htmlFor="login-password">Password</label>
      <input id="login-password" type="password" placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
      <button className="adnu-submit" disabled={busy}>{busy ? 'Logging in…' : 'Log In'}</button>
    </form>
    <div className="adnu-divider"><span>OR</span></div>
    <p className="adnu-switch">Don't have an account? <Link to="/register">Register here</Link></p>
    <div className="adnu-note">For students and authorized printing staff.</div>
  </div></Shell>;
}

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: '', student_id: '', email: '', role: 'student', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  function update(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      navigate(data.user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  return <Shell mode="register"><div className="adnu-card">
    <h2>Create Account</h2><p className="adnu-subtitle">Join ADNU-PRINTS and start printing smarter.</p>
    <ErrorText message={error} />
    <form onSubmit={submit}>
      <label htmlFor="reg-fullname">Full Name</label>
      <input id="reg-fullname" name="fullname" placeholder="Enter your full name" autoComplete="name" minLength={2} maxLength={150} required value={form.fullname} onChange={update} />
      <label htmlFor="reg-id">Student / Employee ID</label>
      <input id="reg-id" name="student_id" placeholder="Enter your ID number" maxLength={100} required value={form.student_id} onChange={update} />
      <label htmlFor="reg-email">Email Address</label>
      <input id="reg-email" type="email" name="email" placeholder="Enter your school email" autoComplete="email" required value={form.email} onChange={update} />
      <label htmlFor="reg-role">Account Type</label>
      <select id="reg-role" name="role" value={form.role} onChange={update}><option value="student">Student</option><option value="faculty">Faculty</option></select>
      <label htmlFor="reg-password">Password</label>
      <input id="reg-password" type="password" name="password" placeholder="Create your password (8+ characters)" minLength={8} maxLength={72} autoComplete="new-password" required value={form.password} onChange={update} />
      <button className="adnu-submit" disabled={busy}>{busy ? 'Creating account…' : 'Create Account'}</button>
    </form>
    <p className="adnu-switch">Already have an account? <Link to="/login">Log in here</Link></p>
    <div className="adnu-note">Registration is available for students and faculty.</div>
  </div></Shell>;
}

export function ProtectedLanding({ admin = false }) {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, user: null });
  useEffect(() => {
    let active = true;
    api.get('/auth/me').then(({data}) => { if (active) setState({loading: false, user: data.user}); })
      .catch(() => { if (active) setState({loading: false, user: null}); });
    return () => { active = false; };
  }, []);
  if (state.loading) return <div className="adnu-status">Checking your session…</div>;
  if (!state.user) return <Navigate to="/login" replace />;
  if (admin && state.user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (!admin && state.user.role === 'admin') return <Navigate to="/admin" replace />;
  async function logout() { try { await api.post('/auth/logout'); navigate('/login', { replace: true }); } catch { alert('Could not log out. Check your connection.'); } }
  return <div className="adnu-placeholder">
    <header className="adnu-header"><Link className="adnu-brand" to="/"><img src={logo} alt="ADNU seal" /><span>ADNU-PRINTS</span></Link><button onClick={logout}>Log Out</button></header>
    <section><p className="adnu-eyebrow">ATENEO DE NAGA UNIVERSITY</p><h1>{admin ? 'Admin' : 'Student'} Dashboard</h1>
      <p>Welcome, <strong>{state.user.fullname}</strong>.</p>
      <p>Your login and registration are connected to MongoDB.</p>
      <p className="adnu-note">Dashboard, printing queue, document uploads and history are the next conversion stage. This screen is not the finished dashboard.</p>
    </section>
  </div>;
}
