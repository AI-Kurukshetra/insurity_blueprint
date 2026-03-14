# Features And Detailed E2E Testing

This document explains the current SmartClaim Pro MVP in detail and provides a practical end-to-end manual testing guide with example data and expected results.

## 1. What This Project Does

SmartClaim Pro is a cyber insurance operations MVP that supports four main user groups:

- `admin`
- `broker`
- `policyholder`
- `adjuster`

The product covers these workflows:

- authentication and password recovery
- live dashboard for operational visibility
- policy portfolio review
- claim submission and claims queue
- claim detail timeline, evidence, and payments
- policyholder self-service portal
- broker workspace
- admin policy creation and assignment management
- explainable AI triage derived from live claim data

## 2. Main Routes And Purpose

### `/login`

Used for:

- sign in
- create account
- request password reset

### `/reset-password`

Used for:

- complete password reset from Supabase recovery link

### `/`

Used for:

- dashboard metrics
- live operational timeline
- AI triage overview
- broker account highlights

### `/policies`

Used for:

- view accessible policies

### `/claims`

Used for:

- submit new claim
- upload claim evidence
- view claims queue
- view AI triage panel

### `/claims/[claimNumber]`

Used for:

- view one claim in detail
- add claim events
- review documents
- review payments
- add payments as admin

### `/portal`

Used for:

- policyholder self-service
- assigned policy summary
- assigned claims
- assigned uploaded documents

### `/broker`

Used for:

- broker book view
- assigned accounts
- renewal and open-claim view

### `/admin`

Used for:

- create policies
- create and remove policy assignments
- create and remove claim assignments

## 3. Required SQL Setup Order

Run these files in this exact order in the target Supabase project:

1. [supabase/schema.sql](/D:/Projects/smartclaim-pro/supabase/schema.sql)
2. [supabase/claim-insert-policy.sql](/D:/Projects/smartclaim-pro/supabase/claim-insert-policy.sql)
3. [supabase/claim-workflow-policies.sql](/D:/Projects/smartclaim-pro/supabase/claim-workflow-policies.sql)
4. [supabase/document-upload-policy.sql](/D:/Projects/smartclaim-pro/supabase/document-upload-policy.sql)

Only if something is broken:

- [supabase/document-upload-repair.sql](/D:/Projects/smartclaim-pro/supabase/document-upload-repair.sql)
- [supabase/broker-upload-diagnosis.sql](/D:/Projects/smartclaim-pro/supabase/broker-upload-diagnosis.sql)

Optional if you want placeholder live data in Supabase:

- [supabase/optional-demo-seed.sql](/D:/Projects/smartclaim-pro/supabase/optional-demo-seed.sql)

## 4. Required Environment Variables

