import { NextRequest, NextResponse } from 'next/server';
import { runStackAgent } from '@/lib/gemini-stack-engine';
import { INITIAL_STACKS } from '@/lib/stacks-store';
import { AgentStack } from '@/lib/stack-types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Lookup stack config (from built-in or stored config)
    const stack = INITIAL_STACKS.find(s => s.id === id || s.slug === id);
    const stackConfig = stack?.config || {
      model: 'gemini-2.0-flash',
      temperature: 0.3,
      maxTokens: 1200,
      topP: 0.9,
      systemPrompt: 'You are an autonomous AI Agent Stack on StackForge AI.',
      selectedSkillIds: [],
      enabledTools: ['calculator', 'code_interpreter', 'web_search']
    };

    const price = stack?.pricePerCall || 0.002;
    const result = await runStackAgent(stackConfig, prompt, price);

    return NextResponse.json({
      success: true,
      stackId: id,
      stackName: stack?.name || id,
      prompt,
      response: result.text,
      telemetry: {
        latencyMs: result.latencyMs,
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        totalTokens: result.totalTokens,
        costDeductedUsd: result.costDeducted,
        toolsCalled: result.toolsCalled.map(t => ({
          tool: t.toolName,
          executionTimeMs: t.executionTimeMs
        }))
      },
      modelUsed: result.modelUsed,
      source: result.source,
      authenticated: apiKey ? 'authenticated_api_key' : 'sandbox_guest_mode',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('API v1 stack run error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Stack API error' },
      { status: 500 }
    );
  }
}
