"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { AuthGate } from "@/components/auth-gate"
import { ChatStream } from "@/components/chat"
import { FieldLabel, PageHeader, Select } from "@/components/field"
import type { Agent, Model, Skill, Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function BuilderPage() {
  return (
    <div>
      <PageHeader
        title="Agent Studio"
        sub="1 Model + 1 Skill + N Tools = Agent"
      />
      <AuthGate>
        <Builder />
      </AuthGate>
    </div>
  )
}

function Builder() {
  const { token } = useAuth()
  const router = useRouter()

  const [models, setModels] = useState<Model[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [modelId, setModelId] = useState("")
  const [skillId, setSkillId] = useState("")
  const [toolIds, setToolIds] = useState<string[]>([])
  const [price, setPrice] = useState("0")

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    Promise.all([
      api<{ data: Model[] }>(token, "/models"),
      api<{ data: Skill[] }>(token, "/skills"),
      api<{ data: Tool[] }>(token, "/tools"),
    ])
      .then(([m, s, t]) => {
        setModels(m.data)
        setSkills(s.data)
        setTools(t.data)
        if (m.data[0]) setModelId(m.data[0].id)
        if (s.data[0]) setSkillId(s.data[0].id)
      })
      .catch((err) =>
        setLoadError(
          err instanceof Error
            ? err.message
            : "Backend unreachable — is the API running on port 4000?"
        )
      )
  }, [token])

  const toggleTool = (id: string) =>
    setToolIds((ids) =>
      ids.includes(id) ? ids.filter((t) => t !== id) : [...ids, id]
    )

  async function saveAgent() {
    if (!token || busy) return
    if (!name.trim() || !modelId || !skillId) {
      setError("Name, model and skill are required.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      const json = await api<{ data: Agent }>(token, "/agents", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          model_id: modelId,
          skill_id: skillId,
          tool_ids: toolIds,
          price_per_call: Number(price) || 0,
        }),
      })
      router.push(`/agents/${json.data.id}/publish`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save agent")
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {loadError && (
        <div className="border-2 border-destructive p-4 text-xs uppercase tracking-widest text-destructive">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Config */}
        <div className="flex flex-col gap-4 border-2 border-foreground bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em]">
            Composition
          </h2>
          <div>
            <FieldLabel>Agent name</FieldLabel>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="RESEARCH COPILOT"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm uppercase outline-none placeholder:text-muted-foreground focus-visible:border-primary"
            />
          </div>
          <div>
            <FieldLabel>Description (optional)</FieldLabel>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Searches the web and summarizes findings"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary"
            />
          </div>
          <div>
            <FieldLabel>Model — pick exactly one</FieldLabel>
            <Select value={modelId} onChange={(e) => setModelId(e.target.value)}>
              <option value="" disabled>
                Select model
              </option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.provider}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Skill — pick exactly one</FieldLabel>
            <Select value={skillId} onChange={(e) => setSkillId(e.target.value)}>
              <option value="" disabled>
                Select skill
              </option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Tools — pick any ({toolIds.length} selected)</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {tools.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  // no tools available
                </span>
              )}
              {tools.map((t) => {
                const active = toolIds.includes(t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTool(t.id)}
                    className={cn(
                      "border px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    )}
                  >
                    {t.name}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <FieldLabel>Price per call (USD, 0 = free)</FieldLabel>
            <input
              type="number"
              min="0"
              step="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-primary"
            />
          </div>
          {error && (
            <p className="border border-destructive p-2 text-xs uppercase tracking-widest text-destructive">
              {error}
            </p>
          )}
          <button
            onClick={saveAgent}
            disabled={busy}
            className="mt-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-80 disabled:opacity-40"
          >
            {busy ? "Saving..." : "Save agent → publish"}
          </button>
        </div>

        {/* Test canvas */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em]">
            Test canvas
          </h2>
          <ChatStream
            token={token}
            modelId={modelId}
            skillId={skillId}
            toolIds={toolIds}
          />
        </div>
      </div>
    </div>
  )
}
