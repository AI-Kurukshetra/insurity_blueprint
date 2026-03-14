# SmartClaim Pro

Hackathon-oriented cyber insurance operations platform built with `Next.js`, prepared for `Supabase`, and intended for `Vercel` deployment.

## Current MVP

- role-aware dashboard with policy, claims, and broker summaries
- live-backed dashboard summaries for metrics, operational timeline, and broker highlights
- claims operations board with live-derived AI triage recommendations
- claim detail pages with timeline and evidence context
- authenticated claim submission workflow
- document upload to Supabase Storage with recent evidence list
- policy portfolio view
- policyholder portal view
- broker or agent workspace
- email-password authentication with Supabase profiles
- password reset and recovery flow
- admin policy creation plus policy and claim assignment management
- documentation set under `docs/`

## Why this scope

The original PDF describes a wide enterprise P&C platform. For a 7-hour build, this repo narrows the product to a cyber insurance MVP that still maps directly to the brief:

- policy management
- claims intake and workflow
- document and payment visibility
- customer self-service
- broker dashboard
- one explainable AI workflow

## Run locally

```bash
npm install
cmd /c npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values when available.

Required for Supabase integration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Optional for privileged server-side flows:

- `SUPABASE_SERVICE_ROLE_KEY`

Starter SQL schema:

- `supabase/schema.sql`
- `supabase/claim-insert-policy.sql`
- `supabase/claim-workflow-policies.sql`
- `supabase/document-upload-policy.sql`
- `supabase/document-upload-repair.sql`
- `supabase/broker-upload-diagnosis.sql`

Important:
If claim creation or document upload fails with a row-level security error, re-run the
incremental SQL files above in the Supabase SQL editor for the current project.
Admin policy creation and claim-event writes also require
`supabase/claim-workflow-policies.sql`, which now also enables admin payment writes.

## Authentication flow

- sign in or sign up at `/login`
- sign-up stores role metadata and creates a `profiles` row in Supabase
- portal and broker access now rely on explicit assignment records, not just role names
- portal and broker pages now query assigned records directly for claims, policies, and documents
- users can request a password reset from `/login`
- recovery links land on `/reset-password` for in-app password update
- Supabase SSR cookies are refreshed in `middleware.ts`
- protected routes also redirect server-side before rendering
- protected routes redirect unauthenticated users back to `/login`
- claims, portal, and broker pages enforce role-based access

## Assignment model

- `policy_assignments` links users to policies for policyholder and broker access
- `claim_assignments` links adjusters or admins to specific claims when needed
- profile and policy triggers auto-create policy assignments when `organization_name` matches `holder_name`
- once Supabase is configured, pages now prefer assigned live data over demo fallbacks
- admins can manage assignments from `/admin`
- `/portal` now shows accessible live claims and uploaded evidence in addition to policy summary
- empty states now explain when assignments or setup prerequisites are missing

## Project context

See the docs folder:

- `docs/product-requirements.md`
- `docs/execution-plan.md`
- `docs/architecture-and-data-model.md`
- `docs/credentials-and-deployment.md`
- `docs/features-and-e2e-testing.md`
- `docs/demo-script.md`
- `docs/progress-tracker.md`

## Documentation maintenance

When changing product behavior, data flows, routes, or setup instructions, update the
relevant docs in `docs/` and this README in the same change.

## Verification

- `cmd /c npm run lint`
- `cmd /c npm run build`
