# Product Requirements

## Source

Distilled from `D:\Projects\insurity_blueprint_20260310_140213.pdf`.

## Problem Definition

Build a Property and Casualty policy administration and claims management platform inspired by products like Insurity, with a modern AI-first experience.

The original brief covers a very broad enterprise insurance platform. For a 7-hour hackathon, the correct interpretation is not to reproduce the full enterprise scope. The correct move is to build a focused MVP that still clearly maps to the brief.

## Recommended Product Slice

Build a cyber insurance operations platform with:

- policy portfolio management
- claims intake and claims workflow tracking
- payment and billing visibility
- document management
- customer/policyholder visibility
- broker or agent-facing visibility
- one meaningful AI feature for claims triage

Cyber insurance is the best fit for the hackathon because it supports strong workflows, realistic dashboards, and AI-assisted claim review without requiring complex visual estimators or heavy regulatory breadth on day one.

## Must-Have Features From The Brief

- Policy configuration and management
- Claims intake and registration
- Claims workflow management
- Billing and payment visibility
- Document management
- Customer self-service portal or equivalent customer visibility
- Agent or broker dashboard
- Financial or operational reporting
- Audit trail direction

## Features Explicitly Deferred For MVP

These are valid platform features but should not be in the first 7-hour version:

- multi-state regulatory engine
- reinsurance management
- policy cancellation engine
- native mobile claims app
- blockchain claims verification
- IoT integrations
- catastrophe modeling
- voice-enabled claims reporting
- full multi-tenant architecture

## AI Feature Recommendation

The AI feature should be practical and demoable:

- triage claim severity
- detect missing evidence or incomplete submissions
- flag suspicious or unusual claim patterns
- provide explainable reasons for prioritization

Avoid broad claims like fully autonomous underwriting or end-to-end claims automation unless there is real working logic behind it.

## Core Personas

- Policyholder
- Claims adjuster
- Broker or agent
- Internal operations/admin user

## Core Entities From The Brief

- Policies
- Policyholders
- Claims
- Payments
- Agents
- Brokers
- Coverage
- Premiums
- Documents
- Transactions
- Adjusters
- Renewals
- Commissions
- Risk assessments
- Fraud alerts
- Audit logs

## MVP Outcome

At the end of the hackathon, the app should feel like a real insurance operations product with a clear story:

1. A policy exists for a cyber insured customer.
2. A claim is submitted and appears in a claims operations queue.
3. Documents and payment context are visible.
4. The AI triage layer recommends what to do next and why.
5. The dashboard shows business value through speed, clarity, and prioritization.
