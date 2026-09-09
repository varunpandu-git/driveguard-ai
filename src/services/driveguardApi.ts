const BASE_URL = 'http://127.0.0.1:5000';

export type RiskLevel = 'SAFE' | 'WARNING' | 'HIGH RISK';

export interface DriveGuardStatus {
  camera_active: boolean;
  driver_detected: boolean;
  eyes_detected: number;
  drowsiness: boolean;
  yawning: boolean;
  risk_level: RiskLevel;
  confidence: number | null;
  timestamp: string | null;
}

export interface DriveGuardHealth {
  status: string;
  model_loaded: boolean;
  camera_available: boolean;
  uptime: number | null;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getStatus(): Promise<DriveGuardStatus> {
  return fetchJson<DriveGuardStatus>('/api/status');
}

export async function getHealth(): Promise<DriveGuardHealth> {
  return fetchJson<DriveGuardHealth>('/api/health');
}

export async function startMonitoring(): Promise<{ message: string }> {
  return fetchJson<{ message: string }>('/api/start', { method: 'POST' });
}

export async function stopMonitoring(): Promise<{ message: string }> {
  return fetchJson<{ message: string }>('/api/stop', { method: 'POST' });
}
