-- Additive migration: existing portfolio tables/data are not changed.
begin;
create table if not exists public.portfolio_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null default '' check (char_length(name) <= 80),
  email text not null check (char_length(email) between 3 and 254),
  service text not null check (service in ('Website', 'Web app', 'Mobile app', 'Redesign')),
  timeline text not null default '' check (char_length(timeline) <= 40),
  message text not null check (char_length(btrim(message)) between 1 and 1200),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_inquiries_recent on public.portfolio_inquiries (created_at desc, id desc);
alter table public.portfolio_inquiries enable row level security;
revoke all on public.portfolio_inquiries from public, anon, authenticated;
grant select, insert, update on public.portfolio_inquiries to service_role;

create table if not exists public.portfolio_rate_limits (
  key text primary key,
  count integer not null default 1,
  expires_at timestamptz not null
);
create index if not exists portfolio_rate_limits_expiry on public.portfolio_rate_limits(expires_at);
alter table public.portfolio_rate_limits enable row level security;
revoke all on public.portfolio_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.portfolio_rate_limits to service_role;

create or replace function public.portfolio_consume_rate_limit(bucket_key text, maximum integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare hits integer;
begin
  if bucket_key !~ '^[a-f0-9]{64}$' or maximum < 1 or maximum > 100 then
    raise exception 'Invalid rate limit arguments';
  end if;
  delete from public.portfolio_rate_limits where expires_at < now();
  insert into public.portfolio_rate_limits as limits (key, count, expires_at)
  values (bucket_key, 1, now() + interval '30 minutes')
  on conflict (key) do update set count = least(limits.count + 1, maximum + 1)
  returning count into hits;
  return hits <= maximum;
end;
$$;
revoke all on function public.portfolio_consume_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.portfolio_consume_rate_limit(text, integer) to service_role;
commit;
