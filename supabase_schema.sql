
create extension if not exists "uuid-ossp";


create table if not exists public.snippets (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled Snippet',
  language    text not null,
  code        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz
);


create index if not exists snippets_user_id_idx on public.snippets(user_id);
create index if not exists snippets_created_at_idx on public.snippets(created_at desc);

-- RLS
alter table public.snippets enable row level security;


create policy "Users can view own snippets"
  on public.snippets for select
  using (auth.uid() = user_id);


create policy "Users can insert own snippets"
  on public.snippets for insert
  with check (auth.uid() = user_id);


create policy "Users can update own snippets"
  on public.snippets for update
  using (auth.uid() = user_id);


create policy "Users can delete own snippets"
  on public.snippets for delete
  using (auth.uid() = user_id);


create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.snippets
  for each row execute procedure public.handle_updated_at();
