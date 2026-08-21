"use client"

import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))

    return () => subscription.unsubscribe()
  }, [])

  return {
    session,
    user: session?.user ?? null,
    token: session?.access_token ?? null,
    loading,
  }
}
