/*
# Edge-AI Driver Distraction Detection — Core Database Schema

## Overview
Creates the full data model for the Edge-AI driver distraction detection platform.
This is a multi-user application with sign-in (Login/Register pages exist), so
tables are owner-scoped to authenticated users via `auth.uid()` with
`DEFAULT auth.uid()` on owner columns so client inserts that omit `user_id`
still satisfy RLS.

## New Tables
1. `profiles` — user profile data linked to Supabase auth, holds full name,
   phone, and role (user/admin). Each user owns exactly their own row.
2. `trips` — a driving session: route, start/end time, duration, safety score,
   alert count, and status (safe/warning/danger). Owned by the authenticated
   user who created it.
3. `distraction_events` — a single detected distraction (phone, drowsiness,
   yawning, etc.) with severity, confidence, and timestamp. Scoped through
   the parent trip's ownership.
4. `contact_messages` — submissions from the public Contact form. Writable by
   anon (visitors may not be signed in) and readable by authenticated users.
5. `team_members` — project team entries (guide, student, AI developer, UI
   designer). Public read, admin-managed via authenticated writes.

## Security (RLS)
- RLS enabled on every table.
- `profiles`, `trips`: owner-scoped CRUD (SELECT/INSERT/UPDATE/DELETE) for
  authenticated users, 4 policies each, `user_id DEFAULT auth.uid()`.
- `distraction_events`: 4 policies scoped through the parent trip's owner via
  an EXISTS subquery against `trips`.
- `contact_messages`: anon + authenticated INSERT (public contact form);
  authenticated SELECT/UPDATE/DELETE (admin moderation).
- `team_members`: anon + authenticated SELECT (public team page);
  authenticated INSERT/UPDATE/DELETE (admin management).

## Notes
- `profiles.id` is the primary key and references `auth.users(id)` so each
  user has one profile row.
- Indexes added on foreign keys and frequently-filtered columns.
- All policies use `auth.uid()` — never `current_user`.
- Owner columns default to `auth.uid()` so inserts omitting `user_id` succeed.
*/

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated USING (auth.uid() = id);

-- ============================================================
-- 2. trips
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_name text NOT NULL DEFAULT '',
  route text NOT NULL DEFAULT '',
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  duration_seconds integer DEFAULT 0,
  safety_score numeric(5,2) DEFAULT 0,
  alerts_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'safe',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_time ON trips(start_time DESC);

DROP POLICY IF EXISTS "select_own_trips" ON trips;
CREATE POLICY "select_own_trips"
ON trips FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_trips" ON trips;
CREATE POLICY "insert_own_trips"
ON trips FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_trips" ON trips;
CREATE POLICY "update_own_trips"
ON trips FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_trips" ON trips;
CREATE POLICY "delete_own_trips"
ON trips FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 3. distraction_events
-- ============================================================
CREATE TABLE IF NOT EXISTS distraction_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  type text NOT NULL,
  severity text NOT NULL DEFAULT 'warning',
  confidence numeric(5,2) DEFAULT 0,
  detected_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE distraction_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_events_trip_id ON distraction_events(trip_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON distraction_events(type);

DROP POLICY IF EXISTS "select_own_events" ON distraction_events;
CREATE POLICY "select_own_events"
ON distraction_events FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = distraction_events.trip_id AND trips.user_id = auth.uid())
);

DROP POLICY IF EXISTS "insert_own_events" ON distraction_events;
CREATE POLICY "insert_own_events"
ON distraction_events FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = distraction_events.trip_id AND trips.user_id = auth.uid())
);

DROP POLICY IF EXISTS "update_own_events" ON distraction_events;
CREATE POLICY "update_own_events"
ON distraction_events FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = distraction_events.trip_id AND trips.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = distraction_events.trip_id AND trips.user_id = auth.uid())
);

DROP POLICY IF EXISTS "delete_own_events" ON distraction_events;
CREATE POLICY "delete_own_events"
ON distraction_events FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = distraction_events.trip_id AND trips.user_id = auth.uid())
);

-- ============================================================
-- 4. contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at DESC);

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_messages;
CREATE POLICY "anon_insert_contact"
ON contact_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact" ON contact_messages;
CREATE POLICY "auth_select_contact"
ON contact_messages FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact" ON contact_messages;
CREATE POLICY "auth_update_contact"
ON contact_messages FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact" ON contact_messages;
CREATE POLICY "auth_delete_contact"
ON contact_messages FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- 5. team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  email text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_team_display_order ON team_members(display_order);

DROP POLICY IF EXISTS "read_team_members" ON team_members;
CREATE POLICY "read_team_members"
ON team_members FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_team_members" ON team_members;
CREATE POLICY "insert_team_members"
ON team_members FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_team_members" ON team_members;
CREATE POLICY "update_team_members"
ON team_members FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_team_members" ON team_members;
CREATE POLICY "delete_team_members"
ON team_members FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- updated_at trigger for profiles
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $body$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$body$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
