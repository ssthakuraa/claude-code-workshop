# Deck 3: Plan Mode & the 4-Phase Workflow

**Duration:** 20 minutes | **Lab:** Lab 2

---

## Slide 1: The 4-Phase Workflow
```
Explore → Plan → Implement → Commit
```
Every non-trivial task should follow this cycle.

> **Speaker notes:** This comes directly from Anthropic's official docs and Boris Cherny's daily practice. It's not optional for complex tasks. Skipping the plan is the #1 source of rework.

---

## Slide 2: When to Use Plan Mode

**Use it when:**
- Task touches 3+ files
- Business rules, validation, or side effects involved
- You're unsure of the approach
- A mistake would be expensive to fix

**Skip it when:**
- You could describe the diff in one sentence
- Simple renames, typo fixes, single-file changes

> **Speaker notes:** The heuristic is simple: if you'd think for more than 30 seconds before coding it yourself, use Plan Mode.

---

## Slide 3: How to Enter Plan Mode

- `Shift+Tab` twice (fastest)
- Or type `/plan`
- Claude researches and proposes — **no code written**
- You iterate: "What about error case X?" "Add Y to the plan"
- When satisfied, switch back to normal mode: `Shift+Tab`

> **Speaker notes:** The key discipline is iterating the plan, not the code. Rewriting a plan bullet takes 5 seconds. Refactoring 50 lines of Java takes 5 minutes.

---

## Slide 4: The Bad Path (No Plan)

```
You: "Implement hireEmployee()"
Claude: Creates employee, returns DTO. Done.

Missing:
- ❌ job_history record
- ❌ Idempotency check
- ❌ Salary validation
- ❌ hr_users record creation
```

> **Speaker notes:** "Create an employee" is what you said. That's all Claude did. The implicit requirements — audit trail, idempotency, salary range — were in the requirements doc but not in the prompt. Plan Mode surfaces them.

---

## Slide 5: The Good Path (With Plan)

```
Plan output:
1. Check idempotency key → throw if duplicate
2. Check email uniqueness → throw if exists
3. Load job → validate salary in range
4. Save employee
5. Create hr_users record (username = email prefix)
6. Write job_history entry
7. Return HrEmployeeDetailDTO with PII masking

Transaction boundary: @Transactional wrapping steps 4-6
Error cases: JobNotFound, DepartmentNotFound, SalaryOutOfRange
```

All 7 steps identified **before a single line of code.**

> **Speaker notes:** THIS is what planning does. It surfaces the implicit. Claude found the job_history requirement by reading the schema. It found idempotency by reading the API spec. Plan Mode gave it time to explore before committing to code.

---

## Slide 6: Pro Tips

- **`Ctrl+G`** — open the plan in your text editor for inline annotation
- **"Don't implement yet"** — guard phrase to prevent premature coding
- **"Think harder about this"** — triggers deeper analysis when the plan feels shallow
- **Feed the plan into CLAUDE.md** — extract rules from the plan so future tasks benefit

> **Speaker notes:** The plan is not disposable. The rules you extract from it ("every lifecycle action writes job_history") belong in CLAUDE.md. Plans are transient; CLAUDE.md is permanent.

---

## Slide 7: Your Turn — Lab 2

You'll:
1. Implement `hireEmployee()` WITHOUT planning — observe the gaps
2. Design it WITH Plan Mode — iterate until complete
3. Implement from the plan — all requirements met
4. Extract rules into CLAUDE.md

**Time:** 60 minutes. Go.
