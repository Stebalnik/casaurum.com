create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text,
  last_name text,
  email text,
  phone text,
  whatsapp text,
  preferred_language text,
  country text,
  state text,
  province text,
  city text,
  zip_code text,
  source_lead_id uuid references public.leads(id) on delete set null,
  payload jsonb not null default '{}'::jsonb
);

create unique index if not exists contacts_email_unique_idx
on public.contacts (lower(email))
where email is not null and email <> '';

create unique index if not exists contacts_phone_unique_idx
on public.contacts (phone)
where phone is not null and phone <> '';

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  title text,
  vertical text,
  service text,
  project_type text,
  budget text,
  timeline text,
  country text,
  state text,
  city text,
  neighborhood text,
  status text not null default 'contact_needed',
  priority text not null default 'normal',
  source_url text,
  next_follow_up_at timestamptz,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists deals_status_idx on public.deals (status);
create index if not exists deals_next_follow_up_idx on public.deals (next_follow_up_at);
create index if not exists deals_lead_id_idx on public.deals (lead_id);
create index if not exists deals_contact_id_idx on public.deals (contact_id);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  contact_id uuid references public.contacts(id) on delete set null,
  deal_id uuid references public.deals(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  type text not null,
  status text not null default 'open',
  due_at timestamptz,
  completed_at timestamptz,
  notes text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists activities_status_due_idx on public.activities (status, due_at);
create index if not exists activities_deal_id_idx on public.activities (deal_id);

create table if not exists public.lead_notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete set null,
  telegram_chat_id text,
  telegram_message_id text,
  sent_at timestamptz,
  acknowledged_at timestamptz,
  last_reminded_at timestamptz,
  reminder_count integer not null default 0,
  status text not null default 'sent',
  payload jsonb not null default '{}'::jsonb
);

create unique index if not exists lead_notifications_lead_id_unique_idx
on public.lead_notifications (lead_id);

alter table public.contacts enable row level security;
alter table public.deals enable row level security;
alter table public.activities enable row level security;
alter table public.lead_notifications enable row level security;

drop policy if exists "No public contact access" on public.contacts;
create policy "No public contact access" on public.contacts for all using (false) with check (false);

drop policy if exists "No public deal access" on public.deals;
create policy "No public deal access" on public.deals for all using (false) with check (false);

drop policy if exists "No public activity access" on public.activities;
create policy "No public activity access" on public.activities for all using (false) with check (false);

drop policy if exists "No public notification access" on public.lead_notifications;
create policy "No public notification access" on public.lead_notifications for all using (false) with check (false);

-- Bot writes with SUPABASE_SERVICE_ROLE_KEY from a trusted server only.
