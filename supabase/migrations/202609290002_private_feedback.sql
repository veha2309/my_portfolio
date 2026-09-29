begin;
create table if not exists public.portfolio_feedback (
  id uuid primary key default gen_random_uuid(),
  target text not null check (target in ('portfolio','vedant','financeflow','stockpulse','stockpulse-mobile','vision-assistant','mahila-mitr','malamen','signature-cafe')),
  rating integer not null check (rating between 1 and 5),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  name text not null default '' check (char_length(name) <= 80),
  email text not null default '' check (char_length(email) <= 254),
  created_at timestamptz not null default now()
);
create index if not exists portfolio_feedback_recent on public.portfolio_feedback(created_at desc, id desc);
create index if not exists portfolio_feedback_target on public.portfolio_feedback(target, created_at desc);
alter table public.portfolio_feedback enable row level security;
revoke all on public.portfolio_feedback from public, anon, authenticated;
grant select, insert on public.portfolio_feedback to service_role;
commit;
