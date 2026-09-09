import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    navigate('/admin');
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to access your dashboard">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full rounded-xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input type={show ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-11 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-cyan-glow" aria-label="Toggle password">
              {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[var(--text-muted)]">
            <input type="checkbox" className="h-4 w-4 rounded border-[var(--border)] accent-cyan-glow" /> Remember me
          </label>
          <a href="#" className="font-medium text-cyan-glow hover:underline">Forgot password?</a>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger ring-1 ring-danger/30">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow py-3.5 font-semibold text-white glow-blue disabled:opacity-60">
          {busy ? 'Signing in…' : (<>Sign in <ArrowRight className="h-4.5 w-4.5" /></>)}
        </button>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Don't have an account? <Link to="/register" className="font-medium text-cyan-glow hover:underline">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
