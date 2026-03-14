# Demo Recording Checklist

Use this document while recording a short SmartClaim Pro demo video.

Target length:

- `2.5` to `4` minutes

Recommended screen size:

- desktop browser
- 125% browser zoom if text feels small

Recommended accounts:

- `admin`: full system walkthrough
- `broker`: broker workspace check
- `policyholder`: portal check

Do not record:

- Supabase dashboard
- `.env.local`
- SQL editor
- passwords in plain text
- browser tabs unrelated to the demo

## Before Recording

1. Start the app and sign out of every open session.
2. Open the app home page in one clean browser window.
3. Make sure there is at least:
   - one admin account
   - one broker account
   - one policyholder account
   - one adjuster account
   - one policy
   - one claim
   - one uploaded document
   - one claim event
4. Decide whether you want to record in light mode or dark mode first.
5. If needed, reload once before recording so the session is stable.

## Suggested Demo Story

The cleanest story is:

1. Admin signs in
2. Admin shows dashboard
3. Admin shows account creation and assignment controls
4. Admin shows claims board and claim detail
5. Broker view
6. Policyholder portal
7. Theme toggle
8. End on dashboard

## Scene 1: Login

Route:

- `/login`

Exact clicks:

1. Open `/login`
2. Click inside `Email address`
3. Enter the admin email
4. Click inside `Password`
5. Enter the admin password
6. Click `Sign in`

What should appear:

- redirect into the authenticated app
- top navigation visible
- sign-out control visible in header

Suggested narration:

“SmartClaim Pro is a cyber insurance operations platform for administrators, brokers, adjusters, and policyholders.”

## Scene 2: Dashboard

Route:

- `/`

Exact clicks:

1. Click `Dashboard` in the top navigation if you are not already there
2. Pause on the metric cards
3. Slowly scroll enough to show:
   - policy snapshot
   - AI triage panel
   - claims queue
   - operational timeline
   - broker highlights

What to point at:

- policies in force
- open claims
- AI triage panel
- recent operational activity

Suggested narration:

“The dashboard gives operations teams one place to monitor policy volume, open claims, explainable AI recommendations, and recent activity.”

## Scene 3: Admin Workspace

Route:

- `/admin`

Exact clicks:

1. Click `Admin` in the top navigation
2. Pause on `Create a user account`
3. Slowly scroll through:
   - user account creation
   - policy creation
   - policy assignments
   - claim assignments
   - current assignment lists

Optional live action:

1. Click into `Full name`
2. Type a sample name
3. Click into `Organization`
4. Type a sample organization
5. Click `Role`
6. Pick a role
7. Click into `Email address`
8. Type a sample email
9. Click into `Temporary password`
10. Type a sample password
11. Stop before submitting if you do not want extra accounts created

Better option if you want a clean recording:

- just show the form without submitting

Suggested narration:

“Administrators provision accounts, create policies, and control which users can see which policies and claims.”

## Scene 4: Claims Board

Route:

- `/claims`

Exact clicks:

1. Click `Claims` in the top navigation
2. Pause on the `Submit a first notice of loss` card
3. Pause on `Upload claim evidence`
4. Pause on the open claims queue
5. Pause on the AI triage panel

If you want to show the flow without changing data:

1. Click into `Policy`
2. Open the dropdown
3. Click into `Severity`
4. Open the dropdown
5. Click into `Loss narrative`
6. Do not submit

Suggested narration:

“Claims teams can report a loss, attach evidence, review the queue, and use explainable AI triage to identify which claims need escalation first.”

## Scene 5: Claim Detail

Route:

- `/claims/[claimNumber]`

Exact clicks:

1. On the claims board, click `Open claim detail` on one claim
2. Pause on:
   - claim overview
   - policy context
   - timeline form
   - payment form
3. Scroll down slowly to show:
   - timeline history
   - documents
   - payments

If you want to show one real action:

1. Click `Event type`
2. Select an option
3. Click `Notes`
4. Enter a short update
5. Click `Add event`

Suggested narration:

“Each claim has a dedicated workspace with policy context, operational history, documents, and payment tracking.”

## Scene 6: Broker Workspace

Route:

- `/broker`

Exact clicks:

1. Click `Sign out`
2. Sign in as a broker user
3. Click `Broker`
4. Pause on:
   - accounts under management
   - renewal date
   - open claims
   - premium
   - retention focus panel

Suggested narration:

“Brokers only see assigned accounts, with renewal timing, open-claim visibility, and a retention view that helps prioritize outreach.”

## Scene 7: Policyholder Portal

Route:

- `/portal`

Exact clicks:

1. Click `Sign out`
2. Sign in as a policyholder user
3. Click `Portal`
4. Pause on:
   - coverage summary
   - self-service actions
   - recent claim activity
   - uploaded evidence

Suggested narration:

“The portal gives policyholders a simpler self-service experience without exposing unrelated operational data.”

## Scene 8: Theme Toggle

Location:

- top-right header controls, beside the account controls

Exact clicks:

1. Move the cursor to the theme button
2. Click once to switch theme
3. Pause for one second
4. Click again only if you want to return to the original theme

Suggested narration:

“The interface also supports light and dark themes while keeping the same workflows and role-aware navigation.”

## Scene 9: Close

Route:

- `/`

Exact clicks:

1. Return to `Dashboard`
2. Hold the screen on the main overview for the closing line

Suggested closing narration:

“SmartClaim Pro brings policy operations, claims triage, document handling, broker visibility, and role-based access into one secure workflow.”

## Fastest Recording Version

If you need a shorter demo, record only:

1. Login as admin
2. Dashboard
3. Admin workspace
4. Claims board
5. Claim detail
6. Broker workspace
7. Portal
8. Theme toggle
9. Dashboard close

## Recording Tips

- keep cursor movement slow
- wait `1` second after each page loads
- avoid typing mistakes live
- if showing forms, either submit confidently or do not submit at all
- keep one browser tab only
- use one consistent account story across the demo

## Safe Sample Narration Order

1. “This is the admin dashboard.”
2. “Admins can provision users and assignments.”
3. “Claims teams can intake and triage losses.”
4. “Each claim has its own detailed workspace.”
5. “Brokers only see assigned accounts.”
6. “Policyholders get a simplified portal.”
7. “The product supports theme switching and protected workflows.”

