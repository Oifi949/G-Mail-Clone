-- Create a `profiles` table to store display usernames for auth users.
-- Run this in the Supabase SQL editor or via psql connected to your Supabase DB.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text,
  created_at timestamptz default now()
);

-- Optional: allow authenticated users to select/insert/update their own profile
-- Adjust policies as needed in the Supabase dashboard.
