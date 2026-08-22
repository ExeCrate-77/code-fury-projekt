"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/", label: "Chat" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/skills", label: "Skills" },
  { href: "/models", label: "Models" },
  { href: "/tools", label: "Tools" },
  { href: "/agents/builder", label: "Builder" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "API Docs" },
]

export function Nav() {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  return (
    <nav className="sticky top-0 z-40 border-b-2 border-foreground bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-stretch">
        <Link
          href="/"
          className="flex items-center border-r-2 border-foreground px-4 py-3 font-sans text-sm font-black uppercase tracking-tighter"
        >
          Agent<span className="text-primary">Mkt</span>
        </Link>
        <div className="flex flex-1 flex-wrap items-stretch overflow-x-auto">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center border-r border-border px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase tracking-widest",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          )}
        >
          <span
            className={cn(
              "size-2",
              loading
                ? "bg-muted-foreground"
                : user
                  ? "bg-primary"
                  : "bg-destructive"
            )}
          />
          {loading ? "..." : user ? "Account" : "Sign in"}
        </Link>
      </div>
    </nav>
  )
}
