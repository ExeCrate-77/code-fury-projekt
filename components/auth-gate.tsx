"use client"

import Link from "next/link"
import { useAuth } from "@/lib/use-auth"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="p-10 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Connecting...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="border-2 border-foreground p-10 text-center md:p-20">
        <h2 className="font-sans text-3xl font-black uppercase tracking-tighter md:text-5xl">
          Access required
        </h2>
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Sign in to compose, test and publish agents
        </p>
        <Link
          href="/settings"
          className="mt-8 inline-block bg-primary px-8 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-80"
        >
          Sign in →
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
