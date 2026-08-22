# StackForge AI — Autonomous Agent Stack Marketplace & Monetization Protocol

**Event / Hackathon Submission Documentation**  
**Team Name**: StackForge AI  
**Project Name**: StackForge AI  
**Repository**: GitHub Repository with regular commits & migrations  

---

## 1. Problem Statement (150–200 Words)

In the rapidly evolving AI ecosystem, developers and domain experts can engineer sophisticated prompt workflows, but converting an AI prompt into a reliable, tool-augmented, autonomous agent stack with production-grade execution and monetization remains complex. Creators struggle with:
1. **Tool Integration Friction**: Manually implementing sandboxed code runtimes, high-precision math evaluators, and web grounding requires heavy infrastructure.
2. **Lack of Transparent Benchmarks & Sandboxes**: Buyers cannot evaluate how an agent stack handles real edge cases or view live tool-execution telemetry before deploying.
3. **Monetization & Metering Overhead**: Building per-call API authentication, rate limiting, and credit metering requires custom billing systems that distract from model engineering.

**StackForge AI** solves this by providing a unified marketplace protocol where creators assemble customized AI agent stacks (combining prompt skill templates, model hyperparameters, and autonomous server-side tools), test them in an interactive multi-turn function-calling sandbox, and publish them as instant, monetizable REST API endpoints with automated key provisioning and sub-cent metered billing.

---

## 2. Technical Architecture & Stack

```mermaid
graph TD
    A[Creator / Consumer Client] -->|Next.js 16 App Router UI| B[StackForge UI / Frontend]
    B -->|Interactive Sandbox| C[/api/sandbox/run]
    B -->|Public REST Endpoint| D[/api/v1/stacks/:id/run]
    
    C --> E[Gemini Agent Execution Engine]
    D --> E
    
    E -->|Function Declarations & Prompts| F[Google Gemini 2.0 Flash / 1.5 Pro]
    F -->|Function Call Request| G[Server-Side Sandbox Executor]
    
    G -->|Math Expressions| H[Precision Calculator Engine]
    G -->|JS / Python Scripts| I[Sandboxed Node.js VM]
    G -->|Factual Queries| J[Real-time Web Grounding]
    G -->|Custom Webhooks| K[External Microservices]
    
    G -->|Tool Output Return| F
    F -->|Final Synthesis| E
    
    E -->|Usage Logs & Metering| L[(Supabase Postgres DB + RLS)]
    E -->|Deduct Credits & Return| A
```

### Core Technologies
- **Frontend Framework**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **AI Reasoning Engine**: Google Gemini API (`gemini-2.0-flash`, `gemini-1.5-pro`) with dynamic Multi-Turn Function Calling.
- **Backend & Tool Sandboxing**: Node.js `node:vm` isolated context (timeouts, zero filesystem/network leakage) + strict regex arithmetic parser.
- **Database, Auth & Metering**: Supabase Postgres with Row Level Security (RLS) policies, API key hashing, and credit balances.

---

## 3. Key Feature Walkthrough

### 1. Stack Builder (Creator Studio)
* **Skill Templates**: Library of pre-tuned prompt templates for Code Security, Quantitative Finance, Clinical Healthcare, Data Engineering, and Autonomous Research.
* **Model Configuration**: Configure temperature (0.0–1.0), max output tokens (100–4000), and top-p sampling.
* **Autonomous Tools**: 1-click toggle for `calculator`, `code_interpreter`, `web_search`, and `custom_webhook`.
* **JSONB Schema Preview**: Real-time Supabase config inspection.

### 2. Live Multi-Turn Sandbox
* **Real-Time Function Calling**: When Gemini identifies a tool requirement, the server executes the tool within an isolated Node VM or math engine and returns the output to Gemini in a continuous loop.
* **Tool Invocation Timeline**: Expandable accordion detailing every intermediate tool call, duration in milliseconds, raw inputs, and execution return values.
* **Telemetry**: Live calculation of latency (ms), token counts, and cost deduction.

### 3. Monetization & Public REST APIs
* **Instant Provisioning**: 1-click generation of production API keys (`sf_live_...`).
* **External Endpoint**: Call `/api/v1/stacks/{stack_id}/run` from any Python, cURL, or Node.js application.
* **Credit Metering**: Real-time balance deductions with simulated top-up capabilities.

---

## 4. Prompts & System Directives Used in Stacks

### 1. Code Security & AST Auditor
```
You are a Principal Software Security Architect.
- Audit all code snippets for reentrancy, injection vectors, memory exhaustion, and race conditions.
- Enforce strict typing, boundary validation, and defensive programming.
- Use the code interpreter tool when you need to verify AST syntax or execute algorithms.
```

### 2. Quantitative Financial Strategist
```
You are an elite Wall Street Quantitative Strategist.
- Always perform arithmetic and financial calculations using the calculator tool for 100% precision.
- Formulate quantitative alpha indicators and margin sensitivity matrices.
- Disclose underlying assumptions clearly.
```

### 3. Clinical Biomedical Scribe
```
You are a biomedical clinical assistant.
- Provide structured differential assessments categorized by probability.
- Cite relevant clinical guidelines and use standard medical nomenclature (ICD-10, SNOMED).
- Always include an explicit clinical safety disclaimer for physician review.
```

---

## 5. API Reference

### Execute Published Stack
**`POST /api/v1/stacks/:id/run`**

#### Headers:
```http
Authorization: Bearer sf_live_your_api_key
Content-Type: application/json
```

#### Request Body:
```json
{
  "prompt": "Audit this smart contract withdraw function and calculate slippage."
}
```

#### Response:
```json
{
  "success": true,
  "stackId": "apex-dev-security-sentinel",
  "prompt": "Audit this smart contract...",
  "response": "### 🛡️ Security Audit Findings...",
  "telemetry": {
    "latencyMs": 135,
    "promptTokens": 42,
    "completionTokens": 280,
    "totalTokens": 322,
    "costDeductedUsd": 0.002,
    "toolsCalled": [
      { "tool": "code_interpreter", "executionTimeMs": 12 },
      { "tool": "calculator", "executionTimeMs": 2 }
    ]
  },
  "modelUsed": "gemini-2.0-flash",
  "timestamp": "2026-08-21T18:55:00.000Z"
}
```

---

## 6. How to Run Locally & Deploy

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables (`.env.local`)**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build & Deploy to Vercel**:
   ```bash
   npm run build
   vercel
   ```
