<!-- AI-DOS HANDOFF START -->

WORK:
WORK-OFFICE-QUEUE-DASHBOARD-0001 — AI-DOS Office Work and Research Queue Dashboard

STATUS:
RUNNING

CURRENT ROUND OR STEP:
ORIENTATION_COMPLETE

PREVIOUS ROUND OR STEP:
CLAIMED_FOR_ORIENTATION

AUTHORITY:
- Review and modify only `polo13999/ai-dos-office` within the bounded Work `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/` and later explicitly authorized product paths.
- May inspect the existing Office architecture, server/API patterns, UI structure, tests, queue schemas, and configuration boundaries.
- May create bounded planning and implementation artifacts for a read-only Work and Research Queue dashboard.
- May not expose private-repository credentials to the browser, mutate authoritative queues, claim or reorder items, alter Handoff authority, merge, promote files, activate a Mission, or expand scope.
- This Handoff is transport only.

CURRENT STATE:
The Work is claimed and `ORIENTATION.md` is persisted. The Office repository is a compact Next.js 15 / React 19 application with a strong visual command-center shell but inspected operational data is client-side mock content. `app/page.tsx` mounts a large `CommandCenter` client component, and `PixelOffice` is also client-heavy and simulated. No established API, data-access, credential-management, or test convention was verified. The queue dashboard therefore represents a new server-derived read-only slice requiring an adapter, parser, internal endpoint, normalized model, freshness/error metadata, and narrowly integrated UI.

COMPLETED:
- Preserved `WORK-SILLYTAVERN-REVIEW-0001` at its Founder decision boundary and returned to Dispatcher.
- Selected and claimed Queue Order `4`, `WORK-OFFICE-QUEUE-DASHBOARD-0001`.
- Created and read back the initial Canonical Handoff.
- Inspected `package.json`, `app/page.tsx`, `app/layout.tsx`, `components/CommandCenter.tsx`, and `components/PixelOffice.tsx`.
- Verified that the inspected UI is mock-data-driven and client-heavy.
- Recorded current package profile, likely integration surfaces, private-repository constraints, test limitations, evidence, and unresolved questions.
- Created and read back `ORIENTATION.md`.
- Avoided product-code changes and credential configuration.

LAST RESULT:
The repository orientation is persisted at commit `9e1d3b60108aa71b9fa0389f28ed3b769ccdc8e7`. The next bounded step is to verify both authoritative queue schemas and complete the implementation plan before any product-code change.

EXACTLY ONE NEXT ACTION:
Inspect `polo13999/ai-dos-research/RESEARCH_TASK_LIST.md`, re-read the current Work Queue schema, inspect any discoverable `app/api` or server-only patterns in `polo13999/ai-dos-office`, then create `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/IMPLEMENTATION-PLAN.md` defining the source adapter interface, normalized queue models, parsing rules, internal read-only API contract, freshness/error behavior, proposed UI integration point, validation approach, file-level change boundary, and credential-free implementation sequence without modifying product code.

AUTHORIZED SCOPE:
- Read Work and Research queue files and Office repository structure.
- Define one bounded implementation plan and explicit file-level change boundary.
- Preserve source terminology, optional fields, and schema differences without inventing values.
- Record unresolved decisions and credential dependencies explicitly.

PROHIBITED:
- No product-code modification in this step.
- No GitHub App, PAT, private key, token, or filesystem credential creation or persistence.
- No queue mutation, claim action, priority interpretation, reordering, approval, or Handoff mutation through the dashboard.
- No architecture implementation, merge, promotion, Mission change, or scope expansion.

EVIDENCE:
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/README.md`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/ORIENTATION.md`
- orientation commit `9e1d3b60108aa71b9fa0389f28ed3b769ccdc8e7`
- `package.json`
- `app/page.tsx`
- `app/layout.tsx`
- `components/CommandCenter.tsx`
- `components/PixelOffice.tsx`
- `polo13999/ai-dos-work:WORK_TASK_LIST.md`
- claim commit `ff62220238ca5503b8add772408f2e77e14b6f1d`

STOP CONDITION:
Stop after `IMPLEMENTATION-PLAN.md` is persisted and read-back verified; then emit exactly one successor Handoff with one bounded next action.

<!-- AI-DOS HANDOFF END -->