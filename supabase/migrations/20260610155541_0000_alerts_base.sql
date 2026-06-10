-- Base do domínio de alertas: extensões + funções utilitárias compartilhadas.
-- Estas são as PRIMEIRAS migrations do projeto (schema public estava vazio).

create extension if not exists pgcrypto with schema extensions;

-- Trigger genérico de updated_at (anexado às tabelas mutáveis nas migrations seguintes).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
