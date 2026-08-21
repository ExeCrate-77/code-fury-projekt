"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/use-auth"
import { PageHeader } from "@/components/field"
import { ApiKeysPanel } from "@/components/api-keys"

export default function SettingsPage() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Connecting...
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Settings" sub="Authentication / Profile / API keys" />
      {session ? <SignedIn email={session.user.email ?? ""} userId={session.user.id} createdAt={session.user.created_at} /> : <SignInForm />}
      {session && <ApiKeysPanel token={session.access_token} />}
    </div>
  )
}

function SignedIn({
  email,
  userId,
  createdAt,
}: {
  email: string
  userId: string
  createdAt: string
}) {
  const [signingOut, setSigningOut] = useState(false)

  return (
    <div className="border-2 border-foreground">
      <div className="flex items-center justify-between border-b-2 border-foreground bg-secondary px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
          Profile
        </span>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary">
          <span className="size-2 bg-primary" /> Authenticated
        </span>
      </div>
      <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
        <div className="bg-background p-4">
          <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 break-all text-sm font-bold">{email}</dd>
        </div>
        <div className="bg-background p-4">
          <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            User ID
          </dt>
          <dd className="mt-1 break-all font-mono text-xs">{userId}</dd>
        </div>
        <div className="bg-background p-4">
          <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Member since
          </dt>
          <dd className="mt-1 text-sm font-bold">
            {new Date(createdAt).toLocaleDateString()}
          </dd>
        </div>
      </dl>
      <div className="border-t-2 border-foreground p-4">
        <button
          onClick={async () => {
            setSigningOut(true)
            await supabase.auth.signOut()
          }}
          disabled={signingOut}
          className="border-2 border-foreground px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background disabled:opacity-40"
        >
          {signingOut ? "..." : "Sign out"}
        </button>
      </div>
    </div>
  )
}

function SignInForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    setError(null)
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
        })
        if (err) throw err
        if (data.user && data.user.identities?.length === 0) {
          setError("This email already has an account — use Sign in.")
        } else if (!data.session) {
          setMessage(
            "Account created. Check your inbox and confirm your email, then sign in."
          )
        } else {
          setMessage("Account created. You are signed in.")
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (err) {
          if (err.message === "Invalid login credentials") {
            throw new Error(
              "Invalid login credentials — no account yet? Use Sign up."
            )
          }
          if (err.message === "Email not confirmed") {
            throw new Error(
              "Email not confirmed — click the confirmation link Supabase sent you."
            )
          }
          throw err
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed"
      setError(
        message.includes("429")
          ? "Rate limited by Supabase — wait a minute, then retry."
          : message
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl border-2 border-foreground">
      <div className="flex border-b-2 border-foreground">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setMessage(null)
              setError(null)
            }}
            className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest ${
              mode === m
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Auth is handled by Supabase. Your session token is passed to the
          AgentMkt API as a bearer token on every request.
        </p>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary"
            placeholder="••••••••"
          />
        </label>
        {message && (
          <p className="border border-primary p-2 text-xs uppercase tracking-widest text-primary">
            {message}
          </p>
        )}
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
          {busy ? "..." : mode === "signin" ? "Sign in →" : "Create account →"}
        </button>
      </form>
    </div>
  )
}
