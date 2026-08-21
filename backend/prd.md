# Agent Marketplace Platform

**PRODUCT REQUIREMENTS DOCUMENT**

*Build, Compose, and Monetize AI Agents*


|             |                                                                         |
| ----------- | ----------------------------------------------------------------------- |
| **Version** | 0.1 (Draft)                                                             |
| **Date**    | August 21, 2026                                                         |
| **Owners**  | Nishant, Harshith, Rahul (Lead)                                         |
| **Status**  | Draft — for team review                                                 |
| **Stack**   | Next.js, Node.js, Supabase (Postgres), LangChain/LangGraph, E2B, Stripe |


## 1. Overview

### 1.1 Problem Statement

Builders who want to ship an AI agent today have to stitch together a model provider, a system prompt, a set of tools, an execution runtime, a sandbox for code execution, and a billing layer — all before they can share or sell what they built. There is no single place to compose these pieces, test them, and expose them as a monetized API in minutes.

### 1.2 Product Vision

A marketplace and builder platform where users assemble AI Agents from three reusable building blocks — a Model, a Skill (system prompt), and one or more Tools — test them live in a ChatGPT-style homepage, and publish them as metered API endpoints that other developers or end users can call and pay for.

### 1.3 Goals

- Let any user compose a working AI agent in under 5 minutes without writing code.
- Provide a live, dynamic chat homepage where model/skill/tools can be swapped mid-session.
- Give creators a one-click path from 'working agent' to 'published, billable API'.
- Run every agent's execution — including code execution — in an isolated, secure sandbox (E2B).
- Support a public marketplace for discovering and reusing Models, Skills, Tools, and Agents.

### 1.4 Non-Goals (v1)

- Fine-tuning or hosting custom model weights.
- Multi-agent orchestration / agent-to-agent handoff (future roadmap).
- Team/workspace collaboration and role-based permissions (future roadmap).

## 2. Target Users &amp; Use Cases


| **User Type**         | **Need**                                              | **Key Flow**                                   |
| --------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Builder / Creator     | Compose an agent from existing pieces and monetize it | Agent Studio → Publish → Dashboard             |
| Prompt Engineer       | Publish reusable system prompts as 'Skills'           | /skills → Add Custom Skill                     |
| Tool Developer        | Expose an API/scraper/sandbox as a pluggable Tool     | /tools → Add Custom Tool (OpenAPI/JSON Schema) |
| API Consumer / Buyer  | Call a published agent from their own app             | Marketplace → Get API Key → POST /execute      |
| Hackathon Demo Viewer | Try an agent instantly without setup                  | Homepage chat → swap model/skill/tools live    |


## 3. Core Building Blocks

The platform is built around four composable entities that combine to form an Agent:


| **Entity**     | **Description**                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Model          | A built-in provider (OpenAI, Anthropic, Ollama) or a Custom Endpoint (OpenAI-compatible BASE_URL + API key).                                 |
| Skill (Prompt) | A system prompt, persona instruction set, or multi-shot execution guideline.                                                                 |
| Tool (Plugin)  | An external capability the agent can call — e.g. Firecrawl web scraper, E2B code execution sandbox, Tavily search, or a custom OpenAPI tool. |
| Agent          | The orchestrator object binding exactly 1 Model + 1 Skill + N Tools into a runnable, publishable unit.                                       |


## 4. Functional Requirements

### 4.1 Dynamic Persona Homepage (Chat-First UX)

The homepage is a live chat interface, similar to ChatGPT/Gemini, with a configuration bar above the chat stream that lets a user change the active Model, Skill, and Tools in real time. Every message sent carries the current persona configuration to the backend.

- Top config bar: Model selector, Skill selector, multi-select Tool toggles.
- Chat stream shows inline tool-execution status (e.g. 'Executing Python in E2B…', 'Scraping URL…').
- 'Publish as API' button opens a modal to name the persona, set price per call, and generate an endpoint.
- Collapsible sidebar: past chat sessions + quick-load preset personas from the marketplace.

### 4.2 Marketplace &amp; Catalog Pages


| **Route**            | **Purpose &amp; Key Features**                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| /                    | Marketplace Hub — catalog of published Agents, Skills, Models, Tools; filter/search; 'Try Agent' quick playground. |
| /skills              | Browse existing prompt templates or add a Custom Skill (system prompt builder).                                    |
| /models              | Browse supported LLMs or add a Custom Model (name, base URL, API key header).                                      |
| /tools               | Browse available tools (scraper, code exec) or add a Custom Tool (OpenAPI / JSON Schema definition).               |
| /agents/builder      | Agent Studio — selector UI to bind 1 Skill + 1 Model + multiple Tools, with an interactive test canvas.            |
| /agents/[id]/publish | Monetization Studio — set price per API call (or free), generate API keys, view usage analytics, publish.          |
| /dashboard           | Creator Portal — revenue, published agents, usage graphs, API key management.                                      |
| /settings            | Authentication, profile info, API key configuration.                                                               |


### 4.3 Agent Execution &amp; API Gateway

- Public endpoint: POST /api/v1/agents/:id/execute, authenticated by API key.
- Gateway resolves the agent's Model + Skill + Tools config from the database, builds the LangChain/LangGraph agent on the fly, and returns the final response.
- Every call is metered and logged for usage-based billing (Stripe).

### 4.4 Sandboxed Tool Execution (E2B)

Any tool requiring code execution runs inside an E2B micro-VM rather than on the main server, so untrusted or generated code never touches shared infrastructure.

