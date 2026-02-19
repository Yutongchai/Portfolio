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

-- Policy: allow public select on active rows
-- (Adjust to your project's auth model if needed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'public_can_view_unavailable_dates'
  ) THEN
    EXECUTE $$
      CREATE POLICY public_can_view_unavailable_dates
        ON public.unavailable_dates
        FOR SELECT
        USING (is_active = true);
    $$;
  END IF;
END $$;

-- Policy: authenticated users can insert/update/delete (adjust to admin roles)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'authenticated_manage_unavailable_dates'
  ) THEN
    EXECUTE $$
      CREATE POLICY authenticated_manage_unavailable_dates
        ON public.unavailable_dates
        FOR ALL
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');
    $$;
  END IF;
END $$;
