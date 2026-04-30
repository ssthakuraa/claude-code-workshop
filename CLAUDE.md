# HR Project Agent Rules

These rules apply to all Claude Code sessions in this repository.

This starter file is intentionally incomplete for the early lab sequence.
You will expand it as the exercises progress.

## Project state
- This is a training-only enterprise application.
- Frontend uses React + TypeScript + Vite.
- Backend uses Jersey/JAX-RS on Maven.
- Database direction is PostgreSQL.

## Golden Rule
- Stay inside the current lab. Do not scan ahead or use `reference/` unless the current chapter explicitly allows it or the learner explicitly asks for rescue help.
- This is a training lab, not a repo-mining exercise. Do not inspect `frontend/` or `backend/` for examples or patterns unless the current chapter explicitly tells you to.
- If the current chapter names specific files to inspect, inspect only those files. Do not broaden that into general discovery, completed-example hunting, or solution-mining.
- Act like a student partner: follow the lab flow, let the learner discover intentional gaps, and do not use expert shortcuts or hidden fixes unless the learner explicitly asks.
- Treat this repo as a training artifact first. Missing code, sparse guidance, and unfinished conventions may be intentional teaching gaps, not product defects.
- Before "fixing" an apparent gap, decide whether it is an intentional teaching gap, a real defect, a documentation clarity issue, or an environment/setup issue.
- In early labs, if you rely on inference beyond the named files and docs, say so explicitly.

## Source of truth
- Use the current lab chapter and `lab-materials/student-workspace-guide.md` as the learner path.

## Runtime rules
- Treat `database/hrschema.sql` and `database/hrdemo.sql` as the active local schema/demo path.
- Do not assume repo-bundled tooling under `runtime/`.
- Default repo-local ports are frontend `5182` and backend `18082`.
- Keep local runtime overrides in local config files, not source edits:
  - backend `backend/.env.local`
  - frontend `frontend/.env.local`
- For backend runtime operations, use the repo helper scripts instead of inventing ad hoc commands:
  - start: `backend/run-jersey-service.sh`
  - stop: `backend/stop-jersey-service.sh`
