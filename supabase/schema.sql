-- ===================================================================
-- StackForge AI: Supabase Database Schema & RLS Policies
-- ===================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'creator' check (role in ('creator', 'consumer', 'admin')),
  credits_balance numeric default 50.00, -- simulated starting credits for consumers ($50)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SKILLS (Reusable prompt templates & domain personas)
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  category text not null default 'General',
  prompt_template text not null,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TOOLS (Available tool integrations)
create table if not exists public.tools (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  display_name text not null,
  description text not null,
  type text not null check (type in ('calculator', 'code_interpreter', 'web_search', 'custom_webhook')),
  parameters_schema jsonb not null default '{}'::jsonb,
  is_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. STACKS (Assembled Agent Stacks)
create table if not exists public.stacks (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  category text not null default 'Development',
  config_json jsonb not null default '{
    "model": "gemini-2.0-flash",
    "temperature": 0.7,
    "max_tokens": 1000,
    "system_prompt": "",
    "selected_skills": [],
    "enabled_tools": ["calculator"]
  }'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  price_per_call numeric not null default 0.002, -- $ per API call
  monthly_price numeric default 0.00, -- $ for subscription
  calls_count integer default 0,
  success_rate numeric default 99.8,
  avg_latency_ms integer default 145,
  rating numeric default 4.9,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. API KEYS (Issued to consumers or creators for stack execution)
create table if not exists public.api_keys (
  id uuid primary key default uuid_generate_v4(),
  stack_id uuid references public.stacks(id) on delete cascade,
  consumer_id uuid references public.profiles(id) on delete cascade,
  key_label text not null default 'Production Key',
  key_prefix text not null, -- e.g. "sf_live_..."
  key_hash text not null, -- SHA-256 hash of secret key
  rate_limit_per_minute integer default 1200,
  status text not null default 'active' check (status in ('active', 'revoked')),
  last_used_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. USAGE LOGS (Telemetry, token consumption & metering)
create table if not exists public.usage_logs (
  id uuid primary key default uuid_generate_v4(),
  stack_id uuid references public.stacks(id) on delete cascade,
  api_key_id uuid references public.api_keys(id) on delete set null,
  consumer_id uuid references public.profiles(id) on delete set null,
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  total_tokens integer default 0,
  latency_ms integer default 0,
  cost_deducted numeric default 0.002,
  status text default 'success' check (status in ('success', 'error', 'rate_limited')),
  tools_called text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

alter table public.profiles enable row level security;
alter table public.stacks enable row level security;
alter table public.skills enable row level security;
alter table public.tools enable row level security;
alter table public.api_keys enable row level security;
alter table public.usage_logs enable row level security;

-- Profiles: Anyone can view basic creator info, users can edit their own profile
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Stacks: Published stacks are viewable by everyone; creators can CRUD their own
create policy "Published stacks are viewable by everyone" on public.stacks
  for select using (status = 'published' or auth.uid() = owner_id);

create policy "Creators can insert own stacks" on public.stacks
  for insert with check (auth.uid() = owner_id or auth.uid() is null);

create policy "Creators can update own stacks" on public.stacks
  for update using (auth.uid() = owner_id);

create policy "Creators can delete own stacks" on public.stacks
  for delete using (auth.uid() = owner_id);

-- Skills & Tools: Public read
create policy "Skills are viewable by everyone" on public.skills
  for select using (is_public = true or auth.uid() = owner_id);

create policy "Tools are viewable by everyone" on public.tools
  for select using (true);

-- API Keys: Users see keys they own or for stacks they created
create policy "Users can view own api keys" on public.api_keys
  for select using (auth.uid() = consumer_id);

create policy "Users can create api keys" on public.api_keys
  for insert with check (auth.uid() = consumer_id or auth.uid() is null);

-- Usage Logs: Viewable by stack owner or consumer
create policy "Users can view relevant usage logs" on public.usage_logs
  for select using (auth.uid() = consumer_id);

-- ===================================================================
-- SEED DATA: Pre-populate Core Tools and Starter Skills
-- ===================================================================

insert into public.tools (name, display_name, description, type, parameters_schema)
values
  (
    'calculator',
    'Mathematical Expression Engine',
    'Evaluates complex mathematical, statistical, and financial calculations with high precision.',
    'calculator',
    '{"type": "object", "properties": {"expression": {"type": "string", "description": "The math expression to evaluate, e.g. (1450 * 0.18) + (3200 / 4)"}}, "required": ["expression"]}'::jsonb
  ),
  (
    'code_interpreter',
    'Sandboxed Code Sandbox',
    'Executes JavaScript/Python algorithmic scripts safely in an isolated VM environment with execution timeouts.',
    'code_interpreter',
    '{"type": "object", "properties": {"language": {"type": "string", "enum": ["javascript", "python"]}, "code": {"type": "string", "description": "The self-contained code snippet to execute"}}, "required": ["code"]}'::jsonb
  ),
  (
    'web_search',
    'Real-time Web Grounding',
    'Searches live web indexes and scrapes key citations and factual sources for up-to-date queries.',
    'web_search',
    '{"type": "object", "properties": {"query": {"type": "string", "description": "Target search query"}}, "required": ["query"]}'::jsonb
  ),
  (
    'custom_webhook',
    'External REST Webhook Tool',
    'Dispatches secure HTTP requests to external third-party endpoints or microservices.',
    'custom_webhook',
    '{"type": "object", "properties": {"url": {"type": "string"}, "method": {"type": "string", "enum": ["GET", "POST"]}, "payload": {"type": "object"}}, "required": ["url"]}'::jsonb
  )
on conflict (name) do nothing;

insert into public.skills (name, slug, description, category, prompt_template, is_public)
values
  (
    'Senior Code Architect & Security Auditor',
    'code-architect',
    'Analyzes AST flows, enforces secure coding standards (OWASP), and produces production-ready refactors.',
    'Development',
    'You are a Principal Software Architect and Security Auditor. When evaluating code or software designs, identify edge-case vulnerabilities, race conditions, and time-complexity bottlenecks. Provide robust, clean TypeScript/Python solutions with complete test considerations.',
    true
  ),
  (
    'Quantitative Financial Strategist',
    'quant-finance',
    'Analyzes balance sheets, calculates DCF models, and evaluates alpha signals with strict numeric rigor.',
    'Finance',
    'You are an elite Wall Street Quantitative Strategist. Always provide mathematically grounded reasoning, calculate margins and risks using the calculator tool, and provide concise risk-reward matrices.',
    true
  ),
  (
    'Clinical Research Scribe & Synthesizer',
    'clinical-research',
    'Synthesizes biomedical literature, patient symptom timelines, and pharmacological interactions.',
    'Healthcare',
    'You are a biomedical research specialist. Provide structured differential analysis, cite clinical protocols, and format outputs with standard medical terminology (ICD-10/SNOMED). Always include clinical safety disclaimers.',
    true
  ),
  (
    'Data Science & SQL Pipeline Engineer',
    'data-engineer',
    'Optimizes high-throughput SQL queries, builds ETL pipelines, and computes statistical aggregates.',
    'Data',
    'You are a Staff Data Engineer. Generate performant ANSI SQL, Pandas transformation scripts, and schema normalization designs. Test data transforms using the code interpreter.',
    true
  )
on conflict (slug) do nothing;
