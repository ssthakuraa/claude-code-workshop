# Build Note: Hire Wizard — Frontend

**Date:** 2026-03-30
**Module:** Frontend — HireWizardPage (4-step wizard)
**Maps to Lab:** Lab 7: Full Feature

---

## What We Built

`HireWizardPage` — a 4-step wizard using the `HrWizard` component:
1. **Personal Details**: firstName, lastName, email, phone, hireDate
2. **Job Information**: job (HrJobSelector with grade preview), department, manager (HrEmployeeSelector)
3. **Compensation**: salary (HrSalaryRangeInput with min/max from selected job), commissionPct, employmentType
4. **Review & Confirm**: read-only summary of all steps, "Hire Employee" primary button

Features: per-step validation, salary range validation, idempotency key generated client-side (`uuid`), success toast + redirect to new employee's 360 view.

## Technique Used

Component composition — assembled existing components (HrWizard, HrJobSelector, HrSalaryRangeInput, HrEmployeeSelector) rather than rebuilding from scratch. Used `VITE_USE_MOCK=true` pattern for mock submission.

## The Prompt That Worked

```
Build HireWizardPage using:
- HrWizard component for the step shell (4 steps: Personal, Job, Compensation, Review)
- HrJobSelector (shows salary range preview) for step 2
- HrSalaryRangeInput (validates against job grade min/max) for step 3
- HrEmployeeSelector for manager selection in step 2
- Per-step validation: step 0 requires firstName, lastName, valid email, hireDate
  step 1 requires jobId, departmentId; step 2 requires salary within 150% of max
- Review step: read-only grid of all collected values
- On submit: POST /app/hr/api/v1/employees with X-Idempotency-Key header (uuid)
  On success: toast "Employee hired" + navigate to /hr/employees/{newId}
Mock data: use mockJobs and mockDepartments from existing data files
```

## What Failed First

- **Symptom:** `HrJobSelector` onChange fired but `form.salary` wasn't reset when the job changed — user could select a $200k job and keep a $8k salary from a previous job selection.
- **Root cause:** Job change only updated `jobId`. Salary was independent state.
- **Fix:** In the job onChange handler: `setForm(f => ({ ...f, jobId, salary: job.minSalary }))` — auto-populate salary with the job's minimum when job changes.

- **Symptom:** Wizard "Next" button enabled even when required fields were empty — validation only ran on Next click, not reactively.
- **Root cause:** `canProceed` prop to HrWizard was hardcoded `true`.
- **Fix:** Computed `canProceed` from current step + form values: `const canProceed = useMemo(() => validateStep(step), [step, form])`.

- **Symptom:** Double-submit on slow network — user clicked "Hire Employee" twice.
- **Root cause:** No loading state on submit, no button disable.
- **Fix:** Added `loading` state, disabled the submit button while loading, idempotency key ensures backend handles any double-sends safely.

## CLAUDE.md / Skill Update Made

```markdown
## Frontend Rules (additions)
- Wizard canProceed must be a computed value (useMemo), never hardcoded true
- Form selectors that affect downstream fields (job → salary) must reset dependent fields on change
- All submit buttons must be disabled during loading state
```
**Why:** These are common wizard UX bugs. Documenting them prevents repeating them in Promote/Transfer/Terminate wizards.

## Key Teaching Points

1. Cascading form state (job → salary range) must be handled explicitly — React doesn't auto-reset dependent fields.
2. `canProceed` as computed state gives real-time Next button feedback — better UX than validate-on-click.
3. Client-side idempotency key (uuid) + server-side check = safe retry on any network failure.

## Lab Exercise Derivation

- **Setup:** HrWizard component exists. HireWizardPage stub with 4 empty steps.
- **Task:** Implement steps 1 and 3 (Personal + Compensation). Wire salary range to selected job.
- **Expected discovery:** Students discover the cascading state problem when they change jobs and salary doesn't reset.
- **Success criteria:** Wizard validates each step; salary resets on job change; submit shows loading, toasts on success.
