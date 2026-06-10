"use server"

import { redirect } from "next/navigation"

import { createClient } from "./server"

/** Termina a sessão e volta ao login. Partilhado entre features (ex: shell). */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
