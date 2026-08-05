<!-- AI-DOS HANDOFF START -->

WORK:
WORK-OFFICE-QUEUE-DASHBOARD-0001 — AI-DOS Office Work and Research Queue Dashboard

STATUS:
RUNNING

CURRENT ROUND OR STEP:
PARSER_SLICE_COMPLETE

PREVIOUS ROUND OR STEP:
IMPLEMENTATION_PLAN_COMPLETE

AUTHORITY:
- Review and modify only `polo13999/ai-dos-office` within the bounded Work `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/` and the explicitly authorized validation paths listed below.
- May inspect and validate the persisted credential-free queue contracts, parsers, and sanitized fixtures.
- May add the minimum repository-approved executable validation files and configuration needed to compile and run parser cases.
- May not expose private-repository credentials to the browser, create a real source adapter, add an API route, modify the Office UI, mutate authoritative queues, claim or reorder items, alter Handoff authority, merge, promote files, activate a Mission, or expand scope.
- This Handoff is transport only.

CURRENT STATE:
The credential-free parser slice is persisted. `lib/queues/types.ts`, the deterministic shared Markdown-table parser, Work parser, Research parser, five sanitized fixtures, and `PARSER-EVIDENCE.md` exist. Work and Research schema differences are preserved without invented values. Static repository evidence covers valid parsing, empty and malformed tables, invalid Queue Order, missing IDs, unknown status/priority warnings, and em-dash normalization. No executable test, TypeScript compilation, API, UI, source adapter, credential, or private-repository access has occurred.

COMPLETED:
- Created queue domain, item, parse-result, and Markdown-row contracts.
- Created an exact-header deterministic Markdown-table parser with separator validation, escaped-pipe handling, source-row traceability, and warning/error behavior.
- Created separate Work and Research normalizers.
- Enforced positive integer Work Queue Order without inferring replacements.
- Preserved unknown priority and status strings with warnings.
- Preserved Research `Current Round` and left Work-only fields null.
- Added sanitized valid Work and Research fixtures.
- Added fixtures for malformed Work rows, empty Work table, and malformed Research separator.
- Created `PARSER-EVIDENCE.md` mapping all required cases to repository evidence.
- Explicitly recorded that no runtime test, compiler, build, dependency, API, UI, or credential work occurred.

LAST RESULT:
The parser evidence is repository-persisted at commit `a96ba48797dd096a932bafc29efe16aa82056685`. The parser slice is complete as static repository evidence, but executable correctness remains unverified.

EXACTLY ONE NEXT ACTION:
Create and run the minimum executable parser validation for the persisted fixtures, including TypeScript compilation and assertions for valid Work parsing, valid Research parsing, schema-difference preservation, empty-table handling, malformed-table handling, malformed Work Queue Order, missing required ID, unknown-status warning behavior, and em-dash-to-null normalization; persist the exact validation mechanism, commands, results, and any required bounded fixes in `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/PARSER-VALIDATION.md`.

AUTHORIZED SCOPE:
- Inspect repository TypeScript configuration and package policy.
- Add only the minimum validation files and configuration necessary to compile and execute the parser cases.
- Modify parser files only when executable validation reveals a bounded defect.
- Record exact commands and results; do not claim success without execution evidence.

AUTHORIZED PRODUCT PATHS:
- `lib/queues/`
- `fixtures/queues/`
- validation files under `tests/queues/` or `scripts/` as minimally required
- `package.json` and lockfile only if an executable validation mechanism genuinely requires an explicitly recorded minimal change
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/`

PROHIBITED:
- No `app/api` route.
- No `CommandCenter` or other UI modification.
- No GitHub App, PAT, private key, token, environment secret, filesystem repository path, or real source adapter.
- No queue mutation, claim action, priority interpretation, reordering, approval, or Handoff mutation through Office.
- No merge, promotion, Mission change, or scope expansion.

EVIDENCE:
- `lib/queues/types.ts`
- `lib/queues/parse-markdown-table.ts`
- `lib/queues/parse-work-queue.ts`
- `lib/queues/parse-research-queue.ts`
- `fixtures/queues/work-valid.md`
- `fixtures/queues/research-valid.md`
- `fixtures/queues/work-edge-cases.md`
- `fixtures/queues/empty-work.md`
- `fixtures/queues/malformed-research.md`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/PARSER-EVIDENCE.md`
- parser-evidence commit `a96ba48797dd096a932bafc29efe16aa82056685`
- implementation-plan commit `b12fd94d02a4521addfff24628acb7af39007f5f`

STOP CONDITION:
Stop after executable parser validation and `PARSER-VALIDATION.md` are persisted and read-back verified; then emit exactly one successor Handoff with one bounded next action.

<!-- AI-DOS HANDOFF END -->