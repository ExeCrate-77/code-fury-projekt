import { NextRequest, NextResponse } from 'next/server';
import { runStackAgent } from '@/lib/gemini-stack-engine';
import { StackConfig } from '@/lib/stack-types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { config, prompt, pricePerCall = 0.002 } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt string is required' }, { status: 400 });
    }

    if (!config || !config.model || !Array.isArray(config.enabledTools)) {
      return NextResponse.json({ error: 'Valid StackConfig object is required' }, { status: 400 });
    }

    const result = await runStackAgent(config as StackConfig, prompt, pricePerCall);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Sandbox run error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal sandbox execution error' },
      { status: 500 }
    );
  }
}
