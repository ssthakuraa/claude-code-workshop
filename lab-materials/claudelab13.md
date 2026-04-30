# Lab 13: Release-Style Feature Slice

**Duration:** 120-150 minutes

## Goal

Build one real release-style feature end to end:

- Feature: HR Assessments Directory
- Audience: HR specialist / manager as reviewer workflow
- Route: `/hr/assessments`
- Scope: new backend list API + new frontend directory page + verification + review artifacts
- Non-goal: do not rebuild or extend the existing employee self-service `My Assessments` flow unless explicitly required

This lab is intentionally about one clean vertical slice, not about making the assessments area bigger in every direction.

## Starter State

The starter should **not** already contain the Lab 13 solution.

The student is expected to build:

- backend endpoint
- backend repository/query
- backend DTO
- backend test
- frontend API hook/module
- frontend page
- route wiring
- navigation wiring
- verification artifacts

If you need rescue help, use the Lab 13 escape hatch in `reference/lab13/`.
Do not pull in unrelated files or replace whole app areas.

## Why This Feature

- It is a clean vertical slice.
- It requires both backend and frontend work.
- It stays in the assessment domain.
- It avoids the current `My Assessments` entanglement.
- It is easy to verify in API, browser, and database.

## Feature Scope

The first slice is read-only.

### Page requirements

- Page title: `Assessments`
- Route: `/hr/assessments`
- Filters:
  - employee name search
  - review cycle
- Table columns:
  - employee
  - department
  - review cycle
  - status
  - reviewer
  - goal completion
  - competency score
  - updated at

### Backend requirements

- New assessments directory endpoint under `/app/hr/api/v1/assessments`
- Read-only DTO for directory rows
- JDBC repository query against `AIHR_EMPLOYEE_ASSESSMENTS` and related tables
- Access rules:
  - `HR_SPECIALIST` can view all assessment records
  - `MANAGER` can view assessment records only for employees in their reporting hierarchy
- Access control must be enforced in the backend resource/query layer, not only hidden in the UI

### Frontend requirements

- New page component
- New API client/hook
- Route wiring
- Sidebar entry
- Command palette entry
- i18n strings
- Follow existing shell/page/table/filter patterns

## Target Files

The lab is easier when the student starts with the real target files instead of repo-wide discovery.

### Backend files

- `backend/hrapp-service/src/main/java/com/company/hr/resource/HrAssessmentResource.java`
- `backend/hrapp-service/src/main/java/com/company/hr/repository/HrAssessmentDirectoryJdbcRepository.java`
- `backend/hrapp-service/src/main/java/com/company/hr/dto/response/HrAssessmentDirectoryRowDTO.java`
- `backend/hrapp-service/src/test/java/com/company/hr/resource/HrAssessmentResourceTest.java`
- `backend/hrapp-service/src/main/java/com/company/hr/HrApplicationConfig.java`

### Frontend files

- `frontend/src/api/assessments.ts`
- `frontend/src/pages/assessments/AssessmentsPage.tsx`
- `frontend/src/routes/router.tsx`
- `frontend/src/components/hr/layout/HrSidebar.tsx`
- `frontend/src/components/hr/layout/HrCommandPalette.tsx`
- `frontend/src/i18n/locales/*/assessments.json`
- `frontend/src/i18n/locales/en-US/navigation.json`

## Required Planning Artifacts

The student must create these before implementation is considered complete:

- `lab-materials/docs/lab12-technical-design.md`
- `lab-materials/docs/lab12-worklist.md`
- `lab-materials/docs/lab12-resume-prompt.md`
- `lab-materials/docs/lab12-backend-review-assist.md`
- `lab-materials/docs/lab12-frontend-review-assist.md`
- `lab-materials/docs/lab12-performance-audit.md`
- `lab-materials/docs/lab12-handoff-summary.md`

Optional:

- `lab-materials/docs/lab12-figma-assessments-ui-spec.md`

## Lab Flow

Claude Code should create a detailed phased worklist first and then follow those exact phase names consistently.

Claude Code should not assume it may proceed automatically from one major phase to the next.
After each named phase, it should hand results to the learner / engineer for review and wait for explicit approval to proceed.

### Phase 1: PM Brief To Design

The student gives Claude Code a PM-style requirement plus UI spec.
Claude Code must produce:

- clarified brief
- technical design
- detailed worklist covering implementation, reviews, audits, verification, and engineer checkpoints
- resume prompt
- risks and open questions

