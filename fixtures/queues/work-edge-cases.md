# Sanitized Work Queue Edge Cases

| Queue Order | Priority | Work ID | Title | Status | Next Action | Waiting On | Claimed By | Resume Condition | Work Path |
|---|---|---|---|---|---|---|---|---|---|
| `not-a-number` | `P0` | `WORK-BAD-ORDER` | Invalid Queue Order | `READY` | — | — | — | — | `demo/work/WORK-BAD-ORDER/` |
| `2` | `PX` | `WORK-UNKNOWN-VALUES` | Preserve Unknown Values | `CUSTOM_STATUS` | — | — | — | — | `demo/work/WORK-UNKNOWN-VALUES/` |
| `3` | `P1` | `` | Missing Required ID | `READY` | — | — | — | — | `demo/work/MISSING/` |
