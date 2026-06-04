create table if not exists public.leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new',

  lead_type text,
  form_type text,
  source_url text,
  language text,

  vertical text,
  service text,
  intent text,
  object_type text,
  material text,

  country text,
  state text,
  province text,
  metro text,
  city text,
  neighborhood text,
  zip_code text,

  first_name text,
  last_name text,
  email text,
  phone text,
  whatsapp text,
  preferred_language text,

  budget text,
  timeline text,
  project_type text,
  service_needed text,
  project_address text,
  rooms text,
  square_footage text,
  measurement_type text,
  preferred_date_time timestamptz,
  message text,

  uploaded_files jsonb not null default '[]'::jsonb,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  user_agent text,
  ip text,

  page_id text,
  canonical_url text,
  indexing_status text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_lead_type_idx on public.leads (lead_type);
create index if not exists leads_location_idx on public.leads (country, state, city);
create index if not exists leads_vertical_idx on public.leads (vertical);

alter table public.leads enable row level security;

drop policy if exists "No public lead reads" on public.leads;
create policy "No public lead reads"
on public.leads
for select
using (false);

drop policy if exists "No public lead writes" on public.leads;
create policy "No public lead writes"
on public.leads
for insert
with check (false);

-- The website writes with SUPABASE_SERVICE_ROLE_KEY from the server only.
-- Telegram bot options:
-- 1. Poll rows where status = 'new', send notification, then update status = 'notified'.
-- 2. Use Supabase Realtime on public.leads inserts from a trusted backend/bot environment.
