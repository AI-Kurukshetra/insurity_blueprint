-- SmartClaim Pro: document upload repair and verification
--
-- Paste this whole file into the Supabase SQL editor for the same project
-- referenced by your local `.env.local`.
--
-- What it does:
-- 1. Verifies the upload bucket exists
-- 2. Recreates the document insert policy
-- 3. Recreates the Storage upload/read policies
-- 4. Prints simple verification queries at the end
--
-- Prerequisite:
-- Run `supabase/schema.sql` first, because this script depends on:
-- - public.can_access_claim(uuid)
-- - public.can_access_policy(uuid)

insert into storage.buckets (id, name, public)
values ('claim-documents', 'claim-documents', false)
on conflict (id) do nothing;

drop policy if exists "assigned users can insert documents" on public.documents;
create policy "assigned users can insert documents"
on public.documents
for insert
to authenticated
with check (
  uploaded_by = auth.uid()
  and (
    (claim_id is not null and public.can_access_claim(claim_id))
    or (policy_id is not null and public.can_access_policy(policy_id))
  )
);

drop policy if exists "assigned users can upload claim documents" on storage.objects;
create policy "assigned users can upload claim documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'claim-documents'
  and public.can_access_claim(nullif(split_part(name, '/', 1), '')::uuid)
);

drop policy if exists "assigned users can view claim documents" on storage.objects;
create policy "assigned users can view claim documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'claim-documents'
  and public.can_access_claim(nullif(split_part(name, '/', 1), '')::uuid)
);

select id, name, public
from storage.buckets
where id = 'claim-documents';

select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname in ('storage', 'public')
  and (
    tablename = 'objects'
    or tablename = 'documents'
  )
order by schemaname, tablename, policyname;
