import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  driver_name: string;
  route: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number;
  safety_score: number;
  alerts_count: number;
  status: 'safe' | 'warning' | 'danger';
  created_at: string;
};

export type DistractionEvent = {
  id: string;
  trip_id: string;
  type: string;
  severity: 'safe' | 'warning' | 'danger';
  confidence: number;
  detected_at: string;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  handled: boolean;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  linkedin_url: string;
  github_url: string;
  email: string;
  display_order: number;
  created_at: string;
};
