Run the test suite and report results.

## Steps

1. Run backend unit tests:
```bash
cd backend && mvn test -pl hrapp-service 2>&1 | tail -30
```

Report: total tests, passed, failed. Show only failures (not full output).

2. If $ARGUMENTS contains "frontend", also run:
```bash
cd frontend && npm run lint 2>&1
cd frontend && npm run test 2>&1 | tail -20
```

## Output Format

```
Backend Tests: X passed, Y failed
[List any failures with class name and error message]

Frontend Lint: PASS / FAIL
[List any lint errors]

Frontend Tests: X passed, Y failed (if requested)
```

If all pass, confirm: "All tests passing ✓"
