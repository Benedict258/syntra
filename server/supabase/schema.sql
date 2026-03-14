-- Enable required extensions
create extension if not exists "pgcrypto";

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id),
  product_name text not null,
  description text,
  document_content jsonb,
  product_type text,
  category text,
  signals jsonb,
  target_budget numeric,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Creatives
create table if not exists public.creatives (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  title text,
  variant text,
  content jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Artifacts
create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  artifact_type text,
  content jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Branding documents
create table if not exists public.branding (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  palette jsonb,
  messaging jsonb,
  assets jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved items
create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  tab_name text,
  subtab_name text,
  title text,
  content_type text,
  content_text text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Reports
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  title text,
  body jsonb,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Run jobs (background prompts)
create table if not exists public.run_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  job_key text,
  payload jsonb,
  status text default 'queued',
  result jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Checklist tasks
create table if not exists public.checklist_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  title text,
  description text,
  is_complete boolean default false,
  due_date date,
  assignee text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Agile tasks
create table if not exists public.agile_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  title text,
  status text default 'backlog',
  points integer,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- BMC documents
create table if not exists public.bmc_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  canvas jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Navigation analytics
create table if not exists public.navigation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  path text not null,
  referrer text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Helper updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger projects_set_updated
before update on public.projects
for each row execute procedure public.set_updated_at();

create or replace trigger creatives_set_updated
before update on public.creatives
for each row execute procedure public.set_updated_at();

create or replace trigger artifacts_set_updated
before update on public.artifacts
for each row execute procedure public.set_updated_at();

create or replace trigger branding_set_updated
before update on public.branding
for each row execute procedure public.set_updated_at();

create or replace trigger reports_set_updated
before update on public.reports
for each row execute procedure public.set_updated_at();

create or replace trigger run_jobs_set_updated
before update on public.run_jobs
for each row execute procedure public.set_updated_at();

create or replace trigger checklist_tasks_set_updated
before update on public.checklist_tasks
for each row execute procedure public.set_updated_at();

create or replace trigger agile_tasks_set_updated
before update on public.agile_tasks
for each row execute procedure public.set_updated_at();

create or replace trigger bmc_documents_set_updated
before update on public.bmc_documents
for each row execute procedure public.set_updated_at();

-- Enable RLS
alter table public.projects enable row level security;
alter table public.creatives enable row level security;
alter table public.artifacts enable row level security;
alter table public.branding enable row level security;
alter table public.saved_items enable row level security;
alter table public.reports enable row level security;
alter table public.run_jobs enable row level security;
alter table public.checklist_tasks enable row level security;
alter table public.agile_tasks enable row level security;
alter table public.bmc_documents enable row level security;
alter table public.navigation_events enable row level security;

-- Simple policies (service role bypasses automatically, auth.uid() can read/write own data)
create policy if not exists "project_owner_select" on public.projects
  for select using ( owner_id = auth.uid() );
create policy if not exists "project_owner_modify" on public.projects
  for all using ( owner_id = auth.uid() );

create policy if not exists "project_join_select" on public.creatives
  for select using ( auth.uid() = owner_id )
  with check ( true );

-- Generic policy template for child tables referencing project_id
create or replace function public.project_owner(project uuid)
returns boolean as $$
declare
  owner uuid;
begin
  select owner_id into owner from public.projects where id = project;
  return owner = auth.uid();
end;
$$ language plpgsql security definer;

create policy if not exists "creatives_access" on public.creatives
  for all using ( public.project_owner(project_id) );
create policy if not exists "artifacts_access" on public.artifacts
  for all using ( public.project_owner(project_id) );
create policy if not exists "branding_access" on public.branding
  for all using ( public.project_owner(project_id) );
create policy if not exists "saved_items_access" on public.saved_items
  for all using ( public.project_owner(project_id) );
create policy if not exists "reports_access" on public.reports
  for all using ( public.project_owner(project_id) );
create policy if not exists "run_jobs_access" on public.run_jobs
  for all using ( public.project_owner(project_id) );
create policy if not exists "checklist_tasks_access" on public.checklist_tasks
  for all using ( public.project_owner(project_id) );
create policy if not exists "agile_tasks_access" on public.agile_tasks
  for all using ( public.project_owner(project_id) );
create policy if not exists "bmc_access" on public.bmc_documents
  for all using ( public.project_owner(project_id) );

-- Navigation events accessible by owner only
create policy if not exists "navigation_owner_access" on public.navigation_events
  for select using ( user_id = auth.uid() );
create policy if not exists "navigation_owner_insert" on public.navigation_events
  for insert with check ( user_id = auth.uid() );
