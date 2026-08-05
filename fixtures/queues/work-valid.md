# Sanitized Work Queue Fixture

| Queue Order | Priority | Work ID | Title | Status | Next Action | Waiting On | Claimed By | Resume Condition | Work Path |
|---|---|---|---|---|---|---|---|---|---|
| `1` | `P0` | `WORK-DEMO-0001` | Demo Work | `READY` | Inspect the bounded target. | — | — | — | `demo/work/WORK-DEMO-0001/` |
| `2` | `P2` | `WORK-DEMO-0002` | Waiting Demo | `WAITING_CONFIRMATION` | Persist an explicit decision. | Founder decision | `Demo-Worker` | Founder decision is persisted. | `demo/work/WORK-DEMO-0002/` |
