# Lab 12: Capstone — End-to-End Feature Build

**Duration:** 150 minutes (Part 1: 60 min, Part 2: 90 min)
**Day:** 4 — Mastery
**Builds On:** Everything from Labs 1–11
**Produces:** The Transfer Employee feature — fully implemented, tested, and verified

---

## Learning Objective

You will build a complete feature — the **Employee Transfer** flow — using every technique from this workshop. This is the synthesis lab. There is no new concept to learn. The goal is to prove you can orchestrate CLAUDE.md, Plan Mode, Skills, Hooks, Subagents, Verification, and MCP into a single, cohesive workflow.

---

## The Feature: Employee Transfer

**Business requirement:** HR Specialists and Admins can transfer an employee to a different department. The transfer:
- Changes the employee's department (and optionally their manager)
- Writes a `job_history` record closing the old assignment and opening the new one
- Requires an idempotency key (no duplicate transfers)
- Has an effective date (defaults to today)
- Must be verified: API returns correct data, database has correct records, UI shows the change

---

## Part 1: Plan & Setup (60 min)

### Step 1: Plan Mode (15 min)

Enter Plan Mode and design the feature:
```
/plan
Design the Employee Transfer feature end-to-end:
1. Backend: HrEmployeeService.transferEmployee(HrTransferRequest)
   - Idempotency check
   - Load employee, validate exists
   - Load new department, validate exists
   - Optionally load new manager
   - Close current job_history, open new one
   - Return HrEmployeeDetailDTO
2. Frontend: TransferPage.tsx
   - 3-step wizard: Select Employee → Select Department & Manager → Confirm
   - Uses HrWizard component
   - TanStack Query mutation to POST /employees/transfer
3. Verification plan: what tests to write, what MCP checks to run

Show the data flow for each layer. Don't implement yet.
```

Iterate on the plan until you're satisfied. **Do not proceed until the plan is solid.**

### Step 2: Use a Skill (10 min)

If you created the `/scaffold-entity` skill in Lab 3, check if any of it applies here. The Transfer feature doesn't need a new entity, but you may want to create:
```
Create a slash command /verify-transfer that:
1. Queries the database for the transferred employee
2. Checks job_history has a closed old record and open new record
3. Takes a screenshot of the employee detail page
4. Compares DB data with UI data
We'll use this command after implementing.
```

### Step 3: Write Tests First (20 min)

Write the backend test before the implementation (verification-driven, from Lab 8):
```
Write JUnit 5 tests for HrEmployeeService.transferEmployee():
1. Duplicate idempotency key → HrConflictException
2. Employee not found → HrResourceNotFoundException
3. New department not found → HrResourceNotFoundException
4. Happy path: department changes, job_history written, DTO returned
Use Mockito. Do not implement the method yet.
```

Run tests — they should fail.

### Step 4: Set Up Hooks (15 min)

Verify your hooks from Lab 5 are active. They should catch:
- Any accidental edit to `schema.sql`
- Any new Java class without `Hr` prefix
- Any PII in logger statements

Verify `.claude/settings.json` has the hooks from Lab 5.

---

## Part 2: Implement & Verify (90 min)

### Step 5: Implement Backend (25 min)

Switch to normal mode and implement:
```
Implement transferEmployee() in HrEmployeeService following the plan.
Run tests after each change until all pass.
```

**Watch the hook enforcement:** If Claude tries to log the employee's email, the PII hook should catch it.

**Run tests:**
```
/run-tests
```
All tests should pass.

### Step 6: Implement Frontend (25 min)

Use a subagent or direct implementation:
```
Build TransferPage.tsx — a 3-step wizard:
Step 1: Select employee (searchable dropdown using HrEmployeeSelector)
Step 2: Select new department (dropdown) and optional new manager
Step 3: Review and confirm
Use TanStack Query useMutation to POST to /app/hr/api/v1/employees/transfer.
Follow existing wizard patterns from HireWizardPage.tsx.
```

### Step 7: Subagent Review (10 min)

Send the implementation to the reviewer (Lab 6):
```
Use the component-reviewer agent to review TransferPage.tsx.
Check accessibility, error states, and edge cases.
```