Your `.env.local` should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=
```

For the current MVP, `SUPABASE_SERVICE_ROLE_KEY` is optional and can stay empty.

## 5. Recommended Test Data Pack

Use these exact example users and records so testing is repeatable.

## 5.1 Test Users

Create these users through `/login` using the Create account flow, or create them in Supabase Auth and let the app sync the profile.

| Persona | Full name | Organization | Role | Email | Password | Expected landing route |
| --- | --- | --- | --- | --- | --- | --- |
| Admin | Avery Admin | SmartClaim HQ | `admin` | `avery.admin@smartclaim.test` | `TestPass123!` | `/` |
| Broker | Maya Broker | Atlas Commerce Group | `broker` | `maya.broker@smartclaim.test` | `TestPass123!` | `/broker` |
| Policyholder | Nina Policyholder | Atlas Commerce Group | `policyholder` | `nina.policyholder@smartclaim.test` | `TestPass123!` | `/portal` |
| Adjuster | Ethan Adjuster | SmartClaim HQ | `adjuster` | `ethan.adjuster@smartclaim.test` | `TestPass123!` | `/claims` |

Important:

- broker and policyholder auto-linking depends on `organization_name` matching a policy `holder_name`
- the adjuster usually needs an explicit claim assignment unless they reported the claim

## 5.2 Example Policy To Create

Create this from `/admin`.

| Field | Example value |
| --- | --- |
| Policy number | `POL-CY-3001` |
| Holder name | `Atlas Commerce Group` |
| Coverage summary | `Cyber Liability - $2.5M limit with incident response coverage` |
| Premium | `175000` |
| Status | `Active` |
| Renewal date | `2026-09-30` |
| Risk score | `72` |

Expected result after submit:

- success banner: `Policy created. It is now available for assignment after refresh.`

## 5.3 Example Assignments To Create

Create these from `/admin`.

### Policy assignment for broker

| Field | Example value |
| --- | --- |
| User | `Maya Broker (broker)` |
| Policy | `POL-CY-3001 - Atlas Commerce Group` |
| Assignment role | `broker` |

Expected result:

- success banner: `Policy assignment created.`

### Policy assignment for policyholder

| Field | Example value |
| --- | --- |
| User | `Nina Policyholder (policyholder)` |
| Policy | `POL-CY-3001 - Atlas Commerce Group` |
| Assignment role | `policyholder` |

Expected result:

- success banner: `Policy assignment created.`

### Claim assignment for adjuster

Use this after at least one claim exists.

| Field | Example value |
| --- | --- |
| User | `Ethan Adjuster (adjuster)` |
| Claim | choose the new claim created in testing |
| Assignment role | `adjuster` |

Expected result:

- success banner: `Claim assignment created.`

## 5.4 Example Claim To Create

Create this from `/claims`.

| Field | Example value |
| --- | --- |
| Policy | `POL-CY-3001 - Atlas Commerce Group` |
| Severity | `High` |
| Incident date | `2026-03-14` |
| Initial reserve amount | `125000` |
| Loss narrative | `Ransomware activity was detected in a production finance environment. Three servers were isolated, invoice processing was interrupted, and outside forensic review has been requested. Initial evidence includes outage notes and endpoint screenshots.` |

Expected result after submit:

- success banner pattern: `Claim CLM-XXXXXX created successfully.`
- the generated claim number starts with `CLM-`
- the claim appears in the live claims queue

## 5.5 Example Document To Upload

Upload from `/claims`.

Suggested test file names:

- `incident-report-atlas.txt`
- `forensic-summary-atlas.pdf`
- `invoice-atlas.pdf`

Recommended first upload:

| Field | Example value |
| --- | --- |
| Claim | choose the newly created Atlas claim |
| Document type | `Incident report` |
| File | `incident-report-atlas.txt` |

Expected result:

- success banner: `Uploaded incident-report-atlas.txt successfully.`
- file appears in recent documents
- file appears on claim detail page under Documents

## 5.6 Example Claim Event To Add

Add from `/claims/[claimNumber]`.

| Field | Example value |
| --- | --- |
| Event type | `Coverage review` |
| Notes | `Initial coverage review started. Waiting for forensic summary and confirmation of business interruption duration.` |

Expected result:

- success banner: `Timeline event added to <claimNumber>.`
- event appears in the timeline list

## 5.7 Example Payment Record To Add

Add from `/claims/[claimNumber]` while signed in as admin.

| Field | Example value |
| --- | --- |
| Amount | `25000` |
| Payment type | `Advance` |
| Status | `Approved` |
| Reference number | `ACH-2026-001` |

Expected result:

- success banner: `Payment record added to <claimNumber>.`
- payment appears in the Payments section on claim detail

## 6. Field-By-Field Testing Reference

This section explains every important user-facing field in the MVP.

## 6.1 `/login` Sign In Form

### Email address

Purpose:

- identifies the existing user account

Example:

- `avery.admin@smartclaim.test`

Expected behavior:

- must be a valid email format
- if password is correct, user signs in

Expected success result:

- banner: `Sign-in successful. Redirecting to your workspace.`

Expected failure result:

- banner: `Email or password is incorrect.`

### Password

Purpose:

- authenticates the user account

Example:

- `TestPass123!`

Expected behavior:

- required field
- must match the user account password

## 6.2 `/login` Create Account Form

### Full name

Purpose:

- stored in `profiles.full_name`
- displayed in admin assignment labels and ownership text

Example:

- `Maya Broker`

### Organization

Purpose:

- stored in `profiles.organization_name`
- used for policy auto-linking when it matches `policies.holder_name`

Example:

- `Atlas Commerce Group`

Expected behavior:

- if it matches a policy holder name, broker or policyholder access may auto-link after SQL triggers run

### Role

Purpose:

- determines workspace access and default landing page

Allowed values:

- `policyholder`
- `broker`
- `adjuster`
- `admin`

Expected behavior:

- `policyholder` lands on `/portal`
- `broker` lands on `/broker`
- `adjuster` lands on `/claims`
- `admin` lands on `/`

### Email address

Purpose:

- account identity for Supabase Auth

Example:

- `nina.policyholder@smartclaim.test`

### Password

Purpose:

- initial account password

Expected behavior:

- minimum 8 characters

Example:

- `TestPass123!`

### Confirm password

Purpose:

- confirms password entry

Expected failure result if mismatched:

- banner: `Password confirmation does not match.`

Expected success result:

- either:
  - `Account created. Redirecting to your workspace.`
- or, if email confirmation is enabled:
  - `Account created. Check your email to confirm the address, then sign in.`

## 6.3 `/login` Reset Password Request Form

### Email address

Purpose:

- sends Supabase recovery email

Example:

- `ethan.adjuster@smartclaim.test`

Expected success result:

- banner: `Password reset email sent. Open the link to choose a new password.`

## 6.4 `/reset-password` Form

### New password

Purpose:

- sets the replacement password for the recovery session

Expected behavior:

- minimum 8 characters

### Confirm password

Purpose:

- confirms the new password

Expected failure result if mismatched:

- banner: `Password confirmation does not match.`

Expected success result:

- banner: `Password updated. Redirecting to sign-in.`
- user is redirected to `/login`

## 6.5 `/admin` Policy Creation Form

### Policy number

Purpose:

- unique public policy identifier

Example:

- `POL-CY-3001`

### Holder name

Purpose:

- business or insured entity name
- also used for profile auto-linking when organization names match

Example:

- `Atlas Commerce Group`

### Coverage summary

Purpose:

- short readable description shown in portfolio and claim context

Example:

- `Cyber Liability - $2.5M limit with incident response coverage`

### Premium

Purpose:

- annual or policy premium amount

Example:

- `175000`

### Status

Purpose:

- current policy state

Allowed examples:

- `Active`
- `Monitored`
- `Healthy`
- `Escalated`
- `Cancelled`

### Renewal date

Purpose:

- used in portfolio and broker-facing renewal visibility

Example:

- `2026-09-30`

### Risk score

Purpose:

- numeric risk indicator used in tone and account health logic

Expected range:

- `0` to `100`

Example:

- `72`

## 6.6 `/admin` Policy Assignment Form

### User

Purpose:

- broker or policyholder receiving access

Expected values:

- a user with role `broker`
- a user with role `policyholder`

### Policy

Purpose:

- policy being granted to that user

### Assignment role

Purpose:

- records whether access is for broker or policyholder behavior

Expected values:

- `policyholder`
- `broker`

## 6.7 `/admin` Claim Assignment Form

### User

Purpose:

- adjuster or admin receiving claim access

Expected values:

- a user with role `adjuster`
- a user with role `admin`

### Claim

Purpose:

- specific claim being assigned

### Assignment role

Purpose:

- stored role for the assignment row

Expected values:

- `adjuster`
- `admin`

## 6.8 `/claims` Claim Submission Form

### Policy

Purpose:

- links the new claim to an existing policy

Expected behavior:

- dropdown only shows accessible live policies

### Severity

Purpose:

- initial severity level used in queue and AI triage

Allowed values:

- `Low`
- `Medium`
- `High`

### Incident date

Purpose:

- date the insured incident occurred

Example:

- `2026-03-14`

### Initial reserve amount

Purpose:

- starting financial reserve for the claim

Example:

- `125000`

### Loss narrative

Purpose:

- description used in claim queue, detail view, and AI triage reasoning

Example:

- `Ransomware activity was detected in a production finance environment...`

Expected success result:

- banner pattern: `Claim CLM-XXXXXX created successfully.`

## 6.9 `/claims` Document Upload Form

### Claim

Purpose:

- claim that will receive the uploaded document

Expected behavior:

- only accessible claims are shown

### Document type

Purpose:

- categorizes the uploaded file

Allowed values:

- `incident-report`
- `invoice`
- `forensic-report`
- `legal-notice`
- `supporting-evidence`

### File

Purpose:

- actual uploaded evidence file stored in Supabase Storage

Recommended examples:

- `incident-report-atlas.txt`
- `forensic-summary-atlas.pdf`

Expected success result:

- banner pattern: `Uploaded <filename> successfully.`

## 6.10 `/claims/[claimNumber]` Claim Event Form

### Event type

Purpose:

- categorizes the operational timeline entry

Allowed values:

- `Coverage review`
- `Document request`
- `Adjuster note`
- `Reserve update`
- `Payment review`

### Notes

Purpose:

- human-readable explanation of what changed or what is blocked

Example:

- `Initial coverage review started. Waiting for forensic summary and confirmation of business interruption duration.`

Expected success result:

- banner pattern: `Timeline event added to <claimNumber>.`

## 6.11 `/claims/[claimNumber]` Payment Entry Form

Only visible to admins.

### Amount

Purpose:

- payment amount to log against the claim

Example:

- `25000`

### Payment type

Purpose:

- categorizes the payment

Allowed values:

- `Advance`
- `Reimbursement`
- `Vendor payment`
- `Settlement`

### Status

Purpose:

- payment workflow state

Allowed values:

- `Pending`
- `Approved`
- `Completed`
- `Blocked`

### Reference number

Purpose:

- external financial reference or internal tracking code

Example:

- `ACH-2026-001`

Expected success result:

- banner pattern: `Payment record added to <claimNumber>.`

## 7. Full Manual E2E Testing Flow

Follow these steps in order for a full MVP validation.

## 7.1 Step A: Start The App

Run:

```bash
cmd /c npm run dev
```

Expected result:

- app opens on `http://localhost:3000`

