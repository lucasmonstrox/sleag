-- Endurecimento: funções SECURITY DEFINER não devem ser chamáveis via PostgREST RPC.
-- handle_new_user só roda como trigger (executada no contexto do dono da tabela, não
-- precisa de grant aos roles do PostgREST). current_tenant_ids é usada nas policies de
-- RLS, então o role `authenticated` precisa manter EXECUTE — mas anon/público não.

revoke execute on function public.handle_new_user()   from public, anon, authenticated;
revoke execute on function public.current_tenant_ids() from public, anon;
grant  execute on function public.current_tenant_ids() to authenticated;
