# Credentials And Deployment

## Credentials Needed

### Needed Soon

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Needed Only If We Build Privileged Server Flows

- `SUPABASE_SERVICE_ROLE_KEY`

### Needed Later

- Vercel access or deployment authorization

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

Optional placeholder-data note:

- the app no longer ships with bundled dummy runtime records
- if you want placeholder records for testing, run `supabase/optional-demo-seed.sql` manually in Supabase after the main SQL files

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

## Repo Details

- repository URL: `https://github.com/AI-Kurukshetra/insurity_blueprint`
- repository visibility: GitHub-hosted repository
- default branch: `main`
- current push target: `origin/main`
- latest MVP push: commit `6eb3701` with message `Complete SmartClaim Pro MVP`

## Deployment Plan

### Local

- run `npm install`
- run `cmd /c npm run dev`
- verify app builds and core routes work
- use `docs/mvp-readiness-checklist.md` as the final go-live checklist

### Vercel

1. Sign in to Vercel and create or open the target project.
2. Import the GitHub repository `AI-Kurukshetra/insurity_blueprint`.
3. Confirm the production branch is `main`.
4. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Leave `SUPABASE_SERVICE_ROLE_KEY` empty unless a new privileged server-side flow is added.
6. Trigger the first deployment.
7. Open the deployed URL and run the route smoke test from `docs/mvp-readiness-checklist.md`.

For the full click-by-click UI flow, use `docs/vercel-ui-deployment-guide.md`.

### Vercel Preparation Checklist

Before clicking deploy, confirm all of these:

- the latest Supabase SQL files have been applied in the target project
- the four test users exist
- broker and policyholder assignments exist
- at least one claim has documents and timeline data
- `cmd /c npm run lint` passes locally
- `cmd /c npm run build` passes locally
- the repo on GitHub matches the latest local MVP state

### After Deployment

- record the Vercel project name
- record the production URL
- verify `/login`, `/`, `/claims`, `/portal`, `/broker`, and `/admin`
- verify one admin flow and one non-admin flow on the live deployment
- update this file with the final deployed URL

## Git Workflow Recommendation

- keep main branch deployable
- commit at major milestones
- avoid large unreviewed changes right before submission

## Notes

- Vercel details are not required until deploy time
- Supabase details are now available for client-side integration
- the final route, SQL, and demo verification checklist lives in `docs/mvp-readiness-checklist.md`