## 7.2 Step B: Create Or Confirm Users

Open `/login` and create the four test users from section 5.1 if they do not already exist.

Expected results:

- admin lands on `/`
- broker lands on `/broker`
- policyholder lands on `/portal`
- adjuster lands on `/claims`

Result examples:

- `Sign-in successful. Redirecting to your workspace.`
- `Account created. Redirecting to your workspace.`

## 7.3 Step C: Admin Creates Policy

Sign in as admin and open `/admin`.

Populate the policy form with the example values from section 5.2.

Expected results:

- success banner: `Policy created. It is now available for assignment after refresh.`
- the new policy appears in the policy dropdown for assignment after refresh

## 7.4 Step D: Admin Creates Assignments

Still on `/admin`, create:

1. broker policy assignment
2. policyholder policy assignment

After the claim exists, create:

3. adjuster claim assignment

Expected results:

- `Policy assignment created.`
- `Claim assignment created.`

If you remove one assignment to test delete:

- `Policy assignment removed.`
- `Claim assignment removed.`

## 7.5 Step E: Adjuster Or Admin Creates Claim

Sign in as adjuster or admin and open `/claims`.

Populate the claim form with the example values from section 5.4.

Expected results:

- success banner pattern: `Claim CLM-XXXXXX created successfully.`
- new claim appears in queue
- claim card includes:
  - holder name
  - description summary
  - reserve amount
  - stage text with incident date

