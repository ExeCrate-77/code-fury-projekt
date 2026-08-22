"use client"

import { useEffect, useRef, useState } from "react"
import { api } from "@/lib/api"
import type { ChatMessage, ChatToolCall } from "@/lib/types"
import { Orb } from "@/components/orb"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  "Write a Python script that plots fibonacci numbers",
  "Scrape and summarize the latest AI news",
  "Draft a launch tweet for my agent",
  "Explain how RAG works like I'm five",
]

export function ChatStream({
  token,
  modelId,
  skillId,
  toolIds,
}: {
  token: string | null
  modelId: string
  skillId: string
  toolIds: string[]
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, busy])

  useEffect(() => {
    if (!busy) {
      setElapsed(0)
      return
    }
    const started = Date.now()
    const t = setInterval(() => setElapsed((Date.now() - started) / 1000), 100)
    return () => clearInterval(t)
  }, [busy])

  async function send(text?: string) {
    const message = (text ?? input).trim()
    if (!message || busy) return
    if (!modelId || !skillId) {
      setError("Select a model and a skill in the persona bar first.")
      return
    }
    setInput("")
    setError(null)
    if (areaRef.current) areaRef.current.style.height = "auto"
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

  const empty = messages.length === 0

  return (
    <div className="flex h-[calc(100dvh-13rem)] min-h-[480px] flex-col">
      {/* Stream / hero */}
      <div ref={scrollRef} className="chat-scroll min-h-0 flex-1 overflow-y-auto">
        {empty ? (
          <EmptyHero busy={busy} onSuggest={(s) => send(s)} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-0">
            {messages.map((m, i) => (
              <MessageRow key={i} message={m} />
            ))}
            {busy && <ThinkingRow elapsed={elapsed} />}
            {error && <ErrorRow message={error} />}
          </div>
        )}
      </div>

      {/* Composer dock */}
      <div className="mx-auto w-full max-w-3xl px-4 pb-6 md:px-0">
        {empty && error && (
          <div className="mb-2">
            <ErrorRow message={error} />
          </div>
        )}
        <div className="glass-strong flex flex-col gap-2 p-3">
          <textarea
            ref={areaRef}
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = "auto"
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={
              modelId && skillId
                ? "Message your agent..."
                : "Pick a model + skill above, then message your agent..."
            }
            className="max-h-52 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between gap-3 border-t border-foreground/10 pt-2">
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              Enter to send · Shift+Enter for newline
            </span>
            <button
              onClick={() => send()}
              disabled={busy || !input.trim()}
              className={cn(
                "flex items-center gap-2 bg-primary px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform",
                "hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
              )}
            >
              {busy ? "Running" : "Send"} <span aria-hidden>↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyHero({
  busy,
  onSuggest,
}: {
  busy: boolean
  onSuggest: (s: string) => void
}) {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <Orb size={132} thinking={busy} />
      <div>
        <h1 className="font-sans text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">
          Talk to your
          <br />
          <span className="text-primary">agent.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[11px] uppercase leading-loose tracking-[0.25em] text-muted-foreground">
          Compose a persona below — swap model, skill and tools any time, even
          mid-conversation.
        </p>
      </div>
      <div className="flex max-w-xl flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            disabled={busy}
            className="glass px-3 py-2 text-left text-[11px] leading-snug text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="msg-enter flex justify-end">
        <div className="max-w-[85%] border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="msg-enter flex gap-3">
      <div className="mt-1 shrink-0">
        <Orb size={30} />
      </div>
      <div className="glass max-w-[85%] flex-1 px-4 py-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-foreground/10 pt-2.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {message.toolCalls.length} tool call
              {message.toolCalls.length > 1 ? "s" : ""}
            </span>
            {message.toolCalls.map((tc, j) => (
              <span
                key={j}
                className="border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary"
              >
                {tc.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ThinkingRow({ elapsed }: { elapsed: number }) {
  return (
    <div className="msg-enter flex gap-3">
      <div className="mt-1 shrink-0">
        <Orb size={30} thinking />
      </div>
      <div className="glass flex items-center gap-3 px-4 py-3">
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 animate-pulse bg-primary"
              style={{ animationDelay: `${i * 180}ms` }}
            />
          ))}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Thinking {elapsed.toFixed(1)}s
        </span>
      </div>
    </div>
  )
}

function ErrorRow({ message }: { message: string }) {
  return (
    <div className="border border-destructive bg-destructive/10 px-4 py-3 text-xs uppercase tracking-widest text-destructive">
      {message}
    </div>
  )
}
