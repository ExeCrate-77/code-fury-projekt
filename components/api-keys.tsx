"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { ApiKey } from "@/lib/types"

export function ApiKeysPanel({ token }: { token: string | null }) {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [label, setLabel] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    try {
      const json = await api<{ data: ApiKey[] }>(token, "/api-keys")
      setKeys(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load keys")
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function create() {
    if (!token || busy) return
    setBusy(true)
    setError(null)
    try {
      const json = await api<{ data: ApiKey & { key: string } }>(
        token,
        "/api-keys",
        {
          method: "POST",
          body: JSON.stringify({ label: label.trim() || "default" }),
        }
      )
      setNewKey(json.data.key)
      setLabel("")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key")
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!token) return
    setError(null)
    try {
      await api(token, `/api-keys/${id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete key")
    }
  }

  return (
    <div className="border-2 border-foreground">
      <div className="border-b-2 border-foreground bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
        API keys
      </div>
      <div className="flex flex-col gap-4 p-4">
        {newKey && (
          <div className="border-2 border-primary p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              Key created — copy it now, it is shown only once
            </p>
            <code className="mt-2 block break-all bg-background p-2 text-xs text-primary">
              {newKey}
            </code>
          </div>
        )}

        {error && (
          <p className="border border-destructive p-2 text-xs uppercase tracking-widest text-destructive">
            {error}
          </p>
        )}

        {keys.length === 0 ? (
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            // No keys yet
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border border border-border">
            {keys.map((k) => (
              <li
                key={k.id}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs"
              >
                <span className="font-bold uppercase tracking-widest">
                  {k.label}
                </span>
                <code className="text-muted-foreground">{k.key_prefix}...</code>
                <span className="text-muted-foreground">
                  {new Date(k.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => remove(k.id)}
                  className="border border-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive hover:bg-destructive hover:text-background"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Key label"
            className="min-w-0 flex-1 border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-widest outline-none placeholder:text-muted-foreground focus-visible:border-primary"
          />
          <button
            onClick={create}
            disabled={busy}
            className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-80 disabled:opacity-40"
          >
            {busy ? "..." : "Generate key"}
          </button>
        </div>
      </div>
    </div>
  )
}
