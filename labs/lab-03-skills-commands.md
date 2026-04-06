# Lab 3: Skills & Commands — Reusable Knowledge Packs

**Duration:** 60 minutes
**Day:** 1 — Foundation
**Builds On:** Lab 1 (CLAUDE.md), Lab 2 (Plan Mode)
**Produces:** A `/scaffold-entity` skill and a `/run-tests` command

---

## Learning Objective

You will create a custom skill that encodes a repeatable pattern, then use it to scaffold an entity in a single prompt. You'll also create a slash command for a daily workflow. The contrast — 10 prompts manually vs 1 with a skill — demonstrates why encoding patterns is the #1 productivity multiplier.

---

## The Key Concepts

### Skills (`.claude/skills/`)
- Markdown files with YAML frontmatter that Claude discovers **automatically** when relevant
- Unlike CLAUDE.md (loaded every session), skills load **on-demand** — keeping context lean
- Can include templates, scripts, and reference files
- Can be invoked as slash commands with `user-invocable: true`

### Slash Commands (`.claude/commands/`)
- Markdown files that create reusable `/command` shortcuts
- Checked into git — shared with the team
- Can include inline bash to pre-compute context
- `$ARGUMENTS` placeholder for dynamic input

### The Rule
> *"If you do something more than once a day, turn it into a skill or command."*

---

## Setup

Continue from Labs 1–2. You should have CLAUDE.md with your rules in place and the Region entity built. If CLAUDE.md is missing, copy the escape hatch version from Lab 1.

---

## Exercise 1: The Manual Way (15 min)

### Goal
Scaffold the `Country` entity manually to feel the pain of re-explaining patterns.

### Instructions

1. Ask Claude to scaffold Country:
   ```
   Scaffold the Country entity for the HR app.
   - HrCountry entity → countries table (countryId CHAR(2), countryName, region FK)
   - HrCountryRepository
   - HrCountryDTO, HrCountryRequest
   - HrCountryService with findAll, findById, create, update, delete
   - HrCountryController at /app/hr/api/v1/countries
   Follow CLAUDE.md conventions: Hr prefix, HrLogHelper, HrApiResponse envelope,
   @PreAuthorize, @SQLRestriction for soft delete.
   Also use MapStruct for the mapper: HrCountryMapper.
   ```

2. **Count the prompt length.** You had to re-specify:
   - Every layer (entity, repo, DTO, request, service, controller, mapper)
   - Every convention (Hr prefix, logging, response envelope, security)
   - The table mapping and field details

3. If Claude missed anything, you'll need **follow-up prompts** to fix it. Count those too.

4. **Total prompt count:** _____ (likely 2–4 prompts to get it right)

> Now imagine doing this for 8 entities. That's 16–32 prompts of mostly-repeated instructions.

---

## Exercise 2: Create the Skill (20 min)

### Goal
Package the scaffolding pattern into a reusable skill.

### Instructions

1. Create the skill directory:
   ```bash
   mkdir -p .claude/skills/scaffold-entity
   ```

2. Ask Claude to create the skill based on the Region + Country patterns:
   ```
   Create a skill at .claude/skills/scaffold-entity/SKILL.md that encodes
   our entity scaffolding pattern. The skill should:

   1. Accept parameters: entity name, table name, fields with types and constraints
   2. Generate all 7 layers: Entity, Repository, DTO, Request, Mapper (MapStruct),
      Service (with HrLogHelper entry/exit), Controller (with HrApiResponse)
   3. Follow all CLAUDE.md conventions automatically
   4. Be user-invocable as /scaffold-entity

   Base it on the patterns from HrRegion and HrCountry that we just built.
   Include a section on common gotchas (deprecated annotations, naming strategy).
   ```

3. **Review the generated SKILL.md.** It should have:
   ```yaml
   ---
   name: scaffold-entity
   description: Scaffold a complete HR entity with all layers following project conventions
   user-invocable: true
   ---
   ```
   Followed by the pattern description, field mapping rules, and gotchas.

4. **Refine the skill** if needed:
   ```
   The skill should also mention:
   - countryId uses @Id with String type (CHAR columns), not Integer
   - FK relationships use @ManyToOne(fetch = FetchType.LAZY)
   - Soft delete uses deletedAt Instant + @SQLRestriction
   Update the skill.
   ```

---

## Exercise 3: Use the Skill (10 min)

### Goal
Scaffold a genuinely new entity using the skill — proving it works on something no one has built before.

### Instructions

1. **Start a fresh context:**
   ```
   /clear
   ```

2. Use the skill to scaffold Notification:
   ```
   /scaffold-entity
   Entity: Notification
   Table: hr_notifications
   Fields:
   - notificationId (Long, PK, auto-generated)
   - recipientUserId (Integer, FK → HrUser, required)
   - notificationType (ENUM: PROBATION_ALERT, CONTRACT_EXPIRY, ACTION_COMPLETE, SYSTEM, required)
   - title (String, max 255, required)
   - message (String/TEXT, optional)
   - referenceTable (String, max 60, optional)
   - referenceId (String, max 60, optional)
   - isRead (Boolean, default false)
   - createdAt (Instant/LocalDateTime, auto)
   - No soft delete needed — notifications are lightweight.
   ```

