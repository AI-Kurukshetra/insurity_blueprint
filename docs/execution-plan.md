# Execution Plan

## Goal

Ship a polished, demoable MVP within 7 hours using:

- Next.js
- Supabase
- Vercel

## Delivery Strategy

Optimize for:

- clean demo flow
- realistic insurance workflow
- minimal backend complexity
- strong UI polish
- one credible AI differentiator

Do not optimize for:

- full enterprise breadth
- deep compliance automation
- complete admin tooling
- low-priority integrations

## Build Order

### Phase 1: Scope Lock

- finalize product name and cyber insurance positioning
- define personas and happy-path demo
- define exact pages to build
- freeze MVP and reject feature creep

### Phase 2: App Scaffold

- create Next.js app
- set up base design direction
- prepare folder structure
- define seed data and types

### Phase 3: Product UI

- build main dashboard
- build policies view
- build claims view
- build customer or broker-facing summary view
- build AI triage panel

### Phase 4: Supabase Integration

- add environment variables
- create Supabase client utilities
- create base tables
- add simple auth
- replace static seed data with Supabase reads where possible
- add document storage plan

### Phase 5: Demo Readiness

- prepare realistic seed records
- verify loading, empty, and error states
- clean README
- deploy to Vercel
- rehearse the demo narrative

## Recommended Route Map

- `/` dashboard
- `/policies` policy portfolio and policy detail entry point
- `/claims` claims queue and triage
- `/claims/[claimNumber]` claim detail, evidence, and event timeline
- `/portal` policyholder summary
- `/broker` broker or agent overview
- `/admin` assignment management for privileged users
- `/login` email-password sign-in and sign-up
- `/reset-password` password recovery completion

## Time Budget

### Hour 0-1

- PDF analysis
- scope lock
- project scaffolding

### Hour 1-3

- dashboard and core UI
- sample data
- route skeletons

### Hour 3-5

- Supabase setup
- auth
- data wiring
- storage direction

### Hour 5-6

- AI triage or AI assistant workflow
- seed content polish

### Hour 6-7

- Vercel deploy
- README and submission polish
- demo rehearsal

## Non-Negotiable Rule

Every feature added must help one of these:

- demo clarity
- judging impact
- product credibility
- implementation speed

If it does not, cut it.
