import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Wind, Phone, ShieldCheck, ShieldAlert, RotateCw,
  Activity, Clock, Gauge, Bell, AlertTriangle, CheckCircle2, Radio,
  Wifi, WifiOff, Play, Square, Camera, CameraOff, User, UserX,
} from 'lucide-react';
import CameraScan from '@/components/CameraScan';
import Reveal from '@/components/Reveal';
import {
  getStatus, startMonitoring, stopMonitoring,
  type DriveGuardStatus, type RiskLevel,
} from '@/services/driveguardApi';

type Status = 'safe' | 'warning' | 'danger';

const statusColor: Record<Status, string> = {
  safe: 'text-success bg-success/15 ring-success/30',
  warning: 'text-warning bg-warning/15 ring-warning/30',
  danger: 'text-danger bg-danger/15 ring-danger/30',
};
const statusDot: Record<Status, string> = {
  safe: 'bg-success', warning: 'bg-warning', danger: 'bg-danger',
};

function riskLevelToStatus(risk: RiskLevel): Status {
  if (risk === 'HIGH RISK') return 'danger';
  if (risk === 'WARNING') return 'warning';
  return 'safe';
}

function riskToScore(risk: RiskLevel): number {
  if (risk === 'HIGH RISK') return 82;
  if (risk === 'WARNING') return 55;
  return 12;
}

interface AlertEntry {
  type: string;
  level: Status;
  time: string;
}

function formatTime(ts: string | null): string {
  if (!ts) return '--:--:--';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleTimeString();
}

