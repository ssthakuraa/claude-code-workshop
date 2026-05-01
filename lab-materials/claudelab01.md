# Lab 01: CLAUDE.md — Your Enterprise Constitution

**Duration:** 60 minutes

## Learning Objective

You will experience how Claude Code behaves **without** project conventions, observe it make predictable mistakes, and then fix those mistakes by writing CLAUDE.md rules. By the end, you'll understand why CLAUDE.md is the single most important file in any Claude Code project.

---

## The Key Concept

CLAUDE.md is a markdown file in the project root of your local repo workspace
that Claude Code reads automatically at the start of every session. It acts as a
permanent instruction manual: your team's conventions, standards, and hard-won
lessons.

**What makes it powerful:**
- Loaded every session — Claude Code never "forgets" what's in it
- Checked into the shared repo/workspace bundle — the team shares and improves it together
- Compounding — every correction you add prevents future mistakes
- Concise — keep it under ~200 lines. Every line must earn its place.

**What to include vs exclude:**

| Include | Exclude |
|---------|---------|
| Build/test/lint commands | Things Claude Code figures out by reading code |
| Conventions that differ from defaults | Standard language conventions |
| Architectural decisions specific to your project | Long tutorials or API docs |
| Common gotchas and anti-patterns | Information that changes frequently |
| Environment quirks | File-by-file codebase descriptions |

---

## Exercise 1: Observe the Failure (15 min)

### Goal
Ask Claude Code to scaffold a backend module **without** the missing CLAUDE.md rules. Observe what goes wrong.

### Instructions

1. Open a Claude Code session in the project root:
   ```bash
   cd /absolute/path/to/your-workshop-root
   claude
   ```

2. For this exercise, if Claude Code needs repo comparison points, keep it limited to
   these current files only:
   - `backend/hrapp-service/src/main/java/com/company/hr/resource/HrDepartmentResource.java`
   - `backend/hrapp-service/src/main/java/com/company/hr/resource/HrJobResource.java`
   - `backend/hrapp-service/src/main/java/com/company/hr/repository/HrDepartmentJdbcRepository.java`
   - `backend/hrapp-service/src/main/java/com/company/hr/repository/HrJobJdbcRepository.java`
   - `backend/hrapp-common/src/main/java/com/company/hr/common/response/HrApiResponse.java`
   - `backend/hrapp-common/src/main/java/com/company/hr/common/log/HrLogHelper.java`

2. Ask Claude Code to scaffold the `Region` backend slice using the current Jersey/JDBC architecture:
   ```
   This is a student exercise.
   Stay inside the current lab. Do not scan ahead or use `reference/` unless this chapter explicitly allows it or I ask for rescue help.
   Strictly perform only what this prompt asks.
   If you need repo comparison points, inspect only the files this chapter explicitly names.
   Scaffold a read-only Region reference module for the HR app.
   Create only the repository, resource, and response DTO needed for GET /app/hr/api/v1/regions.
   Do not add a request DTO.
   Do not add POST, PUT, PATCH, or DELETE endpoints.
   Do not add extra layers, helpers, services, or patterns not explicitly requested.
   Do not modify application registration or runtime wiring in this exercise.
   ```

   Keep the prompt narrow. The point is to see whether the starter rules are
   enough to keep Claude Code inside the intended lab boundary.

3. **Observe the output carefully.** Because the starter `CLAUDE.md` is intentionally incomplete, you should expect Claude Code to produce code with gaps, missing conventions, or incorrect repo assumptions. Use this checklist to identify what is incomplete, misaligned, or invented:
   - [ ] Did Claude Code create a Jersey `*Resource` and JDBC `*JdbcRepository`, or did it drift into a controller/service/JPA stack that this repo does not use?
   - [ ] Did the class names use the current `Hr*` naming pattern?
   - [ ] Did the endpoint shape follow the current `/app/hr/api/v1/...` and `HrApiResponse<T>` conventions?
   - [ ] Did the logging guidance match current `HrLogHelper` usage?
   - [ ] Did the backend code target the current PostgreSQL / `AIHR_*` runtime assumptions instead of inventing different persistence/runtime assumptions?
   - [ ] Did Claude Code keep the exercise read-only, or did it invent request DTOs, write endpoints, or runtime wiring?
   - [ ] Did Claude Code explain what guidance it followed, or does the output look like it came from broad inference rather than explicit current-lab rules?

