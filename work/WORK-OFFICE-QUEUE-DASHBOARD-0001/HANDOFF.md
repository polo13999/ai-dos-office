<!-- AI-DOS HANDOFF START -->

WORK:
WORK-OFFICE-QUEUE-DASHBOARD-0001 — AI-DOS Office Work and Research Queue Dashboard

STATUS:
RUNNING

CURRENT ROUND OR STEP:
IMPLEMENTATION_PLAN_COMPLETE

PREVIOUS ROUND OR STEP:
ORIENTATION_COMPLETE

AUTHORITY:
- Review and modify only `polo13999/ai-dos-office` within the bounded Work `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/` and the explicitly authorized parser/fixture paths listed below.
- May implement credential-free queue contracts, deterministic Work and Research Markdown-table parsers, and sanitized fixtures.
- May inspect queue schemas and repository policy needed for that bounded implementation.
- May not expose private-repository credentials to the browser, create a real source adapter, add an API route, modify the Office UI, mutate authoritative queues, claim or reorder items, alter Handoff authority, merge, promote files, activate a Mission, or expand scope.
- This Handoff is transport only.

CURRENT STATE:
The Work is claimed and both `ORIENTATION.md` and `IMPLEMENTATION-PLAN.md` are persisted. The plan verifies that Work and Research use different authoritative schemas and defines a shared read-only display envelope without inventing missing fields. It proposes a server-only source boundary, source-specific parsers, independent snapshots, visible freshness/error states, a later `/api/queues` endpoint, and a dedicated Queue Dashboard view. No product code, API, UI, credential, real source adapter, or test dependency has been added.

COMPLETED:
- Re-read and verified the current Canonical Handoff.
- Inspected the authoritative Work Queue and Research Queue schemas.
- Recorded Work-specific `Queue Order`, `Next Action`, `Resume Condition`, and `Work Path` fields.
- Recorded Research-specific `Current Round` and `Waiting` fields and the absence of Queue Order.
- Preserved source terminology and defined null behavior without inferring values.
- Searched for an existing Office API route convention; none was established by the available repository search.
- Defined the source adapter interface, normalized models, parsing rules, internal API contract, freshness/error behavior, proposed dedicated Queue Dashboard view, validation approach, file-level boundary, and credential-free implementation sequence.
- Created and read back `IMPLEMENTATION-PLAN.md`.
- Avoided product-code changes and credential configuration.

LAST RESULT:
The credential-free implementation plan is repository-persisted at commit `b12fd94d02a4521addfff24628acb7af39007f5f`. The next bounded action isolates schema correctness before any source access, API, or UI integration.

EXACTLY ONE NEXT ACTION:
Implement the credential-free queue contracts and deterministic parser slice by creating `lib/queues/types.ts`, `lib/queues/parse-markdown-table.ts`, `lib/queues/parse-work-queue.ts`, `lib/queues/parse-research-queue.ts`, and sanitized Work/Research fixture files under `fixtures/queues/`; persist repository-contained parser evidence demonstrating valid Work parsing, valid Research parsing, schema-difference preservation, empty-table handling, malformed-table handling, malformed Work Queue Order handling, missing required ID handling, unknown-status warning behavior, and em-dash-to-null normalization.

AUTHORIZED SCOPE:
- Create only the parser, type, sanitized fixture, and bounded evidence files required by this action.
- Use current authoritative schemas as the source for field names and behavior.
- Preserve unknown status and priority strings with warnings rather than reinterpretation.
- Record the validation mechanism actually used; do not claim tests ran when they did not.

AUTHORIZED PRODUCT PATHS:
- `lib/queues/types.ts`
- `lib/queues/parse-markdown-table.ts`
- `lib/queues/parse-work-queue.ts`
- `lib/queues/parse-research-queue.ts`
- `fixtures/queues/`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/`

PROHIBITED:
- No `app/api` route.
- No `CommandCenter` or other UI modification.
- No GitHub App, PAT, private key, token, environment secret, filesystem repository path, or real source adapter.
- No new dependency or package-script change without explicit successor authority.
- No queue mutation, claim action, priority interpretation, reordering, approval, or Handoff mutation through Office.
- No merge, promotion, Mission change, or scope expansion.

EVIDENCE:
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/README.md`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/ORIENTATION.md`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/IMPLEMENTATION-PLAN.md`
- implementation-plan commit `b12fd94d02a4521addfff24628acb7af39007f5f`
- `polo13999/ai-dos-work:WORK_TASK_LIST.md`
- `polo13999/ai-dos-research:RESEARCH_TASK_LIST.md`

STOP CONDITION:
Stop after the authorized parser/contracts/fixtures and parser evidence are persisted and read-back verified; then emit exactly one successor Handoff with one bounded next action.

<!-- AI-DOS HANDOFF END -->