-- Execute no SQL Editor do seu projeto Supabase.
-- Cada conta acessa exclusivamente o próprio documento de dados.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

drop policy if exists "Usuários leem os próprios dados" on public.user_data;
create policy "Usuários leem os próprios dados"
on public.user_data for select
using (auth.uid() = user_id);

drop policy if exists "Usuários criam os próprios dados" on public.user_data;
create policy "Usuários criam os próprios dados"
on public.user_data for insert
with check (auth.uid() = user_id);

drop policy if exists "Usuários atualizam os próprios dados" on public.user_data;
create policy "Usuários atualizam os próprios dados"
on public.user_data for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

revoke all on public.user_data from anon;
grant select, insert, update on public.user_data to authenticated;
