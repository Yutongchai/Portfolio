-- Add unique constraint to prevent double-booking of the same slot
ALTER TABLE IF EXISTS bookings
  ADD CONSTRAINT unique_slot_per_slot_id UNIQUE (slot_id);

-- Optionally: if you prefer to create a unique index instead
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_bookings_slot_id ON bookings(slot_id);
