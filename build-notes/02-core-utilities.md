# Build Note: Core Utilities (HrLogHelper, HrApiResponse, HrPagedResponse)

**Date:** 2026-03-30
**Module:** Backend — hrapp-common utilities
**Maps to Lab:** Lab 6: Quality Gates

---

## What We Built

- `HrLogHelper`: SLF4J wrapper that enforces entry/exit logging and blocks PII logging
- `HrApiResponse<T>`: Standard envelope for all single-object API responses
- `HrPagedResponse<T>`: Standard envelope for paginated list responses
- Both response classes have static factory methods: `success()`, `created()`, `error()`

## Technique Used

Standard CLAUDE.md-guided generation — utilities built first so all subsequent code can reference them.

## The Prompt That Worked

```
Create hrapp-common utilities:
1. HrLogHelper: wraps SLF4J Logger, exposes info/warn/error.
   Add a maskPii(String) method that replaces the value with "MASKED".
2. HrApiResponse<T>: { boolean success, T data, String message, String timestamp }
   Static factory: success(T data), created(T data, String msg), error(String msg)
3. HrPagedResponse<T>: wraps Spring Page<T>, exposes content, page, size, totalElements, totalPages
All classes in package com.company.hr.common.*
```

## What Failed First

- **Symptom:** First attempt put `HrPagedResponse` in hrapp-service, not hrapp-common, causing a circular dependency.
- **Root cause:** Prompt said "wrap Spring Page<T>" — Claude imported `org.springframework.data.domain.Page` into hrapp-common, which requires spring-data-commons as a dependency.
- **Fix:** Changed to accept a plain `List<T>` + separate pagination metadata rather than wrapping Spring's `Page<T>` directly. hrapp-service maps `Page` → `HrPagedResponse` in the controller layer.

## CLAUDE.md / Skill Update Made

```markdown
## hrapp-common Rules
- hrapp-common has NO Spring Boot dependency — plain Java only
- HrPagedResponse is constructed from List<T> + totalElements + page + size, NOT from Spring Page<T>
- The mapping Page<T> → HrPagedResponse happens in the controller, not in common
```
**Why:** Keeps hrapp-common dependency-free and reusable outside Spring Boot contexts.

## Key Teaching Points

1. Multi-module boundaries must be enforced explicitly — Claude will take the easy path.
2. Building utilities first gives Claude a stable API surface to reference throughout the project.
3. Static factory methods (`success()`, `created()`) produce consistent JSON envelopes without boilerplate.

## Lab Exercise Derivation

- **Setup:** Empty hrapp-common module with blank pom.xml.
- **Task:** Generate the three utilities, then verify hrapp-common compiles with `mvn compile` (no Spring dependency should sneak in).
- **Expected discovery:** Spring Page import causes compile failure → teaches dependency boundary awareness.
- **Success criteria:** `mvn dependency:tree -pl hrapp-common` shows no spring-* dependencies.
