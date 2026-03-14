create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'policyholder',
  organization_name text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    organization_name
  )
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when coalesce(new.raw_user_meta_data ->> 'role', '') in ('policyholder', 'broker', 'adjuster', 'admin')
        then new.raw_user_meta_data ->> 'role'
      else 'policyholder'
    end,
    nullif(new.raw_user_meta_data ->> 'organization_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = coalesce(excluded.role, public.profiles.role),
    organization_name = coalesce(excluded.organization_name, public.profiles.organization_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  policy_number text not null unique,
  holder_name text not null,
  line_of_business text not null default 'cyber',
  coverage_summary text not null,
  premium numeric(12, 2) not null default 0,
  status text not null default 'Active',
  renewal_date date,
  risk_score integer default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  claim_number text not null unique,
  policy_id uuid references public.policies (id) on delete cascade,
  reported_by uuid references public.profiles (id),
  status text not null default 'Open',
  severity text not null default 'Medium',
  incident_date date,
  reserve_amount numeric(12, 2) not null default 0,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.policy_assignments (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  assignment_role text not null,
  provisioning_source text not null default 'manual',
  created_at timestamptz not null default now(),
  unique (policy_id, profile_id, assignment_role)
);

create table if not exists public.claim_assignments (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  assignment_role text not null,
  provisioning_source text not null default 'manual',
  created_at timestamptz not null default now(),
  unique (claim_id, profile_id, assignment_role)
);

create table if not exists public.claim_events (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims (id) on delete cascade,
  event_type text not null,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references public.claims (id) on delete cascade,
  policy_id uuid references public.policies (id) on delete cascade,
  file_name text not null,
  bucket_path text not null,
  document_type text not null,
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies (id) on delete cascade,
  claim_id uuid references public.claims (id) on delete cascade,
  amount numeric(12, 2) not null default 0,
  payment_type text not null,
  status text not null default 'Pending',
  reference_number text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_triage_results (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims (id) on delete cascade,
  priority_label text not null,
  confidence_score numeric(5, 2) not null default 0,
  reason_tags text[] not null default '{}',
  summary text,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.can_access_policy(policy_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or exists (
      select 1
      from public.policy_assignments pa
      where pa.policy_id = policy_uuid
        and pa.profile_id = auth.uid()
    )
$$;

create or replace function public.can_access_claim(claim_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or exists (
      select 1
      from public.claims c
      where c.id = claim_uuid
        and c.reported_by = auth.uid()
    )
    or exists (
      select 1
      from public.claim_assignments ca
      where ca.claim_id = claim_uuid
        and ca.profile_id = auth.uid()
    )
    or exists (
      select 1
      from public.claims c
      where c.id = claim_uuid
        and public.can_access_policy(c.policy_id)
    )
$$;

create or replace function public.sync_profile_policy_assignments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.policy_assignments
  where profile_id = new.id
    and provisioning_source = 'profile_match';

  if new.organization_name is null then
    return new;
  end if;

  if new.role not in ('policyholder', 'broker') then
    return new;
  end if;

  insert into public.policy_assignments (
    policy_id,
    profile_id,
    assignment_role,
    provisioning_source
  )
  select
    p.id,
    new.id,
    new.role,
    'profile_match'
  from public.policies p
  where lower(p.holder_name) = lower(new.organization_name)
  on conflict (policy_id, profile_id, assignment_role) do nothing;

  return new;
end;
$$;

drop trigger if exists sync_profile_policy_assignments on public.profiles;
create trigger sync_profile_policy_assignments
after insert or update of organization_name, role on public.profiles
for each row execute procedure public.sync_profile_policy_assignments();

create or replace function public.sync_policy_profile_assignments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.policy_assignments
  where policy_id = new.id
    and provisioning_source = 'policy_match';

  insert into public.policy_assignments (
    policy_id,
    profile_id,
    assignment_role,
    provisioning_source
  )
  select
    new.id,
    pr.id,
    pr.role,
    'policy_match'
  from public.profiles pr
  where pr.role in ('policyholder', 'broker')
    and pr.organization_name is not null
    and lower(pr.organization_name) = lower(new.holder_name)
  on conflict (policy_id, profile_id, assignment_role) do nothing;

  return new;
end;
$$;

drop trigger if exists sync_policy_profile_assignments on public.policies;
create trigger sync_policy_profile_assignments
after insert or update of holder_name on public.policies
for each row execute procedure public.sync_policy_profile_assignments();

alter table public.profiles enable row level security;
alter table public.policies enable row level security;
alter table public.claims enable row level security;
alter table public.policy_assignments enable row level security;
alter table public.claim_assignments enable row level security;
alter table public.claim_events enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;
alter table public.ai_triage_results enable row level security;

drop policy if exists "users can view own profile" on public.profiles;
create policy "users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "admins can view all profiles" on public.profiles;
create policy "admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "users can view own policy assignments" on public.policy_assignments;
create policy "users can view own policy assignments"
on public.policy_assignments
for select
to authenticated
using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "admins can manage policy assignments" on public.policy_assignments;
create policy "admins can manage policy assignments"
on public.policy_assignments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "users can view own claim assignments" on public.claim_assignments;
create policy "users can view own claim assignments"
on public.claim_assignments
for select
to authenticated
using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "admins can manage claim assignments" on public.claim_assignments;
create policy "admins can manage claim assignments"
on public.claim_assignments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "assigned policy access" on public.policies;
create policy "assigned policy access"
on public.policies
for select
to authenticated
using (public.can_access_policy(id));

drop policy if exists "assigned claim access" on public.claims;
create policy "assigned claim access"
on public.claims
for select
to authenticated
using (public.can_access_claim(id));

drop policy if exists "assigned claim-event access" on public.claim_events;
create policy "assigned claim-event access"
on public.claim_events
for select
to authenticated
using (public.can_access_claim(claim_id));

drop policy if exists "assigned document access" on public.documents;
create policy "assigned document access"
on public.documents
for select
to authenticated
using (
  (claim_id is not null and public.can_access_claim(claim_id))
  or (policy_id is not null and public.can_access_policy(policy_id))
);

drop policy if exists "assigned payment access" on public.payments;
create policy "assigned payment access"
on public.payments
for select
to authenticated
using (
  (claim_id is not null and public.can_access_claim(claim_id))
  or (policy_id is not null and public.can_access_policy(policy_id))
);

drop policy if exists "assigned ai result access" on public.ai_triage_results;
create policy "assigned ai result access"
on public.ai_triage_results
for select
to authenticated
using (public.can_access_claim(claim_id));
