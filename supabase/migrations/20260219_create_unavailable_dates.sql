-- Migration: create unavailable_dates table for blocking booking dates
CREATE TABLE IF NOT EXISTS public.unavailable_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  reason text,
  is_recurring boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookup by date
CREATE INDEX IF NOT EXISTS idx_unavailable_dates_date ON public.unavailable_dates(date);

-- Grant schema/table access to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.unavailable_dates TO anon;

-- Enable Row Level Security
ALTER TABLE public.unavailable_dates ENABLE ROW LEVEL SECURITY;

-- Policy: anon users can SELECT active rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'public_can_view_unavailable_dates'
      AND polrelid = 'public.unavailable_dates'::regclass
  ) THEN
    EXECUTE $policy$
      CREATE POLICY public_can_view_unavailable_dates
        ON public.unavailable_dates
        FOR SELECT
        TO anon
        USING (is_active = true);
    $policy$;
  END IF;
END $$;

-- Policy: authenticated users can INSERT/UPDATE/DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'authenticated_manage_unavailable_dates'
      AND polrelid = 'public.unavailable_dates'::regclass
  ) THEN
    EXECUTE $policy$
      CREATE POLICY authenticated_manage_unavailable_dates
        ON public.unavailable_dates
        FOR ALL
        TO authenticated
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');
    $policy$;
  END IF;
END $$;
