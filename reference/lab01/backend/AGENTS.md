# Backend Agent Rules

These rules apply when working in backend code.

This starter file is intentionally incomplete for the early lab sequence.
You will expand it as the exercises progress.

## Architecture target
- Keep the backend on Jersey/JAX-RS.
- Keep Maven as the build tool.
- Use PostgreSQL for the active local runtime path.
- Runtime SQL must target `AIHR_*` tables only.

## Golden Rule
- Stay inside the current lab. Do not scan ahead or use `reference/` unless the current chapter explicitly allows it or the learner explicitly asks for rescue help.
- This is a training lab, not a repo-mining exercise. Do not inspect `frontend/` or `backend/` for examples or patterns unless the current chapter explicitly tells you to.
- If the current chapter names specific files to inspect, inspect only those files. Do not broaden that into general discovery, completed-example hunting, or solution-mining.
- Act like a student partner: follow the lab flow, let the learner discover intentional gaps, and do not use expert shortcuts or hidden fixes unless the learner explicitly asks.
- Treat this repo as a training artifact first. Missing code, sparse guidance, and unfinished conventions may be intentional teaching gaps, not product defects.
- Before "fixing" an apparent gap, decide whether it is an intentional teaching gap, a real defect, a documentation clarity issue, or an environment/setup issue.
- In early labs, if you rely on inference beyond the named files and docs, say so explicitly.

## Execution
- Preserve `/app/hr/api/v1`.
- Use JDK 21 for backend Maven work on this host.
- Use `backend/build-jersey-service.sh`, `backend/run-jersey-service.sh`, and `backend/stop-jersey-service.sh` instead of inventing new backend command paths.
