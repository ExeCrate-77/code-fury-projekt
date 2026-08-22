import { PageHeader } from "@/components/field"

const example = `curl https://your-gateway.example/api/v1/agents/AGENT_ID/execute \\
  -H "x-api-key: amk_your_key" \\
  -H "content-type: application/json" \\
  -d '{"input":"Research the latest launch notes and summarize them"}'`

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="API docs" sub="Call published agents from any stack" />
      <section className="glass space-y-5 border-2 border-foreground p-5">
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Published agents run behind a metered gateway. Create a personal API key in Account, keep it server-side, and send it with every request.
          Each successful call is recorded against your key and the agent price is shown as your amount owed.
        </p>
        <div>
          <h2 className="mb-2 text-xs font-black uppercase tracking-[.2em]">Request</h2>
          <pre className="overflow-x-auto border border-border bg-background p-4 text-xs leading-6 text-primary"><code>{example}</code></pre>
        </div>
        <div className="grid gap-4 md:grid-cols-3 text-xs leading-5 text-muted-foreground">
          <div><strong className="text-foreground">x-api-key</strong><br />Your generated consumer key. Never expose it in browser code.</div>
          <div><strong className="text-foreground">input</strong><br />The task for the agent. <code>message</code> is accepted as an alias.</div>
          <div><strong className="text-foreground">response</strong><br />Read <code>data.response</code>, <code>tool_calls</code>, and <code>billed_amount</code>.</div>
        </div>
      </section>
    </div>
  )
}
