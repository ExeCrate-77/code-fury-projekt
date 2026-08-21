"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { AuthGate } from "@/components/auth-gate"
import { Badge, FieldLabel, PageHeader, Select } from "@/components/field"
import type { Model } from "@/lib/types"

const PROVIDERS = ["openai", "anthropic", "ollama", "custom"]

export default function ModelsPage() {
  return (
    <div>
      <PageHeader title="Models" sub="LLM providers / custom endpoints" />
      <AuthGate>
        <ModelsContent />
      </AuthGate>
    </div>
  )
}

function ModelsContent() {
  const { token, user } = useAuth()
  const [models, setModels] = useState<Model[]>([])
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [provider, setProvider] = useState("openai")
  const [modelName, setModelName] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    try {
      const json = await api<{ data: Model[] }>(token, "/models")
      setModels(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load models")
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!token || busy) return
    setBusy(true)
    setError(null)
    try {
      await api(token, "/models", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          provider,
          model_name: modelName.trim() || null,
          base_url: baseUrl.trim() || null,
          api_key: apiKey.trim() || null,
          is_public: isPublic,
        }),
      })
      setName("")
      setModelName("")
      setBaseUrl("")
      setApiKey("")
      setIsPublic(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create model")
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!token) return
    setError(null)
    try {
      await api(token, `/models/${id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete model")
    }
  }

  const inputClasses =
    "w-full border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary"

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr]">
      <form
        onSubmit={create}
        className="flex h-fit flex-col gap-4 border-2 border-foreground bg-card p-4"
      >
        <h2 className="text-xs font-bold uppercase tracking-[0.25em]">
          + Add custom model
        </h2>
        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="GPT-4O MINI"
            className={inputClasses + " uppercase"}
          />
        </div>
        <div>
          <FieldLabel>Provider</FieldLabel>
          <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Model name (optional)</FieldLabel>
          <input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="gpt-4o-mini"
            className={inputClasses}
          />
        </div>
        {(provider === "custom" || provider === "ollama") && (
          <div>
            <FieldLabel>Base URL {provider === "custom" && "(required)"}</FieldLabel>
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              className={inputClasses}
            />
          </div>
        )}
        <div>
          <FieldLabel>API key (optional — env fallback used)</FieldLabel>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className={inputClasses}
          />
        </div>
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="size-4 accent-(--primary)"
          />
          List on marketplace
        </label>
        {error && (
          <p className="border border-destructive p-2 text-xs uppercase tracking-widest text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-80 disabled:opacity-40"
        >
          {busy ? "Saving..." : "Create model"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {models.length === 0 ? (
          <p className="border-2 border-dashed border-border p-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            // No models yet
          </p>
        ) : (
          models.map((m) => (
            <article
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 border-2 border-foreground bg-card p-4"
            >
              <div>
                <h3 className="font-sans text-sm font-black uppercase tracking-tight">
                  {m.name}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {m.provider}
                  {m.model_name ? ` / ${m.model_name}` : ""}
                  {m.base_url ? ` / ${m.base_url}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.is_public ? "accent" : "outline"}>
                  {m.is_public ? "Public" : "Private"}
                </Badge>
                {user?.id === m.creator_id && (
                  <button
                    onClick={() => remove(m.id)}
                    className="border border-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-destructive hover:bg-destructive hover:text-background"
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
