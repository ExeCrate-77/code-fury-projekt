"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { AuthGate } from "@/components/auth-gate"
import { Badge, FieldLabel, PageHeader, Select, TextArea } from "@/components/field"
import type { Tool } from "@/lib/types"

const TOOL_TYPES = ["code_execution", "web_scraping", "web_search", "custom"]

export default function ToolsPage() {
  return (
    <div>
      <PageHeader title="Tools" sub="Pluggable capabilities / E2B sandbox" />
      <AuthGate>
        <ToolsContent />
      </AuthGate>
    </div>
  )
}

function ToolsContent() {
  const { token, user } = useAuth()
  const [tools, setTools] = useState<Tool[]>([])
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [toolType, setToolType] = useState("code_execution")
  const [schema, setSchema] = useState("{\n}")
  const [isPublic, setIsPublic] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    try {
      const json = await api<{ data: Tool[] }>(token, "/tools")
      setTools(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tools")
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!token || busy) return
    let schemaConfig: Record<string, unknown> = {}
    try {
      schemaConfig = JSON.parse(schema)
    } catch {
      setError("Schema config must be valid JSON.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await api(token, "/tools", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          tool_type: toolType,
          schema_config: schemaConfig,
          is_public: isPublic,
        }),
      })
      setName("")
      setSchema("{\n}")
      setIsPublic(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tool")
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!token) return
    setError(null)
    try {
      await api(token, `/tools/${id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tool")
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr]">
      <form
        onSubmit={create}
        className="flex h-fit flex-col gap-4 border-2 border-foreground bg-card p-4"
      >
        <h2 className="text-xs font-bold uppercase tracking-[0.25em]">
          + Add custom tool
        </h2>
        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="PYTHON RUNNER"
            className="w-full border border-border bg-transparent px-3 py-2 text-sm uppercase outline-none placeholder:text-muted-foreground focus-visible:border-primary"
          />
        </div>
        <div>
          <FieldLabel>Tool type</FieldLabel>
          <Select value={toolType} onChange={(e) => setToolType(e.target.value)}>
            {TOOL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>
            Schema config (JSON — endpoint / method / api_key / description)
          </FieldLabel>
          <TextArea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className="font-mono text-xs"
            rows={6}
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
          {busy ? "Saving..." : "Create tool"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {tools.length === 0 ? (
          <p className="border-2 border-dashed border-border p-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            // No tools yet
          </p>
        ) : (
          tools.map((t) => (
            <article
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 border-2 border-foreground bg-card p-4"
            >
              <div>
                <h3 className="font-sans text-sm font-black uppercase tracking-tight">
                  {t.name}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t.tool_type.replace(/_/g, " ")}
                  {t.schema_config?.endpoint
                    ? ` / ${String(t.schema_config.endpoint)}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={t.is_public ? "accent" : "outline"}>
                  {t.is_public ? "Public" : "Private"}
                </Badge>
                {user?.id === t.creator_id && (
                  <button
                    onClick={() => remove(t.id)}
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
