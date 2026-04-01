# Build Note: Hire Wizard — Backend

**Date:** 2026-03-30
**Module:** Backend — Hire Employee endpoint + idempotency
**Maps to Lab:** Lab 7: Full Feature

---

## What We Built

The backend half of the Hire Employee feature:
- `POST /app/hr/api/v1/employees` — creates employee record
- `HrEmployeeCreateRequest`: firstName, lastName, email, phone, hireDate, jobId, departmentId, managerId, salary, commissionPct, employmentType, contractEndDate, initialPassword
- Idempotency: `X-Idempotency-Key` header checked against `idempotency_keys` table (stores key + response for 24h)
- First job_history record written automatically on hire (action=HIRE)
- Initial `HrUser` account created with hashed `initialPassword` and ROLE_EMPLOYEE
- Validation: salary within job grade range (warn if outside, error if >50% above max)

## Technique Used

Standard guided implementation — no Plan Mode needed (design already done in Build Note #06). Idempotency implemented as a `@Component` interceptor to keep service clean.

## The Prompt That Worked

```
Implement the hire employee endpoint using the design from CLAUDE.md:
1. HrEmployeeCreateRequest with @Valid annotations (email format, salary positive)
2. HrIdempotencyService: check/store X-Idempotency-Key in idempotency_keys table
   (idempotencyKey, responseBody, createdAt — expire after 24h)
3. In hireEmployee():
   a. Check idempotency key first (return cached response if found)
   b. Validate salary vs job grade (warn if >max, error if >1.5x max)
   c. Save HrEmployee (status=PROBATION if probationEndDate set, else ACTIVE)
   d. Write job_history (action=HIRE, effectiveDate=hireDate, newJobId, newSalary)
   e. Create HrUser (username=firstName.lastName, role=ROLE_EMPLOYEE, hashedPassword)
   f. Store idempotency response
   g. Return HrApiResponse.created(dto, "Employee hired successfully")
```

## What Failed First

- **Symptom:** Duplicate employee created when client retried on network timeout — idempotency check was added but the key was stored AFTER the employee was saved, not before commit.
- **Root cause:** If the save succeeded but the idempotency store failed (race), the next retry didn't see the key and created a second record.
- **Fix:** Wrapped hire logic in `@Transactional` — idempotency key stored in same transaction as employee creation. If key store fails, employee creation rolls back.

- **Symptom:** `initialPassword` field logged in HrLogHelper entry log (`LOGGER.info("Entering hireEmployee(request={})", request)`).
- **Root cause:** `toString()` of `HrEmployeeCreateRequest` included all fields including password.
- **Fix:** Overrode `toString()` in `HrEmployeeCreateRequest` to exclude sensitive fields, and added `@JsonIgnore` on `initialPassword`.

## CLAUDE.md / Skill Update Made

```markdown
## Security Rules (additions)
- Request DTOs with passwords/sensitive fields: override toString() to exclude them
- Add @JsonIgnore on password/salary fields in request DTOs
- Idempotency key store must be in same @Transactional as the main operation
```
**Why:** PII/password leakage in logs is a compliance violation. Idempotency outside the transaction is functionally broken.

## Key Teaching Points

1. Idempotency must be transactional — store key and business record together or not at all.
2. `toString()` of request objects leaks into logs — always override or use `@ToString.Exclude` (Lombok).
3. The hire flow has 5 side effects (employee, job_history, user, idempotency, response) — test them all.

## Lab Exercise Derivation

- **Setup:** HrEmployeeService.hireEmployee() stub. Idempotency table migration exists.
- **Task:** Implement hire with idempotency. Simulate a network retry by calling the endpoint twice with the same X-Idempotency-Key.
- **Expected discovery:** Without transactional idempotency, the second call creates a duplicate. With it, returns the cached response.
- **Success criteria:** Two POST requests with same key return identical responses; DB has exactly one employee + one job_history row.
