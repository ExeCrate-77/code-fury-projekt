"use client"

import { useMemo, useState } from "react"
import { BarChart3, Bot, Code2, Globe, MessageSquare, PenLine, Search, Sparkles, Terminal, Eye, Wrench } from "lucide-react"
import { useCatalog } from "@/lib/use-catalog"
import type { Agent, Model, Skill, Tool } from "@/lib/types"
import { api } from "@/lib/api"

const USE_CASES = [
  ["chatbot", "Chatbot / Assistant", MessageSquare], ["coding", "Code Generation", Code2],
  ["writing", "Content Writing", PenLine], ["analysis", "Data Analysis", BarChart3],
  ["agents_tools", "Agents / Tool Use", Wrench], ["vision", "Vision / Image", Eye], ["research", "Research", Search],
] as const
const TOOL_ICONS: Record<string, typeof Globe> = { web_search: Globe, code_execution: Terminal }

function score(model: Model, useCase: string, budget: string) {
  const providerBoost = useCase === "coding" && model.provider === "openai" ? 18 : useCase === "research" && model.provider === "gemini" ? 18 : 8
  const budgetBoost = budget === "high" && model.provider === "anthropic" ? 8 : budget === "low" && model.provider === "ollama" ? 8 : 0
  return Math.min(99, 62 + providerBoost + budgetBoost)
}

