import * as React from "react"
import { cn } from "@/lib/utils"

const fieldClasses =
  "w-full border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary disabled:opacity-50"

export function Select({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        fieldClasses,
        "h-9 appearance-none uppercase tracking-widest text-xs",
        className
      )}
      {...props}
    />
  )
}

export function TextArea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClasses, "min-h-32", className)} {...props} />
}

export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "accent" | "outline"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
        variant === "accent" && "bg-primary text-primary-foreground",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "outline" && "border border-border text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function PageHeader({
  title,
  sub,
  children,
}: {
  title: string
  sub?: string
  children?: React.ReactNode
}) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b-2 border-foreground pb-8">
      <div>
        <h1 className="font-sans text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
          {title}
        </h1>
        {sub && (
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {sub}
          </p>
        )}
      </div>
      {children}
    </header>
  )
}
