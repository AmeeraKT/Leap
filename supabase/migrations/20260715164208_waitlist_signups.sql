-- Waitlist signups (public submissions via Edge Function only; no anon/authenticated writes)
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  year text not null,
  degree text not null,
  majors text[] not null,
  university text,
  online_presence text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  constraint waitlist_signups_name_len check (char_length(name) between 2 and 100),
  constraint waitlist_signups_email_len check (char_length(email) between 3 and 254),
  constraint waitlist_signups_university_len check (university is null or char_length(university) <= 120),
  constraint waitlist_signups_majors_count check (
    cardinality(majors) >= 1 and cardinality(majors) <= 2
  ),
  constraint waitlist_signups_year_check check (
    year in ('First', 'Second', 'Third', 'Fourth', 'Fifth or above')
  ),
  constraint waitlist_signups_degree_check check (
    degree in ('Bachelor', 'Master', 'PhD')
  ),
  constraint waitlist_signups_majors_check check (
    majors <@ array[
      'Agriculture / Animal Sciences',
      'Architecture / Design / Urban Planning',
      'Arts / Humanities / Social Sciences',
      'Business / Economics',
      'Computer Science / IT',
      'Education',
      'Engineering',
      'Environment',
      'Health / Psychology / Medicine',
      'Law',
      'Science / Mathematics'
    ]::text[]
  ),
  constraint waitlist_signups_online_presence_check check (
    online_presence is null
    or online_presence in (
      'I post regularly',
      'I''ve posted a few times',
      'I have profiles but never post',
      'I don''t have profiles'
    )
  )
);

create unique index if not exists waitlist_signups_email_unique
  on public.waitlist_signups (lower(email));

-- Rate limit buckets keyed by hashed client IP (Edge Function only)
create table if not exists public.waitlist_rate_limits (
  ip_hash text primary key,
  window_start timestamptz not null,
  request_count integer not null default 0,
  constraint waitlist_rate_limits_count_nonneg check (request_count >= 0)
);

alter table public.waitlist_signups enable row level security;
alter table public.waitlist_rate_limits enable row level security;

-- No policies for anon/authenticated: inserts happen only via service_role in the Edge Function.
revoke all on table public.waitlist_signups from anon, authenticated;
revoke all on table public.waitlist_rate_limits from anon, authenticated;

grant select, insert, update, delete on table public.waitlist_signups to service_role;
grant select, insert, update, delete on table public.waitlist_rate_limits to service_role;
