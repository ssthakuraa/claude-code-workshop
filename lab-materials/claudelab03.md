# Lab 03: Skills & Reusable Workflows — Repo Skills

**Duration:** 60 minutes

## Learning Objective

You will create a custom skill that encodes a repeatable pattern, then use it to scaffold a backend module in a single prompt. You will also create a second skill for repeatable verification work. The contrast between manual restatement and a reusable skill demonstrates why encoding patterns is the #1 productivity multiplier.

---

## The Key Concepts

### Skills
- Skills are reusable, scoped instruction packs for Claude Code.
- Unlike CLAUDE.md (loaded every session), skills are selective and task-specific — keeping context lean.
- They can include templates, scripts, and reference files.
- For this lab, repo-scoped skills live under `.claude/commands/`.
- `SKILL.md` is required. Optional metadata can live under `agents/openai.yaml`.

### Reusable Workflow Artifacts
- In Claude Code, a skill is the cleanest repo-native way to package a repeated workflow.
- That means this lab uses a second skill for verification instead of a loose markdown command note.
- The durable lesson is still the same: if a workflow repeats, package it.

### The Agent Concept
- Before Lab 06 introduces delegated reviewer/builder agents, treat your main Claude Code session as the primary agent.
- Skills help that agent stay consistent without bloating CLAUDE.md.

### The Rule
> *"If you do something more than once a day, turn it into a skill."*

---

## Exercise 1: The Manual Way (15 min)

### Goal
Scaffold the `Country` backend module manually to feel the pain of re-explaining patterns.

### Instructions

1. Ask Claude Code to scaffold the Country backend module manually:
   ```
   First inspect the current HrDepartment/HrJob repository and resource files so the generated read shape matches the starter tree.
   Then inspect the promote or transfer flow in HrEmployeeResource and
   HrEmployeeCommandJdbcRepository so the generated write-path conventions match
   the current backend for validation, transaction handling, and response status.

   Scaffold the Country reference module for the HR app.
   - HrCountry request/response DTOs
   - HrCountryJdbcRepository following existing JDBC patterns
   - HrCountryResource at /app/hr/api/v1/countries
   - CRUD operations aligned to the current Jersey/JDBC backend
   Follow CLAUDE.md conventions: Hr prefix, HrLogHelper, HrApiResponse envelope,
   PostgreSQL + AIHR_* runtime assumptions, and current backend architecture.
   ```

2. **Count the prompt length.** You had to re-specify:
   - Every backend layer this repo actually uses (DTOs/requests, JDBC repository, Jersey resource, and any wiring)
   - Every convention (Hr prefix, logging, response envelope, PostgreSQL/Jersey runtime shape)
   - The table mapping and field details

3. If Claude Code missed anything, you'll need **follow-up prompts** to fix it. Count those too.

4. **Total prompt count:** _____ (likely 2–4 prompts to get it right)

> Now imagine doing this for 8 entities. That's 16–32 prompts of mostly-repeated instructions.

---

## Exercise 2: Create the Skill (20 min)

### Goal
Package the scaffolding pattern into a reusable skill.

### Instructions

1. Ask Claude Code to create a draft skill directory in the workspace:
   ```
   Create the directory `.claude/commands/scaffold-reference-module`.
   ```

2. Ask Claude Code to create the skill based on the Region + Country patterns:
   ```
   Create a skill at .claude/commands/scaffold-reference-module/SKILL.md
   that encodes our backend reference-module scaffolding pattern.
   The skill should:

   1. Accept parameters: module name, endpoint path, table/query shape, key fields
   2. Generate the current layers we use here:
      DTO/request objects, JDBC repository, Jersey resource, and needed wiring
   3. Follow all CLAUDE.md conventions automatically
   4. Include an out-of-scope section so it does not overreach

   Base it on the Region slice you already have plus the Country slice you just built,
   while keeping the repository/resource structure aligned to the current Department/Job examples.
   Include a section on common gotchas (PostgreSQL/AIHR_* assumptions, response envelopes,
   naming, and logging expectations).
   ```

3. **Review the generated SKILL.md.** From another terminal, you can inspect it with:
   ```bash
   cat /absolute/path/to/claude-workshop/.claude/commands/scaffold-reference-module/SKILL.md
   ```
   It should start with a metadata block like:
   `name: scaffold-reference-module` and `description: Scaffold an HR reference module following the current Jersey/JDBC project conventions`, followed by the pattern description, inputs, output shape, and gotchas.

