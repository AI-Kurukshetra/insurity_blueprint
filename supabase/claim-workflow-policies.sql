-- SmartClaim Pro: admin workflow and claim-event write policies
--
-- Paste this into the Supabase SQL editor for the active project after
-- `supabase/schema.sql`.

drop policy if exists "admins can manage policies" on public.policies;
create policy "admins can manage policies"
on public.policies
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "assigned users can insert claim events" on public.claim_events;
create policy "assigned users can insert claim events"
on public.claim_events
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.can_access_claim(claim_id)
);

drop policy if exists "admins can manage payments" on public.payments;
create policy "admins can manage payments"
on public.payments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
