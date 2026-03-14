# Progress Tracker

## Current Status

Project phase:

- authenticated MVP implemented and being refined

Product direction:

- cyber insurance operations platform
- hackathon-focused scope
- built on Next.js
- wired for Supabase
- prepared for Vercel deployment

## Completed

### Product and planning

- analyzed the PDF blueprint
- narrowed the scope to a hackathon-safe MVP
- documented requirements, architecture, execution plan, credentials, and demo flow

### Project setup

- created the Next.js app scaffold
- installed Supabase client
- added environment variable setup
- added project documentation under `docs/`

### UI and routes

- implemented dashboard
- implemented policies route
- implemented claims route
- implemented claim detail route
- implemented policyholder portal route
- implemented broker route
- implemented login route
- implemented reset-password route
- implemented admin route
- added shared page shell and navigation

### Supabase integration

- added Supabase client config
- wired local environment values
- added live read support for policies with fallback seeded data
- added live read support for claims with fallback seeded data
- added live claim detail loader for claim, document, and event data
- added payment history loading on claim detail
- added live read support for portal, broker, document, and assignment views
- added starter SQL schema in `supabase/schema.sql`
- added incremental SQL for authenticated claim inserts in `supabase/claim-insert-policy.sql`
- added incremental SQL for admin policy creation, claim-event inserts, and payment writes in `supabase/claim-workflow-policies.sql`
- added incremental SQL for document uploads and Storage access in `supabase/document-upload-policy.sql`

### Authentication

- implemented email-password sign-in
- implemented email-password sign-up
- implemented password reset request flow
- implemented reset-password completion flow
- implemented profile creation and sync via Supabase profile helpers and database trigger
- implemented role-based redirects and protected routes
- added app-wide auth provider
- added session-aware header status
- added sign-out action
- protected `/`
- protected `/policies`
- protected `/claims`
- protected `/portal`
- protected `/broker`
- protected `/admin`

### UX polish

- improved typography and visual hierarchy
- replaced seeded home dashboard summaries with live-backed metrics, timeline activity, and broker highlights
- improved portal, broker, and admin empty states for missing assignments or setup prerequisites
- verified the app still builds cleanly

### Claims workflow

- added authenticated claim submission form
- linked new claims to live policy records
- improved live claims board to show related policy context
- replaced hardcoded AI triage cards with live-derived recommendations backed by claim, document, and event data
- added claim detail drill-down route
- added claim event logging UI and timeline
- added payment history and admin payment entry on claim detail
- added document upload to Supabase Storage
- added recent uploaded-document list for accessible claims

### Access control and administration

- added admin policy-creation UI
- added explicit `policy_assignments` and `claim_assignments` model
- added admin assignment manager UI
- added profile-to-policy auto-linking triggers based on organization name
- tightened route access around role-aware workspaces
- tightened portal and broker data loaders so they read assigned records directly
- improved document upload error handling and cleanup when metadata insert fails
- added a dedicated Supabase SQL repair script for document upload bucket and policy recovery

### Verification completed

- `cmd /c npm run lint`
- `cmd /c npm run build`

## In Progress

- maintain and extend authenticated MVP flows
- reduce remaining seeded fallbacks where useful
- prepare deployment and demo readiness artifacts
- keep docs synchronized with implementation changes

## Pending High Priority

### Product functionality

- add AI triage persistence plus an audit trail so recommendations are not recomputed only in the UI

### Auth and data model

- tighten row-level security beyond demo read access where needed
- verify assignment flows against production-like Supabase data

### Demo readiness

- more realistic seeded or live records
- final submission polish, deployment, and demo rehearsal

## Pending Medium Priority

- policy detail page
- admin workflow should expose clearer success and failure feedback around assignments, policy creation, and payment logging where useful
- add route-level smoke-test coverage or a short verification checklist for auth, claims, documents, and payments

## Pending Low Priority

- advanced analytics
- broker-specific filtering
- multi-role onboarding polish

## Waiting On User

- hackathon committee GitHub repo details
- Vercel deployment details or deployment authorization when ready

## Suggested Next Task

- validate the latest Supabase SQL set in a production-like project and confirm assignment flows with real broker and policyholder users
- update deployment notes, then run final lint/build and prepare for Vercel deployment when repo access is available

## Immediate Next Tasks

1. Validate the latest Supabase SQL in the target project and test assignment flows with real broker, policyholder, and admin accounts.
2. Add AI triage persistence and audit history if the `ai_triage_results` table should become the source of record instead of derived UI-only recommendations.
3. Finish deployment readiness by validating environment variables, refreshing docs, and rerunning `cmd /c npm run lint` plus `cmd /c npm run build` before Vercel deployment.
4. Record final repo URL and deployed URL in `docs/credentials-and-deployment.md` once deployment is complete.
