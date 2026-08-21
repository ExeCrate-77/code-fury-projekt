"use client"

import { use, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { api, API_URL } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { AuthGate } from "@/components/auth-gate"
import { Badge, PageHeader } from "@/components/field"
import { ApiKeysPanel } from "@/components/api-keys"
import type { Agent } from "@/lib/types"

export default function PublishPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div>
      <PageHeader title="Publish" sub="Monetization studio" />
      <AuthGate>
        <PublishStudio id={id} />
      </AuthGate>
    </div>
  )
}

function PublishStudio({ id }: { id: string }) {
  const { token } = useAuth()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [price, setPrice] = useState("0")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    try {
      const json = await api<{ data: Agent }>(token, `/agents/${id}`)
      setAgent(json.data)
      setPrice(String(json.data.price_per_call))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agent")
    }
  }, [token, id])

  useEffect(() => {
    load()
  }, [load])

  async function setPublished(publish: boolean) {
    if (!token || busy) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await api(
        token,
        `/agents/${id}/${publish ? "publish" : "unpublish"}`,
        {
          method: "POST",
          body: JSON.stringify({ price_per_call: Number(price) || 0 }),
        }
      )
      setNotice(publish ? "Agent is live and billable." : "Agent unpublished.")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    } finally {
      setBusy(false)
    }
  }

  const endpoint = `${API_URL}/agents/${id}/execute`
  const curl = `curl -X POST ${endpoint} \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Hello agent"}'`

  if (error && !agent) {
    return (
      <div className="border-2 border-destructive p-6 text-xs uppercase tracking-widest text-destructive">
        {error} —{" "}
        <Link href="/dashboard" className="underline underline-offset-4">
          back to dashboard
        </Link>
      </div>
    )
  }

  if (!agent) {
    return (
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Loading agent...
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-sans text-2xl font-black uppercase tracking-tighter md:text-4xl">
          {agent.name}
        </h2>
        <Badge variant={agent.is_published ? "accent" : "outline"}>
          {agent.is_published ? "Published" : "Draft"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pricing + publish */}
        <div className="flex flex-col gap-4 border-2 border-foreground bg-card p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em]">
            Monetization
          </h3>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Price per API call (USD)
            </label>
            <input
              type="number"
              min="0"
              step="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-primary"
            />
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              0 = free. Metered via Stripe on every successful call.
            </p>
          </div>
          {notice && (
            <p className="border border-primary p-2 text-xs uppercase tracking-widest text-primary">
              {notice}
            </p>
          )}
          {error && agent && (
            <p className="border border-destructive p-2 text-xs uppercase tracking-widest text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {agent.is_published ? (
              <button
                onClick={() => setPublished(false)}
                disabled={busy}
                className="border-2 border-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background disabled:opacity-40"
              >
                {busy ? "..." : "Unpublish"}
              </button>
            ) : (
              <button
                onClick={() => setPublished(true)}
                disabled={busy}
                className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-80 disabled:opacity-40"
              >
                {busy ? "..." : "Publish →"}
              </button>
            )}
          </div>
        </div>

        {/* Config summary */}
        <div className="flex flex-col gap-4 border-2 border-foreground bg-card p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em]">
            Configuration
          </h3>
          <dl className="flex flex-col divide-y divide-border border border-border text-xs">
            <div className="flex justify-between gap-4 px-3 py-2">
              <dt className="uppercase tracking-widest text-muted-foreground">Model</dt>
              <dd className="text-right font-bold uppercase">{agent.model?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 px-3 py-2">
              <dt className="uppercase tracking-widest text-muted-foreground">Skill</dt>
              <dd className="text-right font-bold uppercase">{agent.skill?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 px-3 py-2">
              <dt className="uppercase tracking-widest text-muted-foreground">Tools</dt>
              <dd className="text-right font-bold uppercase">
                {(agent.tools || []).length > 0
                  ? (agent.tools || []).map((t) => t.name).join(", ")
                  : "None"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* API endpoint */}
      <div className="border-2 border-foreground">
        <div className="flex items-center justify-between border-b-2 border-foreground bg-secondary px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
            Public endpoint
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(curl)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
            className="border border-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            {copied ? "Copied" : "Copy curl"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-primary">
          {curl}
        </pre>
      </div>

      <ApiKeysPanel token={token} />
    </div>
  )
}
