"use client"

import { useState, useTransition } from "react"

import { Switch } from "@workspace/ui/components/switch"

import { alternarRegra } from "../../actions/regras"

/** Toggle otimista da regra — reverte se o servidor recusar. */
export function RegraSwitch({ id, ativa }: { id: string; ativa: boolean }) {
  const [checked, setChecked] = useState(ativa)
  const [pending, startTransition] = useTransition()

  return (
    <Switch
      checked={checked}
      disabled={pending}
      onCheckedChange={(value) => {
        setChecked(value)
        startTransition(async () => {
          const result = await alternarRegra(id, value)
          if (result.error) setChecked(!value)
        })
      }}
    />
  )
}
