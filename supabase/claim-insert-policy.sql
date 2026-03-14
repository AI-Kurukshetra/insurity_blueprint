drop policy if exists "authenticated users can insert claims" on public.claims;
create policy "authenticated users can insert claims"
on public.claims
for insert
to authenticated
with check (
  reported_by = auth.uid()
  and public.can_access_policy(policy_id)
);
