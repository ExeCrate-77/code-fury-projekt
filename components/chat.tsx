"use client"

import { useEffect, useRef, useState } from "react"
import { api } from "@/lib/api"
import type { ChatMessage, ChatToolCall } from "@/lib/types"

export function ChatStream({
  token,
  modelId,
  skillId,
  toolIds,
  compact = false,
}: {
  token: string | null
  modelId: string
  skillId: string
  toolIds: string[]
  compact?: boolean
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, busy])

  async function send() {
    const message = input.trim()
    if (!message || busy) return
    if (!modelId || !skillId) {
      setError("Select a model and a skill first.")
      return
    }
    setInput("")
    setError(null)
    const history = messages.map(({ role, content }) => ({ role, content }))
    setMessages((m) => [...m, { role: "user", content: message }])
    setBusy(true)
    try {
      const json = await api<{
        data: { response: string; tool_calls: ChatToolCall[] }
      }>(token, "/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
          history,
          model_id: modelId,
          skill_id: skillId,
          tool_ids: toolIds,
        }),
      })
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: json.data.response,
          toolCalls: json.data.tool_calls,
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col border-2 border-foreground">
      <div className="border-b-2 border-foreground bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        Live session
      </div>
      <div
        className={`flex flex-col gap-4 overflow-y-auto p-4 ${
          compact ? "max-h-80 min-h-40" : "max-h-[28rem] min-h-64"
        }`}
      >
        {messages.length === 0 && (
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            // No messages yet — configure the persona above and send a prompt
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {m.role === "user" ? "You" : "Agent"}
            </span>
            <div
              className={
                m.role === "user"
                  ? "border border-border bg-secondary p-3 text-sm leading-relaxed"
                  : "border-l-4 border-primary bg-card p-3 text-sm leading-relaxed"
              }
            >
              {m.content || (busy && i === messages.length - 1 ? "..." : "")}
            </div>
            {m.toolCalls && m.toolCalls.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {m.toolCalls.map((tc, j) => (
                  <span
                    key={j}
                    className="border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary"
                  >
                    ⟶ tool: {tc.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && (
          <p className="animate-pulse text-[10px] uppercase tracking-[0.3em] text-primary">
            Executing agent...
          </p>
        )}
        {error && (
          <p className="border border-destructive p-2 text-xs uppercase tracking-widest text-destructive">
            {error}
          </p>
        )}
        <div ref={endRef} />
      </div>
      <div className="flex border-t-2 border-foreground">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Type a message..."
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={send}
          disabled={busy}
          className="border-l-2 border-foreground bg-primary px-6 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-80 disabled:opacity-40"
        >
          {busy ? "Running" : "Send"}
        </button>
      </div>
    </div>
  )
}