Apply any feedback.

### Step 8: Full Verification Loop (20 min)

Now use everything from Labs 8–10:

**8a. Backend verification (tests):**
```
/run-tests
```
All tests pass? Good.

**8b. Visual verification (Playwright MCP):**
```
Navigate to the transfer page in the browser.
Fill the wizard with:
- Employee: pick any employee
- Department: pick a different department
- Manager: leave blank
Submit the transfer. Take a screenshot of the confirmation.
Then navigate to the employee detail page and verify the department changed.
```

**8c. Data verification (MySQL MCP):**
```
Query the database for the employee we just transferred.
1. What department are they in now?
2. Is there a job_history record with today's date as start_date?
3. Is the previous job_history record closed (end_date set)?
Show me the actual data.
```

**8d. Cross-verification:**
```
Compare: does the employee detail page in the browser show the same
department as the database query? Any mismatch = a bug.
```

### Step 9: The Final Self-Improvement Coda (10 min)

1. **Review your CLAUDE.md.** Compare it to what you started with on Day 1.
   ```
   Compare my CLAUDE.md now to what it looked like at the start of Lab 1.
   How many rules were added across the workshop?
   ```

2. **Reflect on the techniques used:**
   | Technique | Where You Used It |
   |-----------|------------------|
   | CLAUDE.md | Conventions followed automatically |
   | Plan Mode | Step 1 — feature design |
   | Skills/Commands | Step 2 — /verify-transfer command |
   | Context Management | /clear between phases |
   | Hooks | Caught PII logging or naming violations |
   | Subagents | Step 7 — code review |
   | Verification (test-driven) | Steps 3 + 5 — tests first, implement to pass |
   | Verification (visual) | Step 8b — Playwright screenshot |
   | Verification (data) | Step 8c — MySQL query |
   | Full verification loop | Step 8d — cross-reference all three |

3. **The compounding effect:** On Day 1, scaffolding one entity took 10 prompts and multiple corrections. By Day 4, you built a complex multi-layer feature with fewer corrections because your CLAUDE.md, skills, hooks, and verification loops prevented the mistakes that would have slowed you down.

---

## Success Criteria

- [ ] Feature planned in Plan Mode before any implementation
- [ ] Tests written before `transferEmployee()` implementation
- [ ] All backend tests pass
- [ ] TransferPage.tsx renders and completes the wizard flow
- [ ] Subagent review completed and feedback applied
- [ ] Playwright MCP verified the UI shows correct data
- [ ] MySQL MCP verified the database has correct records
- [ ] UI data matches database data (no mismatches)
- [ ] CLAUDE.md grown significantly from Day 1 starting point

---

## Capstone Presentation (15 min per student)

After completing the capstone, be prepared to walk through:

1. **Your plan** — what did Plan Mode surface that you wouldn't have caught otherwise?
2. **Your CLAUDE.md** — what rules did you add during the workshop? Which was the most valuable?
3. **Your verification loop** — show the Playwright screenshot, the MySQL query, and the cross-check
4. **Your adoption plan** — what will you bring back to your team on Monday?

---

## Your Adoption Plan (Take This Home)

Write three concrete commitments:

1. **CLAUDE.md:** *"I will create a CLAUDE.md for _____________ that includes _____________"*

2. **Hooks:** *"I will add a _____________ hook that prevents _____________"*

3. **Workflow:** *"I will use _____________ (Plan Mode / Skills / Subagents / MCP) for _____________"*

> Share these with your team. Claude Code compounds — the sooner you start, the faster it improves.

---

<details>
<summary><strong>Escape Hatch</strong> — If running out of time</summary>

If you're behind at the start of Part 2:

1. **Skip the frontend** (Step 6). Focus on backend + tests + database verification.
2. Use this reduced verification loop:
   ```
   Run backend tests → pass ✓
   Curl the transfer endpoint → verify API response ✓
   Query MySQL MCP → verify database records ✓
   ```
   This still demonstrates the core verification pattern without the Playwright step.

3. For the presentation, focus on: your plan, your tests, and your CLAUDE.md growth.
</details>