3. **Compare with Exercise 1:**
   - Prompts needed in Exercise 1: _____ (2–4 to scaffold Country)
   - Prompts needed with skill: **1**
   - Did Claude follow all conventions? (Hr prefix, HrLogHelper, HrApiResponse, @PreAuthorize, @SQLRestriction, etc.)

4. Verify: `cd backend && mvn clean compile`

> <details>
> <summary>Seeing lots of "cannot find symbol" errors?</summary>
> Run `mvn clean compile` (not just `mvn compile`). Lombok's annotation processor generates getters/setters in `target/generated-sources/annotations/`. When that directory has stale output from a previous build, Maven reuses cached output instead of regenerating for new or changed classes. `mvn clean` removes `target/` entirely, forcing a fresh rebuild. This is the #1 source of false compilation failures in Labs 2–3.
> </details>

5. **Why this matters:** Notification is a real entity your HR app will need. You didn't build it yet — the skill just delivered all 7 layers in one prompt. Compare that with Exercise 1 where you needed multiple prompts for Country and still had gaps.

### What You Should See

One prompt → all 7 layers → compiles clean → all conventions followed. The skill eliminated the need to re-explain the pattern and delivered a production-ready entity you actually need.

---

## Exercise 3b: Wire Frontend to Real API (10 min)

### Goal
You just built the Notification backend (Exercise 2). But the NotificationsPage at `/hr/notifications` currently uses hardcoded mock data. Wire it to call the real `/app/hr/api/v1/notifications` API you just scaffolded.

### The Key Concept

Frontend development often starts against mock data when the backend API isn't ready yet. This is the most common enterprise workflow — build the UI first, wire it to the real API when the backend exists.

### Instructions

1. Navigate to the NotificationsPage in your running frontend (`/hr/notifications`). It currently shows 5 hardcoded notifications.

2. Ask Claude to wire the page to the real API:
   ```
   Rewire src/pages/admin/NotificationsPage.tsx to fetch notifications
   from the real backend API at GET /app/hr/api/v1/notifications.

   Use TanStack Query (useQuery) for the data fetching — follow the
   pattern from src/api/employees.ts for the hook setup.
   Replace the hardcoded mock data completely.

   The backend returns:
   {
     "status": 200,
     "data": [array of notifications with notificationId, notificationType, title, message, isRead, createdAt]
   }

   Requirements:
   - Create a useNotifications() hook in src/api/notifications.ts
   - Use HrStatusBadge for read/unread status (use green dot for read, amber for unread)
   - Keep the mark-as-read and mark-all-read functionality
   - Add loading skeletons (HrSkeleton) and empty state
   - Sort by createdAt descending (newest first)
   - Mark-as-read should call PUT /app/hr/api/v1/notifications/{id}/mark-read
   - After mark-read, invalidate the notifications query so the list refreshes
   ```

3. After Claude makes the changes, verify it compiles:
   ```bash
   cd frontend && npx tsc --noEmit 2>&1 | head -20
   ```

4. Start the frontend and navigate to `/hr/notifications`. The page should now load data from the real Notification API you scaffolded in Exercise 2.

> **Reference:** A reference version exists at `reference/frontend/src/pages/admin/NotificationsPage.real.tsx`. Build your own first, then compare.

5. **What you just learned:** This is the standard enterprise workflow — mock data for rapid UI prototyping, then wire to the real API when the backend is ready. The skill gave you the backend in one prompt; wiring it is a single command on the frontend.

---

## Exercise 4: The Verification Agent Chain (15 min)

### Goal
Build a **verification chain** — a sequence of agent calls that progressively
increases the quality bar on your output. Learn the pattern that separates
"it compiles" from "it ships."

### The Concept

The professional workflow is not:
```
Build → Ship it
```

It's:
```
Build → Review (agent) → Fix → Test → Visual Verify (Playwright)
```

Each link catches different classes of defects:
| Link | Catches |
|------|---------|
| **Agent review** | Edge cases, accessibility gaps, type safety, consistency |
| **/run-tests** | Runtime bugs, incorrect logic, broken contracts |
| **Playwright** | Visual regressions, broken renders, missing elements |

### Instructions

1. **Review** — Send the NotificationsPage you wired in Exercise 3b
   to the component-reviewer agent:

   ```
   Use the component-reviewer agent to review
   src/pages/admin/NotificationsPage.tsx.
   Focus on accessibility, error states, and edge cases.
   ```

2. **Fix** — Address any Critical or Warning findings:

   ```
   Fix these issues from the component-reviewer:
   [paste the agent's Critical and Warning findings]
   ```

3. **Test** — Run the suite to make sure nothing broke:

   ```
   /run-tests
   ```

4. **Visual Verify** — If Playwright MCP is configured (Lab 9),
   navigate to the page and take a screenshot:

   ```
   Navigate to http://localhost:5173/hr/notifications.
   Take a screenshot. Do the notifications render correctly?
   Check for loading state, data state, and empty state.
   ```
   If Playwright isn't available yet, manually verify the page loads
   and note what you'd automate in Lab 9.

