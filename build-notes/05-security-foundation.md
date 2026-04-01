# Build Note: Security Foundation (JWT + RBAC + HrSecurityUtil)

**Date:** 2026-03-30
**Module:** Backend — Spring Security
**Maps to Lab:** Lab 5: Parallel Dev

---

## What We Built

- `HrSecurityConfig`: Spring Security filter chain — JWT stateless, CSRF disabled, public paths for `/auth/**`
- `HrJwtService`: JWT generation + validation using `io.jsonwebtoken` (JJWT 0.12)
- `HrSecurityUtil`: Helper with `currentUser()`, `canViewSalary()`, `canViewPii()`, `scopeToReports()`
- `HrUserDetailsService`: Loads `HrUser` from DB for Spring Security
- `@PreAuthorize` annotations on all service methods (RBAC)

## Technique Used

Plan Mode used to design the security layer before implementation — prevents missing filter ordering mistakes.

## The Prompt That Worked (Plan Mode)

```
/plan
Design Spring Security configuration for the HR app:
- JWT stateless (no sessions)
- Public: POST /auth/login, POST /auth/refresh
- All other /app/hr/api/v1/** require authentication
- RBAC: ROLE_ADMIN, ROLE_HR_SPECIALIST, ROLE_MANAGER, ROLE_EMPLOYEE
- Managers see only their direct/indirect reports
- Salary fields visible to ADMIN + HR_SPECIALIST + self only
Show the filter chain order, the JWT filter placement, and which methods need @PreAuthorize.
```

## What Failed First

- **Symptom:** `HrSecurityConfig` registered JWT filter with `addFilterBefore(AuthenticationManager.class)` — caused 401 on all requests including login.
- **Root cause:** JWT filter was placed before `UsernamePasswordAuthenticationFilter` but tried to authenticate before the token existed.
- **Fix:** `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` — JWT filter runs first and skips requests without a Bearer token (falls through to public-path permit).

- **Symptom:** `@PreAuthorize("hasRole('MANAGER')")` failed for users with role `ROLE_MANAGER` because Spring Security prefixes roles automatically.
- **Root cause:** Using `hasRole()` with the `ROLE_` prefix included. `hasRole('MANAGER')` expects the DB value without prefix.
- **Fix:** Either use `hasAuthority('ROLE_MANAGER')` or store without prefix and let Spring add it.

## CLAUDE.md / Skill Update Made

```markdown
## Security Rules (additions)
- JWT filter: addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
- @PreAuthorize: use hasAuthority('ROLE_ADMIN') not hasRole('ROLE_ADMIN')
- Store roles WITHOUT ROLE_ prefix in DB; Spring Security adds it automatically
```
**Why:** These are Spring Security gotchas that cost hours if not documented.

## Key Teaching Points

1. Plan Mode before security implementation prevents filter ordering bugs.
2. `hasRole()` vs `hasAuthority()` is a common Spring Security mistake — document the project convention.
3. JWT filter must NOT authenticate — it only extracts the principal and sets SecurityContext.

## Lab Exercise Derivation

- **Setup:** Basic Spring Boot app, no security.
- **Task:** Use Plan Mode to design the security layer, then implement. Deliberately use `hasRole('ROLE_MANAGER')` and observe the 403 failure.
- **Expected discovery:** Plan Mode surfaces the filter chain design; the hasRole bug teaches why conventions must be documented in CLAUDE.md.
- **Success criteria:** `POST /auth/login` returns 200 with JWT; protected endpoint returns 401 without token, 403 with wrong role.
