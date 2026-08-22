import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { prompt, modelTarget = 'gemini-2.5-flash' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model: modelTarget,
      contents: prompt,
    });
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      output: response.text,
      latencyMs,
      modelUsed: modelTarget,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}