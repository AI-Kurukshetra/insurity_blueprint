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
