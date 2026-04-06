# Lab 5: Hooks — Deterministic Quality Gates

**Duration:** 60 minutes
**Day:** 2 — Productivity
**Builds On:** Lab 1 (CLAUDE.md — rules), Lab 4 (context discipline)
**Produces:** 3 hooks in `.claude/settings.json` enforcing enterprise standards

---

## Learning Objective

You will see the difference between **advisory rules** (CLAUDE.md — Claude might ignore them) and **structural enforcement** (hooks — Claude physically cannot override them). By the end, you'll understand why hooks are the enterprise governance feature of Claude Code.

---

## The Key Concept

Hooks are shell commands that execute automatically at specific lifecycle events. Unlike CLAUDE.md instructions (which Claude might forget at high context), hooks are **guaranteed to execute** every time.

**Two critical events:**

| Event | When It Fires | Use For |
|-------|---------------|---------|
| `PreToolUse` | Before Claude edits/writes a file | **Blocking** — prevent forbidden actions (exit 1 = hard stop) |
| `PostToolUse` | After Claude edits/writes a file | **Validating** — check conventions, run linters, scan for issues |

**Hook anatomy:**
```json
{
  "matcher": "Edit|Write",        // Which tools trigger the hook
  "hooks": [{
    "type": "command",             // Shell command
    "command": "...",              // The actual check
    "timeout": 10,                // Max seconds
    "statusMessage": "Checking..."  // Spinner text
  }]
}
```

**The key insight:** CLAUDE.md states the rules. Hooks **enforce** them.

---

## Setup

```bash
# Verify the backend compiles cleanly
cd backend && mvn compile -q && echo "Backend: OK"
```

You should have CLAUDE.md with your rules from Day 1 and the Region/Country/Location entities built.

---

## Exercise 1: The Read-Only File Guard (15 min)

### Goal
Create a PreToolUse hook that blocks any edit to `database/schema.sql`.

### Why This Matters
`schema.sql` is the reference DDL. Schema changes must go through Flyway migrations. But Claude might try to edit it directly when asked to "update the database schema." A CLAUDE.md rule says "don't edit it" — a hook makes it **impossible**.

### Instructions

> **Reference:** A reference version of `.claude/settings.json` exists at `reference/.claude/settings.json`. Create your own with 3 hooks first, then compare at the end. The reference includes 3 additional bonus hooks not covered in this lab — frontend TypeScript check (`tsc --noEmit`), Flyway migration naming validator, and `.env` file guard. These are optional real-world extras; your 3 hooks are complete for this exercise.

1. Ask Claude to set up the hook:
   ```
   Add a PreToolUse hook in .claude/settings.json that blocks any
   Edit or Write to database/schema.sql. The hook should:
   - Print a clear error message explaining WHY it's blocked
   - Suggest the correct approach (create a Flyway migration instead)
   - Exit with code 1 (hard block)
   Use jq to parse the tool input JSON from stdin.
   ```

2. **Test it.** Ask Claude to do something that would trigger the guard:
   ```
   Add a new column "middle_name" to the employees table in the database schema.
   ```

3. **What you should see:**
   - The hook fires and prints: `BLOCKED: database/schema.sql is READ ONLY...`
   - Claude sees the error and pivots to creating a Flyway migration file instead
   - Claude did NOT need to be told twice — the hook message guided it

4. **Contrast with CLAUDE.md only:** Imagine this at 85% context — Claude might ignore the CLAUDE.md rule. The hook fires regardless.

---

## Exercise 2: The Naming Convention Guard (15 min)

### Goal
Create a PostToolUse hook that rejects Java classes without the `Hr` prefix.

### Why This Matters
In a 50-developer enterprise team, naming conventions drift. One developer's `EmployeeValidator` breaks the pattern. Hooks enforce the convention automatically — every Claude session, every developer.

### Instructions

1. Add the hook:
   ```
   Add a PostToolUse hook that checks any new .java file written to
   hrapp-service/src/main/java/. If the class name doesn't start with "Hr",
   the hook should print a NAMING VIOLATION error and exit 1.
   Extract the filename from the tool input JSON using jq.
   ```

2. **Test it.** Ask Claude to create a class with a wrong name:
   ```
   Create a utility class called EmployeeValidator.java in the service package
   that validates employee email formats.
   ```

3. **What you should see:**
   - Hook fires: `NAMING VIOLATION: 'EmployeeValidator' must start with 'Hr'...`
   - Claude self-corrects to `HrEmployeeValidator.java` without you saying anything

---

## Exercise 3: The PII Leak Detector (15 min)

### Goal
Create a PostToolUse hook that scans service file changes for sensitive field names in logger statements.

### Why This Matters
PII in logs is a compliance violation. Code review catches it sometimes; a hook catches it every time. In regulated industries (healthcare, finance), this is a regulatory requirement.

### Instructions

