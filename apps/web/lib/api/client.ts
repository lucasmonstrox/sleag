import { treaty } from "@elysiajs/eden"
import type { App } from "api"

const API_URL = process.env.API_URL ?? "http://localhost:3333"

/** Cliente Eden tipado de ponta a ponta contra o apps/api (Elysia). */
export const api: ReturnType<typeof treaty<App>> = treaty<App>(API_URL)
