import { Sandbox } from '@e2b/code-interpreter'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// E2B enforces a maximum sandbox timeout of one hour.
const TTL = 60 * 60 * 1000
const runtimes = new Map()
const runtimeSource = await readFile(fileURLToPath(new URL('../../agents-served/server.js', import.meta.url)), 'utf8')

function requireKey() { if (!process.env.E2B_API_KEY) throw new Error('E2B_API_KEY is not configured') }

export async function deployPublishedAgent(agentId, model, skill) {
  requireKey()
  const current = runtimes.get(agentId)
  if (current && current.expiresAt > Date.now()) return current.url
  if (current) await stopPersistentSandbox(agentId)
  const sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY, timeoutMs: TTL })
  await sandbox.files.write('/home/user/agent-runtime.mjs', runtimeSource)
  await sandbox.commands.run('node /home/user/agent-runtime.mjs > /tmp/agent-runtime.log 2>&1 &')
  const url = `https://${sandbox.getHost(8000)}`
  const config = { provider:model.provider, model_name:model.model_name, base_url:model.base_url, api_key:model.api_key || process.env[model.provider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENAI_API_KEY'] || '', system_prompt:skill.system_prompt }
  const response = await fetch(`${url}/configure`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(config) })
  if (!response.ok) { await sandbox.kill().catch(()=>{}); throw new Error(`E2B runtime configuration failed (${response.status})`) }
  runtimes.set(agentId, {sandbox, url, expiresAt:Date.now()+TTL})
  return url
}

export async function invokePublishedAgent(agentId, config, body) {
  const url = await deployPublishedAgent(agentId, config.model, config.skill)
  const response = await fetch(`${url}/invoke`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body) })
  const data = await response.json().catch(()=>({}))
  if (!response.ok) throw new Error(data.error || `E2B runtime failed (${response.status})`)
  return data
}

export async function stopPersistentSandbox(agentId) { const current=runtimes.get(agentId); if(current){await current.sandbox.kill().catch(()=>{});runtimes.delete(agentId)} }

export async function runCodeInSandbox(code, language='python') {
  requireKey(); const sandbox=await Sandbox.create({apiKey:process.env.E2B_API_KEY})
  try { const execution=await sandbox.runCode(code,{language}); return {results:execution.results?.map(r=>r.text??String(r))||[],stdout:execution.logs?.stdout?.map(l=>l.line)||[],stderr:execution.logs?.stderr?.map(l=>l.line)||[],error:execution.error?String(execution.error):null} }
  catch(error) { return {results:[],stdout:[],stderr:[error.message],error:error.message} }
  finally { await sandbox.kill().catch(()=>{}) }
}
