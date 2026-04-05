# Lab 2: Plan Mode — Think Before You Build

**Duration:** 60 minutes
**Day:** 1 — Foundation
**Builds On:** Lab 1 (CLAUDE.md in place)
**Produces:** A fully designed and implemented `hireEmployee()` method

---

## Learning Objective

You will design a complex service method using Plan Mode, observe how planning surfaces hidden requirements, and implement from the plan. You'll also see what happens when you skip planning — and why it costs more time than it saves.

---

## The Key Concept

Plan Mode is activated via `Shift+Tab` twice (or `/plan`). In Plan Mode, Claude researches and proposes an implementation plan **without writing any code**. You iterate on the plan until it's solid, then switch to normal mode and implement.

**The 4-Phase Workflow:**

```
Explore → Plan → Implement → Commit
```

**When to use Plan Mode:**
- Any task that touches 3+ files
- Any task with business rules, validation, or side effects
- Any task where you're unsure of the approach
- When a mistake would be expensive to fix

**When to skip it:**
- You could describe the diff in one sentence
- Simple renames, typo fixes, single-file changes

---

## Setup

Continue from Lab 1. You should have a working CLAUDE.md with naming, logging, database, and API response rules. If not, copy the escape hatch CLAUDE.md from Lab 1's Escape Hatch section into the project root.

---

## Exercise 1: The Bad Path — Skip the Plan (15 min)

### Goal
Implement `hireEmployee()` WITHOUT planning. Observe what's missing.

### Instructions

1. Ask Claude to implement directly (do NOT use Plan Mode):
   ```
   Implement hireEmployee() in HrEmployeeService.
   It should create a new employee record and return the employee detail DTO.
   Use the existing patterns from HrRegionService.
   ```

2. **Review the output.** Check:
   - [ ] Does it write a `job_history` record? (It should — every hire needs one)
   - [ ] Does it check idempotency? (Duplicate POST should not create two employees)
   - [ ] Does it validate salary against the job's min/max range?
   - [ ] Does it create an `hr_users` record for the new employee?
   - [ ] Does it mask PII in the response based on the caller's role?

3. **Count the missing requirements.** You'll likely find 2–4 gaps.

> **This is intentional.** "Create an employee" is what you said. That's all Claude did. The audit trail, idempotency, salary validation, and user account creation are implicit requirements that Claude couldn't infer from a one-line prompt.

4. Undo the implementation:
   ```
   Undo all changes from the last implementation. We're going to redo this properly.
   ```

---

## Exercise 2: The Good Path — Plan First (30 min)

### Goal
Design `hireEmployee()` in Plan Mode, iterate until the plan is complete, then implement.

### Instructions

1. Enter Plan Mode:
   ```
   Shift+Tab twice
   ```
   Or type:
   ```
   /plan
   ```

2. Give Claude the full design brief:
   ```
   Design the hireEmployee() method for HrEmployeeService.

   Requirements:
   - Creates a new employee from HrEmployeeCreateRequest
   - Must validate salary against the job's min_salary/max_salary range
   - Must check idempotency (X-Idempotency-Key header, stored in hr_idempotency_keys)
   - Must check email uniqueness (no duplicate employee emails)
   - Must create a job_history record (every hire = first job history entry)
   - Must create an hr_users record (username defaults to email prefix)
   - Must return HrEmployeeDetailDTO with PII masking based on caller's role
   - @PreAuthorize for ADMIN and HR_SPECIALIST only

   Show me the data flow, method signature, what repositories are needed,
   and the transaction boundary. Don't implement yet.
   ```

3. **Review the plan.** Look for:
   - Does it identify all 7 steps (idempotency → email check → load job → validate salary → save employee → create user → create job history)?
   - Does it show the correct transaction boundary (`@Transactional` wrapping all writes)?
   - Does it call out which repositories are needed?
   - Does it mention error cases (job not found, department not found, salary out of range)?

4. **Iterate on the plan.** If anything is missing:
   ```
   The plan is missing error handling for when the manager ID doesn't exist.
   Also, what happens if the username derived from email is already taken?
   Update the plan.
   ```

5. When the plan is solid, **switch to normal mode** and implement:
   ```
   Shift+Tab (back to normal mode)

   Implement hireEmployee() exactly as designed in the plan above.
   ```

6. **Verify:** Run `mvn compile` to check it compiles. Review the method against the plan.

> **Reference:** If you get stuck, compare with `reference/backend/hrapp-service/src/main/java/com/company/hr/service/HrEmployeeService.java.reference` — the full working version is there.

### What You Should See

The planned implementation should include all 7 steps, proper error handling, and the transaction boundary — everything that was missing in Exercise 1. The plan surfaced the implicit requirements before a single line of code was written.

---

## Exercise 3: Compare and Encode (15 min)

### Goal
Compare the two approaches and encode the lesson.

### Instructions

1. Compare Exercise 1 vs Exercise 2:
   ```
   Compare the hireEmployee() implementation from our first attempt (no plan)
   vs the current implementation (from plan). What requirements were missed
   in the first attempt?
   ```

2. **Add a rule to CLAUDE.md:**
   ```markdown
   ## Employee Lifecycle Rules
   - Every hire/promote/transfer/terminate MUST write a job_history record
   - Hire endpoint requires idempotency key (checked in service layer)
   - findById masks salary/PII based on HrSecurityUtil.canViewSalary()/canViewPii()
   ```

3. Ask Claude to self-critique:
   ```
   Is there anything in the current hireEmployee() implementation
   that doesn't follow CLAUDE.md conventions? Check logging, response format,
   security annotations, and error handling.
   ```

4. Fix any issues Claude identifies.

---

## Success Criteria

- [ ] Exercise 1 is missing at least 2 requirements (job_history, idempotency, etc.)
- [ ] Exercise 2 plan includes all 7 steps before implementation starts
- [ ] Final `hireEmployee()` compiles and follows all CLAUDE.md conventions
- [ ] CLAUDE.md now contains Employee Lifecycle Rules
- [ ] You can explain when to use Plan Mode vs when to skip it

---

## Key Takeaways

1. **"Create X" prompts produce only X.** Audit trails, idempotency, and masking need explicit mention — or a plan that surfaces them.
2. **Planning is cheaper than debugging.** 5 minutes of planning saved 20 minutes of rework.
3. **The plan output feeds CLAUDE.md.** Don't discard the plan — extract rules from it.
4. **Iterate the plan, not the code.** It's much cheaper to rewrite a plan bullet than refactor 50 lines of Java.

---

<details>
<summary><strong>Escape Hatch</strong> — Click if stuck on Plan Mode</summary>

If Plan Mode isn't activating:
- Type `/plan` explicitly
- Or press `Shift+Tab` **twice** (once switches to auto-accept, twice switches to Plan Mode)

If the plan is incomplete, try this prompt:
```
Think harder about this design. I need:
1. Every step in order, numbered
2. Which repository method is called at each step
3. What exception is thrown if each step fails
4. The @Transactional boundary
Show me a table: Step | Action | Repository | Error Case
```
</details>
