-- SmartClaim Pro: optional placeholder data
--
-- Run this only if you want example policies, claims, events, payments,
-- and AI triage results in Supabase for testing or demos.
--
-- Recommended order:
-- 1. supabase/schema.sql
-- 2. supabase/claim-insert-policy.sql
-- 3. supabase/claim-workflow-policies.sql
-- 4. supabase/document-upload-policy.sql
-- 5. this file

insert into public.policies (
  policy_number,
  holder_name,
  coverage_summary,
  premium,
  status,
  renewal_date,
  risk_score
)
values
  ('POL-CY-1048', 'Northstar HealthTech', 'Cyber Liability - $2M limit', 145000, 'Monitored', '2026-04-08', 67),
  ('POL-CY-1072', 'Finwell Payroll', 'Tech E&O - $1M limit', 92000, 'Healthy', '2026-05-14', 26),
  ('POL-CY-1089', 'Atlas Commerce Group', 'Cyber Liability - $3M limit', 210000, 'Escalated', '2026-03-29', 88)
on conflict (policy_number) do nothing;

insert into public.claims (
  claim_number,
  policy_id,
  status,
  severity,
  incident_date,
  reserve_amount,
  description
)
select
  'CLM-2209',
  p.id,
  'Urgent',
  'High',
  '2026-03-10',
  118000,
  'Ransomware incident reported through broker. Vendor invoices and outage timeline are attached, but incident report remains incomplete.'
from public.policies p
where p.policy_number = 'POL-CY-1089'
on conflict (claim_number) do nothing;

insert into public.claims (
  claim_number,
  policy_id,
  status,
  severity,
  incident_date,
  reserve_amount,
  description
)
select
  'CLM-2214',
  p.id,
  'Monitor',
  'High',
  '2026-03-11',
  245000,
  'Possible PHI exposure with outside counsel engaged. Regulatory notice cost could rise quickly across multiple states.'
from public.policies p
where p.policy_number = 'POL-CY-1048'
on conflict (claim_number) do nothing;

insert into public.claim_events (
  claim_id,
  event_type,
  notes
)
select
  c.id,
  'Coverage review',
  'Initial coverage review started. Waiting for forensic summary and updated outage timeline.'
from public.claims c
where c.claim_number = 'CLM-2209'
and not exists (
  select 1
  from public.claim_events ce
  where ce.claim_id = c.id
    and ce.event_type = 'Coverage review'
);

insert into public.claim_events (
  claim_id,
  event_type,
  notes
)
select
  c.id,
  'Document request',
  'Requested external counsel notice plan and final breach chronology.'
from public.claims c
where c.claim_number = 'CLM-2214'
and not exists (
  select 1
  from public.claim_events ce
  where ce.claim_id = c.id
    and ce.event_type = 'Document request'
);

insert into public.payments (
  policy_id,
  claim_id,
  amount,
  payment_type,
  status,
  reference_number
)
select
  c.policy_id,
  c.id,
  25000,
  'Advance',
  'Approved',
  'ACH-2026-001'
from public.claims c
where c.claim_number = 'CLM-2209'
and not exists (
  select 1
  from public.payments p
  where p.claim_id = c.id
    and p.reference_number = 'ACH-2026-001'
);

insert into public.ai_triage_results (
  claim_id,
  priority_label,
  confidence_score,
  reason_tags,
  summary
)
select
  c.id,
  'Escalate',
  91,
  array['high severity exposure', 'reserve above fast-track band', 'no uploaded evidence yet'],
  'Claim needs immediate adjuster review because severity, reserve, and missing supporting evidence increase exposure.'
from public.claims c
where c.claim_number = 'CLM-2209'
and not exists (
  select 1
  from public.ai_triage_results atr
  where atr.claim_id = c.id
    and atr.priority_label = 'Escalate'
);