4. **Refine the skill** if needed:
   ```
   The skill should also mention:
   - runtime code targets AIHR_* tables only
   - follow existing *JdbcRepository and *Resource examples before generating
   - do not invent Spring Boot/JPA layers that do not exist in this repo
   Update the skill.
   ```

---

## Exercise 3: Use the Skill (10 min)

### Goal
Scaffold a new entity using the skill — one prompt, zero corrections.

### Instructions

1. **Start a fresh context** by opening a new Claude Code session or resetting the current one if your client supports that.

2. Use the skill to scaffold Location:
   ```
   Use the scaffold-reference-module skill to scaffold the Location reference module.
   Endpoint: /app/hr/api/v1/locations
   Core fields:
   - locationId
   - streetAddress
   - postalCode
   - city
   - stateProvince
   - countryId / country details
   ```

3. **Compare with Exercise 1:**
   - Prompts needed in Exercise 1: _____ (2–4)
   - Prompts needed with skill: **1**
   - Did Claude Code follow all conventions? (Hr prefix, logging, response envelope, etc.)

4. To verify, ask Claude Code:
   ```
   Run `cd backend && ./build-jersey-service.sh compile` and tell me whether the
   Location module compiles cleanly.
   Use the backend wrapper, not raw `mvn`.
   ```

### What You Should See

One prompt → the correct module layers → compiles clean → all conventions followed. The skill eliminated the need to re-explain the pattern.

---

## Exercise 4: Create a Verification Skill (10 min)

### Goal
Create a reusable verification skill for daily use.

### Instructions

1. Ask Claude Code to create the second skill directory:
   ```
   Create the directory `.claude/commands/run-tests`.
   ```

2. Ask Claude Code to create the verification skill:
   ```
   Create .claude/commands/run-tests/SKILL.md that standardizes how we ask Claude Code
   to run and summarize verification in this repo.
   The skill should:
   1. Run backend unit tests via `cd backend && ./build-jersey-service.sh test`
   2. Summarize failures only
   3. Report pass/fail counts
   4. If frontend scope is involved, include frontend lint/build verification
   5. Explicitly avoid raw `mvn` so the repo-owned backend wrapper remains the
      standard learner path
   6. If a user-visible flow changed, add a short smoke-test note
   ```

3. Test it:
   ```
   Use the `run-tests` skill to run the backend test loop and summarize the result.
   ```

---

## Exercise 5: Capture the Rule (5 min)

1. Ask Claude Code to update `CLAUDE.md` in the project root of your local workspace
   by adding:
   ```
   ## Skills & Commands
   - Repeated backend scaffolding belongs in a repo skill under `.claude/commands/`, not in CLAUDE.md
   - Repeated verification belongs in a reusable skill such as `run-tests`
   ```

2. After Claude Code updates `CLAUDE.md`, exit Claude Code and use the printed resume command so the updated rules are loaded in the next session.

3. Reflect: *What other patterns in your real codebase could become skills?*

---

## Success Criteria

- [ ] The scaffold skill exists in `.claude/commands/scaffold-reference-module/SKILL.md`
- [ ] Location module scaffolded with one prompt, zero corrections
- [ ] A reusable run-tests skill exists and is usable
- [ ] Manual scaffolding (Exercise 1) required 2+ prompts; skill required 1
- [ ] CLAUDE.md updated with skill/command references

---

## Key Takeaways

1. **Skills compound engineering** — define the pattern once, reuse it N times without context drift
2. **Skills are on-demand, CLAUDE.md is always-on** — use skills for large patterns that would bloat CLAUDE.md
3. **Reusable workflows belong in skills** — if you do it more than once a day, package it as a repo skill
4. **Team-shared in the repo** — checked-in skill sources let the whole team benefit.

---

<details>
<summary><strong>Recovery Path</strong> — Use this if the skill drafting gets noisy</summary>

Stay inside the current lab. Do not scan ahead or use `reference/` unless this
recovery path explicitly tells you to.

If the skill draft wanders, reset to the smallest safe request:

```text
Read only these current files first:
- `CLAUDE.md`
- `lab-materials/claudelab03.md`
- the existing `HrDepartment*` and `HrJob*` backend files you need for examples

Then create:
- `.claude/commands/scaffold-reference-module/SKILL.md`
- `.claude/commands/run-tests/SKILL.md`

Do not edit unrelated files.
Keep the skill instructions short, concrete, and repo-specific.
```

Once the skill files exist, rerun Exercise 5 and add the rule block to
`CLAUDE.md`.
</details>
