"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { AuthGate } from "@/components/auth-gate"
import { Badge, FieldLabel, PageHeader, TextArea } from "@/components/field"
import type { Skill } from "@/lib/types"

export default function SkillsPage() {
  return (
    <div>
      <PageHeader
        title="Skills"
        sub="Reusable system prompts / personas"
      />
      <AuthGate>
        <SkillsContent />
      </AuthGate>
    </div>
  )
}

function SkillsContent() {
  const { token, user } = useAuth()
  const [skills, setSkills] = useState<Skill[]>([])
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [prompt, setPrompt] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    try {
      const json = await api<{ data: Skill[] }>(token, "/skills")
      setSkills(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skills")
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
      await api(token, "/skills", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          system_prompt: prompt,
          is_public: isPublic,
        }),
      })
      setName("")
      setPrompt("")
      setIsPublic(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create skill")
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!token) return
    setError(null)
    try {
      await api(token, `/skills/${id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill")
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr]">
      <form
        onSubmit={create}
        className="flex h-fit flex-col gap-4 border-2 border-foreground bg-card p-4"
      >
        <h2 className="text-xs font-bold uppercase tracking-[0.25em]">
          + Add custom skill
        </h2>
        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="CONCISE CODE REVIEWER"
            className="w-full border border-border bg-transparent px-3 py-2 text-sm uppercase outline-none placeholder:text-muted-foreground focus-visible:border-primary"
          />
        </div>
        <div>
          <FieldLabel>System prompt</FieldLabel>
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            placeholder="You are a ruthless but fair code reviewer..."
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
          {busy ? "Saving..." : "Create skill"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {skills.length === 0 ? (
          <p className="border-2 border-dashed border-border p-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            // No skills yet
          </p>
        ) : (
          skills.map((s) => (
            <article key={s.id} className="border-2 border-foreground bg-card">
              <div className="flex items-center justify-between gap-2 border-b-2 border-foreground px-3 py-2">
                <h3 className="font-sans text-sm font-black uppercase tracking-tight">
                  {s.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant={s.is_public ? "accent" : "outline"}>
                    {s.is_public ? "Public" : "Private"}
                  </Badge>
                  {user?.id === s.creator_id && (
                    <button
                      onClick={() => remove(s.id)}
                      className="border border-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-destructive hover:bg-destructive hover:text-background"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="max-h-40 overflow-y-auto whitespace-pre-wrap p-3 text-xs leading-relaxed text-muted-foreground">
                {s.system_prompt}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
