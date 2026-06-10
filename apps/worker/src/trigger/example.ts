import { logger, task } from "@trigger.dev/sdk";

/**
 * Task de fumaça — só confirma que o worker está conectado ao projeto certo.
 * Dispare pelo dashboard ou via `tasks.trigger("health-check", { name })`.
 * Substituir pelas tasks reais de sync/scoring (docs/ingestao.md §6) quando
 * o packages/market-data existir.
 */
export const healthCheck = task({
  id: "health-check",
  run: async (payload: { name?: string }) => {
    logger.info("worker online", { name: payload.name ?? "tikspy" });
    return { ok: true, greeted: payload.name ?? "tikspy" };
  },
});
