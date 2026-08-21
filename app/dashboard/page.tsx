"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { AuthGate } from "@/components/auth-gate"
import { Badge, PageHeader } from "@/components/field"
import { ApiKeysPanel } from "@/components/api-keys"
import type { DashboardAgent, DashboardSummary, UsageLog } from "@/lib/types"

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" sub="Creator portal / Revenue / Usage" />
      <AuthGate>
        <Dashboard />
      </AuthGate>
    </div>
  )
}

function Dashboard() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [agents, setAgents] = useState<DashboardAgent[]>([])
  const [usage, setUsage] = useState<UsageLog[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) return
    try {
      const [s, a, u] = await Promise.all([
        api<{ data: DashboardSummary }>(token, "/dashboard/summary"),
        api<{ data: DashboardAgent[] }>(token, "/dashboard/agents"),
        api<{ data: UsageLog[] }>(token, "/dashboard/usage?days=30"),
      ])
      setSummary(s.data)
      setAgents(a.data)
      setUsage(u.data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Backend unreachable — is the API running on port 4000?"
      )
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  const byDay = useMemo(() => {
    const days = new Map<string, { total: number; success: number }>()
    for (const log of usage) {
      const day = new Date(log.created_at).toISOString().slice(0, 10)
      const entry = days.get(day) || { total: 0, success: 0 }
      entry.total += 1
      if (log.status === "success") entry.success += 1
      days.set(day, entry)
    }
    return [...days.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14)
  }, [usage])

  const maxDay = Math.max(1, ...byDay.map(([, d]) => d.total))

  return (
    <div className="flex flex-col gap-10">
      {error && (
        <div className="border-2 border-destructive p-4 text-xs uppercase tracking-widest text-destructive">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px border-2 border-foreground bg-border lg:grid-cols-4">
        <Stat label="Published agents" value={summary?.published_agents ?? "—"} />
        <Stat label="Total calls" value={summary?.total_calls ?? "—"} />
        <Stat label="Successful calls" value={summary?.successful_calls ?? "—"} />
        <Stat
          label="Revenue (USD)"
          value={summary ? `$${Number(summary.total_revenue).toFixed(2)}` : "—"}
          accent
        />
      </div>

      {/* Usage trend */}
      <section className="border-2 border-foreground">
        <div className="border-b-2 border-foreground bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
          Call volume — last {byDay.length || 0} active days
        </div>
        {byDay.length === 0 ? (
          <p className="p-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            // No usage yet
          </p>
        ) : (
          <div className="flex h-48 items-end gap-2 overflow-x-auto p-4">
            {byDay.map(([day, d]) => (
              <div key={day} className="flex min-w-8 flex-1 flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{d.total}</span>
                <div
                  className="w-full bg-primary"
                  style={{ height: `${Math.max(4, (d.total / maxDay) * 120)}px` }}
                  title={`${day}: ${d.total} calls`}
                />
                <span className="text-[9px] uppercase text-muted-foreground">
                  {day.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Agents table */}
      <section className="border-2 border-foreground">
        <div className="flex items-center justify-between border-b-2 border-foreground bg-secondary px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
            Your agents
          </span>
          <Link
            href="/agents/builder"
            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
          >
            + New agent
          </Link>
        </div>
        {agents.length === 0 ? (
          <p className="p-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            // No agents yet — build one in the studio
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Calls</th>
                  <th className="px-3 py-2">Revenue</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-3 font-bold uppercase tracking-widest">
                      {a.name}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={a.is_published ? "accent" : "outline"}>
                        {a.is_published ? "Live" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      {Number(a.price_per_call) > 0 ? `$${a.price_per_call}` : "Free"}
                    </td>
                    <td className="px-3 py-3">
                      {a.usage.successful}/{a.usage.total}
                    </td>
                    <td className="px-3 py-3 text-primary">
                      ${Number(a.revenue).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/agents/${a.id}/publish`}
                        className="border border-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ApiKeysPanel token={token} />
    </div>
  )
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <div className="bg-background p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 font-sans text-3xl font-black tracking-tighter md:text-5xl ${
          accent ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
    </div>
  )
}
