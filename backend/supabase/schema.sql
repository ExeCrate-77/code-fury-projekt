-- Agent Marketplace Platform — Supabase schema
-- Run this in the Supabase SQL editor.

-- Users mirror auth.users
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  provider text not null, -- openai | anthropic | gemini | ollama | custom
  model_name text,
  base_url text,
  api_key text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  system_prompt text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  tool_type text not null, -- code_execution | web_scraping | web_search | custom
  schema_config jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  description text,
  model_id uuid not null references public.models (id),
  skill_id uuid not null references public.skills (id),
  is_published boolean not null default false,
  price_per_call numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_tools (
  agent_id uuid not null references public.agents (id) on delete cascade,
  tool_id uuid not null references public.tools (id) on delete cascade,
  primary key (agent_id, tool_id)
);

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  label text not null default 'default',
  key_hash text not null unique,
  key_prefix text,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents (id) on delete set null,
  api_key_id uuid references public.api_keys (id) on delete set null,
  caller_id uuid references public.users (id) on delete set null,
  status text not null default 'success',
  latency_ms integer,
  amount numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Sync users from auth.users on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that signed up before the trigger existed
insert into public.users (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- Indexes
create index if not exists idx_agents_creator on public.agents (creator_id);
create index if not exists idx_usage_logs_agent on public.usage_logs (agent_id, created_at);
create index if not exists idx_usage_logs_key on public.usage_logs (api_key_id);
create index if not exists idx_api_keys_hash on public.api_keys (key_hash);

alter table public.usage_logs add column if not exists amount numeric not null default 0;

-- Row Level Security
-- The Express backend uses the admin (secret-key) client for cross-user reads
-- and enforces ownership in code; these policies protect direct client access.
alter table public.users enable row level security;
alter table public.models enable row level security;
alter table public.skills enable row level security;
alter table public.tools enable row level security;
alter table public.agents enable row level security;
alter table public.agent_tools enable row level security;
alter table public.api_keys enable row level security;
alter table public.usage_logs enable row level security;

create policy "read own profile" on public.users
  for select using (auth.uid() = id);

create policy "read public or own models" on public.models
  for select using (is_public or creator_id = auth.uid());
create policy "manage own models" on public.models
  for all using (creator_id = auth.uid()) with check (creator_id = auth.uid());

create policy "read public or own skills" on public.skills
  for select using (is_public or creator_id = auth.uid());
create policy "manage own skills" on public.skills
  for all using (creator_id = auth.uid()) with check (creator_id = auth.uid());

create policy "read public or own tools" on public.tools
  for select using (is_public or creator_id = auth.uid());
create policy "manage own tools" on public.tools
  for all using (creator_id = auth.uid()) with check (creator_id = auth.uid());

create policy "read published or own agents" on public.agents
  for select using (is_published or creator_id = auth.uid());
create policy "manage own agents" on public.agents
  for all using (creator_id = auth.uid()) with check (creator_id = auth.uid());

create policy "read agent_tools for visible agents" on public.agent_tools
  for select using (true);
create policy "manage own agent_tools" on public.agent_tools
  for all using (
    exists (select 1 from public.agents a where a.id = agent_id and a.creator_id = auth.uid())
  );

create policy "manage own api keys" on public.api_keys
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "read own usage" on public.usage_logs
  for select using (caller_id = auth.uid());
