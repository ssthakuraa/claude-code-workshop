# Build Note: Debugging & Prompt Engineering

**Date:** 2026-03-30
**Module:** Debugging — diagnosing Claude failures and fixing prompts
**Maps to Lab:** Lab 13: Debugging

---

## What This Lab Covers

Claude doesn't always produce correct output on the first attempt. This lab covers a systematic approach to diagnosing *why* Claude failed and fixing the prompt — not just re-running it and hoping for better results.

Three failure categories and their fixes:

1. **Hallucination** — Claude invents values, functions, or facts not in the codebase
2. **Convention drift** — Claude generates code that violates project patterns
3. **Scope creep** — Claude changes more than asked, introduces unnecessary abstractions

---

## Failure Category 1: Hallucination

**Symptom in this project:** Claude invented a `Blue-40 = #4A90D9` token that doesn't exist in the Figma spec. Also invented an `HrPayrollService` method signature that doesn't exist in the codebase.

**Root cause:** Claude fills gaps from training data when the provided context is incomplete. It doesn't know it's hallucinating — the output looks confident.

**Diagnostic question:** "Did Claude have the information it needed, or did it have to infer?"

**Fixes:**
- For design tokens: "Only use values explicitly stated in the spec. Mark missing values as UNKNOWN."
- For code references: Always provide the actual file ("Read HrEmployeeService.java first, then add the method") rather than describing the interface from memory.
- For API contracts: Paste the actual DTO shape in the prompt, not "use the existing DTO."

**The meta-pattern:** Hallucination is almost always an incomplete context problem, not a model failure. Add the missing context; the hallucination stops.

---

## Failure Category 2: Convention Drift

**Symptom in this project:** After ~40 turns in a long session, new service methods were missing `LOGGER.info("Entering...")` calls. A new controller returned `ResponseEntity<HrEmployee>` instead of `ResponseEntity<HrApiResponse<HrEmployeeDTO>>`.

**Root cause:** CLAUDE.md conventions scroll out of the effective context window in long sessions. Claude defaults to general Java patterns, not project-specific ones.

**Diagnostic question:** "Did this session run long enough for CLAUDE.md to fall out of context?"

**Fixes:**
- Re-anchor explicitly: "Re-read CLAUDE.md. Apply the logging pattern and response envelope to the following task."
- Add a TypeScript/Java guard: the `tsc --noEmit` hook catches type mismatches, but not logging gaps. For logging, a grep-based check works: `grep -r "LOGGER.info" src/ | grep -v "Entering\|Exiting"` flags methods that log but don't follow the entry/exit pattern.
- Keep sessions focused — one module per session limits drift.

---

## Failure Category 3: Scope Creep

**Symptom in this project:** Asked to "add pagination to the employee list endpoint." Claude added pagination, refactored the existing filter logic, renamed `findAll` to `findFiltered`, added a new `HrEmployeeFilterDTO`, and updated 4 callers.

**Root cause:** Claude optimizes for completeness. When a task touches existing code, it tends to "clean up" surrounding logic. This is usually wrong in a production codebase — unrequested changes break things and bloat PRs.

**Diagnostic question:** "Did Claude change things that weren't in the task description?"

**Fixes:**
- Scope-limit the prompt: "Add pagination ONLY. Do not rename methods, refactor existing logic, or touch callers. Make the smallest possible change."
- Use Plan Mode first for risky changes: Plan Mode shows the intended scope before any code is written. Review the plan, reject scope creep before it happens.
- After the change: `git diff --stat` — if more files changed than expected, ask Claude to explain each change. Revert unexplained ones.

---

## The Debugging Workflow

When Claude produces wrong output:

```
1. Identify the failure category (hallucination / drift / scope creep)
2. Diagnose root cause (missing context / long session / underspecified scope)
3. Fix the prompt (add context / re-anchor / add constraints)
4. Re-run with the fixed prompt — do NOT just retry the same prompt
```

**The anti-pattern:** Retrying the same prompt hoping for different output. Same prompt → same failure mode. Fix the prompt, then retry.

---

## The Prompt That Worked (Diagnosing a Drift Failure)

```
The last method you wrote is missing the HrLogHelper entry/exit pattern.
Re-read CLAUDE.md section "Logging Pattern (MANDATORY)".
Then rewrite HrDepartmentService.findById() to comply:
- LOGGER.info("Entering findById(id={})", id) at the top
- LOGGER.info("Exiting findById, found: {}", result.getName()) before return
Make only these logging changes — do not touch anything else.
```

**Why it works:** Names the specific violation. Re-anchors to the rule. Constrains scope to "only these logging changes."

---

## What Failed First

- **Symptom:** Asked Claude to "fix the TypeScript error" without showing the error message. Claude guessed wrong and introduced a type assertion (`as any`) that silenced the error without fixing it.
- **Root cause:** Incomplete diagnostic information. Claude can't fix what it can't see.
- **Fix:** Always paste the full error output: "Here is the tsc error: [paste]. Fix this error without using `as any` or type assertions."

- **Symptom:** After asking Claude to "write a test for the hire endpoint," it wrote a test that mocked `HrEmployeeService` and tested the controller in isolation. But the project convention is integration tests with a real DB, not mocks.
- **Root cause:** Claude defaulted to unit-test patterns (mocking) because the prompt didn't specify integration test.
- **Fix:** "Write a `@SpringBootTest` integration test using MockMvc and the test DB — do not mock HrEmployeeService."

---

## CLAUDE.md / Skill Update Made

```markdown
## Debugging Checklist
- Hallucination: add missing context, instruct "mark UNKNOWN not infer"
- Convention drift: re-read CLAUDE.md, scope to one module per session
- Scope creep: add "make only the requested change" to prompt
- Never use `as any` to silence TypeScript errors — fix the root type
- Integration tests use @SpringBootTest + real DB — never mock the service layer
```

---

## Key Teaching Points

1. **Same prompt → same failure.** Diagnose the failure category, fix the prompt, then retry.
2. **Hallucination = incomplete context.** Give Claude the information it needs; don't ask it to infer.
3. **Convention drift is a long-session problem.** Re-anchor to CLAUDE.md when sessions run long.
4. **Scope creep is a prompt precision problem.** "Make the smallest possible change" is a valid, important instruction.
5. **Error messages are context.** Paste the full error — not just "it doesn't work."

---

## Lab Exercise Derivation

- **Setup:** HR app with a deliberately introduced bug: `HrDepartmentService.findAll()` returns a raw `List<HrDepartment>` instead of `HrPagedResponse<HrDepartmentSummaryDTO>`.
- **Task 1 (Hallucination):** Ask Claude to describe `HrDepartmentService.findAll()` without reading the file. Observe if it halluccinates the correct signature. Then provide the file — ask again. Compare.
- **Task 2 (Drift):** Ask Claude to "fix the return type bug." Observe if it changes more than the return type. Add scope constraint. Re-run.
- **Task 3 (Diagnosis):** Run `mvn test` — paste the test failure to Claude. Ask it to diagnose. Observe that full error output leads to correct fix; partial error output ("the test fails") leads to guessing.
- **Success criteria:** Task 1 — Claude says "I don't see the file" or guesses wrong before the read, gets it right after. Task 2 — scoped prompt produces minimal diff. Task 3 — correct fix using full error output.
