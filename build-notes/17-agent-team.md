# Build Note: Agent Team Build & Orchestration

**Date:** 2026-03-30
**Module:** Sub-agents — parallel task execution with orchestration
**Maps to Lab:** Lab 11: Agent Team

---

## What This Lab Covers

Using Claude's sub-agent capability to parallelize independent work streams. An **orchestrator** (the main Claude session) spawns **worker agents** that each handle one domain, then the orchestrator integrates their results.

This matters when:
- Tasks are genuinely independent (no shared state between them)
- Each task is large enough that sequential execution would be slow
- You want to protect the main context window from filling up with implementation details

---

## The Scenario

**Build the Reporting module in parallel:** Three independent features that can be developed simultaneously:

1. **Agent A** — Backend: `HrReportService` + `HrReportController` (headcount, turnover, salary band reports)
2. **Agent B** — Frontend: `ReportsPage.tsx` with export controls and filter UI
3. **Agent C** — Integration tests: `HrReportControllerTest.java` covering all report endpoints

All three can be built at the same time because they share only the API contract (defined upfront), not implementation state.

---

## The Orchestration Prompt That Worked

```
We need to build the HR Reporting module. The API contract is:
  GET /app/hr/api/v1/reports/headcount?departmentId=&asOf=
  GET /app/hr/api/v1/reports/turnover?startDate=&endDate=&departmentId=
  GET /app/hr/api/v1/reports/salary-bands?jobId=

Spawn three parallel agents:

Agent 1 — Backend:
  Build HrReportService and HrReportController following existing patterns:
  - HrLogHelper entry/exit logging
  - HrApiResponse<T> envelope
  - @PreAuthorize("hasRole('ROLE_HR_SPECIALIST') or hasRole('ROLE_ADMIN')")
  - Return DTOs: HrHeadcountReportDTO, HrTurnoverReportDTO, HrSalaryBandReportDTO
  Read docs/requirement.md section on reporting for business rules.

Agent 2 — Frontend:
  Build src/pages/organization/ReportsPage.tsx:
  - Three report tabs (Headcount, Turnover, Salary Bands)
  - Date range pickers and department filter
  - Export to CSV button (use Papa Parse)
  - Loading/empty states
  - Mock data when VITE_USE_MOCK=true
  Follow existing page patterns from DashboardPage.tsx.

Agent 3 — Tests:
  Build backend/hrapp-service/src/test/java/.../HrReportControllerTest.java:
  - MockMvc tests for all 3 endpoints
  - Test with ROLE_ADMIN and ROLE_HR_SPECIALIST (should succeed)
  - Test with ROLE_EMPLOYEE (should return 403)
  - Use @SpringBootTest with test profile

Wait for all three agents to complete. Then:
- Review Agent 1's DTOs — ensure Agent 2's mock data matches the shape
- Run mvn test to verify Agent 3's tests pass against Agent 1's implementation
- Report any integration gaps.
```

---

## What Failed First

- **Symptom:** Agent 2 (Frontend) built mock data with a different field name than Agent 1 (Backend) used in the DTO. `employeeCount` (backend) vs `headcount` (frontend).
- **Root cause:** Agents work from the same prompt but interpret ambiguous spec independently. The API contract was underspecified — it described endpoints but not response field names.
- **Fix:** Add explicit DTO shapes to the orchestration prompt before spawning agents:
  ```
  HrHeadcountReportDTO: { departmentId, departmentName, employeeCount, asOf }
  HrTurnoverReportDTO: { startDate, endDate, terminations, hires, turnoverRate }
  HrSalaryBandReportDTO: { jobId, jobTitle, minSalary, maxSalary, avgSalary, headcount }
  ```
  With explicit shapes, all agents agree on field names without coordination.

- **Symptom:** Agent 3 (Tests) wrote tests that called endpoints not yet implemented — `GET /reports/salary-bands` was missing from Agent 1's implementation.
- **Root cause:** Agent 1 prioritized headcount and turnover and ran out of context before implementing salary bands.
- **Fix:** Added per-agent completion criteria to the prompt: "Agent 1 must implement all 3 endpoints before marking complete." Orchestrator checks completion before proceeding.

- **Symptom:** The orchestrator's context window filled up with all three agents' full output — couldn't fit the integration review.
- **Root cause:** Sub-agents returned full file contents, not summaries.
- **Fix:** Added to each agent prompt: "Return a summary of what you built (file paths, key decisions, any open questions) — not the full code." Code lives in files; the orchestrator only needs the summary to do integration review.

---

## CLAUDE.md / Skill Update Made

```markdown
## Agent Team Pattern
- Define explicit DTO shapes BEFORE spawning agents — ambiguous specs cause field name drift
- Each agent prompt must include completion criteria — agents stop when criteria met, not when context runs out
- Agents return summaries, not full code — orchestrator reads files directly if needed
- Always run integration check after parallel build: compile + test to catch cross-agent gaps
```

Created skill `/parallel-build`:
```
Given feature: $FEATURE with API contract: $CONTRACT and DTOs: $DTOS
Spawn parallel agents:
- Backend agent: service + controller following CLAUDE.md patterns
- Frontend agent: page component with mock data matching $DTOS
- Test agent: MockMvc tests for all endpoints, all RBAC roles
Each agent returns: files created, decisions made, open questions.
After all complete: run mvn test. Report integration gaps.
```

---

## Key Teaching Points

1. **Parallelism requires explicit contracts** — the more ambiguous the spec, the more agents diverge. Invest 5 minutes defining DTO shapes upfront; it saves 30 minutes of integration fixes.
2. **Agents protect context** — each sub-agent has its own context window. The orchestrator's window stays clean for coordination, not implementation.
3. **Completion criteria prevent partial work** — without them, an agent that runs long will stop mid-feature, leaving the orchestrator with a broken build.
4. **Summaries, not code** — orchestrators that accumulate full file contents from agents hit context limits fast. Keep agent returns lean.

---

## Lab Exercise Derivation

- **Setup:** HR app with Reporting module NOT yet built.
- **Task:** Run the orchestration prompt above. Observe agents working in parallel (each appears in Claude Code as a sub-agent turn). After completion, check that `mvn test` passes and the Reports page renders.
- **Deliberate gap:** Omit the DTO shapes from the initial prompt. Observe the field-name mismatch between backend and frontend. Add the DTO shapes and re-run.
- **Success criteria:** All 3 endpoints return 200 for HR_SPECIALIST, 403 for EMPLOYEE. Reports page renders all 3 tabs with mock data.
