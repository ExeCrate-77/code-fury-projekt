"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { useCatalog } from "@/lib/use-catalog"
import { AuthGate } from "@/components/auth-gate"
import { ChatStream } from "@/components/chat"
import { PersonaBar } from "@/components/persona-bar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Agent } from "@/lib/types"

export default function HomePage() {
  return (
    <AuthGate>
      <Suspense fallback={null}>
        <ChatHome />
      </Suspense>
    </AuthGate>
  )
}

function ChatHome() {
  const { token } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tryAgentId = searchParams.get("agent")
  const { models, skills, tools, agents, loading, error } = useCatalog(token)

  const [modelId, setModelId] = useState("")
  const [skillId, setSkillId] = useState("")
  const [toolIds, setToolIds] = useState<string[]>([])

  const [publishOpen, setPublishOpen] = useState(false)
  const [agentName, setAgentName] = useState("")
  const [agentPrice, setAgentPrice] = useState("0")
  const [publishBusy, setPublishBusy] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)

  useEffect(() => {
    if (!modelId && models.length > 0) setModelId(models[0].id)
  }, [models, modelId])

  useEffect(() => {
    if (!skillId && skills.length > 0) setSkillId(skills[0].id)
  }, [skills, skillId])

  useEffect(() => {
    if (!tryAgentId || agents.length === 0) return
    const agent = agents.find((a) => a.id === tryAgentId)
    if (!agent) return
    setModelId(agent.model_id)
    setSkillId(agent.skill_id)
    setToolIds((agent.tools || []).map((t) => t.id))
    router.replace("/")
  }, [tryAgentId, agents, router])

  const toggleTool = (id: string) =>
    setToolIds((ids) =>
      ids.includes(id) ? ids.filter((t) => t !== id) : [...ids, id]
    )

  async function publishAsApi() {
    if (!token || publishBusy) return
    if (!agentName.trim() || !modelId || !skillId) {
      setPublishError("Name, model and skill are required.")
      return
    }
    setPublishBusy(true)
    setPublishError(null)
    try {
      const json = await api<{ data: Agent }>(token, "/agents", {
        method: "POST",
        body: JSON.stringify({
          name: agentName.trim(),
          model_id: modelId,
          skill_id: skillId,
          tool_ids: toolIds,
          price_per_call: Number(agentPrice) || 0,
        }),
      })
      setPublishOpen(false)
      router.push(`/agents/${json.data.id}/publish`)
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Failed to create")
    } finally {
      setPublishBusy(false)
    }
  }

  return (
    <div className="chat-backdrop flex min-h-0 flex-1 flex-col">
      {error && (
        <div className="mb-3 border-2 border-destructive p-3 text-xs uppercase tracking-widest text-destructive">
          {error}
        </div>
      )}

      <div className="mb-3">
        <PersonaBar
          models={models}
          skills={skills}
          tools={tools}
          modelId={modelId}
          skillId={skillId}
          toolIds={toolIds}
          onModel={setModelId}
          onSkill={setSkillId}
          onToggleTool={toggleTool}
          onPublish={() => setPublishOpen(true)}
        />
      </div>

      {loading && models.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="animate-pulse text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Loading personas...
          </p>
        </div>
      ) : (
        <ChatStream
          token={token}
          modelId={modelId}
          skillId={skillId}
          toolIds={toolIds}
        />
      )}

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish persona as API</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Agent name
              </span>
              <input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="MY AGENT"
                className="border border-border bg-transparent px-3 py-2 text-sm uppercase outline-none placeholder:text-muted-foreground focus-visible:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Price per call (USD, 0 = free)
              </span>
              <input
                type="number"
                min="0"
                step="0.001"
                value={agentPrice}
                onChange={(e) => setAgentPrice(e.target.value)}
                className="border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-primary"
              />
            </label>
            {publishError && (
              <p className="border border-destructive p-2 text-xs uppercase tracking-widest text-destructive">
                {publishError}
              </p>
            )}
            <button
              onClick={publishAsApi}
              disabled={publishBusy}
              className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-80 disabled:opacity-40"
            >
              {publishBusy ? "Creating..." : "Create endpoint →"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
