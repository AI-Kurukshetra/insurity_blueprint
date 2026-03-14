# MVP Readiness Checklist

Use this as the final pre-deploy and pre-demo checklist for SmartClaim Pro.

## 1. Environment

- Confirm `.env.local` contains:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Leave `SUPABASE_SERVICE_ROLE_KEY` empty unless a new privileged server flow is introduced.
- Verify local app boot:
  - `cmd /c npm run dev`

## 2. Supabase SQL

Apply these in order for the active Supabase project:

1. `supabase/schema.sql`
2. `supabase/claim-insert-policy.sql`
3. `supabase/claim-workflow-policies.sql`
4. `supabase/document-upload-policy.sql`

Use only if needed:

- `supabase/document-upload-repair.sql`
- `supabase/broker-upload-diagnosis.sql`

Expected outcome:

- auth works
- assigned policies and claims are visible
- claim events can be written
- admin payments can be written
- document upload works for allowed users

## 3. Account Setup

Prepare at least these users in Supabase Auth:

- `admin`
- `broker`
- `policyholder`
- `adjuster`

For clean demo behavior:

- ensure the broker has at least one `policy_assignments` row
- ensure the policyholder has at least one `policy_assignments` row
- ensure the adjuster has at least one `claim_assignments` row or is the claim reporter
- ensure at least one claim has:
  - uploaded document(s)
  - claim event(s)
  - optional payment record

## 4. Route Smoke Test

Validate these routes with real assigned accounts:

- `/login`
- `/`
- `/policies`
- `/claims`
- `/claims/[claimNumber]`
- `/portal`
- `/broker`
- `/admin`
- `/reset-password`

Expected behavior:

- unauthenticated access redirects to `/login`
- dashboard shows live metrics and AI triage
- claims page shows live queue, submission, uploads, and triage
- claim detail shows timeline, documents, and payments
- portal shows only assigned policy, claims, and documents
- broker shows only assigned book data
- admin can create policies and assignments

## 5. Build Verification

Run:

- `cmd /c npm run lint`
- `cmd /c npm run build`

Do not deploy if either command fails.

## 6. Vercel Deploy

Before deploy:

- confirm repo target and branch
- confirm Vercel project access
- add the same environment variables used locally

After deploy:

- open production URL
- repeat the route smoke test with at least admin and one non-admin user
- verify login, protected redirects, claim detail, and document visibility

## 7. Demo Data Quality

Before the demo:

- make sure at least one high-severity claim exists
- make sure AI triage has visible reasons
- make sure one assigned policyholder account has a populated portal
- make sure one broker account has visible renewals or open claims
- avoid blank screens on the primary demo path

## 8. Submission Closeout

- update `docs/progress-tracker.md` if scope changes again
- update `README.md` if setup or scope changes again
- record final repo URL and deploy URL in `docs/credentials-and-deployment.md`
- keep one short demo path and do not improvise beyond tested flows
