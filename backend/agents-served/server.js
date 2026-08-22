import http from 'node:http'
let config = null
const send = (res, status, body) => { res.writeHead(status, {'content-type':'application/json'}); res.end(JSON.stringify(body)) }
async function invoke(body) {
  const messages = [{role:'system',content:config.system_prompt||''}, ...(body.history||[]), {role:'user',content:body.input||body.message}]
  if (config.provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model_name||'gemini-2.5-flash')}:generateContent?key=${encodeURIComponent(config.api_key)}`
    const contents = messages.slice(1).map(m => ({role:m.role === 'assistant' ? 'model' : 'user', parts:[{text:String(m.content)}]}))
    const r = await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:messages[0].content}]},contents})})
    const d = await r.json(); if (!r.ok) throw new Error(d.error?.message||'Gemini request failed')
    return {response:d.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'',tool_calls:[]}
  }
  const base=(config.base_url||'https://api.openai.com/v1').replace(/\/$/,'')
  const r=await fetch(`${base}/chat/completions`,{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${config.api_key}`},body:JSON.stringify({model:config.model_name||'gpt-4o-mini',messages,temperature:.2})})
  const d=await r.json(); if(!r.ok) throw new Error(d.error?.message||'Model request failed')
  return {response:d.choices?.[0]?.message?.content||'',tool_calls:d.choices?.[0]?.message?.tool_calls||[]}
}
http.createServer(async (req,res)=>{try{let raw='';for await(const c of req)raw+=c;const b=raw?JSON.parse(raw):{};if(req.method==='POST'&&req.url==='/configure'){config=b;return send(res,200,{status:'ready'})}if(req.method==='POST'&&req.url==='/invoke'){if(!config)return send(res,409,{error:'Runtime is not configured'});return send(res,200,await invoke(b))}send(res,404,{error:'Not found'})}catch(e){send(res,500,{error:e.message})}}).listen(8000,'0.0.0.0')