export default function LiveDashboard() {
  const [connected, setConnected] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [status, setStatus] = useState<DriveGuardStatus | null>(null);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [tripStart, setTripStart] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const prevRiskRef = useRef<RiskLevel | null>(null);
  const alertIdRef = useRef(0);

  // Poll status every 1 second
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const s = await getStatus();
        if (cancelled) return;
        setConnected(true);
        setLastError(null);
        setStatus(s);

        // Track risk-level transitions to generate alerts
        if (prevRiskRef.current !== s.risk_level) {
          const newStatus = riskLevelToStatus(s.risk_level);
          if (newStatus !== 'safe') {
            const id = alertIdRef.current++;
            setAlerts((prev) => [
              { type: s.risk_level === 'HIGH RISK' ? 'High risk detected' : 'Warning: distraction', level: newStatus, time: 'now' },
              ...prev,
            ].slice(0, 8));
          } else if (prevRiskRef.current !== null) {
            setAlerts((prev) => [
              { type: 'Attentive', level: 'safe' as Status, time: 'now' },
              ...prev,
            ].slice(0, 8));
          }
          prevRiskRef.current = s.risk_level;
        }

        // Also flag drowsiness / yawning alerts
        if (s.drowsiness) {
          setAlerts((prev) => {
            if (prev.length > 0 && prev[0].type === 'Drowsiness detected') return prev;
            return [{ type: 'Drowsiness detected', level: 'danger' as Status, time: 'now' }, ...prev].slice(0, 8);
          });
        }
        if (s.yawning) {
          setAlerts((prev) => {
            if (prev.length > 0 && prev[0].type === 'Yawning detected') return prev;
            return [{ type: 'Yawning detected', level: 'warning' as Status, time: 'now' }, ...prev].slice(0, 8);
          });
        }
      } catch {
        if (cancelled) return;
        setConnected(false);
        setMonitoring(false);
        setStatus(null);
        setLastError(null);
      }
    }

    poll();
    const id = setInterval(poll, 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const handleStart = useCallback(async () => {
    setLoadingAction(true);
    try {
      await startMonitoring();
      setMonitoring(true);
      setTripStart(Date.now());
      setAlerts([]);
    } catch (e) {
      setLastError(e instanceof Error ? e.message : 'Failed to start monitoring');
    } finally {
      setLoadingAction(false);
    }
  }, []);

  const handleStop = useCallback(async () => {
    setLoadingAction(true);
    try {
      await stopMonitoring();
      setMonitoring(false);
    } catch (e) {
      setLastError(e instanceof Error ? e.message : 'Failed to stop monitoring');
    } finally {
      setLoadingAction(false);
    }
  }, []);

  // Trip timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!monitoring || tripStart === null) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - tripStart) / 1000)), 1000);
    return () => clearInterval(id);
  }, [monitoring, tripStart]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const driverStatus: Status = status ? riskLevelToStatus(status.risk_level) : 'safe';
  const risk = status ? riskToScore(status.risk_level) : 0;
  const confidence = status?.confidence != null ? status.confidence.toFixed(1) : '--';
  const distraction = status
    ? status.risk_level === 'HIGH RISK'
      ? status.drowsiness ? 'Drowsy' : 'Distraction'
      : status.risk_level === 'WARNING'
        ? status.yawning ? 'Yawning' : 'Looking Away'
        : 'Attentive'
    : 'No data';

  const metrics: { icon: typeof Eye; label: string; value: string; status: Status }[] = status
    ? [
        { icon: status.eyes_detected >= 1 ? Eye : EyeOff, label: 'Eye Status', value: status.eyes_detected >= 1 ? 'Open' : 'Closed', status: status.eyes_detected >= 1 ? 'safe' : 'danger' },
        { icon: Wind, label: 'Yawning', value: status.yawning ? 'Detected' : 'None', status: status.yawning ? 'warning' : 'safe' },
        { icon: Phone, label: 'Drowsiness', value: status.drowsiness ? 'Detected' : 'Alert', status: status.drowsiness ? 'danger' : 'safe' },
        { icon: status.driver_detected ? User : UserX, label: 'Driver', value: status.driver_detected ? 'Detected' : 'Not Found', status: status.driver_detected ? 'safe' : 'warning' },
        { icon: status.camera_active ? Camera : CameraOff, label: 'Camera', value: status.camera_active ? 'Active' : 'Off', status: status.camera_active ? 'safe' : 'danger' },
        { icon: RotateCw, label: 'Eyes Count', value: String(status.eyes_detected), status: status.eyes_detected === 2 ? 'safe' : status.eyes_detected === 1 ? 'warning' : 'danger' },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-glow">
            <Radio className="h-4 w-4 animate-pulse" />
            <span className="font-display text-sm font-semibold uppercase tracking-widest">Live</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">Driver Monitoring Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm">
            <Clock className="h-4 w-4 text-cyan-glow" /> Trip {mm}:{ss}
          </span>
          <span className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
            connected ? 'bg-gradient-to-r from-brand-500 to-cyan-glow text-white' : 'glass text-danger'
          }`}>
            {connected ? <Activity className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {connected ? 'Connected' : 'Offline'}
          </span>
        </div>
      </Reveal>

      {/* Warning banner when risk is WARNING or HIGH RISK */}
      <AnimatePresence>
        {connected && status && status.risk_level !== 'SAFE' && monitoring && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 overflow-hidden rounded-xl border-l-4 ${
              status.risk_level === 'HIGH RISK'
                ? 'border-danger bg-danger/10'
                : 'border-warning bg-warning/10'
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <AlertTriangle className={`h-5 w-5 ${status.risk_level === 'HIGH RISK' ? 'text-danger' : 'text-warning'}`} />
              <span className="font-display text-sm font-semibold">
                {status.risk_level === 'HIGH RISK'
                  ? 'HIGH RISK: Immediate driver distraction detected!'
                  : 'WARNING: Driver attention degraded'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backend offline banner */}
      <AnimatePresence>
        {!connected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border-l-4 border-danger bg-danger/10"
          >
            <div className="flex items-center gap-3 px-4 py-4">
              <WifiOff className="h-5 w-5 text-danger" />
              <div>
                <p className="font-display text-sm font-semibold text-danger">AI BACKEND OFFLINE</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Cannot reach the DriveGuard AI backend at http://127.0.0.1:5000. Please start the Python Flask server.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start / Stop controls */}
      <Reveal className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStart}
            disabled={!connected || monitoring || loadingAction}
            className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          >
            <Play className="h-4 w-4" /> Start Monitoring
          </button>
          <button
            onClick={handleStop}
            disabled={!connected || !monitoring || loadingAction}
            className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-danger to-warning px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          >
            <Square className="h-4 w-4" /> Stop Monitoring
          </button>
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            {connected ? (
              <><Wifi className="h-4 w-4 text-success" /> Backend connected</>
            ) : (
              <><WifiOff className="h-4 w-4 text-danger" /> Backend unreachable</>
            )}
          </div>
          {lastError && (
            <span className="text-xs text-danger">{lastError}</span>
          )}
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera + status */}
        <div className="lg:col-span-2 space-y-6">
          <Reveal>
            <div className="relative">
              <CameraScan />
              <AnimatePresence mode="wait">
                {monitoring && status && (
                  <motion.div
                    key={distraction}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${statusColor[driverStatus]}`}
                  >
                    {distraction}
                  </motion.div>
                )}
              </AnimatePresence>
              {!monitoring && connected && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--bg-elev)]/80 px-4 py-1.5 text-sm font-semibold text-[var(--text-muted)]">
                  Press Start to begin monitoring
                </div>
              )}
            </div>
          </Reveal>

          {/* Metric cards */}
          {connected && status ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {metrics.map((m, i) => (
                <Reveal key={m.label} delay={i * 0.05}>
                  <div className="relative h-full overflow-hidden rounded-2xl glass p-4">
                    <div className="flex items-center justify-between">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${statusColor[m.status]}`}>
                        <m.icon className="h-4.5 w-4.5" />
                      </span>
                      <span className={`h-2 w-2 rounded-full ${statusDot[m.status]} ${m.status !== 'safe' ? 'animate-pulse' : ''}`} />
                    </div>
                    <p className="mt-3 text-xs text-[var(--text-muted)]">{m.label}</p>
                    <p className="font-display text-lg font-semibold">{m.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          <Reveal delay={0.1}>
            <div className="rounded-2xl glass p-6">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Gauge className="h-4.5 w-4.5" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Driver Status</h3>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold ring-1 ${statusColor[driverStatus]}`}>
                  {risk}
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">{distraction}</p>
                  <p className="text-xs text-[var(--text-muted)]">Risk score · {risk > 60 ? 'High' : risk > 30 ? 'Moderate' : 'Low'}</p>
                </div>
              </div>
              {/* Risk bar */}
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: risk > 60 ? 'linear-gradient(90deg,#ff5c7c,#ffc857)' : risk > 30 ? 'linear-gradient(90deg,#ffc857,#22e1ff)' : 'linear-gradient(90deg,#22d39a,#22e1ff)' }}
                  animate={{ width: `${risk}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl glass p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Confidence</p>
                  <p className="font-display text-2xl font-bold gradient-text">{confidence}{confidence !== '--' ? '%' : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Eyes Detected</p>
                  <p className="font-display text-2xl font-bold">{status?.eyes_detected ?? '--'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Trip Time</p>
                  <p className="font-display text-2xl font-bold">{mm}:{ss}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Risk Score</p>
                  <p className="font-display text-2xl font-bold">{risk}<span className="text-sm text-[var(--text-muted)]">/100</span></p>
                </div>
              </div>
              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <p className="text-xs text-[var(--text-muted)]">Last Update</p>
                <p className="font-display text-sm font-semibold">{formatTime(status?.timestamp ?? null)}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-2xl glass p-6">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Bell className="h-4.5 w-4.5" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Alerts</h3>
              </div>
              <div className="mt-4 space-y-2.5">
                {alerts.length === 0 ? (
                  <p className="py-4 text-center text-sm text-[var(--text-muted)]">No alerts yet</p>
                ) : (
                  alerts.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 rounded-xl bg-[var(--bg-elev)]/40 px-3 py-2.5"
                    >
                      {a.level === 'safe' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className={`h-4 w-4 ${a.level === 'danger' ? 'text-danger' : 'text-warning'}`} />}
                      <span className="flex-1 text-sm">{a.type}</span>
                      <span className="text-xs text-[var(--text-muted)]">{a.time}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
