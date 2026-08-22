export function StreamingText({ content }: { content: string }) {
  return <p className="whitespace-pre-wrap text-[15px] leading-7 text-[var(--ai-text)]">{content}</p>
}