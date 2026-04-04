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
Scaffold a new entity using the skill — one prompt, zero corrections.

### Instructions

1. **Start a fresh context:**
   ```
   /clear
   ```

2. Use the skill to scaffold Location:
   ```
   /scaffold-entity
   Entity: Location
   Table: locations
   Fields:
   - locationId (Integer, PK, auto-generated)
   - streetAddress (String, max 40)
   - postalCode (String, max 12)
   - city (String, max 30, required)
   - stateProvince (String, max 25)
   - country (FK → HrCountry)
   ```

3. **Compare with Exercise 1:**
   - Prompts needed in Exercise 1: _____ (2–4)
   - Prompts needed with skill: **1**
   - Did Claude follow all conventions? (Hr prefix, logging, response envelope, etc.)

4. Verify: `cd backend && mvn compile`

### What You Should See

One prompt → all 7 layers → compiles clean → all conventions followed. The skill eliminated the need to re-explain the pattern.

---

## Exercise 4: Create a Slash Command (10 min)

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
- [ ] Location entity scaffolded with one prompt, zero corrections
- [ ] `/run-tests` command exists and runs successfully
- [ ] Manual scaffolding (Exercise 1) required 2+ prompts; skill required 1
- [ ] CLAUDE.md updated with skill/command references

---

## Key Takeaways

1. **Skills compound engineering** — define the pattern once, reuse it N times without context drift
2. **Skills are on-demand, CLAUDE.md is always-on** — use skills for large patterns that would bloat CLAUDE.md
3. **Slash commands for daily workflows** — if you do it more than once a day, make it a `/command`
4. **Team-shared via git** — `.claude/skills/` and `.claude/commands/` are checked in. The whole team benefits.

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