1. Add the hook:
   ```
   Add a PostToolUse hook that scans any Service.java file change for
   LOGGER statements containing sensitive words: email, phone, salary,
   password, ssn. If found, print "PII LEAK DETECTED" with the offending
   line and exit 1. Read the new content from the tool input JSON,
   not from the file on disk.
   ```

2. **Test it.** Ask Claude to add a log line with PII:
   ```
   In HrRegionService, add a debug log line that shows the full
   employee email when processing a region assignment.
   ```

3. **What you should see:**
   - Hook fires: `PII LEAK DETECTED in logger statement...`
   - Claude replaces the email with `MASKED` and retries

> **Important limitation to understand:**
> The PII hook reads `new_string` (Edit tool) or `content` (Write tool) from the tool
> input — this is only the *changed fragment*, not the whole file. If Claude makes a
> partial edit that inserts a PII log line, the hook sees only the new content and will
> catch it. But if an existing PII log line was already in the file before this session,
> the hook won't flag it — it only catches violations introduced in the current tool call.
>
> This is a fundamental property of PostToolUse hooks: they enforce "no new violations,"
> not "no violations period." For comprehensive scanning, use a separate audit script
> (`grep -r` across the whole codebase) as a CI step rather than relying on hooks alone.

---

## Exercise 4: Review All Hooks (10 min)

### Instructions

1. View the final settings:
   ```
   Read .claude/settings.json and explain each hook —
   what it does, when it fires, and what it prevents.
   ```

2. **Verify the hook categories:**

   | Hook | Event | Severity | What It Prevents |
   |------|-------|----------|-----------------|
   | schema.sql guard | PreToolUse | Hard block | Direct schema modification |
   | Naming convention | PostToolUse | Hard block | Convention drift |
   | PII detector | PostToolUse | Hard block | Compliance violation |

3. **Add to CLAUDE.md:**
   ```markdown
   ## Active Hooks
   - PreToolUse: schema.sql is read-only (use Flyway migrations)
   - PostToolUse: Java classes must start with Hr
   - PostToolUse: No PII (email, phone, salary) in LOGGER statements
   ```

---

## Exercise 5: The Self-Improvement Coda (5 min)

Reflect on the difference:

| | CLAUDE.md Rule | Hook |
|-|---------------|------|
| **Enforcement** | Advisory — Claude might ignore under pressure | Structural — physically impossible to bypass |
| **Context dependency** | Degrades at high context | Fires regardless of context |
| **Scope** | Per-session (loaded at start) | Per-action (fires every tool call) |
| **Best for** | Conventions, patterns, guidelines | Inviolable rules, compliance, safety |

> **Think about your codebase:** What rules are currently advisory (code review catches them sometimes) that should be structural (hooks catch them always)?

---

## Success Criteria

- [ ] `.claude/settings.json` contains 3 hooks (schema guard, naming, PII)
- [ ] schema.sql edit attempt is blocked with clear error message
- [ ] Claude self-corrects naming violation without being told
- [ ] PII in logger statement is caught and prevented
- [ ] You can explain PreToolUse (blocking) vs PostToolUse (validating)

---

## Key Takeaways

1. **CLAUDE.md = advisory, Hooks = structural** — use both, for different things
2. **Hooks run as you, not as Claude** — Claude cannot override or disable them
3. **PreToolUse + exit 1 = hard block** — for inviolable rules
4. **PostToolUse + exit 1 = catch and correct** — for convention enforcement
5. **Project settings are team-wide** — `.claude/settings.json` is committed to git

---

<details>
<summary><strong>Escape Hatch</strong> — settings.json with all 3 hooks</summary>

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "f=$(jq -r '.tool_input.file_path // empty'); if echo \"$f\" | grep -q 'database/schema.sql'; then echo 'BLOCKED: database/schema.sql is READ ONLY. Use a Flyway migration in db/migration/ instead.' >&2; exit 1; fi",
        "timeout": 10,
        "statusMessage": "Checking schema.sql guard..."
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "f=$(jq -r '.tool_input.file_path // empty'); if echo \"$f\" | grep -q 'hrapp-service/src/main/java' && echo \"$f\" | grep -q '\\.java$'; then classname=$(basename \"$f\" .java); if ! echo \"$classname\" | grep -q '^Hr'; then echo \"NAMING VIOLATION: '$classname' must start with 'Hr'.\" >&2; exit 1; fi; fi",
          "timeout": 10,
          "statusMessage": "Checking Hr naming convention..."
        },
        {
          "type": "command",
          "command": "f=$(jq -r '.tool_input.file_path // empty'); if echo \"$f\" | grep -q 'Service\\.java$'; then matches=$(jq -r '.tool_input.new_string // .tool_input.content // empty' | grep -iE 'LOGGER.*\\b(email|phone|salary|password|ssn)\\b' || true); if [ -n \"$matches\" ]; then echo 'PII LEAK DETECTED in logger statement. Use MASKED placeholder.' >&2; exit 1; fi; fi",
          "timeout": 10,
          "statusMessage": "Scanning for PII in logs..."
        }
      ]
    }]
  }
}
```
</details>
