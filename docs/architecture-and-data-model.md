# Architecture And Data Model

## Stack

- Next.js App Router for UI and route structure
- Supabase Postgres for app data
- Supabase Auth for user access
- Supabase SSR for cookie-backed sessions and server-side redirects
- Supabase Storage for claim and policy documents
- Vercel for deployment

## Suggested Frontend Structure

```text
src/
  app/
    page.tsx
    admin/
    broker/
    claims/
    login/
    policies/
    portal/
    reset-password/
  components/
    admin/
    auth/
    claims/
    policies/
    navigation.tsx
    page-shell.tsx
  lib/
    auth.ts
    auth-server.ts
    live-data.ts
    sample-data.ts
    supabase.ts
    supabase-server.ts
    supabase-middleware.ts
```

## Recommended MVP Pages

### Dashboard

Purpose:
Unified operational overview with KPIs, recent claims, policy counts, payment status, and AI triage highlights.

### Policies

Purpose:
List of policies with holder, premium, renewal, risk score, and status.

### Claims

Purpose:
Claims queue with status, severity, documents, reserve amount, and AI triage recommendation.
Also includes claim detail drill-down with event timeline and linked evidence.
Claim detail now also exposes payment history for the selected record.

### Portal

Purpose:
Policyholder-friendly view for coverage, claim submission status, and documents.

### Broker

Purpose:
Broker or agent view for client policies, upcoming renewals, and claim summaries.

### Login

Purpose:
Email-password sign-in and sign-up with a linked Supabase profile for role-aware access.

### Admin

Purpose:
Manage policy creation plus policy and claim assignments so access can be controlled without using raw SQL.

### Reset Password

Purpose:
Complete the Supabase password recovery flow inside the app.

## Core Supabase Tables

### `profiles`

Use:
Map authenticated users to roles.

Suggested columns:

- `id`
- `email`
- `full_name`
- `role`
- `organization_name`
- `created_at`

### `policies`

Suggested columns:

- `id`
- `policy_number`
- `holder_name`
- `line_of_business`
- `coverage_summary`
- `premium`
- `status`
- `renewal_date`
- `risk_score`
- `created_at`

### `claims`

Suggested columns:

- `id`
- `claim_number`
- `policy_id`
- `reported_by`
- `status`
- `severity`
- `incident_date`
- `reserve_amount`
- `description`
- `created_at`

### `claim_events`

Suggested columns:

- `id`
- `claim_id`
- `event_type`
- `notes`
- `created_by`
- `created_at`

### `documents`

Suggested columns:

- `id`
- `claim_id`
- `policy_id`
- `file_name`
- `bucket_path`
- `document_type`
- `uploaded_by`
- `created_at`

### `payments`

Suggested columns:

- `id`
- `policy_id`
- `claim_id`
- `amount`
- `payment_type`
- `status`
- `reference_number`
- `created_at`

### `ai_triage_results`

Suggested columns:

- `id`
- `claim_id`
- `priority_label`
- `confidence_score`
- `reason_tags`
- `summary`
- `created_at`

## Recommended Roles

- `policyholder`
- `broker`
- `adjuster`
- `admin`

## Explicit Assignment Tables

### `policy_assignments`

Use:
Bind policyholders and brokers to the specific policies they may access.

Suggested columns:

- `id`
- `policy_id`
- `profile_id`
- `assignment_role`
- `provisioning_source`
- `created_at`

### `claim_assignments`

Use:
Bind adjusters or privileged users to specific claims beyond simple reporter access.

Suggested columns:

- `id`
- `claim_id`
- `profile_id`
- `assignment_role`
- `provisioning_source`
- `created_at`

## Row-Level Security Direction

Current approach:

- policyholders can only view policies linked through `policy_assignments`
- brokers can only view client accounts linked through `policy_assignments`
- adjusters can only view claims linked through `claim_assignments` or claims they reported
- admins can view all records

## API Or Server Action Groups

- auth
- policies
- claims
- documents
- payments
- reports
- ai-triage

## Current Data Access Pattern

- `src/lib/live-data.ts` is the main server-side data loading layer
- when Supabase is not configured, the UI falls back to seeded records from `src/lib/sample-data.ts`
- when Supabase is configured, reads rely on RLS plus explicit assignment tables
- AI triage cards are currently derived server-side from live claim, document, and claim-event records
- home dashboard metrics, timeline, and broker-highlight cards are also derived server-side from live Supabase data
- portal and broker workspaces now use explicit assignment-scoped loaders instead of broad shared list reads
- writes for claim creation, claim-event creation, document upload, and assignment management run from client components against Supabase directly

## Important Implementation Note

For the hackathon, it is acceptable to start with seeded mock data and then swap high-value flows to Supabase progressively. Do not block UI progress on full backend completion.

## Starter Schema

Use `supabase/schema.sql` as the first SQL pass in the Supabase SQL editor. It creates the main tables, adds demo read policies, and seeds a small set of policy and claim data.

Additional incremental SQL:

- `supabase/claim-insert-policy.sql` for authenticated claim inserts
- `supabase/claim-workflow-policies.sql` for admin policy creation, claim-event inserts, and payment inserts
- `supabase/document-upload-policy.sql` for document records and Storage access
