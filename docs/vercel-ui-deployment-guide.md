# Vercel UI Deployment Guide

Use this guide to deploy SmartClaim Pro through the Vercel web dashboard instead of the CLI.

## 1. Before You Start

Make sure all of these are ready first:

- the code is pushed to GitHub
- the target repo is `https://github.com/AI-Kurukshetra/insurity_blueprint`
- the default branch is `main`
- Supabase environment values are available
- the required Supabase SQL files have already been applied

Required SQL order:

1. `supabase/schema.sql`
2. `supabase/claim-insert-policy.sql`
3. `supabase/claim-workflow-policies.sql`
4. `supabase/document-upload-policy.sql`

## 2. Sign In To Vercel

1. Open the Vercel dashboard in your browser.
2. Sign in with your Vercel account.
3. If asked, connect your GitHub account.

## 3. Import The GitHub Repository

1. Click `Add New...`
2. Click `Project`
3. Under GitHub repositories, find:
   - `AI-Kurukshetra/insurity_blueprint`
4. Click `Import`

If the repo is not visible:

- confirm the GitHub account connected to Vercel has access to the repo
- refresh the GitHub integration permissions in Vercel

## 4. Configure The Project

On the import screen, check these settings:

### Framework Preset

Expected value:

- `Next.js`

If Vercel does not auto-detect it:

- manually select `Next.js`

### Root Directory

Expected value:

- repository root

For this project, do not point to a subfolder unless you intentionally moved the app.

### Build And Output Settings

Usually leave defaults for Next.js.

Expected behavior:

- build command should use the default Next.js behavior
- output settings should be auto-managed by Vercel

### Production Branch

Expected value:

- `main`

## 5. Add Environment Variables

In the Vercel project setup, add these environment variables:

### Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Optional

- `SUPABASE_SERVICE_ROLE_KEY`

For the current MVP, `SUPABASE_SERVICE_ROLE_KEY` is not required unless you later add privileged server-side flows.

## 6. Deploy

1. Click `Deploy`
2. Wait for Vercel to finish the build
3. Open the generated deployment URL

Expected result:

- a live Vercel preview or production deployment URL is created

## 7. Post-Deploy Verification

After deployment, test these routes in the live app:

- `/login`
- `/`
- `/policies`
- `/claims`
- `/claims/[claimNumber]`
- `/portal`
- `/broker`
- `/admin`
- `/reset-password`

## 8. What To Verify In The Live App

### Authentication

Check:

- sign in works
- sign-up works if enabled for your Supabase project
- password reset route loads correctly
- logged-out users are redirected to `/login`

### Dashboard

Check:

- dashboard metrics render
- AI triage cards render
- operational timeline renders
- broker highlights render

### Claims Flow

Check:

- claims queue loads
- claim submission works
- document upload works
- claim detail opens
- claim event logging works
- payment history is visible

### Policyholder Portal

Check:

- assigned policy renders
- only assigned claims are visible
- only assigned documents are visible

### Broker Workspace

Check:

- assigned accounts render
- renewal dates render
- open-claim counts render
- unrelated accounts are not visible

### Admin Workspace

Check:

- policy creation works
- policy assignments work
- claim assignments work

## 9. Common Failure Reasons

If deployment succeeds but the app does not behave correctly, check these first.

### Missing Environment Variables

Symptoms:

- live pages fall back unexpectedly
- Supabase-backed features fail

Fix:

- confirm `NEXT_PUBLIC_SUPABASE_URL`
- confirm `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- redeploy after saving env vars

### SQL Not Applied

Symptoms:

- claim insert fails
- claim events fail
- payments fail
- document upload fails

Fix:

- re-run the SQL files in the correct order

### Missing Assignments

Symptoms:

- portal is empty
- broker workspace is empty
- adjuster cannot see claim detail

Fix:

- create required `policy_assignments`
- create required `claim_assignments`

## 10. Recommended Live Test Accounts

Use the same sample users from:

- `docs/features-and-e2e-testing.md`

Recommended roles to test after deployment:

- one `admin`
- one `broker`
- one `policyholder`
- one `adjuster`

## 11. Final Documentation Update

After Vercel deployment is complete, update:

- `docs/credentials-and-deployment.md`

Add:

- Vercel project name
- deployed URL
- deployment date

## 12. Related Docs

- `docs/credentials-and-deployment.md`
- `docs/mvp-readiness-checklist.md`
- `docs/features-and-e2e-testing.md`
