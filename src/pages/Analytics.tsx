import { useEffect, useState } from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, CalendarDays, Gauge, Activity, Target, Layers } from 'lucide-react';
import ChartJS from '@/lib/registerCharts';

void ChartJS;
import Reveal from '@/components/Reveal';
import { useTheme } from '@/context/ThemeContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weeks = ['W1', 'W2', 'W3', 'W4'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function useChartColors() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return {
    grid: dark ? 'rgba(120,150,210,0.12)' : 'rgba(20,40,80,0.1)',
    text: dark ? '#8b9bbd' : '#525e74',
    gradient: ['#4a98ff', '#22e1ff', '#8b5cff'] as const,
  };
}

function PageHeader({ icon: Icon, title, subtitle }: { icon: typeof TrendingUp; title: string; subtitle: string }) {
  return (
    <Reveal className="mb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow">
          <Icon className="h-5.5 w-5.5 text-white" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
    </Reveal>
  );
}

function ChartCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl glass p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function Analytics() {
  const c = useChartColors();
  const [tab, setTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: c.text, font: { family: 'Inter', size: 12 } } },
    },
    scales: {
      x: { grid: { color: c.grid }, ticks: { color: c.text } },
      y: { grid: { color: c.grid }, ticks: { color: c.text }, beginAtZero: true },
    },
  };

  const dailyData = {
    labels: days,
    datasets: [
      { label: 'Alerts', data: [12, 8, 15, 6, 18, 22, 9], borderColor: '#22e1ff', backgroundColor: 'rgba(34,225,255,0.15)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#22e1ff' },
      { label: 'Safe events', data: [88, 92, 85, 94, 82, 78, 91], borderColor: '#4a98ff', backgroundColor: 'rgba(74,152,255,0.12)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#4a98ff' },
    ],
  };

  const weeklyData = {
    labels: weeks,
    datasets: [
      { label: 'Distractions', data: [42, 35, 51, 28], backgroundColor: 'rgba(139,92,255,0.7)', borderRadius: 8 },
      { label: 'Alerts raised', data: [38, 30, 47, 24], backgroundColor: 'rgba(34,225,255,0.7)', borderRadius: 8 },
    ],
  };

  const monthlyData = {
    labels: months,
    datasets: [
      { label: 'Trips', data: [120, 145, 160, 132, 178, 190], borderColor: '#4a98ff', backgroundColor: 'rgba(74,152,255,0.15)', fill: true, tension: 0.4 },
      { label: 'Incidents', data: [22, 18, 25, 14, 19, 12], borderColor: '#ff5c7c', backgroundColor: 'rgba(255,92,124,0.12)', fill: true, tension: 0.4 },
    ],
  };

  const distractionTypes = {
    labels: ['Phone', 'Drowsiness', 'Yawning', 'Looking away', 'Smoking', 'No belt'],
    datasets: [{
      data: [32, 24, 18, 14, 8, 4],
      backgroundColor: ['#1d75ff', '#22e1ff', '#8b5cff', '#4a98ff', '#ff5c7c', '#ffc857'],
      borderWidth: 0,
    }],
  };

  const accuracy = {
    labels: ['Precision', 'Recall', 'F1', 'Latency', 'Stability', 'Coverage'],
    datasets: [{
      label: 'Model',
      data: [98, 97, 97.5, 92, 95, 96],
      borderColor: '#22e1ff',
      backgroundColor: 'rgba(34,225,255,0.18)',
      pointBackgroundColor: '#22e1ff',
    }],
  };

  const driverScore = {
    labels: days,
    datasets: [{
      label: 'Driver score',
      data: [82, 88, 76, 91, 73, 68, 94],
      backgroundColor: ['#22d39a', '#22d39a', '#22e1ff', '#22d39a', '#22e1ff', '#ff5c7c', '#22d39a'],
      borderRadius: 8,
    }],
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Reveal className="mb-8">
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-[var(--text-muted)]">Historical trends, distraction breakdowns, and model performance.</p>
      </Reveal>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: TrendingUp, label: 'Avg Driver Score', value: '84.2', suffix: '/100', color: 'from-brand-500 to-cyan-glow' },
          { icon: Activity, label: 'Total Alerts (30d)', value: '1,284', suffix: '', color: 'from-violet-glow to-brand-500' },
          { icon: Target, label: 'Model Accuracy', value: '98.7', suffix: '%', color: 'from-cyan-glow to-violet-glow' },
          { icon: Layers, label: 'Trips Analyzed', value: '927', suffix: '', color: 'from-brand-400 to-cyan-glow' },
        ].map((k, i) => (
          <Reveal key={k.label} delay={i * 0.06}>
            <div className="rounded-2xl glass p-5">
              <span className={`inline-flex rounded-xl bg-gradient-to-br ${k.color} p-2.5`}>
                <k.icon className="h-5 w-5 text-white" />
              </span>
              <p className="mt-3 font-display text-2xl font-bold">{k.value}<span className="text-sm text-[var(--text-muted)]">{k.suffix}</span></p>
              <p className="text-xs text-[var(--text-muted)]">{k.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Tabbed report */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <PageHeader icon={CalendarDays} title="Alert reports" subtitle="Daily, weekly, and monthly breakdowns" />
        <div className="flex gap-1 rounded-xl glass p-1">
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-white' : 'text-[var(--text-muted)]'}`}
            >
              {tab === t && <motion.span layoutId="tab-pill" className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-brand-500 to-cyan-glow" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <ChartCard className="h-80">
          {tab === 'daily' && <Line data={dailyData} options={baseOpts} />}
          {tab === 'weekly' && <Bar data={weeklyData} options={baseOpts} />}
          {tab === 'monthly' && <Line data={monthlyData} options={baseOpts} />}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <PageHeader icon={Gauge} title="Driver score" subtitle="Daily safety score across the week" />
          <ChartCard className="h-72">
            <Bar data={driverScore} options={{ ...baseOpts, plugins: { legend: { display: false } } }} />
          </ChartCard>
        </Reveal>

        <Reveal delay={0.1}>
          <PageHeader icon={Layers} title="Distraction types" subtitle="Distribution of detected distractions" />
          <ChartCard className="h-72">
            <Doughnut data={distractionTypes} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: c.text } } } }} />
          </ChartCard>
        </Reveal>

        <Reveal>
          <PageHeader icon={Target} title="Model accuracy" subtitle="Precision, recall, and stability metrics" />
          <ChartCard className="h-72">
            <Radar data={accuracy} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: c.grid }, angleLines: { color: c.grid }, pointLabels: { color: c.text }, ticks: { color: c.text, backdropColor: 'transparent' }, suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } } }} />
          </ChartCard>
        </Reveal>

        <Reveal delay={0.1}>
          <PageHeader icon={TrendingUp} title="Weekly report" subtitle="Distractions vs alerts raised" />
          <ChartCard className="h-72">
            <Bar data={weeklyData} options={baseOpts} />
          </ChartCard>
        </Reveal>
      </div>
    </div>
  );
}
