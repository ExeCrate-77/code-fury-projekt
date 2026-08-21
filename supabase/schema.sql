-- ===================================================================
-- AgentForge: Supabase Database Schema & RLS Policies
-- ===================================================================

create extension if not exists "uuid-ossp";

-- Enable pgvector if available for semantic search over skills/tools
create extension if not exists "vector";

-- 1. MODELS (LLM Providers & Configuration)
create table if not exists public.models (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  provider text not null check (provider in ('google_gemini', 'openai_compatible', 'anthropic', 'custom_endpoint')),
  endpoint_url text,
  api_key_encrypted text,
  params jsonb not null default '{
    "model_name": "gemini-2.5-flash",
    "temperature": 0.3,
    "max_output_tokens": 2048,
    "top_p": 0.95
  }'::jsonb,
  is_builtin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SKILLS (Versioned Prompt Templates & System Personas)
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  system_prompt text not null,
  input_schema jsonb default '{"type": "object", "properties": {"prompt": {"type": "string"}}}'::jsonb,
  version integer default 1,
  category text default 'General',
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TOOLS (LangChain Structured Tools & Sandboxes)
create type tool_type_enum as enum ('web_search', 'web_scrape', 'code_exec', 'http_call', 'custom');

create table if not exists public.tools (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text not null,
  input_schema jsonb not null default '{"type": "object", "properties": {}}'::jsonb,
  tool_type text not null default 'code_exec' check (tool_type in ('web_search', 'web_scrape', 'code_exec', 'http_call', 'custom')),
  webhook_url text,
  code_snippet text,
  is_builtin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. AGENTS (Assembled Agent Stacks: Model + Skill + 1..N Tools)
create table if not exists public.agents (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  skill_id uuid references public.skills(id) on delete set null,
  model_id uuid references public.models(id) on delete set null,
  tool_ids text[] default '{}',
  is_published boolean default false,
  api_key text,
  price_per_call numeric not null default 0.002,
  pricing_model text not null default 'per_call' check (pricing_model in ('per_call', 'subscription', 'free')),
  monthly_price numeric default 0.00,
  calls_count integer default 0,
  success_rate numeric default 99.8,
  avg_latency_ms integer default 140,
  rating numeric default 4.95,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. AGENT_RUNS (Powers history, real-time tool logs, analytics & metering)
create table if not exists public.agent_runs (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references public.agents(id) on delete cascade,
  caller_id uuid references auth.users(id) on delete set null,
  input jsonb not null,
  output jsonb not null,
  tools_called jsonb default '[]'::jsonb,
  tokens_used integer default 0,
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  latency_ms integer default 0,
  cost numeric default 0.002,
  status text default 'success' check (status in ('success', 'error', 'rate_limited')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. API_KEYS (Consumer access keys for published agents)
create table if not exists public.api_keys (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references public.agents(id) on delete cascade,
  owner_id uuid references auth.users(id) on delete cascade,
  key_label text not null,
  key_prefix text not null,
  key_hash text not null,
  rate_limit_per_min integer default 1200,
  status text default 'active' check (status in ('active', 'revoked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

alter table public.models enable row level security;
alter table public.skills enable row level security;
alter table public.tools enable row level security;
alter table public.agents enable row level security;
alter table public.agent_runs enable row level security;
alter table public.api_keys enable row level security;

-- Models: builtin are public; users view/edit their own custom models
create policy "Built-in and owned models are viewable" on public.models
  for select using (is_builtin = true or auth.uid() = owner_id);

create policy "Users can manage own models" on public.models
  for all using (auth.uid() = owner_id);

-- Skills: public skills viewable by all; owners edit their own
create policy "Public and owned skills are viewable" on public.skills
  for select using (is_public = true or auth.uid() = owner_id);

create policy "Users can manage own skills" on public.skills
  for all using (auth.uid() = owner_id);

-- Tools: builtin and owned tools viewable
create policy "Built-in and owned tools are viewable" on public.tools
  for select using (is_builtin = true or auth.uid() = owner_id);

create policy "Users can manage own tools" on public.tools
  for all using (auth.uid() = owner_id);

-- Agents: Published agents viewable by everyone; owners manage own
create policy "Published and owned agents are viewable" on public.agents
  for select using (is_published = true or auth.uid() = owner_id);

create policy "Owners can manage own agents" on public.agents
  for all using (auth.uid() = owner_id);

-- Agent Runs: Viewable by agent creator or caller
create policy "Users view relevant agent runs" on public.agent_runs
  for select using (
    auth.uid() = caller_id or 
    exists (select 1 from public.agents where id = agent_runs.agent_id and owner_id = auth.uid())
  );

-- ===================================================================
-- SEED DATA: Preloaded Models, Skills, Tools, and Agents
-- ===================================================================

insert into public.models (name, provider, params, is_builtin)
values
  ('Google Gemini 2.5 Flash', 'google_gemini', '{"model_name": "gemini-2.5-flash", "temperature": 0.2, "max_output_tokens": 2048, "top_p": 0.95}'::jsonb, true),
  ('Google Gemini 2.5 Pro', 'google_gemini', '{"model_name": "gemini-2.5-pro", "temperature": 0.3, "max_output_tokens": 4096, "top_p": 0.95}'::jsonb, true),
  ('OpenAI Compatible Gateway', 'openai_compatible', '{"model_name": "gpt-4o-mini", "temperature": 0.2, "max_output_tokens": 2048}'::jsonb, true)
on conflict do nothing;

insert into public.tools (name, description, tool_type, input_schema, is_builtin)
values
  (
    'code_exec',
    'Executes JavaScript/Python algorithms in an isolated sandbox with memory and timeout constraints.',
    'code_exec',
    '{"type": "object", "properties": {"code": {"type": "string", "description": "The executable code string"}}, "required": ["code"]}'::jsonb,
    true
  ),
  (
    'web_search',
    'Searches live web indexes and retrieves grounded citations and official documentation snippets.',
    'web_search',
    '{"type": "object", "properties": {"query": {"type": "string", "description": "Search query"}}, "required": ["query"]}'::jsonb,
    true
  ),
  (
    'web_scrape',
    'Fetches clean markdown content from public URLs with bot-filter mitigation.',
    'web_scrape',
    '{"type": "object", "properties": {"url": {"type": "string", "description": "Target webpage URL"}}, "required": ["url"]}'::jsonb,
    true
  ),
  (
    'http_call',
    'Performs authenticated outbound HTTP/REST webhooks with custom payloads.',
    'http_call',
    '{"type": "object", "properties": {"url": {"type": "string"}, "method": {"type": "string", "enum": ["GET", "POST"]}, "payload": {"type": "object"}}, "required": ["url"]}'::jsonb,
    true
  )
on conflict do nothing;
