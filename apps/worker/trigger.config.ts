import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_grlsnmejoweszxtgclvr",
  // Runtime alinhado ao stack do TIKSPY (Bun). Caso algum build extension/dep nativa
  // não suporte Bun na infra do Trigger, troque para "node" — é a única mudança necessária.
  runtime: "bun",
  logLevel: "log",
  // Teto de duração por run (segundos). Sync de mercado é I/O-bound e curto;
  // sobe aqui se um backfill grande precisar de mais fôlego.
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      factor: 2,
      minTimeoutInMs: 1_000,
      maxTimeoutInMs: 10_000,
      randomize: true,
    },
  },
  // Onde o Trigger procura as tasks. Tudo dentro de src/trigger é registrado.
  dirs: ["./src/trigger"],
});
