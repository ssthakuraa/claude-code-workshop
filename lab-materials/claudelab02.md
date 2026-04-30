# Lab 02: Planning Discipline — Think Before You Build

**Duration:** 60 minutes

## Learning Objective

You will design a complex backend change using an explicit planning workflow, observe how planning surfaces hidden requirements, and implement from the plan. You'll also see what happens when you skip planning — and why it costs more time than it saves.

---

## Key Terms

| Term | Meaning in this lab |
|---|---|
| `agent` | The Claude Code session doing the work in your repo |
| `plan` | A repo-grounded implementation approach produced before code is written |
| `verify` | Compile, test, or otherwise prove the implementation matches the plan |
| `worklist` | A durable checklist for multi-step or multi-session work |

## The Key Concept

In Claude Code, the important habit is not a specific UI mode. The important habit is to ask for a repo-grounded plan **before** implementation when the task is non-trivial. You iterate on that plan until it is solid, then you ask Claude Code to implement against it.

**The 4-Phase Workflow:**

```
Explore → Plan → Implement → Verify
```

**When to plan first:**
- Any task that touches 3+ files
- Any task with business rules, validation, or side effects
- Any task where you're unsure of the approach
- When a mistake would be expensive to fix

**When to skip it:**
- You could describe the diff in one sentence
- Simple renames, typo fixes, single-file changes

---

## Setup

You should have a working CLAUDE.md from Lab 01. If not, ask Claude Code to restore
it for you with this exact prompt:

```text
Restore `CLAUDE.md` from `reference/lab01/CLAUDE.md`.
Only replace that file.
Do not inspect or modify anything else.
Then tell me the restore is complete.
```

### Starter-State Note

In the staged training workspace, the hire-flow path is intentionally incomplete.
That gap is part of the exercise design, not a repo accident. Before you rebuild it,
it is acceptable for hire attempts to fail because the starter has been shaped to
give you a real planning and implementation target.

---

## Exercise 1: The Bad Path — No Plan, Observe the Gaps (15 min)

### Goal
Audit the existing hire flow WITHOUT planning — observe what the starter code is missing.

> **Note:** The starter workspace already has a partial `hireEmployee()` implementation — it compiles and returns a hired employee, but it is intentionally incomplete. Your job is to **observe and document the gaps**, not to implement from scratch.

### Instructions

1. Ask Claude Code to audit the existing hire flow (do NOT ask for a plan first):
   ```
   Audit the existing backend hire flow for the HR app.
   Read the current hireEmployee() method in HrEmployeeCommandJdbcRepository
   and the hire() endpoint in HrEmployeeResource.
   Do not modify any files yet.
   Report which of these requirements are currently missing from the implementation:
   - writes a job_history record (every hire = first job history entry)
   - checks idempotency (duplicate POST should not create two employees)
   - validates salary against the job's min/max range
   - creates an AIHR_USERS record for the new employee
   - masks PII in the response based on the caller's role
   This is the bad path on purpose.
   Do not add or fix anything yet.
   ```

2. **Review the output.** Check:
   - [ ] Does it write a `job_history` record? (It should — every hire needs one)
   - [ ] Does it check idempotency? (Duplicate POST should not create two employees)
   - [ ] Does it validate salary against the job's min/max range?
   - [ ] Does it create an `AIHR_USERS` record for the new employee?
   - [ ] Does it mask PII in the response based on the caller's role?

3. **Count the missing requirements.** You should find at least 2–4 gaps.

> **This is intentional.** The starter `hireEmployee()` is deliberately incomplete. If Claude Code identifies requirements not listed above (audit trail, email uniqueness, etc.), treat those as good findings too — write them down. If the audit comes up empty, push harder: ask Claude Code to compare against `terminateEmployee()` or `transferEmployee()` as reference implementations of a complete lifecycle flow.

4. **Preserve the first attempt before undoing it.** Ask Claude Code to capture a short note you can compare later:
   ```
   Summarize the first attempt before we undo it.
   Show:
   1. which files changed
   2. which important requirements are still missing
   3. a short bullet list named "bad path snapshot" that I can reuse in Exercise 3
   Do not fix anything yet.
   ```

5. Ask Claude Code to restore the learner workspace to the pre-implementation state. For this training bundle, keep the learner recovery path on the checked-in `reference/` escape hatches and the repo starter state.
   Use a prompt like:
   ```
   Restore only the files changed by the last implementation attempt.
   Inspect only the touched files and the specific checked-in `reference/`
   rescue material needed to restore them.
   Use the checked-in `reference/` escape hatches and the current repo starter
   state instead of assuming a separate learner zip.
   Copy back only the touched files.
   Do not perform broad repo discovery or modify anything else.
   We're going to redo this properly.
   ```

---

## Exercise 2: The Good Path — Plan First (30 min)

### Goal
Design the hire flow first, iterate until the plan is complete, then implement.

### Instructions

