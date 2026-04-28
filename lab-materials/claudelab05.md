# Lab 05: Hooks — Truthful Guardrails

**Duration:** 25 minutes

## Learning Objective

You will see the difference between **advisory rules** (`CLAUDE.md`) and **structural guardrails** (hooks). By the end, you should understand one truthful hook example, the current runtime limitation, and why this course does not keep live hooks active after the demo.

---

## The Key Concept

Repo-managed Claude Code hooks live in a single file:

- `.claude/settings.json`
  - contains a `"hooks"` key that defines hook events, matchers, and commands
  - no separate `config.toml` or `hooks.json` — Claude Code uses one unified config file

In the current training environment, repo-managed hooks should be treated as an
evolving Claude Code feature, not as a fully mature production capability. This lab
therefore stays intentionally light: **one small `PreToolUse` example** that
teaches you how to configure and reason about a hook without pretending Claude Code
is already ready for a broad hook policy.

The goal is practical understanding, not over-promising maturity. Once a future
Claude Code release makes this feature stable enough for wider use, confirm that in
official Anthropic Claude Code release notes before you expand from this demo to a
larger, repo-relevant hook set.

**The key insight:** `CLAUDE.md` states the rules. Hooks enforce the subset of rules that the runtime can actually intercept.

---

## Exercise 1: Protect Java Backend Naming (10 min)

### Goal
Create a `PreToolUse` Bash hook that warns when a backend Java class path under
`com/company/hr` does not start with `Hr`.

### Why This Matters
Lab 01 established the naming rule, but a real guardrail is useful once the repo
starts growing. In the current runtime, this hook gives you a visible warning and
a non-zero signal that the naming rule was violated.

### Instructions

1. Ask Claude Code to add the hook:
   ```
   Add a PreToolUse Bash hook under the "hooks" key in `.claude/settings.json`
   that blocks Bash commands targeting backend Java files under
   `backend/hrapp-service/src/main/java/com/company/hr/`
   when the file name does not start with `Hr`.

   The hook should:
   - parse the Bash command from stdin with jq
   - inspect any matching Java file paths mentioned in the command
   - print a clear BLOCKED message naming the offending file
   - exit non-zero
   ```

2. **Restart Claude Code before the live demo.** This is a manual learner action. Close the current Claude Code session and reopen the project from the learner workspace root. There is no `claude resume` command — re-opening the project is the correct restart path.

3. **Test it live.** In the fresh session, ask Claude Code:
   ```
   Create backend/hrapp-service/src/main/java/com/company/hr/EmployeeRatingResource.java
   ```

4. **What you should see:**
   - The client shows the `PreToolUse` hook status lines on screen
   - The Java naming hook surfaces a visible warning naming `EmployeeRatingResource.java`
   - In some clients the warning is informational only and the Bash command may still run
   - If the file is created anyway, treat that as a runtime limitation, not as proof that your hook logic is wrong

5. **Clean up the intentionally bad file.** Ask Claude Code:
   ```
   Remove backend/hrapp-service/src/main/java/com/company/hr/EmployeeRatingResource.java
   ```

6. **Return the workspace to a quiet state.** Ask Claude Code:
   ```
   Remove the "hooks" key from `.claude/settings.json` so the file returns
   to its baseline state with no active hooks.
   ```

7. **Restart Claude Code once hooks are cleared.** This clears the warning flow before you continue to later labs. Close the current Claude Code session and reopen the project from the learner workspace root. There is no `claude resume` command — re-opening the project is the correct restart path.

## Key Takeaways

1. The Hooks feature is evolving and experimental.
2. Hooks live in a single file: `.claude/settings.json` under the `"hooks"` key.
3. In this learner path, the hook lesson is one small Bash-governance demo, not
   a broad live-enforcement system.
4. `PreToolUse` plus a non-zero exit gives you a real signal, but not always a
   guaranteed live block in every client.
5. One visible demo is enough to understand the feature without making the rest
   of the course noisy.
