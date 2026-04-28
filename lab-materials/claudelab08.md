# Lab 08: Verification Loops — The Quality Multiplier

**Duration:** 60 minutes

> Recommended Day 2 order: **Lab 09 -> Lab 08 -> Lab 07 -> Lab 10 -> Lab 11 -> optional Lab 12**.

## Learning Objective

You will use a verification-driven workflow: define the expected behavior,
implement to that expectation, then verify in tests and in the browser. The lab
uses the current learner repo surface: Jersey backend, PostgreSQL data, and the
repo’s current frontend/browser workflow.

---

## The Key Concept

Without verification, Claude Code often gets you to "looks right." With verification,
you can get to "proved correct."

Use three kinds of checks:

| Strategy | How | Best For |
|---|---|---|
| Test-driven | Write or tighten a backend test first | business logic and API rules |
| Visual | Compare browser output to a concrete UI expectation | components and page behavior |
| Data-driven | Verify the stored result in PostgreSQL | writes and state changes |

The repeatable loop is:

1. define expected behavior
2. implement
3. verify
4. fix
5. verify again

---

## Setup

Ask Claude Code to run a backend preflight check:

```text
Run `cd backend && ./build-jersey-service.sh test` as a backend preflight check.
Tell me whether it passes before we start the exercise.
```

If you later need the live app for a visual loop, use the repo-local ports:

- backend `18082`
- frontend `5182`

If those ports are already busy, treat stale repo-owned processes as the first
suspect before calling it a feature defect.
For backend cleanup, use `cd backend && ./stop-jersey-service.sh`.
Keep any local port overrides in `backend/.env.local` and `frontend/.env.local`.

---

## Exercise 1: Test-Driven Backend Slice (25 min)

### Goal

Write or tighten backend tests before touching the implementation.

### Instructions

1. Ask Claude Code to write tests for the promote flow:
   ```text
   This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use `reference/` unless this chapter explicitly allows it or you need rescue help.

   Write backend tests for the current promote flow implementation.
   Cover:
   1. duplicate idempotency key -> conflict
   2. employee not found
   3. salary above the new job's maximum
   4. happy path -> employee update plus job-history write

   Use the current backend testing patterns.
   Do not implement the feature changes yet.
   ```

2. Run the tests:
   ```text
   Run `cd backend && ./build-jersey-service.sh test`.
   Summarize the failure briefly if the intended starter gap is still present.
   ```

3. Ask Claude Code to implement to the test:
   ```text
   Implement the promote-flow behavior so the tests pass.
   Re-run `cd backend && ./build-jersey-service.sh test` after each meaningful change.
   ```

4. Keep iterating until the backend test result is green.

---

## Exercise 2: Visual Verification (20 min)

### Goal

Verify a UI slice against an explicit expectation instead of trusting the first implementation.

### Instructions

1. Use a concrete UI target:
   ```text
   Build or refine `frontend/src/components/hr/HrEmployeeCard.tsx` so it shows:
   - avatar with initials fallback
   - employee name and job title
   - department and location
   - hire date
   - status badge
   - click-through to detail page

   Keep the implementation consistent with the current Vertex Agentics / Modern UI direction already present in the repo.
   ```

2. Bring up the app if needed on:
   - backend `18082`
   - frontend `5182`

3. Run a browser verification loop:
   ```text
   Open the page that renders `HrEmployeeCard`.
   Compare what you see against the expected structure.
   Tell me what is missing or visibly wrong.
   ```

4. Feed the differences back into Claude Code and verify again.

---

## Exercise 3: Combine The Loop (10 min)

### Goal

Connect test-driven backend work with browser verification and database truth.

### Instructions

Ask Claude Code to summarize the correct feature loop for this repo:

```text
Summarize the best verification loop for this repo when a feature changes
backend behavior, frontend rendering, and stored data.
Keep it to one short numbered list.
```

The expected answer should look roughly like:

1. tighten backend tests
2. implement until tests pass
3. verify the UI in the browser
4. verify stored data with PostgreSQL queries when writes are involved
5. only then mark the task done

---

## Exercise 4: Capture The Rule (5 min)

Ask Claude Code to update `CLAUDE.md` with a short rule block:

```markdown
## Verification
- Backend changes: prefer tests first, then implement to green
- UI changes: verify in the browser, not only in code review
- Write paths: verify stored PostgreSQL data when behavior depends on persistence
- Do not mark work complete without verification evidence
```

Then restart or resume Claude Code if you want the updated rules loaded in a fresh
session.

---

## Success Criteria

- [ ] Backend tests were written or tightened before implementation
- [ ] `./build-jersey-service.sh test` passed after the backend fix
- [ ] A browser verification loop was run for the UI slice
- [ ] The repo-specific verification order is now clear
- [ ] `CLAUDE.md` captures the verification rule

---

## Key Takeaways

1. Tests are executable specifications.
2. Browser verification catches issues code review alone will miss.
3. PostgreSQL verification closes the loop for write-heavy behavior.
4. Verification is what turns an okay first draft into a reliable change.

---

<details>
<summary><strong>Recovery Path</strong> — Use this if the promote test loop gets stuck</summary>

Use this only after you have tried the student path first.

For this recovery step only, review `reference/lab08/README.md`.
That rescue path restores only the completed `promoteEmployee()` method snippet
for `HrEmployeeCommandJdbcRepository.java`.

Do not replace the whole repository file. Earlier and later labs share that
file, so a full-file copy would overwrite unrelated learner work.

After applying the rescue snippet, rerun:

```text
cd backend && ./build-jersey-service.sh test
```

Then continue the normal verification loop from this chapter.
</details>
