import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { messages, selectedModel } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Route logic based on selected provider/model
    if (selectedModel.startsWith('gemini')) {
      const response = await ai.models.generateContent({
        model: selectedModel, // e.g., 'gemini-2.5-flash'
        contents: lastUserMessage,
      });

      return NextResponse.json({
        role: 'assistant',
        content: response.text,
        modelUsed: selectedModel,
      });
    }

    // Fallback/Mock handlers for Claude and ChatGPT until live keys are attached
    return NextResponse.json({
      role: 'assistant',
      content: `[Response from ${selectedModel}]: ${lastUserMessage}`,
      modelUsed: selectedModel,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}