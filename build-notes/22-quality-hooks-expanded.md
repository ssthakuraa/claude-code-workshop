# Build Note: Quality Hooks — Expanded (Enterprise Hook Patterns)

**Date:** 2026-03-31
**Module:** Quality Gates — Hooks (Advanced)
**Maps to Lab:** Lab 6 (Extended): Enterprise Hook Patterns

---

## What We Built

Four additional Claude Code hooks across `PreToolUse` and `PostToolUse` events, each demonstrating a distinct real-world use case for hooks in a complex codebase.

### Hooks Added

| Hook | Event | What It Does |
|------|-------|--------------|
| `schema.sql` guard | `PreToolUse` | Blocks any Edit/Write to `database/schema.sql` — hard stop, exit 1 |
| Env file warning | `PreToolUse` | Warns before editing any `.env*` file — soft warning, does not block |
| `Hr` naming convention | `PostToolUse` | Rejects new Java classes in `hrapp-service` that don't start with `Hr` |
| Flyway migration naming | `PostToolUse` | Rejects migration files that don't follow `V{n}__description.sql` pattern |
| PII leak detector | `PostToolUse` | Scans service file changes for LOGGER statements containing sensitive field names |

Note: The TypeScript check hook from Build Note #12 was already present and retained.

---

## Technique Used

Claude Code hooks — `PreToolUse` (blocking) and `PostToolUse` (validating), using `jq` to parse stdin JSON, bash conditionals to scope by file path, and `exit 1` to hard-block violations.

---

## The Prompt That Worked

```
Add four hooks to .claude/settings.json:
1. PreToolUse: block any Edit or Write to database/schema.sql with a clear error message
2. PreToolUse: warn (soft) before editing any .env file
3. PostToolUse: after writing a .java file in hrapp-service/src/main/java, check the class name starts with Hr
4. PostToolUse: after writing a db/migration .sql file, validate it matches V{n}__description.sql naming
5. PostToolUse: scan service Java file changes for LOGGER statements containing email, phone, salary, password, ssn — fail if found
Keep the existing TypeScript hook.
```

---

## What Failed First

- **Symptom:** PII detector initially used `cat $f` to read the file, which reads the saved file — not the content being written. This means it only catches PII in already-saved files, not inline edits.
- **Root cause:** For PostToolUse on Edit, the new content is in `.tool_input.new_string`; for Write it's in `.tool_input.content`. The file on disk may be the old version at hook time.
- **Fix:** Use `jq -r '.tool_input.new_string // .tool_input.content // empty'` to read the actual content being written, not the file.

- **Symptom:** Flyway check initially used `grep -P` which requires perl-regex support — not guaranteed on all Linux distros.
- **Fix:** Verified `grep -P` is available on the target system (Ubuntu). For portability, could use `grep -E '^V[0-9]+__[a-z0-9_]+\.sql$'` with a slightly less precise pattern.

---

## Key Teaching Points

### 1. PreToolUse vs PostToolUse — Blocking vs Validating
- **PreToolUse + exit 1** = hard block. Claude cannot proceed. Use for inviolable rules (read-only files, secrets).
- **PostToolUse + exit 1** = Claude already made the change but sees the error and must fix it. Use for convention enforcement.
- **PostToolUse + no exit** = advisory only. Surfaces information without blocking.

### 2. Hooks Run as the User, Not as Claude
Hooks execute shell commands with your system permissions. Claude cannot override them, rewrite them, or bypass them during a session. This is what makes them *structural* rather than advisory.

### 3. stdin JSON is the Interface
Every hook receives a JSON payload on stdin describing the tool call. Always use `jq` to extract values:
```bash
f=$(jq -r '.tool_input.file_path // empty')           # for file path
content=$(jq -r '.tool_input.new_string // .tool_input.content // empty')  # for file content
```
Never rely on env vars or positional arguments in command hooks.

### 4. Scope Guards are Essential
Without a file-path guard, every hook fires on every Edit/Write. Always scope with `grep -q` on the path:
```bash
if echo "$f" | grep -q 'hrapp-service/src/main/java'; then ...
```
This keeps hooks fast and avoids false positives.

### 5. CLAUDE.md States the Rules, Hooks Enforce Them
The `schema.sql is READ ONLY` rule is in CLAUDE.md. But Claude can forget, misread context, or be given conflicting instructions. The PreToolUse hook makes it physically impossible to violate — no matter what the prompt says.

### 6. Project vs Personal Settings
- `.claude/settings.json` — committed to the repo. Every developer and every Claude session on this project gets the same hooks.
- `.claude/settings.local.json` — gitignored. For personal preferences (themes, personal aliases) that shouldn't affect the team.

### 7. Soft vs Hard Guards — Intentional Design Choice
The env file hook warns but does not block (`exit 0` implicitly). This is intentional — editing `.env.example` is legitimate. Hooks should match the severity of the rule: inviolable rules get `exit 1`, advisory rules get a warning message only.

---

## Real-World Significance

In a complex enterprise codebase, these patterns address problems that code review alone cannot reliably catch:

| Problem | Without Hooks | With Hooks |
|---------|--------------|-----------|
| Schema modified directly | Caught in PR review (if reviewer notices) | Blocked instantly, every time |
| PII in logs | Caught in security audit (weeks later) | Blocked at the moment of writing |
| Bad migration file name | Fails silently at Flyway startup in staging | Blocked before the file is saved |
| Wrong class name prefix | Code review comment, manual fix | Blocked, message explains the rule |

The key insight: **hooks turn team conventions into automated enforcement at zero marginal cost per violation**.

---

## Lab Exercise Derivation

### Lab 6B: Enterprise Hook Patterns (20 minutes)

**Setup:** Students start with a project that has no hooks (or only the TypeScript hook from Lab 6A).

**Tasks (progressive):**

1. **Task 1 — Read-only guard:** Ask Claude to edit `database/schema.sql` directly. Observe it gets blocked. Then ask Claude the right way (create a new migration file). Discuss the difference between CLAUDE.md rules and hook enforcement.

2. **Task 2 — Naming convention:** Ask Claude to create a new Java service called `EmployeeValidator.java` (missing `Hr` prefix). Observe the hook fires and explains the violation. See Claude self-correct.

3. **Task 3 — PII detector:** Add a log line to a service: `LOGGER.info("Processing employee email: {}", employee.getEmail())`. Observe the hook catches it and Claude replaces with `MASKED`.

**Expected discovery:** Students realize Claude obeys hooks even when the prompt didn't mention the rule — the enforcement is structural, not conversational.

**Discussion prompt:** *"Where in your current codebase would you put a PreToolUse block? What's the most dangerous file someone could accidentally edit?"*

**Success criteria:**
- `schema.sql` edit attempt is blocked with a clear message
- Naming violation hook fires and Claude self-corrects without being told
- PII hook catches the logger line and Claude uses `MASKED` instead

---

## Connection to Other Build Notes

- **Build Note #12** (TypeScript hook) — same event system, simpler use case. Good to do first.
- **Build Note #02** (HrLogHelper, PII masking) — the PII hook enforces the rule established there.
- **Build Note #01** (CLAUDE.md) — schema.sql read-only rule first appears there. Hook makes it structural.
