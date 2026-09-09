import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const phone = String(fd.get('phone') ?? '');
    const password = String(fd.get('password') ?? '');
    const confirm = String(fd.get('confirm') ?? '');
    if (password !== confirm) {
      setError('Passwords do not match.');
      setBusy(false);
      return;
    }
    const { error } = await signUp(email, password, fullName, phone);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join the Edge-AI driver monitoring platform">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field icon={User} label="Name" name="name" type="text" placeholder="Your full name" required />
        <Field icon={Mail} label="Email" name="email" type="email" placeholder="you@email.com" required />
        <Field icon={Phone} label="Phone" name="phone" type="tel" placeholder="+1 555 000 0000" />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input name="password" type={show ? 'text' : 'password'} required placeholder="••••••••" className="w-full rounded-xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-11 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-cyan-glow" aria-label="Toggle password">
              {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">Confirm Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input name="confirm" type="password" required placeholder="••••••••" className="w-full rounded-xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40" />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
          <input name="terms" type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-cyan-glow" />
          I agree to the <a href="#" className="text-cyan-glow hover:underline">Terms</a> and <a href="#" className="text-cyan-glow hover:underline">Privacy Policy</a>
        </label>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger ring-1 ring-danger/30">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-success ring-1 ring-success/30">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Account created! Redirecting to sign in…
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow py-3.5 font-semibold text-white glow-blue disabled:opacity-60">
          {busy ? 'Creating account…' : (<>Create account <ArrowRight className="h-4.5 w-4.5" /></>)}
        </button>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Already have an account? <Link to="/login" className="font-medium text-cyan-glow hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function Field({ icon: Icon, label, name, type, placeholder, required }: { icon: typeof User; label: string; name: string; type: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-muted)]" />
        <input name={name} type={type} required={required} placeholder={placeholder} className="w-full rounded-xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40" />
      </div>
    </div>
  );
}