4. **Write down every mistake you find.** If the scaffold looks cleaner than
   expected, also write down any important convention that Claude Code handled only by
   inference or luck because CLAUDE.md did not guarantee it. You'll fix those
   gaps in Exercise 2.
   Treat "correct by inference" as a real finding, not as a pass.
   Your Exercise 1 notes should capture at least one visible drift or one
   governance-gap finding.

### What You Should See

Claude Code often makes 2–4 of these mistakes because it has no project-specific guidance. Common ones:
- Falls back to an outdated persistence style that does not match the repo
- Returns raw DTO data instead of wrapping in `HrApiResponse<T>`
- Misses an existing Jersey resource or JDBC repository pattern
- Assumes stale database/runtime conventions

If your first pass is cleaner than expected, do **not** pretend it failed.
Treat that as a hidden-governance signal instead: Claude Code inferred conventions
that CLAUDE.md still does not guarantee. In that case, your Exercise 1 output
should be a list of missing rules you would not want to rely on luck for in a
new session, on a larger feature, or with a different model.

If you are unsure whether something was a mistake, compare it against the current repo shape:
- this repo uses Jersey resources, not generic "controllers"
- this repo uses explicit JDBC repositories, not a JPA service stack
- this repo already has good comparison points in `HrDepartment*` and `HrJob*`
  backend classes
- this exercise is intentionally read-only; request DTOs, write endpoints, and
  runtime registration are out of scope
- this lab expects you to notice extra invented structure, stale assumptions, and naming drift, not just compile errors

> **This is the teaching moment.** Claude Code is capable but ignorant of YOUR conventions. Without CLAUDE.md, every session is a blank slate.

---

## Exercise 2: Write the Rules (20 min)

### Goal
Update CLAUDE.md with rules that prevent every mistake you observed in Exercise 1.

### Instructions

1. Review the mistakes from Exercise 1 and expect to add or strengthen rules in these areas:
   - **Golden rule:** keeps Claude Code inside the current lab, forbids scanning ahead or unauthorized `reference/` use, and keeps it acting like a student partner. If the starter already contains a weak version of this rule, strengthen it instead of deleting it. This rule matters because the exercise is testing whether Claude Code follows `CLAUDE.md` closely enough to stay inside the intended learner path.
   - **Naming:** require `Hr*` class names and the current `*Resource`, `*JdbcRepository`, request DTO, and response DTO patterns.
   - **Database/runtime:** keep runtime backend code on `AIHR_*` tables and prevent old MySQL, legacy pre-PostgreSQL, or framework-magic assumptions from coming back.
   - **Logging:** require `HrLogHelper`, avoid noisy entry/exit logging, and never log PII.
   - **Backend architecture/API response:** require Jersey/JAX-RS with explicit JDBC repositories and `HrApiResponse<T>` on all endpoints.

2. You can issue the following prompt to Claude Code:
   ```
   Read CLAUDE.md and update it based on the mistakes from the Region scaffolding exercise.
   
   Add concise, explicit rules in these areas if they are missing or too weak:
   - Golden Rule: stay inside the current lab; do not scan ahead or use `reference/` unless the current chapter allows it or the learner asks for rescue help; act like a student partner and do not use expert shortcuts or hidden fixes unless asked.
   - Scope Control: when a lab prompt defines a read-only reference module, do not invent request DTOs, write endpoints, or runtime wiring that the prompt did not ask for.
   - Naming Conventions: all Java classes start with Hr; follow the current *Resource, *JdbcRepository, request DTO, and response DTO naming patterns.
   - Database Rules: runtime backend code targets AIHR_* tables only; database/hrschema.sql and database/hrdemo.sql are the active local PostgreSQL scripts; do not reintroduce MySQL, legacy pre-PostgreSQL, or Flyway assumptions.
   - Logging Pattern: use HrLogHelper; avoid noisy entry/exit logging on every method; never log PII such as email, phone, or salary.
   - Backend Architecture: active backend is Jersey/JAX-RS with explicit JDBC repositories; all endpoints return HrApiResponse<T>; never return raw objects.
   
   Keep CLAUDE.md concise. Every rule should prevent a specific mistake from the exercise.
   Paste the concrete CLAUDE.md edits directly into the file.
   ```

---

## Exercise 3: Verify the Rules Work (15 min)

### Goal
Redo the same scaffolding task and confirm Claude Code now follows your rules.

### Instructions

