-- ============================================================
-- Margin App - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  relist_checks INTEGER NOT NULL DEFAULT 3,
  total_relist_checks_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('clothing', 'shoes')),
  item_name TEXT,
  detected_brand TEXT,
  detected_model TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  result_json JSONB,
  recommended_relist_price NUMERIC,
  quick_sale_price NUMERIC,
  max_profit_price NUMERIC,
  best_platform TEXT,
  confidence TEXT CHECK (confidence IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  package_type TEXT NOT NULL,
  relist_checks_added INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile only
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: no direct updates from frontend (use service role only)
CREATE POLICY "profiles_no_update" ON profiles
  FOR UPDATE USING (false);

-- Scans: users can read their own scans
CREATE POLICY "scans_select_own" ON scans
  FOR SELECT USING (auth.uid() = user_id);

-- Payments: users can read their own payments
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- Auto-create profile on new user signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, relist_checks, total_relist_checks_used)
  VALUES (
    NEW.id,
    NEW.email,
    3,
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ============================================================
-- Updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- Stored procedures for credit management (service role only)
-- ============================================================

-- Deduct 1 relist check (returns true if successful)
CREATE OR REPLACE FUNCTION deduct_relist_check(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_checks INTEGER;
BEGIN
  SELECT relist_checks INTO v_checks
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_checks IS NULL OR v_checks < 1 THEN
    RETURN FALSE;
  END IF;

  UPDATE profiles
  SET
    relist_checks = relist_checks - 1,
    total_relist_checks_used = total_relist_checks_used + 1,
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$;

-- Refund 1 relist check (used when analysis fails)
CREATE OR REPLACE FUNCTION refund_relist_check(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    relist_checks = relist_checks + 1,
    total_relist_checks_used = GREATEST(0, total_relist_checks_used - 1),
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;

-- Add relist checks after payment (idempotent via stripe_session_id)
CREATE OR REPLACE FUNCTION add_relist_checks(p_user_id UUID, p_amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    relist_checks = relist_checks + p_amount,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON payments(stripe_session_id);
