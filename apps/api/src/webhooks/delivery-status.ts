/**
 * Progressão MONOTÔNICA do status de entrega: queued → sent → delivered → read.
 * Webhooks chegam fora de ordem (READ antes do DELIVERY_ACK é comum) — o status
 * nunca regride. Regras portadas do menupiloto (packages/db/status-ingest):
 *  - `failed` só a partir de queued/sent (mensagem já entregue não "falha");
 *  - recibo positivo REVIVE um failed (o gateway errou ao reportar falha);
 *  - `skipped` é terminal (nada foi enviado, não há recibo legítimo).
 */

export type DeliveryStatus = "queued" | "sent" | "delivered" | "read" | "failed" | "skipped"
export type ReceiptEvent = "sent" | "delivered" | "read" | "failed"

const PROGRESS: Record<string, number> = { queued: 0, sent: 1, delivered: 2, read: 3 }

export function nextDeliveryStatus(current: DeliveryStatus, incoming: ReceiptEvent): DeliveryStatus {
  if (current === "skipped") return current
  if (incoming === "failed") {
    return current === "queued" || current === "sent" ? "failed" : current
  }
  if (current === "failed") return incoming
  return (PROGRESS[incoming] ?? 0) > (PROGRESS[current] ?? 0) ? incoming : current
}

/** Coluna de timestamp a carimbar quando o recibo avança o status. */
export const RECEIPT_TIMESTAMP_COLUMN: Record<ReceiptEvent, "sent_at" | "delivered_at" | "read_at" | "failed_at"> = {
  sent: "sent_at",
  delivered: "delivered_at",
  read: "read_at",
  failed: "failed_at",
}