1. **Exit Claude Code and resume** — this is critical because `CLAUDE.md` is
   read at session start.
   Exit the current Claude Code session from your workspace root.
   > **Note:** Claude Code does not print a resume command on exit. Close and re-open the project in Claude Code, or use `/continue` to resume the conversation.

2. Ask Claude Code the **exact same prompt** as Exercise 1:
   ```
   This is a student exercise.
   Stay inside the current lab. Do not scan ahead or use `reference/` unless this chapter explicitly allows it or I ask for rescue help.
   Strictly perform only what this prompt asks.
   If you need repo comparison points, inspect only the files this chapter explicitly names.
   Scaffold a read-only Region reference module for the HR app.
   Create only the repository, resource, and response DTO needed for GET /app/hr/api/v1/regions.
   Do not add a request DTO.
   Do not add POST, PUT, PATCH, or DELETE endpoints.
   Do not add extra layers, helpers, services, or patterns not explicitly requested.
   Do not modify application registration or runtime wiring in this exercise.
   ```

3. **Check the code and confirm the mistakes you noticed before are now gone:**
   - [ ] Current Jersey/JDBC patterns followed?
   - [ ] `HrLogHelper` used without noisy entry/exit logging?
   - [ ] `HrApiResponse<T>` on all resource endpoints?
   - [ ] Class names start with `Hr`?
   - [ ] Runtime assumptions match the PostgreSQL / `AIHR_*` backend?

4. If any mistakes remain, add another rule to CLAUDE.md and repeat.

### What You Should See

Claude Code should now produce convention-compliant code on the **first try** — no corrections needed. The CLAUDE.md rules prevented every mistake from Exercise 1, and the golden rule should keep the next fresh session from skipping the learning steps.

---

## Exercise 4: Final Reflection (10 min)

### Goal
Practice the compounding loop that you'll use at the end of every lab.

### Instructions

1. Review your CLAUDE.md. Ask yourself:
   - Is every rule specific and actionable? (Not vague like "write clean code")
   - Is any rule something Claude Code already does correctly without being told? (Delete it)
   - Is any rule too long? (Shorten it — Claude Code reads better with terse rules)

2. Ask Claude Code to critique its own CLAUDE.md:
   ```
   Read CLAUDE.md and identify any rules that are:
   1. Too vague to be actionable
   2. Redundant with what you'd do by default
   3. Missing — based on common Jersey/JAX-RS + JDBC + React mistakes
   Suggest improvements.
   ```

3. Apply Claude Code's suggestions if they're good. Reject if they're not.

> **This is the compounding loop:** mistake → rule → verify → refine. By the end of this self-paced lab sequence, your CLAUDE.md will be a living document that makes Claude Code dramatically better at your specific project.

---

## Success Criteria

- [ ] CLAUDE.md contains at least 5 project-specific rules
- [ ] Exercise 1 surfaces at least 2 real convention gaps:
      visible violations, hidden assumptions, or rules Claude Code followed only by inference
- [ ] Exercise 3 produces 0 convention violations (same prompt, rules in place)
- [ ] You can explain the difference between CLAUDE.md (always loaded) and Skills (on-demand)

---

## Key Takeaways

1. **CLAUDE.md is production infrastructure** — iterate on it like prompts, not like documentation
2. **Every correction should become a rule** — if you corrected Claude Code, encode it so it never repeats
3. **Concise > comprehensive** — ~200 lines max. Claude Code ignores bloated files.
4. **Team-shared in the repo** — the whole team contributes. Review CLAUDE.md changes like code.
5. **The golden learner rule belongs in CLAUDE.md** — if you want fresh sessions to stay inside the exercise, make that behavior durable there.

---

<details>
<summary><strong>Recovery Path</strong> — Use this if you get stuck for more than 5 minutes</summary>

Stay inside the current lab. Do not scan ahead or use `reference/` unless this
recovery path explicitly tells you to.

If the exercise gets noisy or Claude Code wanders off the point, reset the exercise
to the smallest useful state:

```bash
cd /absolute/path/to/your-workshop-root
```

Then ask Claude Code to do only this:

```text
Read CLAUDE.md, CLAUDE.md only. Do not scan the codebase.
Summarize the exact missing rule categories exposed by the Region scaffolding exercise.
Then update CLAUDE.md with only those missing rules.
Do not edit any Java or frontend files in this step.
```

After that update:

1. exit Claude Code
2. re-open the project in Claude Code (there is no `resume` command; use `/continue` or reopen the same project window)
3. rerun the original Region scaffolding prompt from Exercise 1
</details>
