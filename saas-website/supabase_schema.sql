-- Supabase Database Schema for TapOpen Forms

-- 1. Create a public profiles table linked to Supabase Auth users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

-- Set up RLS Policies for profiles
create policy "Users can view their own profile." on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Trigger function to automatically create a profile record when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run handle_new_user() on auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create a table for storing secure timed forms (updated with title field and uniqueness constraint)
create table if not exists public.forms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  google_form_link text not null,
  duration_seconds integer not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_google_form unique (user_id, google_form_link)
);

-- Enable RLS on forms
alter table public.forms enable row level security;

-- Set up RLS Policies for forms
create policy "Users can insert their own forms." on public.forms
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own forms." on public.forms
  for select using (auth.uid() = user_id);

create policy "Users can update their own forms." on public.forms
  for update using (auth.uid() = user_id);

create policy "Users can delete their own forms." on public.forms
  for delete using (auth.uid() = user_id);

-- 4. Enable public read access to forms (so students can fetch form details by UUID)
-- WARNING: This policy allows ANY user to read ALL forms. This is necessary for the
-- ExamPage (/take/:formId) where unauthenticated students need to fetch form settings.
-- Because RLS policies are OR'd, this overrides the "Users can view their own forms" policy.
-- The Dashboard query MUST explicitly filter by user_id to prevent data leakage.
create policy "Allow public read access to forms by ID" on public.forms
  for select using (true);