- Short-lived mode: a fresh sandbox is spun up per code-execution call and killed after returning output — used for one-off tool calls from the chat/execute endpoints.
- Persistent mode: for a published agent, the full LangChain agent (prompt, model, tools) is packaged into an E2B custom template and run as a standalone Express micro-server inside the sandbox, exposed on port 8000 via an HTTPS URL. The main backend proxies /chat calls to this URL, so each agent effectively gets its own isolated, long-running API process.
- Sandbox lifetime is capped (e.g. 24h) and re-spun on demand; the main server keeps an agentId → sandboxUrl registry.

### 4.5 Monetization

- Creators set price per API call (or mark an agent free) at publish time.
- Stripe metered billing tracks usage per API key and per agent.
- Dashboard surfaces revenue, call volume, and per-agent usage trends to creators.

## 5. System Architecture

### 5.1 High-Level Flow

Frontend (Next.js) → API Gateway (Node.js/Next.js route handlers) → Supabase (config + auth + billing state) → LangChain/LangGraph execution → E2B sandbox for code tools → response streamed back to the caller, with usage recorded for metered billing.

### 5.2 Request Lifecycle: POST /api/v1/agents/:id/execute

- 1. Request arrives with an API key.
- 2. Gateway verifies the key and looks up the Agent, its Model, Skill, and bound Tools from Supabase.
- 3. Backend dynamically builds a LangChain/LangGraph React agent: system prompt = Skill, chat model = Model config, tools = bound Tools array.
- 4. If a code-execution tool is bound, an E2B sandbox is created (or an existing persistent sandbox for that agent is reused) to run the code in isolation.
- 5. Agent loop executes and returns the final answer as JSON; usage is recorded against the caller's API key for metered billing.

### 5.3 Tech Stack


| **Layer**              | **Technology**                                                      |
| ---------------------- | ------------------------------------------------------------------- |
| Frontend               | Next.js (App Router), Vercel AI SDK (useChat) for streaming chat    |
| Backend / API          | Node.js, Next.js route handlers / Express                           |
| Database               | Supabase (PostgreSQL)                                               |
| Agent Orchestration    | LangChain + LangGraph (createReactAgent)                            |
| Code Execution Sandbox | E2B (short-lived tool calls and persistent per-agent micro-servers) |
| Billing                | Stripe (metered usage billing)                                      |
| Hosting                | Frontend on Vercel; backend on Railway or Render                    |


## 6. Data Model

Core Supabase/Postgres tables:


| **Table**   | **Key Fields**                                                                             |
| ----------- | ------------------------------------------------------------------------------------------ |
| users       | id (PK), email, created_at                                                                 |
| models      | id (PK), creator_id (FK), name, provider, base_url, api_key                                |
| skills      | id (PK), creator_id (FK), name, system_prompt                                              |
| tools       | id (PK), creator_id (FK), name, tool_type, schema_config                                   |
| agents      | id (PK), creator_id (FK), name, skill_id (FK), model_id (FK), is_published, price_per_call |
| agent_tools | agent_id (FK), tool_id (FK) — join table for N tools per agent                             |
| api_keys    | id (PK), user_id (FK), key_hash                                                            |


Relationships: an Agent references exactly one Model and one Skill, and joins to many Tools via agent_tools. Every Model, Skill, Tool, and Agent is owned by a creator_id, enabling both private use and public marketplace listing.

## 7. Team &amp; Ownership

### 7.1 Nishant — Agent Builder &amp; Config Pipeline

- Build the /agents/builder UI: selectors for 1 Skill, 1 Model, multi-select for Tools.
- Build the API to persist the bundled config into agents and agent_tools.
- Pass the consolidated configuration object to the Node.js LangChain engine.
- Co-own the homepage Config Bar and wiring model/skill/tools state into useChat.

### 7.2 Harshith — Skill &amp; Prompt Management

- Build the /skills UI and API: form for title and system_prompt.
- Attach creator_id to every created Skill and persist to the skills table.
- Seed the marketplace with pre-made template prompts.
- Co-own the homepage Config Bar and wiring model/skill/tools state into useChat.

### 7.3 Rahul — Lead, Backend &amp; Integration

- Build the core Node.js runtime: LangChain/LangGraph agent construction + E2B sandbox integration (both short-lived and persistent modes).
- Build the API gateway: POST /api/v1/agents/:id/execute, API key verification, Stripe metered billing.
- Own the hosting pipeline: Next.js frontend on Vercel, Supabase DB, Node.js backend on Railway/Render.

## 8. Success Metrics (Hackathon / v1)

- Time from landing on homepage to first successful agent response &lt; 60 seconds.
- End-to-end demo: compose an agent with a code-execution tool, publish it, and call it externally via the public API.
- At least one Skill, one custom Tool, and one Agent published to the marketplace by each team member.
- E2B sandbox correctly isolates and returns output for a code-execution tool call with no leakage between runs.

## 9. Risks &amp; Open Questions


| **Risk / Question**                              | **Notes**                                                                                     |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| E2B persistent sandbox costs &amp; idle timeouts | 24h keep-alive per published agent may be expensive at scale; needs a sleep/resume strategy.  |
| Custom Model / Tool trust boundary               | User-supplied base_url and API keys need secret handling and abuse protection.                |
| Render/Railway cold starts                       | Backend keep-alive pinging needed to avoid latency spikes on first call.                      |
| Metered billing accuracy                         | Usage recording must be idempotent and reconciled against Stripe to avoid billing drift.      |
| Marketplace content moderation                   | Public Skills/Tools/Agents need basic review before listing to avoid unsafe prompts or tools. |




 this is the poject outline , i wanna build the backend now in express, build all the api routes mentioned properly in the backend and use the

  supabase skill to include supabse in our project, btw the creditionals are already put in a dontenv file so dont worry about it , u dont need to run it or

  anything just completely build it 