import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Send, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
    };
    const { error } = await supabase.from('contact_messages').insert(payload);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
    form.reset();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-cyan-glow">Get in touch</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Contact</h1>
        <p className="mt-4 text-[var(--text-muted)]">Questions about the project, collaboration, or demo requests — we'd love to hear from you.</p>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <Reveal>
          <form onSubmit={handleSubmit} className="rounded-2xl glass p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon={User} label="Name" name="name" type="text" placeholder="Your name" required />
              <Field icon={Mail} label="Email" name="email" type="email" placeholder="you@email.com" required />
              <Field icon={Phone} label="Phone" name="phone" type="tel" placeholder="+1 555 000 0000" />
              <Field icon={MessageSquare} label="Subject" name="subject" type="text" placeholder="Project inquiry" />
            </div>
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us what you need…"
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-glow mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-6 py-3.5 font-semibold text-white glow-blue disabled:opacity-60"
            >
              {sent ? (<><CheckCircle2 className="h-5 w-5" /> Message Sent</>) : submitting ? 'Sending…' : (<>Send Message <Send className="h-4 w-4" /></>)}
            </button>
            {sent && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-sm text-success">Thanks! We'll get back to you shortly.</motion.p>}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-danger">
                <AlertCircle className="h-4 w-4" /> {error}
              </motion.p>
            )}
          </form>
        </Reveal>

        {/* Map + info */}
        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="relative h-72 overflow-hidden rounded-2xl glass">
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-500/10 to-violet-glow/10">
                <div className="text-center">
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-glow glow-blue"
                  >
                    <MapPin className="h-7 w-7 text-white" />
                  </motion.span>
                  <p className="mt-3 font-display text-sm font-semibold">Department of Computer Engineering</p>
                  <p className="text-xs text-[var(--text-muted)]">University Campus, Innovation Block · Floor 3</p>
                </div>
              </div>
              <svg className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
                <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#22e1ff" strokeWidth="2" strokeDasharray="10 8" />
                <line x1="55%" y1="0" x2="55%" y2="100%" stroke="#22e1ff" strokeWidth="2" strokeDasharray="10 8" />
              </svg>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Mail, label: 'Email', value: 'team@edgeai-driver.io' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                { icon: MapPin, label: 'Location', value: 'Innovation Block, Floor 3' },
                { icon: MessageSquare, label: 'Response time', value: 'Within 24 hours' },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06}>
                  <div className="flex items-center gap-3 rounded-2xl glass p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow">
                      <c.icon className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">{c.label}</p>
                      <p className="text-sm font-medium">{c.value}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, name, type, placeholder, required }: { icon: typeof User; label: string; name: string; type: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40"
        />
      </div>
    </div>
  );
}
