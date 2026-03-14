# Credentials And Deployment

## Credentials Needed

### Needed Soon

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Legacy fallback still supported in code:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Needed Only If We Build Privileged Server Flows

- `SUPABASE_SERVICE_ROLE_KEY`

### Needed Later

- Vercel access or deployment authorization
- GitHub repo details from the hackathon committee

## Authentication Recommendation

Current app expectation:

- email and password auth
- optional email confirmation redirect back to `/login`
- password recovery redirect to `/reset-password`

Important local-development note:

- Supabase hosted email sending is rate-limited
- if confirmation or recovery emails are blocked by limits, disable confirm email for local signup or add custom SMTP

Important access-control note:

- after signup, a user may still see empty portal or broker screens until the account has policy or claim assignments
- the current schema auto-links policyholders and brokers when `profiles.organization_name` matches `policies.holder_name`
- adjuster claim assignments should be added explicitly for production-grade routing
- admins can now manage assignments from the in-app `/admin` screen once the updated RLS SQL is applied
- admin policy creation, claim-event writes, and payment writes require `supabase/claim-workflow-policies.sql`

Document upload note:

- create the storage bucket and upload policies by running `supabase/document-upload-policy.sql`
- uploads use the `claim-documents` bucket and store files under `<claim-id>/<timestamp>-<filename>`
- if uploads fail with a row-level security error, the most likely cause is that this SQL has not been applied yet in the active Supabase project
- for a paste-ready repair script that also verifies the bucket and policies, use `supabase/document-upload-repair.sql`
- if admin upload works but broker upload fails, use `supabase/broker-upload-diagnosis.sql` to verify the broker is assigned to the claim's underlying policy

Optional if already configured:

- Google sign-in
- GitHub sign-in

## Environment Variables

Planned local env file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Current local project status:

- Supabase URL received
- Supabase publishable key received
- Service role key not needed yet

## Repo Details Placeholder

When the hackathon committee provides the repo details, capture them here:

- repository URL:
- repository visibility:
- default branch:
- push instructions:
- any submission branch naming rule:

## Deployment Plan

### Local

- run `npm install`
- run `cmd /c npm run dev`
- verify app builds and core routes work
- use `docs/mvp-readiness-checklist.md` as the final go-live checklist

### Vercel

- connect repo or deploy from local project
- add environment variables
- deploy preview
- verify production URL

## Git Workflow Recommendation

- keep main branch deployable
- commit at major milestones
- avoid large unreviewed changes right before submission

## Notes

- GitHub details are not required to continue local development
- Vercel details are not required until deploy time
- Supabase details are now available for client-side integration
- the final route, SQL, and demo verification checklist lives in `docs/mvp-readiness-checklist.md`
