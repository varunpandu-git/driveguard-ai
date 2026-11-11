-- DriveGuard AI: lock down roles and designate the single owner admin.
-- Run this migration in Supabase SQL Editor before enabling the new login flow.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz,
  ADD COLUMN IF NOT EXISTS email text;

CREATE OR REPLACE FUNCTION public.is_driveguard_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'varunpandu166@gmail.com';
$$;

-- Create a profile automatically at signup. The role is decided server-side,
-- never by a value submitted from the browser.
CREATE OR REPLACE FUNCTION public.handle_new_driveguard_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email, role)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', ''),
    coalesce(NEW.raw_user_meta_data ->> 'phone', ''),
    lower(coalesce(NEW.email, '')),
    CASE WHEN lower(coalesce(NEW.email, '')) = 'varunpandu166@gmail.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    role = CASE WHEN lower(coalesce(NEW.email, '')) = 'varunpandu166@gmail.com' THEN 'admin' ELSE 'user' END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_driveguard ON auth.users;
CREATE TRIGGER on_auth_user_created_driveguard
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_driveguard_user();

-- Backfill profiles for existing auth users and promote only the configured email.
INSERT INTO public.profiles (id, full_name, phone, email, role)
SELECT
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  coalesce(u.raw_user_meta_data ->> 'phone', ''),
  lower(coalesce(u.email, '')),
  CASE WHEN lower(coalesce(u.email, '')) = 'varunpandu166@gmail.com' THEN 'admin' ELSE 'user' END
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = CASE WHEN lower(coalesce((SELECT email FROM auth.users WHERE id = EXCLUDED.id), '')) = 'varunpandu166@gmail.com' THEN 'admin' ELSE 'user' END;

-- Profiles: users can see/edit their own row; only the owner admin can list all.
DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "delete_own_profile" ON public.profiles;
CREATE POLICY "profiles_read_self_or_admin" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id OR public.is_driveguard_admin());
CREATE POLICY "profiles_update_self_or_admin" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id OR public.is_driveguard_admin())
WITH CHECK (
  public.is_driveguard_admin()
  OR (auth.uid() = id AND role = 'user')
);

-- Contact messages are visible only to the configured admin.
DROP POLICY IF EXISTS "auth_select_contact" ON public.contact_messages;
DROP POLICY IF EXISTS "auth_update_contact" ON public.contact_messages;
DROP POLICY IF EXISTS "auth_delete_contact" ON public.contact_messages;
CREATE POLICY "admin_read_contact" ON public.contact_messages
FOR SELECT TO authenticated USING (public.is_driveguard_admin());
CREATE POLICY "admin_update_contact" ON public.contact_messages
FOR UPDATE TO authenticated USING (public.is_driveguard_admin())
WITH CHECK (public.is_driveguard_admin());
CREATE POLICY "admin_delete_contact" ON public.contact_messages
FOR DELETE TO authenticated USING (public.is_driveguard_admin());

-- Team content changes are also admin-only.
DROP POLICY IF EXISTS "insert_team_members" ON public.team_members;
DROP POLICY IF EXISTS "update_team_members" ON public.team_members;
DROP POLICY IF EXISTS "delete_team_members" ON public.team_members;
CREATE POLICY "admin_insert_team_members" ON public.team_members
FOR INSERT TO authenticated WITH CHECK (public.is_driveguard_admin());
CREATE POLICY "admin_update_team_members" ON public.team_members
FOR UPDATE TO authenticated USING (public.is_driveguard_admin())
WITH CHECK (public.is_driveguard_admin());
CREATE POLICY "admin_delete_team_members" ON public.team_members
FOR DELETE TO authenticated USING (public.is_driveguard_admin());
