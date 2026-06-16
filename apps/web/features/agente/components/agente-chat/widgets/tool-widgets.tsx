import type { ReactNode } from "react"

import { NichoEmAltaWidget } from "./nicho-em-alta-widget"

/**
 * Registry tool → widget. A chave é o nome da tool no apps/api (a mesma que o
 * modelo chama); o valor pinta o `output` da tool como UI. Tool sem entrada
 * aqui não renderiza widget — o texto do agente cobre o resultado.
 */
export const TOOL_WIDGETS: Record<string, (output: unknown) => ReactNode> = {
  nichoEmAlta: (output) => <NichoEmAltaWidget output={output} />,
}
