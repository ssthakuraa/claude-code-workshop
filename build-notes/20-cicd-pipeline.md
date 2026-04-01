# Build Note: CI/CD Pipeline Integration

**Date:** 2026-03-30
**Module:** GitHub Actions — automated build, test, and quality gates
**Maps to Lab:** Lab 14: CI/CD

---

## What This Lab Covers

Using Claude Code to generate a GitHub Actions CI/CD pipeline for the HR monorepo. The pipeline runs on every PR and push to main:

1. **Backend:** `mvn clean install` — compiles, runs unit tests, packages the JAR
2. **Frontend:** `npm ci && npm run build` — installs deps, type-checks, builds
3. **Quality gate:** TypeScript errors and test failures block merge

This lab is about **generating** the pipeline config, not running it. Claude reads the project structure and produces a correct `.github/workflows/ci.yml` on the first or second attempt.

---

## The Prompt That Worked

```
Read the project structure (CLAUDE.md, backend/pom.xml, frontend/package.json).
Generate .github/workflows/ci.yml for a GitHub Actions CI pipeline that:

Backend job:
- Runs on: ubuntu-latest
- Java: 21 (temurin distribution)
- Cache: Maven ~/.m2 repository
- Steps: checkout → setup-java → mvn clean install -pl hrapp-service (skip hrapp-common tests separately)
- Test reports: upload surefire XML as artifact

Frontend job:
- Runs on: ubuntu-latest
- Node: 20
- Cache: npm cache based on frontend/package-lock.json hash
- Working directory: frontend/
- Steps: checkout → setup-node → npm ci → npm run build
- On PR only: also run npx tsc --noEmit and report errors

Both jobs run in parallel. Pipeline triggers on: push to main, pull_request to main.
Use actions/checkout@v4, actions/setup-java@v4, actions/setup-node@v4.
```

---

## What Failed First

- **Symptom:** Generated pipeline used `mvn clean install` at the root, which tried to build both modules but failed because `hrapp-service` depends on `hrapp-common` being installed first.
- **Root cause:** Claude didn't know the module dependency order from the prompt alone.
- **Fix:** Added to prompt: "Build order: `mvn install -pl hrapp-common` first, then `mvn install -pl hrapp-service`." Or simpler: `mvn clean install` at root (Maven resolves reactor order automatically). Claude chose the latter once corrected.

- **Symptom:** Frontend job failed in CI because `npm run build` calls Vite which uses `VITE_USE_MOCK`. In CI there's no `.env` file.
- **Root cause:** Vite requires env vars at build time. Missing vars cause TypeScript errors on import.
- **Fix:** Added to the workflow:
  ```yaml
  env:
    VITE_USE_MOCK: "true"
    VITE_API_BASE_URL: "http://localhost:8080"
  ```
  In CI, always build with mock mode — the build artifact is for verification, not production deployment.

- **Symptom:** Maven cache wasn't being hit — each run re-downloaded all dependencies (2-3 min overhead).
- **Root cause:** Cache key used `${{ hashFiles('**/pom.xml') }}` but the glob didn't match nested POMs in `backend/`.
- **Fix:** Changed to `${{ hashFiles('backend/**/pom.xml') }}`.

---

## CLAUDE.md / Skill Update Made

```markdown
## CI/CD
- Pipeline: .github/workflows/ci.yml (GitHub Actions)
- Backend: mvn clean install (Maven resolves reactor order)
- Frontend: npm ci + npm run build with VITE_USE_MOCK=true
- Maven cache key: hashFiles('backend/**/pom.xml')
- npm cache key: hashFiles('frontend/package-lock.json')
```

---

## Key Teaching Points

1. **Claude generates correct pipelines from project structure** — read `pom.xml` and `package.json` before generating; don't describe the project from memory.
2. **CI env vars are a common gap** — Vite (and many frontend tools) need env vars at build time. Always add a `env:` block for required vars.
3. **Cache keys must match actual file paths** — glob patterns that don't match produce cache misses silently. Test with a real run.
4. **Parallel jobs = faster CI** — backend and frontend have no runtime dependency on each other. Run them in parallel; a 6-minute sequential pipeline becomes 3.5 minutes.

---

## Lab Exercise Derivation

- **Setup:** HR app repo connected to GitHub. No existing CI config.
- **Task:** Run the prompt above. Review the generated YAML. Identify any env var gaps. Commit and push — observe the pipeline run.
- **Deliberate failure:** Remove `VITE_USE_MOCK: "true"` from the frontend job. Observe the build failure. Add it back.
- **Success criteria:** Both jobs green on first push. Maven cache hit on second push (verify via "Cache restored" log line). Frontend build produces `dist/` artifact.
