-- SmartClaim Pro: broker document-upload diagnosis
--
-- Replace the placeholder values below before running this in the Supabase SQL editor.
-- This helps verify whether the broker actually has access to the policy and claim
-- behind the document upload target.

with broker_user as (
  select id, email, role, organization_name
  from public.profiles
  where email = 'broker@example.com'
),
target_claim as (
  select
    c.id,
    c.claim_number,
    c.policy_id,
    p.policy_number,
    p.holder_name
  from public.claims c
  left join public.policies p on p.id = c.policy_id
  where c.claim_number = 'CLM-2209'
)
select
  bu.email as broker_email,
  bu.role as broker_role,
  bu.organization_name,
  tc.claim_number,
  tc.policy_number,
  tc.holder_name,
  pa.assignment_role as policy_assignment_role,
  pa.provisioning_source as policy_assignment_source,
  ca.assignment_role as claim_assignment_role,
  ca.provisioning_source as claim_assignment_source
from broker_user bu
cross join target_claim tc
left join public.policy_assignments pa
  on pa.profile_id = bu.id
 and pa.policy_id = tc.policy_id
left join public.claim_assignments ca
  on ca.profile_id = bu.id
 and ca.claim_id = tc.id;

-- Optional helper: see all policy assignments for the broker.
select
  pr.email,
  pr.role,
  p.policy_number,
  p.holder_name,
  pa.assignment_role,
  pa.provisioning_source
from public.policy_assignments pa
join public.profiles pr on pr.id = pa.profile_id
join public.policies p on p.id = pa.policy_id
where pr.email = 'broker@example.com'
order by p.created_at desc;