function Toggle({ active, label, icon: Icon, onClick }: { active: boolean; label: string; icon: typeof Globe; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex items-center gap-2 border px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/60 text-muted-foreground hover:border-primary hover:text-foreground"}`}><Icon size={14} />{label}</button>
}

export function AgentRecommender({ token }: { token: string | null }) {
  const { models, skills, tools, agents, loading, error } = useCatalog(token)
  const [useCase, setUseCase] = useState("coding")
  const [budget, setBudget] = useState("medium")
  const [selectedTools, setSelectedTools] = useState<string[]>(["code_execution"])
  const [brief, setBrief] = useState("")
  const [remote, setRemote] = useState<{ model?: Model; skill?: Skill; tools?: Tool[]; agent?: Agent; summary?: string; reasons?: string[] } | null>(null)
  const [busy, setBusy] = useState(false)
  const recommendation = useMemo(() => {
    const model = [...models].sort((a, b) => score(b, useCase, budget) - score(a, useCase, budget))[0]
    const skill = skills[0]
    return { model, skill, fit: model ? score(model, useCase, budget) : 0 }
  }, [models, skills, useCase, budget])
  const alternatives = useMemo(() => agents.filter((a) => a.is_published).slice(0, 4), [agents])
  async function recommend() {
    if (!token || !brief.trim() || busy) return
    setBusy(true)
    try { const result = await api<{ data: typeof remote }>(token, "/recommend", { method: "POST", body: JSON.stringify({ brief }) }); setRemote(result.data) } finally { setBusy(false) }
  }

  if (loading) return <div className="glass p-10 text-center text-xs uppercase tracking-[.25em] text-muted-foreground">Loading recommendation engine...</div>
  if (error) return <div className="border border-destructive p-4 text-xs uppercase tracking-widest text-destructive">{error}</div>

  return <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
    <div className="space-y-4">
      <section className="glass p-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-primary">Describe your agent</p><textarea value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="I need an agent that researches competitors, cites sources, and turns findings into a weekly report..." className="min-h-28 w-full resize-y border border-border bg-background/70 p-3 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-primary" /><button onClick={recommend} disabled={busy || !brief.trim()} className="mt-3 w-full bg-primary px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary-foreground disabled:opacity-40">{busy ? "Gemini is composing..." : "Recommend with Gemini"}</button></section>
      <section className="glass p-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">What should your agent do?</p><div className="grid grid-cols-2 gap-2">{USE_CASES.map(([id, label, Icon]) => <Toggle key={id} active={useCase === id} label={label} icon={Icon} onClick={() => setUseCase(id)} />)}</div></section>
      <section className="glass p-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Budget</p><div className="grid grid-cols-3 gap-2">{["low", "medium", "high"].map((item) => <button key={item} onClick={() => setBudget(item)} className={`border px-2 py-2 text-[10px] font-bold uppercase tracking-widest ${budget === item ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}>{item}</button>)}</div></section>
      <section className="glass p-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Tools needed</p><div className="grid gap-2">{tools.map((tool) => { const Icon = TOOL_ICONS[tool.tool_type] || Wrench; return <Toggle key={tool.id} active={selectedTools.includes(tool.id)} label={tool.name} icon={Icon} onClick={() => setSelectedTools((current) => current.includes(tool.id) ? current.filter((id) => id !== tool.id) : [...current, tool.id])} /> })}</div></section>
    </div>
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-primary"><Sparkles size={14} /> Agent intelligence / live catalog</div>
      <section className="border-2 border-primary bg-card p-5"><div className="mb-4 flex items-start justify-between gap-4"><div><div className="mb-2 inline-flex items-center gap-1 bg-primary px-2 py-1 text-[9px] font-bold uppercase text-primary-foreground"><Bot size={11} /> {remote ? "Gemini composition" : "Local preview"}</div><h2 className="text-2xl font-black uppercase tracking-tight">{remote?.skill?.name || recommendation.skill?.name || "Create a skill first"}</h2><p className="mt-1 text-xs text-muted-foreground">on {remote?.model?.name || recommendation.model?.name || "No model available"} · {remote?.model?.provider || recommendation.model?.provider || "—"}</p></div><div className="text-right"><div className="font-mono text-3xl font-bold text-primary">{recommendation.fit}%</div><div className="text-[9px] uppercase tracking-widest text-muted-foreground">match</div></div></div><div className="grid gap-3 md:grid-cols-3"><div className="border border-border bg-background p-3"><p className="text-[9px] font-bold uppercase tracking-widest text-primary">Model</p><p className="mt-2 text-sm font-bold">{remote?.model?.name || recommendation.model?.name || "—"}</p><p className="mt-1 text-xs text-muted-foreground">{remote?.model?.provider || recommendation.model?.provider || "Add a model"}</p></div><div className="border border-border bg-background p-3"><p className="text-[9px] font-bold uppercase tracking-widest text-primary">Skill</p><p className="mt-2 text-sm font-bold">{remote?.skill?.name || recommendation.skill?.name || "—"}</p><p className="mt-1 text-xs text-muted-foreground">{remote?.summary || `Persona matched to ${useCase}`}</p></div><div className="border border-border bg-background p-3"><p className="text-[9px] font-bold uppercase tracking-widest text-primary">Tools</p><p className="mt-2 text-sm font-bold">{remote?.tools?.map((tool) => tool.name).join(", ") || `${selectedTools.length} selected`}</p><p className="mt-1 text-xs text-muted-foreground">{remote?.agent ? `Best published agent: ${remote.agent.name}` : "Ready for composition"}</p></div></div>{remote?.reasons && <ul className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">{remote.reasons.map((reason) => <li key={reason}>→ {reason}</li>)}</ul>}</section>
      <section><h3 className="mb-3 text-sm font-black uppercase tracking-tight">Published alternatives</h3><div className="grid gap-2">{alternatives.map((agent: Agent) => <div key={agent.id} className="glass flex items-center justify-between gap-3 p-3"><div><p className="text-sm font-bold uppercase">{agent.name}</p><p className="text-[10px] text-muted-foreground">{agent.model?.name || "Model pending"} · {agent.skill?.name || "Skill pending"}</p></div><span className="font-mono text-[10px] text-primary">{Number(agent.price_per_call) ? `$${agent.price_per_call}/call` : "Free"}</span></div>)}</div></section>
    </div>
  </div>
}
