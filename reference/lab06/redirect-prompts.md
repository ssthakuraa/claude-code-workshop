# Lab 06 — Strong Redirect Prompt Rewrites (ANSWER KEY)

This is the answer key for Lab 06 Exercise 4. The three weak prompts below each tried to redirect the same drift: the agent has just proposed adding a `RegionService` layer.

**Do not read this file before attempting Exercise 4 on your own.** Read your own rewrites first, then compare.

---

## The four-part shape

A strong redirect prompt usually has four parts:

1. **Explicit stop** — name what to stop, not "that" or "this"
2. **Restate the only files in scope** — name them; do not assume the agent remembers
3. **Restate the original contract** — endpoint shape, return type, table name
4. **Confirm before acting** — ask for the revised plan before any code is written

Memorize the shape. The wording can vary; the four parts cannot.

---

## Weak A — "no don't do that"

### Why it fails

"That" is ambiguous. The agent reads it against several previous turns of context and frequently picks the wrong target — sometimes the service layer, sometimes the table name, sometimes the file list. Vague redirects often re-trigger the same drift because the agent fills in the meaning.

### Strong rewrite

```text
Stop. Do not add a RegionService class. The slice is repository + resource +
response DTO only.

The only files to create are:
- backend/hrapp-service/src/main/java/com/company/hr/dto/response/HrRegionDTO.java
- backend/hrapp-service/src/main/java/com/company/hr/repository/HrRegionJdbcRepository.java
- backend/hrapp-service/src/main/java/com/company/hr/resource/HrRegionResource.java

The contract is GET /app/hr/api/v1/regions returning HrApiResponse<List<HrRegionDTO>>,
reading from AIHR_REGIONS (region_id, region_name).

Show me the revised plan before you write any code.
```

---

## Weak B — "go back, that's not what i asked for"

### Why it fails

"Go back" is a navigation instruction, not a constraint. The agent has no shared idea of what state to "go back to" and frequently produces a different drift in its attempt to undo the first one. "That's not what I asked for" puts the agent in the position of guessing what you did ask for — which it has already shown it gets wrong.

### Strong rewrite

```text
Stop. Discard the current plan. Do not add a service layer.

The original prompt is unchanged: read-only Region scaffold, three artifacts only —
HrRegionDTO (response), HrRegionJdbcRepository, HrRegionResource. No request DTO.
No write endpoints. No service layer. No registration changes.

Endpoint: GET /app/hr/api/v1/regions, returning HrApiResponse<List<HrRegionDTO>>.
Table: AIHR_REGIONS, columns region_id and region_name.

Produce a fresh plan that lists exactly those three files and nothing else.
Do not implement until I confirm the plan.
```

---

## Weak C — "please be more careful and follow the conventions"

### Why it fails

This redirect contains zero specifics. "More careful" is an adjective without an action. "The conventions" assumes the agent knows which convention you mean — and the drift you are trying to fix is precisely that the agent has invented a convention that does not exist in the repo. Strong-redirect prompts do not appeal to the agent's judgment; they remove the judgment from the loop.

### Strong rewrite

```text
Stop. The repo has no service layer. Drop RegionService entirely.

The convention is Resource -> JdbcRepository, with no service in between.
You can confirm by inspecting only these two files (do not read more):
- backend/hrapp-service/src/main/java/com/company/hr/resource/HrDepartmentResource.java
- backend/hrapp-service/src/main/java/com/company/hr/repository/HrDepartmentJdbcRepository.java

After confirming, produce a revised plan for the Region slice that follows the
same Resource -> JdbcRepository pattern, with the response DTO in
com/company/hr/dto/response/.

Do not write code until I confirm the revised plan.
```

---

## Pattern observations

Three things every strong rewrite above does, and every weak version above fails to do:

- **Names the wrong thing explicitly.** "Do not add a RegionService" beats "don't do that" because the agent never has to guess what it should not do.
- **Names the right thing concretely.** Specific file paths beat abstract "the conventions" because the agent has nothing to invent.
- **Withholds permission to act.** "Show me the revised plan before you write any code" puts the next turn back in the user's hands. Strong redirects do not let the agent sprint past the correction.

The redirect-prompt template you should keep for future sessions:

```text
Stop. <name what to stop>.

The only files in scope are:
<list them>

The contract is <endpoint, return type, table>.

Show me the revised plan before you write any code.
```

Four sentences. Memorize the shape; vary the contents per task.
