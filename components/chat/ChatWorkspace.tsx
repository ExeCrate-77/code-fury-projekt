"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api"
import type { Model, Skill, Tool } from "@/lib/types"
import type { AIBlock } from "@/lib/ai-types"
import { useAuth } from "@/lib/use-auth"
import { AIMessage } from "@/components/ai/AIMessage"
import { AIOrb } from "@/components/ai/AIOrb"
import { ToolChip } from "@/components/ai/ToolChip"
import { ChatNavbar } from "./ChatNavbar"
import { ChatComposer } from "./ChatComposer"

type Turn = { id: string; role: "user" | "assistant"; content: string; blocks?: AIBlock[]; toolCalls?: { name: string; args?: unknown }[] }
const suggestions = ["Build a React website", "Analyze some data", "Compare AI models", "Debug my code"]

function responseBlocks(content: string): AIBlock[] {
  return [{ type: "text", content }]
}

export function ChatWorkspace() {
  const { token, user, loading: authLoading } = useAuth()
  const [models, setModels] = useState<Model[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [messages, setMessages] = useState<Turn[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const defaultSkill = useMemo(() => skills.find((skill) => /general|default|assistant|chat/i.test(skill.name)) || skills[0], [skills])

  useEffect(() => {
    if (!token) return
    Promise.all([api<{ data: Model[] }>(token, "/models"), api<{ data: Skill[] }>(token, "/skills"), api<{ data: Tool[] }>(token, "/tools")]).then(([modelResult, skillResult, toolResult]) => { setModels(modelResult.data); setSkills(skillResult.data); setTools(toolResult.data); setSelectedModel(modelResult.data[0]?.id || "") }).catch((reason: Error) => setError(reason.message))
  }, [token])

  const sendMessage = async () => {
    const message = input.trim()
    if (!message || loading || !selectedModel || !defaultSkill) return
    const userTurn: Turn = { id: crypto.randomUUID(), role: "user", content: message }
    setMessages((current) => [...current, userTurn]); setInput(""); setLoading(true); setError("")
    try {
      const history = messages.map(({ role, content }) => ({ role, content }))
      const result = await api<{ data: { response: string; tool_calls?: { name: string; args?: unknown }[] } }>(token, "/chat", { method: "POST", body: JSON.stringify({ message, history, model_id: selectedModel, skill_id: defaultSkill.id, tool_ids: selectedTools }) })
      const toolCalls = result.data.tool_calls || []
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: result.data.response, blocks: responseBlocks(result.data.response), toolCalls }])
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to reach the AI") } finally { setLoading(false) }
  }

  return <main className="flex h-screen flex-col overflow-hidden bg-[var(--ai-bg)] text-[var(--ai-text)]"><ChatNavbar models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} user={user ? { email: user.email } : null} /><div className="flex min-h-0 flex-1 flex-col"><div className="flex-1 overflow-y-auto"><div className="mx-auto flex min-h-full w-full max-w-[900px] flex-col justify-center px-4 py-12 sm:px-8">{messages.length === 0 ? <div className="flex flex-col items-center text-center"><AIOrb state={loading ? "thinking" : "idle"} /><h1 className="mt-5 text-2xl font-light tracking-tight sm:text-3xl">What can I help you build?</h1><p className="mt-3 max-w-md text-sm leading-6 text-[var(--ai-muted)]">Ask anything, generate code, analyze data, or explore an idea.</p><div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => { setInput(suggestion); window.setTimeout(() => document.querySelector<HTMLTextAreaElement>("textarea")?.focus(), 0) }} className="border border-[var(--ai-border)] px-3 py-3 text-left text-xs text-[var(--ai-muted)] transition-colors hover:border-[var(--ai-accent)]/60 hover:text-[var(--ai-text)]">{suggestion}<span className="float-right text-[var(--ai-accent)]">↗</span></button>)}</div>{!authLoading && !user && <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-[var(--ai-muted)]">Sign in from settings to connect your models</p>}</div> : <div className="space-y-10 py-8">{messages.map((message) => message.role === "user" ? <div className="ml-auto max-w-[78%] border border-[var(--ai-border)] bg-[var(--ai-panel)] px-4 py-3 text-sm leading-6" key={message.id}>{message.content}</div> : <div key={message.id}><AIMessage blocks={message.blocks || [{ type: "text", content: message.content }]} />{message.toolCalls && message.toolCalls.length > 0 && <div className="ml-10 mt-3 flex flex-wrap gap-2">{message.toolCalls.map((tool, index) => <ToolChip key={`${tool.name}-${index}`} name={tool.name} />)}</div>}</div>)}{loading && <AIMessage state="thinking" blocks={[{ type: "thinking", label: "Generating", status: "active" }]} />}</div>}</div></div>{error && <p className="mx-auto w-full max-w-[860px] px-6 pb-2 font-mono text-[10px] uppercase tracking-widest text-red-400">{error}</p>}<ChatComposer value={input} onChange={setInput} onSend={sendMessage} loading={loading} models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} tools={tools} selectedTools={selectedTools} onToolsChange={setSelectedTools} canSend={Boolean(token && selectedModel && defaultSkill && input.trim())} /></div></main>
}