### The Escalation Pattern

As you gain confidence, add links to the chain:

```
Level 1 (beginner):  Build it. Check it compiles.
Level 2 (intermediate): Build → Review (agent) → Fix → Compile
Level 3 (advanced):   Build → Review → Fix → Test → Visual verify
```

Most juniors stop at Level 1. Seniors operate at Level 3 minimum.

### Add to CLAUDE.md

```markdown
## Verification Chain
- After building a feature: run component-reviewer agent, fix findings, run tests
- For frontend: also verify with Playwright MCP (screenshot + element check)
```

---

## Exercise 5: Create a Slash Command (10 min)

### Goal
Create a `/run-tests` command for daily use.

### Instructions

1. Create the commands directory:
   ```bash
   mkdir -p .claude/commands
   ```

2. Ask Claude to create a test runner command:
   ```
   Create a slash command at .claude/commands/run-tests.md that:
   1. Runs backend unit tests (mvn test -pl hrapp-service)
   2. Shows only failures (not full output)
   3. Reports a summary: total tests, passed, failed
   If $ARGUMENTS contains "frontend", also run npm run lint in frontend/.
   ```

3. Test it:
   ```
   /run-tests
   ```
   Then:
   ```
   /run-tests frontend
   ```

   > **Note:** You will see `hireEmployee` test failures if you haven't implemented it yet in Lab 2. That's expected — the test suite covers the full service contract. If you completed Lab 2, those tests should pass. Either way, the command itself is working correctly if it runs and reports results.

---

## Exercise 5: The Self-Improvement Coda (5 min)

1. Add to CLAUDE.md:
   ```markdown
   ## Skills & Commands
   - Entity scaffolding: use /scaffold-entity skill for new entities
   - Test runner: /run-tests (add "frontend" arg to include lint)
   ```

2. Reflect: *What other patterns in your real codebase could become skills?*

---

## Success Criteria

- [ ] `/scaffold-entity` skill exists in `.claude/skills/scaffold-entity/SKILL.md`
- [ ] Notification entity scaffolded with one prompt, zero corrections
- [ ] NotificationsPage wired to real API via `useNotifications()` hook in `src/api/notifications.ts`
- [ ] Mark-as-read and mark-all-read work with query invalidation
- [ ] `/run-tests` command exists and runs successfully
- [ ] Manual scaffolding (Exercise 1) required 2+ prompts; skill required 1
- [ ] CLAUDE.md updated with skill/command references and verification chain rules

---

## Key Takeaways

1. **Skills compound engineering** — define the pattern once, reuse it N times without context drift
2. **Skills are on-demand, CLAUDE.md is always-on** — use skills for large patterns that would bloat CLAUDE.md
3. **Slash commands for daily workflows** — if you do it more than once a day, make it a `/command`
1. **Skills compound engineering** — define the pattern once, reuse it N times without context drift
2. **Skills are on-demand, CLAUDE.md is always-on** — use skills for large patterns that would bloat CLAUDE.md
3. **Slash commands for daily workflows** — if you do it more than once a day, make it a `/command`
4. **Verification chain multiplies quality** — build → review (agent) → fix → test → visual verify (Playwright). Level 3 is production minimum.
5. **Team-shared via git** — `.claude/skills/` and `.claude/commands/` are checked in. The whole team benefits.

---

<details>
<summary><strong>Escape Hatch</strong> — Skill YAML frontmatter</summary>

```yaml
---
name: scaffold-entity
description: Scaffold a complete HR entity (Entity, Repo, DTO, Request, Mapper, Service, Controller) following CLAUDE.md conventions
user-invocable: true
---

## Entity Scaffolding Pattern

When invoked, generate all 7 layers for an HR entity:

### 1. Entity (model/)
- Class: Hr{EntityName}, @Entity, @Table(name = "{table_name}")
- @SQLRestriction("deleted_at IS NULL") for soft delete
- @EntityListeners(HrAuditListener.class)
- FKs: @ManyToOne(fetch = FetchType.LAZY)

### 2. Repository (repository/)
- Hr{EntityName}Repository extends JpaRepository<Hr{EntityName}, {IdType}>

### 3. DTO (dto/response/)
- Hr{EntityName}DTO with all display fields

### 4. Request (dto/request/)
- Hr{EntityName}Request with validation annotations (@NotBlank, @Size, etc.)

### 5. Mapper (mapper/)
- Hr{EntityName}Mapper using MapStruct (@Mapper(componentModel = "spring"))
- toDTO, fromRequest, updateFromRequest methods

### 6. Service (service/)
- Hr{EntityName}Service with HrLogHelper entry/exit on EVERY method
- findAll, findById, create, update, delete
- @Transactional, @PreAuthorize

### 7. Controller (controller/)
- Hr{EntityName}Controller at /app/hr/api/v1/{plural_name}
- ALL endpoints return HrApiResponse<T>

## Gotchas
- Use @SQLRestriction NOT @Where (deprecated Hibernate 6.2)
- Column names must match schema.sql exactly (PhysicalNamingStrategyStandardImpl)
- Never log PII in HrLogHelper calls
```
</details>
