import { NextRequest, NextResponse } from 'next/server';
import { runAgentOrchestration } from '@/lib/agentforge-langchain-engine';
import { BUILTIN_AGENTS, BUILTIN_MODELS, BUILTIN_SKILLS, BUILTIN_TOOLS } from '@/lib/agentforge-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const authHeader = req.headers.get('authorization') || '';
    const apiKey = authHeader.replace(/^Bearer\s+/i, '').trim();

    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request: "prompt" string field is required in JSON payload' },
        { status: 400 }
      );
    }

    // Lookup Agent, Model, Skill, and Tools
    const agent = BUILTIN_AGENTS.find(a => a.id === agentId || a.slug === agentId) || BUILTIN_AGENTS[0];
    const model = BUILTIN_MODELS.find(m => m.id === agent.model_id) || BUILTIN_MODELS[0];
    const skill = BUILTIN_SKILLS.find(s => s.id === agent.skill_id) || BUILTIN_SKILLS[0];
    const tools = BUILTIN_TOOLS.filter(t => agent.tool_ids.includes(t.id) || agent.tool_ids.includes(t.name));

    const result = await runAgentOrchestration(agent, model, skill, tools, prompt);

    return NextResponse.json({
      success: true,
      agent_id: agent.id,
      agent_name: agent.name,
      prompt,
      response: result.text,
      telemetry: {
        latency_ms: result.latency_ms,
        prompt_tokens: result.prompt_tokens,
        completion_tokens: result.completion_tokens,
        tokens_used: result.tokens_used,
        cost_usd: result.cost,
        tools_called: result.tools_called.map(t => ({
          tool_name: t.tool_name,
          latency_ms: t.latency_ms
        }))
      },
      model_used: result.model_used,
      source: result.source,
      authenticated: apiKey ? 'authenticated_api_key' : 'sandbox_guest_mode',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('AgentForge API v1 agent run error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Agent execution error' },
      { status: 500 }
    );
  }
}
