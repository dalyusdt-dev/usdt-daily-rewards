create extension if not exists pgcrypto;
create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,email text unique,role text not null default 'user' check(role in ('user','admin')),created_at timestamptz not null default now());
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,email) values(new.id,new.email) on conflict(id) do update set email=excluded.email; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create table if not exists public.packages(id uuid primary key default gen_random_uuid(),name text not null,price_usdt numeric(18,6) not null check(price_usdt>0),description text,active boolean not null default false,created_at timestamptz not null default now());
create table if not exists public.site_settings(id integer primary key check(id=1),paused boolean not null default true,updated_at timestamptz not null default now());
insert into public.site_settings(id,paused) values(1,true) on conflict(id) do nothing;
create table if not exists public.deposit_requests(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete restrict,package_id uuid references public.packages(id) on delete set null,amount_usdt numeric(18,6) not null check(amount_usdt>0),network text not null check(network='TRC20'),txid text not null unique,status text not null default 'pending' check(status in ('pending','confirmed','rejected')),created_at timestamptz not null default now(),reviewed_at timestamptz);
alter table public.profiles enable row level security; alter table public.packages enable row level security; alter table public.site_settings enable row level security; alter table public.deposit_requests enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;
create policy "profile read own or admin" on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
create policy "active packages visible" on public.packages for select to anon,authenticated using(active=true or public.is_admin());
create policy "settings readable" on public.site_settings for select to anon,authenticated using(true);
create policy "admin updates settings" on public.site_settings for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "own requests or admin" on public.deposit_requests for select to authenticated using(user_id=auth.uid() or public.is_admin());
create policy "user creates request when not paused" on public.deposit_requests for insert to authenticated with check(user_id=auth.uid() and status='pending' and exists(select 1 from public.site_settings where id=1 and paused=false));
create policy "admin reviews requests" on public.deposit_requests for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admin manages packages" on public.packages for all to authenticated using(public.is_admin()) with check(public.is_admin());
insert into public.packages(name,price_usdt,description,active) values
('Starter $10',10,'Activate only after terms and funding are reviewed.',false),
('Basic $15',15,'Activate only after terms and funding are reviewed.',false),
('Standard $20',20,'Activate only after terms and funding are reviewed.',false),
('Plus $25',25,'Activate only after terms and funding are reviewed.',false),
('Pro $50',50,'Activate only after terms and funding are reviewed.',false),
('Premium $100',100,'Activate only after terms and funding are reviewed.',false),
('Gold $200',200,'Activate only after terms and funding are reviewed.',false),
('Platinum $500',500,'Activate only after terms and funding are reviewed.',false),
('Diamond $700',700,'Activate only after terms and funding are reviewed.',false),
('Elite $1000',1000,'Activate only after terms and funding are reviewed.',false)
on conflict do nothing;
