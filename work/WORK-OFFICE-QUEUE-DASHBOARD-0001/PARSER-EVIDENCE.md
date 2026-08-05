# WORK-OFFICE-QUEUE-DASHBOARD-0001 Parser Evidence

## Scope

This evidence covers only the credential-free queue contracts, deterministic Markdown-table parsers, and sanitized fixtures authorized by the current Handoff.

No API route, UI, source adapter, credential, dependency, package script, queue mutation, or real private-repository access was added.

## Files persisted

- `lib/queues/types.ts`
- `lib/queues/parse-markdown-table.ts`
- `lib/queues/parse-work-queue.ts`
- `lib/queues/parse-research-queue.ts`
- `fixtures/queues/work-valid.md`
- `fixtures/queues/research-valid.md`
- `fixtures/queues/work-edge-cases.md`
- `fixtures/queues/empty-work.md`
- `fixtures/queues/malformed-research.md`

## Validation mechanism used

The repository currently declares no test runner or lint script, and the Handoff prohibits adding a dependency or package-script change without successor authority.

Therefore this round used repository-contained static evidence:

1. exact schema comparison against the authoritative Work and Research table headers;
2. code inspection of deterministic parsing and normalization branches;
3. sanitized fixtures that exercise the required cases;
4. GitHub read-back verification of the persisted files.

No runtime test command was executed. This document does not claim that TypeScript compilation, build, or automated tests passed.

## Evidence matrix

| Required behavior | Repository evidence | Expected parser result |
|---|---|---|
| Valid Work parsing | `fixtures/queues/work-valid.md` + `parse-work-queue.ts` | Two `WORK` items; positive integer Queue Order preserved; Work-specific fields populated. |
| Valid Research parsing | `fixtures/queues/research-valid.md` + `parse-research-queue.ts` | Two `RESEARCH` items; `Current Round` preserved; no invented Queue Order or Work-only fields. |
| Schema-difference preservation | Separate exact header lists and separate normalizers | Work receives `queueOrder`, `nextAction`, `resumeCondition`, and location; Research receives `currentRound`; absent fields remain `null`. |
| Empty-table handling | `fixtures/queues/empty-work.md` | `EMPTY`, no fabricated items. |
| Malformed-table handling | `fixtures/queues/malformed-research.md` | `PARSE_ERROR` because the separator row is invalid. |
| Malformed Work Queue Order | First row in `work-edge-cases.md` | Row skipped with warning; no inferred Queue Order. |
| Missing required ID | Third row in `work-edge-cases.md` | Row skipped with warning; no fabricated ID. |
| Unknown-status warning | Second row in `work-edge-cases.md` | Item preserved with original status and priority strings plus warnings. |
| Em-dash-to-null normalization | Valid fixtures use `—` in optional fields | Optional fields become `null`; required fields are never silently replaced. |

## Deterministic parser properties

The shared parser:

- searches for one exact authoritative header signature;
- requires a valid Markdown separator row immediately after the header;
- handles escaped pipe characters deterministically;
- strips one surrounding pair of Markdown code ticks from scalar values;
- records original source row numbers;
- skips invalid-width rows with warnings;
- stops when the authoritative table ends;
- does not parse surrounding prose as queue data.

The Work parser:

- requires positive integer Queue Order;
- requires Work ID, title, priority, and status;
- preserves unknown priority and status values with warnings;
- maps Work-only fields without reinterpreting them.

The Research parser:

- requires Research ID, title, priority, status, and Current Round;
- preserves `UNKNOWN` or other round text exactly;
- preserves unknown priority and status values with warnings;
- leaves Work-only fields as `null`.

## Limitations

The following remain unverified until a successor Handoff authorizes an executable validation mechanism:

- TypeScript compiler success;
- production build success;
- runtime fixture execution;
- malformed escaped-pipe edge cases beyond code inspection;
- API serialization behavior;
- credential non-exposure in an actual server response;
- UI rendering and error-state behavior.

## Result

`PARSER_SLICE_PERSISTED_STATIC_EVIDENCE_ONLY`

The parser slice is complete at the repository level and ready for a separately authorized executable validation step. No API or UI work should begin until the parser files are compiled and the fixtures are executed by an approved validation mechanism.
