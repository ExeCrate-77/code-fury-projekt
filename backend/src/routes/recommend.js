import { Router } from 'express'
import { ChatGoogle } from '@langchain/google'
import { requireUser } from '../middleware/auth.js'
import { getAdminClient } from '../lib/supabase.js'

const router = Router()
router.use(requireUser)

router.post('/', async (req, res) => {
  const brief = String(req.body?.brief || '').trim()
  if (!brief) return res.status(400).json({ error: 'brief is required' })
  const admin = getAdminClient()
  const [{ data: models }, { data: skills }, { data: tools }, { data: agents }] = await Promise.all([
    admin.from('models').select('id,name,provider,model_name').or(`is_public.eq.true,creator_id.eq.${req.userId}`),
    admin.from('skills').select('id,name,system_prompt').or(`is_public.eq.true,creator_id.eq.${req.userId}`),
    admin.from('tools').select('id,name,tool_type').or(`is_public.eq.true,creator_id.eq.${req.userId}`),
    admin.from('agents').select('id,name,description,model_id,skill_id,price_per_call,is_published').eq('is_published', true),
  ])
  const prompt = `You are an AI agent architecture recommender. Return ONLY valid JSON with keys model_id, skill_id, tool_ids, agent_id, summary, reasons (array). Choose IDs only from the catalog. User brief: ${brief}\nCATALOG:${JSON.stringify({ models: models || [], skills: skills || [], tools: tools || [], agents: agents || [] })}`
  try {
    const llm = new ChatGoogle({ model: 'gemini-3.7-flash', apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY, temperature: 0.2 })
    const response = await llm.invoke(prompt)
    const text = typeof response.content === 'string' ? response.content : JSON.stringify(response.content)
    const parsed = JSON.parse(text.replace(/^```json\s*/i, '').replace(/\s*```$/, ''))
    res.json({ data: { ...parsed, model: (models || []).find((item) => item.id === parsed.model_id) || null, skill: (skills || []).find((item) => item.id === parsed.skill_id) || null, tools: (tools || []).filter((item) => (parsed.tool_ids || []).includes(item.id)), agent: (agents || []).find((item) => item.id === parsed.agent_id) || null } })
  } catch (error) { res.status(502).json({ error: `Gemini recommendation failed: ${error.message}` }) }
})

export default router