## 7.6 Step F: Upload Evidence

Still on `/claims`, use the document upload form and the example values from section 5.5.

Expected results:

- success banner: `Uploaded incident-report-atlas.txt successfully.`
- file appears in Recent Documents
- file appears later in claim detail Documents section

## 7.7 Step G: Open Claim Detail And Add Event

Open the newly created claim detail page from the claims queue.

Add the example event from section 5.6.

Expected results:

- success banner pattern: `Timeline event added to <claimNumber>.`
- timeline count increases
- the new event appears with:
  - event type
  - notes
  - created timestamp

## 7.8 Step H: Admin Adds Payment

Sign in as admin if needed and open the same claim detail page.

Add the payment example from section 5.7.

Expected results:

- success banner pattern: `Payment record added to <claimNumber>.`
- payment appears in the Payments section
- non-admin users should not see the payment-entry form

## 7.9 Step I: Validate Dashboard

Sign in as admin and open `/`.

Expected results:

- dashboard metrics render
- AI triage panel renders
- timeline renders
- broker account highlights render

Result examples:

- dashboard shows policy count above zero
- open claims above zero
- AI triage cards contain labels like `Escalate`, `Monitor`, or `Approve path`
- AI triage reasons appear as pill tags on `/claims`

## 7.10 Step J: Validate Policyholder Portal

