# Lab 8: Verification Loops — The Quality Multiplier

**Duration:** 60 minutes
**Day:** 2 — Productivity
**Builds On:** Labs 5 (hooks), 6 (subagents), 7 (parallel sessions)
**Produces:** A feature built with test-driven verification and a visual check

---

## Learning Objective

You will implement a feature using a verification-driven workflow: write the test first, implement to pass it, then verify visually. Boris Cherny calls verification **"probably the most important thing to get great results out of Claude Code"** — it 2–3x the quality of final output.

---

## The Key Concept

Without verification, Claude produces "looks right" code. With verification, Claude produces **proven-correct** code. The difference is dramatic.

**Three verification strategies:**

| Strategy | How | When |
|----------|-----|------|
| **Test-driven** | Write test first → implement until tests pass | Backend logic, business rules |
| **Visual** | Implement → screenshot → compare to spec → iterate | Frontend components, layouts |
| **Data-driven** | Implement → query DB → verify data integrity | Database operations, migrations |

**The verification loop:**
```
Write test/spec → Implement → Verify → Fix → Verify again → Done
```

Usually 2–3 iterations to reach quality.

---

## Setup

```bash
# Verify tests pass
cd backend && mvn test -pl hrapp-service -q && echo "Tests: OK"
```

---

## Exercise 1: Test-Driven Backend Feature (25 min)

### Goal
Build the `promoteEmployee()` method test-first — write the test, then implement until it passes.

### Instructions

1. **Write the test first:**
   ```
   Write a JUnit 5 unit test for HrEmployeeService.promoteEmployee().
   The test should verify:
   1. Idempotency check — duplicate key throws HrConflictException
   2. Employee not found — throws HrResourceNotFoundException
   3. Salary above new job's max — throws HrBusinessRuleViolationException
   4. Happy path — employee's job and salary are updated, job_history is written

   Use Mockito to mock repositories. Do NOT implement the method yet —
   write tests against the expected behavior.
   ```

2. **Run the tests — they should fail:**
   ```
   /run-tests
   ```
   Or: `cd backend && mvn test -pl hrapp-service`

   Expected: compilation errors or test failures (method may not exist or may be incomplete).

3. **Now implement to pass:**
   ```
   Implement promoteEmployee() in HrEmployeeService so that all tests pass.
   Follow the patterns from hireEmployee() — idempotency check, salary validation,
   job history write. Run tests after each change.
   ```

4. **Watch the iteration loop:**
   - Claude implements → runs tests → sees failure → fixes → runs tests → passes
   - This loop usually takes 2–3 iterations

5. **Final verification:**
   ```
   /run-tests
   ```
   All tests should pass.

### What You Should See

Claude iterates until tests are green. The test acted as a specification — Claude didn't need detailed instructions because the test defined the expected behavior.

---

## Exercise 2: Visual Verification (20 min)

### Goal
Build a frontend component, verify it visually against a spec, and iterate.

### Instructions

1. **Define the visual spec:**
   ```
   Build an HrEmployeeCard component that looks like this:
   ┌──────────────────────────────────┐
   │  [Avatar]  John Smith            │
   │            Senior Developer      │
   │  ─────────────────────────────── │
   │  Department: Engineering         │
   │  Location:   Seattle, WA         │
   │  Hired:      2024-03-15          │
   │  Status:     ● Active            │
   └──────────────────────────────────┘
   - Avatar shows initials if no image (e.g., "JS")
   - Status badge uses HrStatusBadge component
   - Card is clickable — navigates to /employees/{id}
   - Responsive — full width on mobile
   ```

2. **First implementation.** Let Claude build it.

3. **Visual check.** If Playwright MCP is available (Day 3), use it. Otherwise, manually verify:
   ```
   Start the frontend dev server and navigate to a page that renders
   this component. Describe what you see vs the spec above.
   What's different?
   ```