1. Ask Claude Code for a plan first:
   ```
   Design the backend hire flow for the current HR app.

   Requirements:
   - Entry point stays aligned with the current Jersey resource + JDBC repository patterns
   - Creates a new employee from HrEmployeeCreateRequest
   - Must validate salary against the job's min_salary/max_salary range
   - Must check idempotency using the current request/body contract
   - Must check email uniqueness (no duplicate employee emails)
   - Must create a job_history record (every hire = first job history entry)
   - Must create an `AIHR_USERS` record (username defaults to email prefix)
   - Must return HrEmployeeDetailDTO with PII masking based on caller's role
   - Must preserve the current frontend-used API contract

   Show me:
   1. the data flow
   2. which current classes/files will change
   3. what repository methods are needed
   4. the transaction boundary
   5. the verification plan
   Do not implement yet.
   ```

2. **Review the plan.** Look for:
   - Does it identify all 7 steps (idempotency → email check → load job → validate salary → save employee → create user → create job history)?
   - Does it show the correct transaction boundary (explicit JDBC transaction handling in `HrEmployeeCommandJdbcRepository`, with `setAutoCommit(false)` / `commit()` / rollback)?
   - Does it call out which repositories are needed?
   - Does it mention error cases (job not found, department not found, salary out of range)?

3. **Iterate on the plan.** If anything is missing:
   ```
   The plan is missing error handling for when the manager ID doesn't exist.
   Also, what happens if the username derived from email is already taken?
   Update the plan.
   ```

4. When the plan is solid, ask Claude Code to implement against it:
   ```
   Implement hireEmployee() exactly as designed in the plan above.
   For backend verification, use `cd backend && ./build-jersey-service.sh test`
   rather than a direct `mvn` command.
   ```

5. **Verify:** Ask Claude Code:
   ```
   Run `cd backend && ./build-jersey-service.sh test` to compile and validate
   the current implementation.
   Then compare the implementation against the plan and tell me whether anything
   is still missing.
   Do not switch to raw `mvn`.
   ```

### What You Should See

The planned implementation should include all 7 steps, proper error handling, and the transaction boundary — everything that was missing in Exercise 1. The plan surfaced the implicit requirements before a single line of code was written.

---

## Exercise 3: Compare, Verify, and Encode (15 min)

### Goal
Compare the two approaches and encode the lesson.

### Instructions

1. Compare Exercise 1 vs Exercise 2:
   Compare the actual "bad path snapshot" captured from Exercise 1 against the current implementation from the plan-first path. Use the captured snapshot from this run, even if the bad path drifted or over-completed. Do not rewrite the story into an idealized textbook bad path. Write down which requirements were missed, invented, or handled incorrectly in the first attempt, and how the planned version fixed them.

2. **Add a rule to CLAUDE.md:**
   ```
   Update CLAUDE.md by adding these rules:

   ## Employee Lifecycle Rules
   - Every hire/promote/transfer/terminate MUST write a job_history record
   - Hire endpoint requires idempotency key; request validation happens in the resource layer and duplicate-request enforcement happens in the command repository
   - findById masks salary/PII based on HrSecurityUtil.canViewSalary()/canViewPii()
   ```

   After Claude Code updates `CLAUDE.md`, exit Claude Code and use the printed resume command so the updated rules are loaded in the next session.

3. Ask Claude Code to self-critique:
   ```
   Is there anything in the current hireEmployee() implementation
   that doesn't follow CLAUDE.md conventions? Check logging, response format,
   security annotations, and error handling.
   ```

4. Ask Claude Code:
   ```
   Fix any good issues you identified in the current hireEmployee()
   implementation.
   Keep the changes aligned to CLAUDE.md and rerun the backend wrapper-based
   verification if needed.
   ```

5. Add an explicit verification step to your own workflow notes:
   - plan
   - implement
   - verify
   - only then mark complete

## Common Mistakes & Fixes

- Mistake: asking Claude Code to "just implement it" on a multi-file workflow.
  Fix: ask for affected files, data flow, transaction boundary, and verification first.
- Mistake: treating the first plan as final.
  Fix: iterate on missing error cases and side effects before coding.
- Mistake: planning only the implementation and not the verification.
  Fix: require compile/test/manual verification in the plan itself.

---

## Success Criteria

- [ ] Exercise 1 is missing at least 2 requirements (job_history, idempotency, etc.)
- [ ] Exercise 2 plan includes all 7 steps before implementation starts
- [ ] Final `hireEmployee()` compiles and follows all CLAUDE.md conventions
- [ ] CLAUDE.md now contains Employee Lifecycle Rules
- [ ] You can explain when to ask Claude Code for an explicit plan vs when to skip it

---

## Key Takeaways

1. **"Create X" prompts produce only X.** Audit trails, idempotency, and masking need explicit mention — or a plan that surfaces them.
2. **Planning is cheaper than debugging.** 5 minutes of planning saved 20 minutes of rework.
3. **The plan output feeds CLAUDE.md.** Don't discard the plan — extract rules from it.
4. **Iterate the plan, not the code.** It's much cheaper to rewrite a plan bullet than refactor 50 lines of Java.