Sign in as policyholder and open `/portal`.

Expected results:

- assigned policy summary is visible
- claims section only shows claims for assigned policy
- documents section only shows documents tied to assigned policy/claims

Concrete example using the manually created or optionally seeded data:

- holder should reflect `Atlas Commerce Group`
- at least one claim should be visible after claim creation
- uploaded `incident-report-atlas.txt` should be visible after upload

## 7.11 Step K: Validate Broker Workspace

Sign in as broker and open `/broker`.

Expected results:

- assigned account `Atlas Commerce Group` is visible
- renewal date is visible
- open-claim count reflects created claim
- broker should not see unrelated accounts unless separately assigned

## 7.12 Step L: Validate Route Protection

Sign out and try opening:

- `/`
- `/claims`
- `/portal`
- `/broker`
- `/admin`

Expected result:

- user is redirected to `/login`

Then sign in as policyholder and try opening `/admin`.

Expected result:

- user is redirected away from `/admin`

## 8. Expected Failure Cases To Verify

These are useful sanity checks.

### Wrong sign-in password

Expected result:

- `Email or password is incorrect.`

### Create account with mismatched confirm password

Expected result:

- `Password confirmation does not match.`

### Upload document without choosing file

Expected result:

- `Choose a file before uploading.`

### Claim event write without proper SQL

Expected result:

- message mentioning `supabase/claim-workflow-policies.sql`

### Payment insert without proper SQL

Expected result:

- message mentioning `supabase/claim-workflow-policies.sql`

### Document upload RLS issue

Expected result:

- message mentioning `supabase/document-upload-policy.sql`

## 9. Pass Criteria

The MVP passes manual E2E testing if all of these are true:

- all four roles can sign in
- admin can create policy
- admin can create assignments
- claim can be created
- document can be uploaded
- claim event can be added
- admin payment can be added
- dashboard renders live metrics and AI triage
- policyholder sees only assigned records
- broker sees only assigned records
- route protection works
- no critical form shows misleading empty-state behavior

## 10. Final Verification Commands

Run:

```bash
cmd /c npm run lint
cmd /c npm run build
```

Both commands must pass before deployment.

## 11. Related Docs

- [docs/mvp-readiness-checklist.md](/D:/Projects/smartclaim-pro/docs/mvp-readiness-checklist.md)
- [docs/credentials-and-deployment.md](/D:/Projects/smartclaim-pro/docs/credentials-and-deployment.md)
- [docs/demo-script.md](/D:/Projects/smartclaim-pro/docs/demo-script.md)
- [docs/progress-tracker.md](/D:/Projects/smartclaim-pro/docs/progress-tracker.md)