4. **Iterate on differences:**
   ```
   The avatar initials are too small and the status badge isn't
   using HrStatusBadge — it's just plain text. Also the card
   doesn't have a hover effect. Fix these issues.
   ```

5. **Second visual check.** Repeat until the component matches the spec.

### What You Should See

First attempt: 70–80% match. After 1–2 rounds of visual feedback: 95%+ match. The visual loop is what turns "close enough" into "production ready."

---

## Exercise 3: Combining Strategies (10 min)

### Goal
See how test-driven and visual verification work together.

### Instructions

1. Reflect on what you just did:
   - **Backend (Exercise 1):** Test-driven — test defined behavior, implementation followed
   - **Frontend (Exercise 2):** Visual — spec defined appearance, iteration refined

2. **The ideal workflow for a full feature:**
   ```
   1. Write backend tests (define API behavior)
   2. Implement backend until tests pass
   3. Write frontend against visual spec
   4. Visually verify and iterate
   5. Run E2E test to verify full stack
   ```

3. **Add to CLAUDE.md:**
   ```markdown
   ## Verification
   - Backend: test-driven — write tests first, implement to pass
   - Frontend: visual — implement, compare to spec, iterate
   - Full feature: backend tests → backend impl → frontend → visual check → E2E
   - Never mark a task done without verification
   ```

---

## Exercise 4: The Self-Improvement Coda (5 min)

1. Count iterations:
   - Backend: _____ iterations to pass all tests
   - Frontend: _____ iterations to match visual spec

2. **Key insight:** The verification loop is 2–3 iterations, not 10. The first attempt gets you 70–80%. Verification polishes the last 20–30%.

3. **Discussion:** *Without the tests and visual spec, would you have caught the same issues in code review? How long would that have taken?*

---

## Success Criteria

- [ ] `promoteEmployee()` tests written before implementation
- [ ] All tests pass after implementation
- [ ] HrEmployeeCard matches visual spec within 2–3 iterations
- [ ] CLAUDE.md updated with verification workflow
- [ ] You can explain the test-driven vs visual verification difference

---

## Key Takeaways

1. **Tests are specs, not afterthoughts** — write them first and Claude knows exactly what to build
2. **Visual verification catches what tests can't** — spacing, alignment, visual hierarchy
3. **2–3 iterations is normal** — the first attempt is 70–80%; verification closes the gap
4. **Verification is the highest-ROI practice** — Boris says it 2–3x quality. From this lab, you should believe it.
5. **Combine both for full features** — backend test-driven + frontend visual + E2E = production confidence

---

<details>
<summary><strong>Escape Hatch</strong> — promoteEmployee test structure</summary>

```java
@ExtendWith(MockitoExtension.class)
class HrEmployeeServicePromoteTest {

    @Mock HrEmployeeRepository employeeRepository;
    @Mock HrJobRepository jobRepository;
    @Mock HrIdempotencyKeyRepository idempotencyKeyRepository;
    @Mock HrJobHistoryRepository jobHistoryRepository;
    // ... other mocks

    @InjectMocks HrEmployeeService service;

    @Test
    void promoteEmployee_throwsConflict_onDuplicateKey() {
        HrPromoteRequest req = new HrPromoteRequest();
        req.setIdempotencyKey("key-1");
        when(idempotencyKeyRepository.existsById("key-1")).thenReturn(true);
        assertThatThrownBy(() -> service.promoteEmployee(req))
                .isInstanceOf(HrConflictException.class);
    }

    @Test
    void promoteEmployee_throwsBusinessRule_whenSalaryExceedsMax() {
        // Setup: employee exists, new job has max 10000, request salary is 99000
        // Assert: throws HrBusinessRuleViolationException
    }

    @Test
    void promoteEmployee_updatesJobAndWritesHistory() {
        // Setup: valid request, all repos return expected data
        // Assert: employee.setJob(newJob) called, jobHistoryRepository.save() called
    }
}
```
</details>
