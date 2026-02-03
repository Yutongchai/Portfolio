-- Create bookings table and RLS policies
create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  slot_id text not null,
  customer_name text not null,
  company text,
  appointment_time text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.bookings enable row level security;

-- Allow public read
create policy "Public read bookings" on public.bookings
  for select using (true);

-- Allow public insert
create policy "Public insert bookings" on public.bookings
  for insert with check (true);
