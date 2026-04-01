# Build Note: Simple CRUD (Regions, Countries, Locations, Jobs)

**Date:** 2026-03-30
**Module:** Backend — Simple CRUD entities
**Maps to Lab:** Lab 5: Parallel Dev

---

## What We Built

Four simple CRUD entities scaffolded using the `/scaffold-entity` skill from Build Note #03:
- **Region**: regionId, regionName (parent of countries)
- **Country**: countryId, countryName, regionId (FK)
- **Location**: locationId, streetAddress, city, stateProvince, postalCode, countryId (FK)
- **Job**: jobId (string PK), jobTitle, minSalary, maxSalary

Each has: Entity, Repository, DTO, Request, Service (HrLogHelper), Controller (HrApiResponse).

## Technique Used

**Parallel development with worktrees** — Region and Country scaffolded on `main`, then Location and Job scaffolded simultaneously in a git worktree to demonstrate parallel dev without branch conflicts.

## The Prompt That Worked

```
/scaffold-entity
Entity: Country
Table: countries
Fields: countryId (String, PK), countryName (String, not null), regionId (Integer, FK → regions)
Include: findAllByRegionId(Integer regionId) in repository
```
(Repeated for Location, Job with appropriate fields)

For parallel dev demo:
```
/worktree create feature/location-job-entities
# In worktree: scaffold Location and Job simultaneously
# Merge back to main
```

## What Failed First

- **Symptom:** `HrJobService.findAll()` returned jobs sorted by `jobId` (alphabetical string sort — "AD_PRES" before "FI_ACCOUNT"). Business expectation was sort by title.
- **Root cause:** Default JPA sort is by PK. String PKs sort lexicographically.
- **Fix:** Added `Sort.by("jobTitle")` as default in `HrJobController` and documented default sort per entity.

- **Symptom:** Worktree merge produced a conflict in `HrSecurityConfig` (both branches added security permit rules for new paths).
- **Root cause:** Both Location and Job controllers needed to be added to the public permit list — same line edited in both worktrees.
- **Fix:** Refactored security permit list to use `requestMatchers("/app/hr/api/v1/**").authenticated()` (catch-all) instead of listing each path. Simpler and conflict-proof.

## CLAUDE.md / Skill Update Made

```markdown
## Security Rules (additions)
- All /app/hr/api/v1/** routes require authentication (catch-all rule)
- Only /app/hr/api/v1/auth/** is public — don't list individual paths
```
**Why:** Per-path security rules cause merge conflicts and drift as new controllers are added.

## Key Teaching Points

1. Worktrees enable true parallel development — two independent features, no stash/branch switching.
2. String PKs need explicit sort — never assume JPA default sort is correct.
3. Catch-all security rules are more maintainable than per-path rules in a growing API.

## Lab Exercise Derivation

- **Setup:** Region entity exists. Location and Job need to be built.
- **Task:** Use `/worktree create` to scaffold Location and Job in parallel, then merge. Observe the security conflict and apply the catch-all fix.
- **Expected discovery:** Parallel worktrees feel natural after the first merge. The conflict teaches why catch-all rules matter.
- **Success criteria:** All 4 entities return data from `GET /app/hr/api/v1/{entity}`. No security permit conflicts after catch-all refactor.
