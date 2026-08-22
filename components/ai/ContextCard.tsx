export function ContextCard({ title, content }: { title: string; content: string }) {
  return <section className="border border-[var(--ai-border)] px-4 py-3"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ai-muted)]">{title}</p><p className="mt-2 text-sm leading-6 text-[var(--ai-text)]">{content}</p></section>
}