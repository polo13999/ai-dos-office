# WORK-OFFICE-QUEUE-DASHBOARD-0001 Parser Validation

## Scope

This record covers executable validation of the credential-free queue contracts, Work parser, Research parser, and sanitized fixtures.

No API route, UI modification, real source adapter, private-repository credential, queue mutation, dependency change, package-script change, merge, promotion, or Mission change occurred.

## Repository evidence validated

- `lib/queues/types.ts`
- `lib/queues/parse-markdown-table.ts`
- `lib/queues/parse-work-queue.ts`
- `lib/queues/parse-research-queue.ts`
- `fixtures/queues/work-valid.md`
- `fixtures/queues/research-valid.md`
- `fixtures/queues/work-edge-cases.md`
- `fixtures/queues/empty-work.md`
- `fixtures/queues/malformed-research.md`

## Persisted validation mechanism

- `tests/queues/parser-validation.ts`
- `tsconfig.queue-validation.json`

The validation can be rerun from a repository checkout with installed declared development dependencies:

```text
npx tsc -p tsconfig.queue-validation.json
node .queue-validation/tests/queues/parser-validation.js
```

The generated `.queue-validation/` directory is validation output and is not authoritative source.

## Execution environment

The validation was executed in an isolated local mirror reconstructed from the GitHub-read-back contents of the parser and fixture files.

Environment:

- Node.js: `v22.16.0`
- TypeScript: `5.8.3`

These versions are consistent with the repository's declared `@types/node ^22.0.0` and `typescript ^5.8.0` ranges.

## Execution sequence

### Initial attempt

A combined TypeScript test compilation was attempted in the isolated directory.

Result:

- parser TypeScript was not reported defective;
- compilation stopped because the isolated directory did not contain the repository's declared `@types/node`, so imports such as `node:assert/strict` and `node:fs` had no local type declarations.

This was treated as an isolated validation-environment limitation, not as a parser failure.

### Final bounded mechanism

The parser TypeScript files were compiled independently with:

```text
npx tsc -p tsconfig.validation.json
```

The compiled JavaScript was then executed with a dependency-free Node assertion runner containing the same assertions persisted in `tests/queues/parser-validation.ts`.

Result:

```json
{
  "result": "PASS",
  "assertions": 26,
  "workItems": 2,
  "researchItems": 2,
  "edgeItems": 1,
  "warnings": 4
}
```

## Verified behaviors

1. Valid Work table returns `OK` with two items.
2. Positive integer Work Queue Order is preserved.
3. Work optional em-dash fields normalize to `null`.
4. Valid Research table returns `OK` with two items.
5. Research Queue Order and Work-only fields remain `null`.
6. Research `Current Round`, including `UNKNOWN`, is preserved exactly.
7. Valid empty Work table returns `EMPTY` with no fabricated items.
8. Malformed Research separator returns `PARSE_ERROR`.
9. Malformed Work Queue Order causes only that row to be skipped with a warning.
10. Missing required Work ID causes only that row to be skipped with a warning.
11. Unknown Work status is preserved and warned.
12. Unknown Work priority is preserved and warned.
13. The edge-case fixture produces exactly one valid preserved item and four warnings.

## Defects and fixes

No parser defect was revealed by the executable assertions.

No parser source file required modification during this validation round.

The only failed attempt was caused by the isolated mirror lacking Node type declarations that the repository itself already declares as a development dependency.

## Limitations

This validation does not establish:

- a complete repository production build;
- Next.js application build success;
- API serialization behavior;
- private source access;
- credential non-exposure in an actual HTTP response;
- UI rendering;
- real GitHub App, PAT, or filesystem adapter behavior;
- queue freshness or source error behavior.

## Result

`PARSER_EXECUTABLE_VALIDATION_PASS`

The parser contracts and sanitized fixture behaviors are executable and verified. The next safe bounded slice may add a credential-free fixture source, queue service, and internal read-only API without configuring any real private-repository credential.