No code yet.

The worklist should include these named phases:

- Backend Contract
- Backend Access Control
- Frontend Data Hook
- Frontend Page Shell
- Route And Navigation Wiring
- Verification
- Final Audit

### Phase 2: Backend Contract

Claude Code executes only the approved backend contract phase:

- backend DTO
- resource contract
- repository shape
- tests first
- coding-agent review of backend changes
- backend review-assist summary

Then:

- run `cd backend && ./build-jersey-service.sh test`
- summarize results
- fix obvious review findings before handoff
- stop for learner / engineer review

### Phase 3: Backend Access Control

Claude Code executes only the approved backend access-control phase:

- enforce `HR_SPECIALIST` all-record access
- enforce `MANAGER` reporting-hierarchy-only access
- keep enforcement in backend resource/query behavior
- extend tests to cover allowed and denied cases

Then:

- rerun `cd backend && ./build-jersey-service.sh test`
- summarize results
- stop for learner / engineer review

### Phase 4: Frontend Data Hook

Claude Code executes only the approved frontend data-hook phase:

- API module / hook
- wire query parameters to the backend contract
- keep frontend behavior aligned to the read-only slice

Then:

- run `cd frontend && npm run build`
- summarize results
- stop for learner / engineer review

### Phase 5: Frontend Page Shell

Claude Code executes only the approved page phase:

- page shell
- employee-name search
- cycle filter
- table columns
- loading and empty states
- export or saved-view behavior if included in the approved plan
- frontend code review
- frontend review-assist summary

Then:

- run `cd frontend && npm run build`
- run browser verification
- summarize results
- stop for learner / engineer review

### Phase 6: Route And Navigation Wiring

Claude Code executes only the approved route/navigation phase:

- route protection
- sidebar entry
- command palette entry
- i18n labels

Then:

- rerun `cd frontend && npm run build`
- rerun browser verification
- summarize results
- stop for learner / engineer review

### Phase 7: Final Audit

Claude Code executes only the approved final audit phase:

- final coding-agent code review across the full feature
- PM requirement audit
- UX review
- production-quality manual browser check
- JFR analysis
- HAR / network analysis
- findings and recommendations documented for engineer review
- final handoff summary

## Prompt Guidance

### Phase 1 prompt

Ask Claude Code to:

- improve the PM brief
- produce the technical design
- produce a detailed phased worklist
- produce a resume prompt
- explicitly include backend build, backend review checkpoint, frontend build, frontend review checkpoint, PM audit, UX audit, JFR/HAR review, final verification, and final handoff
- not implement yet

### Backend implementation prompt

Ask Claude Code to:

- execute only the approved backend phase
- write tests first
- run `cd backend && ./build-jersey-service.sh test`
- generate `lab12-backend-review-assist.md`
- stop and ask whether backend review is complete and whether to proceed to the next named phase

### Frontend implementation prompt

Ask Claude Code to:

- execute only the approved frontend phase
- run `cd frontend && npm run build`
- run browser verification
- generate `lab12-frontend-review-assist.md`
- stop and ask whether frontend review is complete and whether to proceed to the next named phase

### Final audit prompt

Ask Claude Code to:

- execute only the approved final audit / final verification phase
- perform final review
- perform final verification
- produce the final handoff summary

## Verification Requirements

### Backend

- automated tests
- endpoint contract verification
- explicit access-control verification for HR specialist and manager paths

### Frontend

- `cd frontend && npm run build`
- browser verification of search, cycle filter, table rendering, and navigation

### Database

- verify returned assessment rows match `AIHR_*` data
- verify manager scoping aligns with the seeded reporting hierarchy
- verify filter behavior corresponds to real database values

## Out Of Scope

- editing assessment entries
- submission workflow
- employee self-service create/edit flow
- major schema redesign
- extending the old `My Assessments` page instead of building the reviewer directory slice

## Success Criteria

- technical design exists before coding
- worklist and resume prompt exist
- backend tests pass
- frontend build passes
- directory page works in browser
- sidebar and command palette links work
- API, browser, and database results align
- final handoff summary exists

## Recommendation

This lab should stay a read-only first slice.

That keeps Lab 13:

- realistic
- bounded
- finishable
- easy to verify

The strongest solutions are the ones that keep the reviewer workflow clearly separate from the employee self-service assessment flow.
