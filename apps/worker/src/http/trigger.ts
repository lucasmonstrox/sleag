import { type Env, propagateEnv } from "../lib/env"

/**
 * Disparo on-demand do EvaluateAlertsWorkflow. O cron de Workflow (wrangler.jsonc)
 * NÃO dispara sozinho no `wrangler dev`, então este endpoint é o caminho de dev/ops
 * pra rodar a avaliação na hora. Protegido por TRIGGER_SECRET (Bearer).
 *
 *   POST /trigger   (body opcional { snapshotDt })  → cria instância, devolve { instanceId }
 *   GET  /trigger?instanceId=<id>                    → status da instância
 *
 * Alternativas equivalentes sem este endpoint: `wrangler workflows trigger
 * sleag-evaluate-alerts --local` ou o Local Explorer (tecla `e` no wrangler dev).
 */
export async function handleTrigger(request: Request, env: Env): Promise<Response> {
  propagateEnv(env)
  const url = new URL(request.url)
  if (url.pathname !== "/trigger") return new Response("not found", { status: 404 })

  const secret = process.env.TRIGGER_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 })
  }

  if (request.method === "GET") {
    const instanceId = url.searchParams.get("instanceId")
    if (!instanceId) return Response.json({ error: "instanceId obrigatório" }, { status: 400 })
    const instance = await env.ALERTS_WORKFLOW.get(instanceId)
    return Response.json({ instanceId, status: await instance.status() })
  }

  if (request.method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { snapshotDt?: string }
    const instance = await env.ALERTS_WORKFLOW.create({ params: body })
    return Response.json({ instanceId: instance.id })
  }

  return new Response("method not allowed", { status: 405 })
}
