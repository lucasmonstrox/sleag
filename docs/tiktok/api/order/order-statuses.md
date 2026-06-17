# Estados do Pedido (Order Statuses)

> **Fonte:** TikTok Shop Partner Center · Máquina de estados oficial

## O que faz

Documenta a **máquina de estados** de um pedido no TikTok Shop — todas as transições possíveis e seus significados. Essencial para interpretar o campo `order_status` nos endpoints de listagem/detalhe e para reagir corretamente aos webhooks `ORDER_STATUS_CHANGE`.

## Máquina de estados

```
┌─────────┐
│  UNPAID  │  Pedido criado, pagamento pendente
│  (100)   │  ↳ Comprador não concluiu pagamento
└────┬────┘
     │ pagamento aprovado
     ▼
┌──────────┐
│ ON_HOLD  │  Pagamento em verificação (anti-fraude)
│  (105)   │  ↳ TikTok revisa a transação (~minutos a horas)
└────┬─────┘
     │ verificação OK
     ▼
┌──────────────────┐
│ AWAITING_SHIPMENT │  Pronto para o seller despachar
│      (111)        │  ↳ ⚡ Ação do seller: criar pacote + enviar
└──────┬───────────┘
       │ Pacote criado / etiqueta gerada
       ▼
┌────────────────────┐
│ AWAITING_COLLECTION │  Aguardando coleta pela transportadora
│       (112)         │  ↳ Para FBT/logística do TikTok
└──────┬─────────────┘
       │ Coletado pela transportadora
       ▼
┌────────────┐
│ IN_TRANSIT │  Em trânsito para o comprador
│   (114)    │  ↳ Tracking number ativo
└──────┬─────┘
       │ Entregue ao comprador
       ▼
┌────────────┐
│ DELIVERED  │  Entregue — aguardando confirmação
│   (115)    │  ↳ Comprador pode abrir devolução
└──────┬─────┘
       │ Período de avaliação / confirmação automática
       ▼
┌────────────┐
│ COMPLETED  │  Pedido finalizado com sucesso
│   (130)    │  ↳ Estado terminal (positivo)
└────────────┘
```

### Estado terminal alternativo

```
Qualquer estado (exceto COMPLETED)
       │
       ▼
┌────────────┐
│ CANCELLED  │  Pedido cancelado
│   (140)    │  ↳ Estado terminal (negativo)
└────────────┘
```

## Tabela de status

| Código | Status | Significado | Ação esperada |
|---|---|---|---|
| `100` | `UNPAID` | Pedido criado, aguardando pagamento | Nenhuma. Aguardar confirmação. Pode expirar (~30 min a horas). |
| `105` | `ON_HOLD` | Pagamento em análise de risco | Nenhuma. Aguardar liberação ou bloqueio. |
| `111` | `AWAITING_SHIPMENT` | Pagamento aprovado, pronto para envio | ⚡ **Preparar e enviar.** Criar pacote, gerar etiqueta, despachar. Respeitar prazo de handling time. |
| `112` | `AWAITING_COLLECTION` | Aguardando coleta da transportadora | Confirmar que transportadora coletou. |
| `114` | `IN_TRANSIT` | Em transporte | Monitorar tracking. Responder a dúvidas do comprador. |
| `115` | `DELIVERED` | Entregue ao comprador | Aguardar confirmação. Período de devolução ativo (~7-30 dias). |
| `130` | `COMPLETED` | Pedido finalizado | Estado terminal. Settlement será processado. |
| `140` | `CANCELLED` | Pedido cancelado | Estado terminal. Pode ser cancelado pelo comprador (antes do envio), seller, ou plataforma. |

## Transições importantes

| De | Para | Disparador |
|---|---|---|
| `UNPAID` | `ON_HOLD` | Pagamento iniciado |
| `UNPAID` | `CANCELLED` | Timeout de pagamento ou comprador cancela |
| `ON_HOLD` | `AWAITING_SHIPMENT` | Pagamento aprovado pelo anti-fraude |
| `ON_HOLD` | `CANCELLED` | Pagamento rejeitado |
| `AWAITING_SHIPMENT` | `CANCELLED` | Comprador cancela antes do envio, ou seller cancela |
| `AWAITING_SHIPMENT` | `AWAITING_COLLECTION` | Pacote pronto para coleta |
| `AWAITING_COLLECTION` | `IN_TRANSIT` | Transportadora coletou |
| `IN_TRANSIT` | `DELIVERED` | Entregue |
| `DELIVERED` | `COMPLETED` | Confirmação automática ou buyer confirma |
| `DELIVERED` | `CANCELLED` | Devolução/reembolso total |

## Prazos (SLA)

| Evento | Prazo típico |
|---|---|
| `UNPAID` → expira | ~30 min a 2 horas |
| `AWAITING_SHIPMENT` → envio | **Handling time** da loja (1–7 dias úteis) |
| `DELIVERED` → `COMPLETED` | ~7–30 dias (depende da região) |
| Janela de devolução | ~7–30 dias após `DELIVERED` |

## Relevância para o SLEAG

- Dashboard segmentado por status (cards/colunas).
- Automação: `AWAITING_SHIPMENT` → notificar equipe de fulfillment.
- SLAs: alertas se pedido parado em um status além do prazo.
