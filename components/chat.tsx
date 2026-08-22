'use client';

import { useState } from 'react';
import { Sparkles, Send, Bot, User, Cpu } from 'lucide-react';
import { ModelCard } from './ModelCard';
import { api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  componentPayload?: any; // To attach interactive components in message stream
}

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Pick a model above and prompt me to generate UI components or execute agent tasks.',
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          selectedModel,
        }),
      });

      const data = await res.json();

      // Check if user requested a component (e.g., "show model card")
      let payload = null;
      if (input.toLowerCase().includes('card') || input.toLowerCase().includes('component')) {
        payload = {
          title: 'CodeRefine Pro',
          description: 'Optimized Next.js/SQL execution agent.',
          tag: 'Development',
          price: 'Free',
        };
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.error,
        componentPayload: payload,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#09090b] text-white">
      {/* Header & Model Selector */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <h1 className="text-lg font-bold tracking-tight">AI Multi-Model Playground</h1>
        </div>

        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-zinc-400" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-indigo-500"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gpt-4o">ChatGPT (GPT-4o)</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          </select>
        </div>
      </header>

      {/* Chat Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                msg.role === 'user'
                  ? 'border-indigo-500/30 bg-indigo-500/20 text-indigo-300'
                  : 'border-white/10 bg-zinc-900 text-zinc-300'
              }`}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className="space-y-3">
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'border border-white/10 bg-zinc-900/80 text-zinc-200'
                }`}
              >
                {msg.content}
              </div>

              {/* Render dynamic UI component inside chat message */}
              {msg.componentPayload && (
                <div className="w-80">
                  <ModelCard {...msg.componentPayload} />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-zinc-500 italic">Model is thinking...</div>}
      </div>

      {/* Chat Input Bar */}
      <div className="border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Message ${selectedModel}... (e.g. "Show me a model card")`}
            className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white transition-hover hover:bg-indigo-500"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ChatStreamProps {
  token: string | null;
  modelId: string;
  skillId: string;
  toolIds: string[];
}

export function ChatStream({ token, modelId, skillId, toolIds }: ChatStreamProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!token || !modelId || !skillId || !input.trim() || loading) return;
    const message = input.trim();
    setMessages((current) => [...current, { id: Date.now().toString(), role: 'user', content: message }]);
    setInput('');
    setLoading(true);
    try {
      const result = await api<{ data: { response: string } }>(token, '/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history: messages.map(({ role, content }) => ({ role, content })), model_id: modelId, skill_id: skillId, tool_ids: toolIds }),
      });
      setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: 'assistant', content: result.data.response }]);
    } catch (error) {
      setMessages((current) => [...current, { id: `${Date.now()}-error`, role: 'assistant', content: error instanceof Error ? error.message : 'Request failed' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border border-border p-3">
      <div className="min-h-48 space-y-3 overflow-y-auto text-sm">
        {messages.map((message) => <div key={message.id} className={message.role === 'user' ? 'text-right' : 'text-left'}>{message.content}</div>)}
        {loading && <div className="text-muted-foreground">Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') sendMessage(); }} placeholder="Test this agent..." className="min-w-0 flex-1 border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-primary" />
        <button onClick={sendMessage} disabled={loading} className="bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground disabled:opacity-40">Send</button>
      </div>
    </div>
  );
}