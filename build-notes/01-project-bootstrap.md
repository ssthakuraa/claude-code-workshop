# Build Note: Project Bootstrap & CLAUDE.md

**Date:** 2026-03-30
**Module:** Project Bootstrap
**Maps to Lab:** Lab 1: CLAUDE.md

---

## What We Built

- Maven multi-module backend: `hrapp-common` (utilities) + `hrapp-service` (Spring Boot 3.2)
- `CLAUDE.md` with naming conventions, logging pattern, API envelope, security rules, DB rules, frontend rules
- React 19 + Vite + TypeScript + Tailwind frontend scaffold
- Git repository initialized with `.gitignore`

## Technique Used

Manual bootstrap — scaffolded CLAUDE.md first, then asked Claude to create the project structure following the rules in CLAUDE.md.

## The Prompt That Worked

```
Read CLAUDE.md. Bootstrap the HR Enterprise Platform:
1. Create Maven multi-module project: hrapp-common (utilities) + hrapp-service (Spring Boot 3.2)
2. hrapp-common: HrLogHelper, HrApiResponse, HrPagedResponse
3. hrapp-service: application.yml (dev profile), Spring Security skeleton, Flyway migration V1__init.sql from database/schema.sql
4. React 19 + Vite + TypeScript frontend with src/components/{ui,hr,templates} and src/pages structure
Follow ALL rules in CLAUDE.md strictly.
```

## What Failed First

- **Symptom:** First attempt created a single-module Maven project and put all utilities directly in hrapp-service.
- **Root cause:** CLAUDE.md said "multi-module" but the prompt didn't reinforce the package boundary.
- **Fix:** Added explicit instruction: "hrapp-common must NOT import spring-boot-starter — it is a plain Java library."

## CLAUDE.md / Skill Update Made

```markdown
## Build & Run
cd backend && mvn clean install
mvn spring-boot:run -pl hrapp-service -Dspring-boot.run.profiles=dev
```
**Why:** Ensures future prompts know how to build without asking.

## Key Teaching Points

1. CLAUDE.md is read at the start of every session — put your project's non-obvious rules there, not in comments.
2. Multi-module Maven projects need explicit package boundary rules or Claude will collapse them.
3. Bootstrap commit gives Claude a stable reference point for all future work.

## Lab Exercise Derivation

- **Setup:** Empty directory, CLAUDE.md provided, schema.sql provided.
- **Task:** Ask Claude to bootstrap the project following CLAUDE.md rules.
- **Expected discovery:** Students discover that vague "multi-module" instructions collapse without explicit boundary rules.
- **Success criteria:** `mvn clean install` passes; frontend `npm run dev` starts.
