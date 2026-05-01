# Lab 05: Hooks — Structural Guardrails

**Duration:** 75 minutes

## Learning Objective

You will see the difference between **advisory rules** (`CLAUDE.md`) and **structural guardrails** (hooks). By the end you should know each Claude Code hook event by name, when each one is the right tool, when a hook is the wrong tool, and how to layer hooks without producing noise. The lab keeps the existing one-hook demo as its foundation, then walks the rest of the hook surface one event at a time.

---

## The Key Concept

Repo-managed Claude Code hooks live in a single file:

- `.claude/settings.json`
  - contains a `"hooks"` key that defines hook events, matchers, and commands
  - no separate `config.toml` or `hooks.json` — Claude Code uses one unified config file

Hooks are evaluated by the Claude Code runtime around tool calls and session events. They give the runtime a chance to inspect, block, augment, or react to what the agent is doing. Unlike `CLAUDE.md` rules — which are advisory and depend on the model honoring them — hooks run shell commands, read structured payloads on stdin, and signal the runtime through exit codes.

**The six hook events you will exercise in this lab:**

| Event | Fires | Typical use |
|---|---|---|
| `PreToolUse` | Before a tool call runs | Block dangerous commands, enforce naming, gate by file path |
| `PostToolUse` | After a tool call succeeds | Run linter/formatter, compile-check, log diffs |
| `UserPromptSubmit` | When the learner submits a prompt | Inject narrow repo facts |
| `Stop` | When the main session ends | Warn on uncommitted work, archive logs |
| `SubagentStop` | When a delegated subagent returns | Summarize subagent output |
| `Notification` | When the client surfaces a system notification | Audit prompts, log permissions events |

**Exit code semantics:**

| Exit code | Effect on Claude Code |
|---|---|
| `0` | Hook ran cleanly. Tool call proceeds (PreToolUse), or post-step is logged (PostToolUse). |
| `2` | Hook signals a hard block. PreToolUse hooks with exit 2 are the only reliable way to stop a tool call before it runs. |
| Other non-zero | Treated as a warning by most clients. Behavior is client-specific and may be informational only. |

**The key insight:** `CLAUDE.md` states the rules. Hooks enforce the subset of rules that the runtime can actually intercept.

> **A note on maturity.** Hooks are an evolving Claude Code feature. Some clients render hook output as inline status lines, some as stderr-only warnings, and some clients still let the underlying tool call proceed even after a non-zero exit. Each exercise below tells you what to do if your client's behavior deviates from what the lab expects. The point of the lab is to know which hook does what, not to assume every client enforces every signal identically.

---

## Setup

Before the first exercise, confirm:

1. `.claude/settings.json` exists in your workspace root. If not, ask Claude Code to create an empty one with `{"hooks": {}}` as a starting shape.
2. `jq` is available on your shell (`command -v jq`). Several exercises parse JSON payloads from stdin with `jq`. If `jq` is missing, install it before continuing — `apt install jq` or the equivalent for your platform.
3. You have a clean git working tree, or at least know what is uncommitted. The Stop-hook exercise warns on uncommitted work, and you want a clean baseline to test against.

This lab adds and removes hooks as it goes. Exercises 2–7 each leave a working hook in `.claude/settings.json`. Exercise 8 cleans them all up so the rest of the curriculum is not noisy. Do not skip Exercise 8.

---

## Exercise 1: PreToolUse — Protect Java Backend Naming (10 min)

### Goal
Create a `PreToolUse` Bash hook that warns when a backend Java class path under `com/company/hr` does not start with `Hr`.

### Why This Matters
Lab 01 established the naming rule, but a real guardrail is useful once the repo starts growing. In the current runtime, this hook gives you a visible warning and a non-zero signal that the naming rule was violated.

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

6. **Keep the hook in `.claude/settings.json`.** Unlike the older one-exercise version of this lab, you will leave this hook in place and layer additional hooks alongside it. Final cleanup happens in Exercise 8.

> **Foundation hook.** This is the example you will compare every other hook type against. Keep it open in another window while you work through Exercises 2–7.

---

## Exercise 2: PreToolUse — Block Dangerous Bash (12 min)

### Goal
Use a `PreToolUse` Bash hook to stop destructive shell commands before Claude Code runs them.

### Why This Matters
The Java-naming hook in Exercise 1 enforces a convention. This one enforces safety. It is the canonical use case for `PreToolUse` with exit code 2: a hard block on commands that, if they ran, would do real damage.

### Instructions

1. Ask Claude Code to add a second `PreToolUse` hook entry in `.claude/settings.json`. Keep the Exercise 1 hook intact and append the new one alongside it:
   ```
   Add a second PreToolUse Bash hook under the "hooks" key in `.claude/settings.json`.
   Keep the existing Java naming hook intact.

   The new hook should:
   - parse the Bash command from stdin with jq
   - block the command if it matches any of these deny patterns:
     - `rm -rf /` or `rm -rf ~` or `rm -rf $HOME`
     - `git push --force` or `git push -f` to a non-feature branch
     - `DROP TABLE` or `DROP DATABASE`
     - `chmod -R 777`
   - print a structured BLOCKED message to stderr that names the matched pattern
   - exit with code 2 (hard block)

   Use a clear statusMessage like "Checking for dangerous bash commands..."
   ```

2. **Restart Claude Code** so the new hook is loaded.

3. **Test the block.** Ask Claude Code:
   ```
   Run `rm -rf /tmp/lab05-cleanup` to remove a sandboxed test directory.
   ```
   This should pass — `/tmp/lab05-cleanup` does not match any deny pattern.

4. Now ask:
   ```
   Run `rm -rf /` to clean the root.
   ```
   The hook should fire with exit code 2. The tool call should be blocked, not just warned.

5. **Inspect the matcher tightness.** Ask Claude Code:
   ```
   Run `git push --force origin feature/my-branch`
   ```
   This is a feature-branch force push. Whether it should be blocked is a policy choice. Decide for yourself whether your hook's matcher is tight enough or too loose, and adjust if the behavior surprised you.

6. **What you should see:**
   - Safe commands run normally (no false positives on `/tmp/lab05-cleanup`)
   - Destructive commands return a non-zero exit and a structured BLOCKED message
   - Loose matchers either let bad commands through or block legitimate ones; this is the trade-off you tune

> **The lesson:** PreToolUse with exit 2 is the only reliable hard block in the current hook surface. Use it for must-stop-before conditions. Use it sparingly — every false positive trains you to ignore the warning.

---

## Exercise 3: PostToolUse — Lint After Frontend Edits (13 min)

### Goal
Use a `PostToolUse` hook to run a linter automatically after Claude Code edits frontend code.

### Why This Matters
PostToolUse is for **should-clean-up** cleanup, not must-block enforcement. Failures from a PostToolUse hook usually surface as warnings, not blocks — Claude Code already finished the action. The right pattern is to run formatters or quick validators that produce useful feedback the next turn can act on.

This repo has `npm run lint` wired (eslint) and no separate `format` script. The exercise uses `npx eslint --fix` so the hook can both report and auto-correct simple issues. The same hook shape works for backend `./build-jersey-service.sh compile` if you want a compile-check on Java edits — that is the optional extension at the end.

### Instructions

1. Ask Claude Code to add a `PostToolUse` hook:
   ```
   Add a PostToolUse hook in `.claude/settings.json` that runs after Edit and
   Write tools succeed.

   The hook should:
   - parse the tool name and file path from stdin with jq
   - only act when the tool was Edit or Write AND the path matches frontend/src/**/*.{ts,tsx}
   - run `cd frontend && npx eslint --fix <relative-path>` on the changed file
   - print a one-line summary of the eslint result to stderr
   - exit 0 either way (PostToolUse is advisory; do not block)

   Keep all existing hooks intact.
   ```

2. **Restart Claude Code** so the new hook is loaded.

3. **Test it.** Ask Claude Code to make a small frontend edit:
   ```
   Open frontend/src/components/hr/HrStatusBadge.tsx and add a const named
   `LAB05_DEMO_VALUE` with the value `"lab05demo"` (double quotes) just below
   the imports. Then save the file.
   ```

4. **Observe the hook output.** You should see:
   - The Edit tool reports success
   - The PostToolUse hook fires and runs eslint on `HrStatusBadge.tsx`
   - eslint auto-fixes the double-quoted string to a single-quoted string
   - Claude Code's next turn sees the file in its eslint-fixed shape, not the shape it just wrote

5. **Notice the loop.** Ask Claude Code:
   ```
   Show me the diff of HrStatusBadge.tsx since my last manual save.
   ```
   The diff should show `"lab05demo"` changed to `'lab05demo'` — a change that Claude Code did not write directly. This is the "PostToolUse changed the file behind the agent's back" effect — it is fine when the formatter is deterministic, surprising when the formatter is opinionated. Lesson: choose PostToolUse targets that are deterministic.

6. **Roll back the demo edit.** Ask Claude Code:
   ```
   Remove the LAB05_DEMO_VALUE const from HrStatusBadge.tsx.
   ```

7. **Optional — backend compile-check variant.** If you want to extend this to Java files, the same hook shape with `command: cd backend && ./build-jersey-service.sh compile` and a path match on `backend/**/*.java` runs a real validation pipeline after every Java edit. It is slower (Maven invocations are expensive) so most teams gate it to specific paths or run it manually. You do not need to wire this for Lab 05; the eslint version exercises the pattern.

### What You Should See

PostToolUse fires after the tool call. Failures are advisory, not blocking. The hook is most useful when the post-action is deterministic (formatters, linters with `--fix`) and least useful when the post-action is slow or opinionated.

> **The lesson:** PreToolUse for must-block; PostToolUse for should-clean-up. Choosing the wrong event for the wrong purpose is the most common hook mistake.

---

## Exercise 4: UserPromptSubmit — Inject Project Context (10 min)

### Goal
Use a `UserPromptSubmit` hook to prepend a small repo-fact reminder to every prompt, then deliberately overuse it to feel the failure mode.

### Why This Matters
`UserPromptSubmit` runs before Claude Code reads the learner's prompt. Whatever the hook prints to stdout is injected into the agent's context as additional input. It is a powerful and easy-to-misuse event. The right use is **narrow facts that are easy to forget**: the active port, the active database engine, the current branch policy. The wrong use is prose context, multi-paragraph reminders, or anything the model would read as a competing instruction stream.

### Instructions

1. Ask Claude Code to add the hook:
   ```
   Add a UserPromptSubmit hook in `.claude/settings.json`.

   The hook should print a short one-line repo-fact reminder, then exit 0:
     "Active runtime: PostgreSQL on backend port 18082, frontend port 5182.
      Use `cd backend && ./build-jersey-service.sh test` for backend tests."

   Keep all existing hooks intact.
   ```

2. **Restart Claude Code.**

3. **Test it.** Ask Claude Code:
   ```
   What backend port should I use for local testing?
   ```
   The answer should reflect the injected fact (`18082`). Without the hook, the agent could only answer from `CLAUDE.md` or by reading config files.

4. **Now deliberately overreach.** Ask Claude Code to expand the hook payload:
   ```
   Update the UserPromptSubmit hook to also inject a 5-paragraph summary of the
   project history, the team conventions, and a friendly greeting at the start.
   ```
   Restart Claude Code. Ask any small question.

5. **Observe the failure mode.** With a paragraph-length injection, the agent's responses often:
   - adopt a different tone (the friendly greeting bleeds in)
   - re-summarize the injected context unnecessarily
   - mix the injected prose with their actual answer
   - sometimes contradict CLAUDE.md if the injected prose drifts from it

6. **Revert the overreach.** Ask Claude Code to restore the hook to its one-line fact form.

### What You Should See

UserPromptSubmit is best used for tight repo facts, not for prose context. Prose injection pollutes the agent's response style and competes with CLAUDE.md. The lesson is to keep these injections to one line and to write them like a status bar, not like documentation.

> **The rule:** UserPromptSubmit injects facts, not vibes.

---

## Exercise 5: Stop and SubagentStop — Don't Let Work Walk Away (10 min)

### Goal
Use `Stop` to catch end-of-session conditions; observe what `SubagentStop` sees so you recognize the event when Lab 07 starts using it.

### Why This Matters
`Stop` fires when the main session ends. It is the right place for end-of-session checks: uncommitted work warning, summary generation, log archival. `SubagentStop` fires when a delegated subagent returns; it is most useful once a workflow actually uses subagents (Lab 07 is when this lab's curriculum starts depending on them).

### Instructions

1. Ask Claude Code to add a `Stop` hook:
   ```
   Add a Stop hook in `.claude/settings.json`.

   The hook should:
   - run `git status --porcelain` from the workspace root
   - if the output is non-empty, print a warning to stderr that lists the
     uncommitted paths, then exit 0 (warn, do not block — Stop already happened)
   - if the output is empty, print a one-line "clean working tree" confirmation

   Keep all existing hooks intact.
   ```

2. Ask Claude Code to also add a `SubagentStop` hook:
   ```
   Add a SubagentStop hook in `.claude/settings.json`.

   The hook should print a one-line summary line containing the subagent's name
   (parse from stdin with jq) and exit 0. The point is to confirm the event
   fires; you do not need to do anything with the payload yet.

   Keep all existing hooks intact.
   ```

3. **Restart Claude Code.**

4. **Test the Stop hook.** Make any small uncommitted edit (add a comment somewhere harmless). Then exit Claude Code. The Stop hook should fire on session end and print the uncommitted-work warning. If your client suppresses Stop hook output, check `.claude/settings.json` and confirm the hook is wired correctly — the lesson is the same even if the output is not visible.

5. **Test the SubagentStop hook only if your client supports subagents.** If not, leave the hook wired and note that Lab 07 will exercise it. The hook itself is correct even if it has not fired yet.

6. **Roll back the test edit.** Use `git checkout` or ask Claude Code to revert the demo edit.

### What You Should See

Stop is reliable. SubagentStop's usefulness depends on whether your workflow actually delegates to subagents. Both events are quiet by default — they do not fire on every tool call — so they are good places for end-of-something checks without noise.

> **The lesson:** Stop is for closure. Use it for the checks you would otherwise forget at the end of the session.

---

## Exercise 6: Notification — Optional Awareness (5 min)

### Goal
Add a `Notification` hook so you know what the event carries.

### Why This Matters
`Notification` fires when Claude Code shows the learner a system notification — most often a permissions prompt or a long-running tool warning. The event is mostly useful for audit logging or for wiring desktop notifications to a longer-running session. It is the lowest-impact hook in the surface; you will not use it heavily.

### Instructions

1. Ask Claude Code to add a `Notification` hook:
   ```
   Add a Notification hook in `.claude/settings.json`.

   The hook should:
   - read the notification payload from stdin
   - append a single line to `.claude/notification-log.local` containing
     the timestamp and the payload's `message` field (parse with jq)
   - exit 0

   Add `.claude/notification-log.local` to `.gitignore` if it is not already
   covered by an existing pattern. Keep all existing hooks intact.
   ```

2. **Restart Claude Code.**

3. **Trigger a notification.** Ask Claude Code to do something that requires a permissions prompt — for example, ask it to read a file outside the workspace (`/etc/hosts`) or run a command your settings restrict. The Notification event should fire.

4. **Check the log.** Open `.claude/notification-log.local` and confirm an entry was appended.

### What You Should See

Notification is observability, not control. The hook gives you a record of when the client surfaced something to the learner — useful for debugging surprising prompts, less useful for blocking the agent.

> **The lesson:** Notification logs help post-hoc; they do not change the run.

---

## Exercise 7: Hook Composition and Anti-Patterns (10 min)

### Goal
Layer the hooks you have built so far, observe the order and noise, then mark a list of hook ideas as appropriate or anti-pattern.

### Why This Matters
Hooks compose by event. Multiple hooks under the same event run in the order they appear in `.claude/settings.json`. If you wired Exercises 1, 2, and 3, your `PreToolUse` array now has two entries (Java naming + dangerous bash) and your `PostToolUse` array has one. This exercise confirms the order is what you expect, then asks you to recognize when **not** to add a hook at all.

### Instructions

1. Ask Claude Code to summarize the current hook surface:
   ```
   Read `.claude/settings.json` and list:
   - every hook event currently configured
   - for each event, the order the hooks will run
   - for each hook, a one-line description of what it does

   Print this as a markdown table. Do not modify the file.
   ```

2. **Confirm the order matches your intent.** Java naming should run before dangerous-bash if you added them in that order. If both fire on the same Bash command, both messages should appear. This is fine — composition is additive.

3. **Now an anti-pattern audit.** For each idea below, decide: would you implement this as a hook, or is a hook the wrong tool? Write your answer and a one-line rationale in your own notes.

   | # | Hook idea | Hook or not? Why? |
   |---|---|---|
   | a | Block any Bash command that contains `sudo` | |
   | b | Enforce that all React components use functional syntax (no class components) | |
   | c | Auto-format Java files with a 4-space indent on every Edit | |
   | d | Inject the full contents of `CLAUDE.md` into every UserPromptSubmit | |
   | e | Silently rewrite any prompt containing the word "yolo" to "carefully" | |
   | f | Warn when a `git commit` would include a `.env` file | |
   | g | On Stop, post a Slack message summarizing the session | |
   | h | On every PreToolUse, run a 30-second test suite to validate the agent's "intent" | |

4. **Compare your answers** to this rubric:

   - **(a) Hook is fine** — narrow, deterministic, safety-shaped. Same family as Exercise 2.
   - **(b) Hook is overreach** — taste, not safety. Belongs in `CLAUDE.md` or a skill, not a structural guardrail.
   - **(c) Hook is fine** when the formatter is deterministic — same family as Exercise 3. Watch for opinionated formatters.
   - **(d) Anti-pattern** — `CLAUDE.md` is already loaded at session start. Re-injecting it on every prompt is duplicate context that pollutes responses (Exercise 4 lesson).
   - **(e) Anti-pattern** — silently rewriting prompts is the worst use of `UserPromptSubmit`. The learner cannot see the modification. Hooks should be visible and honest.
   - **(f) Hook is fine** as a `PreToolUse` on Bash with a `git commit` matcher and a `.env` content check. Safety-shaped, narrow, easy to test.
   - **(g) Hook is fine** as a `Stop` hook, given network policy allows it. Same family as Exercise 5.
   - **(h) Anti-pattern** — running a 30-second test on every tool call destroys the loop. Hooks should be cheap; expensive checks belong in CI, not in `PreToolUse`.

### What You Should See

Hooks compose cleanly when they are narrow and ordered intentionally. Anti-patterns share a shape: they encode taste rather than safety, hide modifications from the learner, duplicate `CLAUDE.md`, or are too expensive to run on every event.

> **The rule:** Hook for safety and determinism. Skill or rule for taste. Skip the hook entirely if it would surprise the learner or slow the loop.

---

## Exercise 8: Cleanup and Capture the Rule (5 min)

### Goal
Restore the workspace to a quiet state and encode the lesson.

### Instructions

1. **Remove the live hooks.** Ask Claude Code:
   ```
   Remove the "hooks" key from `.claude/settings.json` so the file returns
   to its baseline state with no active hooks.
   Also remove `.claude/notification-log.local` if it exists.
   ```

2. **Restart Claude Code** so the rest of the curriculum runs without hook noise.

3. **Add the cumulative rule to `CLAUDE.md`:**
   ```
   Update CLAUDE.md by adding this section. Do not modify any other section.

   ## Hooks (Structural Guardrails)
   - Hooks live in `.claude/settings.json` under the "hooks" key
   - PreToolUse with exit 2 is the only reliable hard block; treat PostToolUse as advisory
   - UserPromptSubmit injects narrow facts only; never paragraph-length context
   - Hooks compose by event, in file order; keep each hook narrow and ordered intentionally
   - Use hooks for safety and determinism, not for taste; CLAUDE.md and skills cover the rest
   - Remove demo hooks before continuing to later labs so the workspace stays quiet
   ```

4. **Exit Claude Code** and reopen the project so the new rule is loaded for later labs.

### What You Should See

`.claude/settings.json` is back to its baseline with no `"hooks"` key. `CLAUDE.md` now carries a Hooks section that summarizes the lesson without re-listing every exercise.

---

## Common Mistakes & Fixes

- Mistake: using `PostToolUse` for a hard block.
  Fix: PostToolUse is advisory; the action already happened. Use `PreToolUse` with exit 2.
- Mistake: paragraph-length `UserPromptSubmit` injections.
  Fix: one-line facts only. Anything longer belongs in `CLAUDE.md` or a skill.
- Mistake: encoding taste as a hook.
  Fix: if the rule is "I prefer X style," that is `CLAUDE.md` or a reviewer skill, not a hook.
- Mistake: leaving demo hooks active across labs.
  Fix: Exercise 8 cleanup is mandatory; later labs assume a quiet hook surface.
- Mistake: trusting that every client enforces every hook signal identically.
  Fix: read your client's release notes and confirm with `maintainer-tools/claude-hook-smoke-test.sh` if available.

---

## Success Criteria

- [ ] Each hook category (PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, Notification) was wired and observed at least once
- [ ] You can articulate when to choose PreToolUse vs PostToolUse in one sentence
- [ ] You produced an anti-pattern rationale for at least three of the eight ideas in Exercise 7
- [ ] `.claude/settings.json` was returned to its baseline state in Exercise 8
- [ ] `CLAUDE.md` updated with the Hooks (Structural Guardrails) section

---

## Key Takeaways

1. Hooks live in `.claude/settings.json` under the `"hooks"` key — one file, one schema.
2. PreToolUse with exit 2 is the only reliable hard block; everything else is advisory.
3. PostToolUse is for should-clean-up actions like formatters and linters; it is not a gate.
4. UserPromptSubmit injects facts, not vibes — keep it to one line.
5. Stop is for end-of-session closure; SubagentStop becomes useful once Lab 07 brings subagents into the picture.
6. Notification is observability, not control.
7. Hooks compose by event in file order; anti-patterns share a shape — taste, secrecy, duplication, or cost.
8. The lesson lives in `CLAUDE.md`. The demo hooks do not.

---

<details>
<summary><strong>Recovery Path</strong> — Use this if `.claude/settings.json` becomes unworkable mid-lab</summary>

Stay inside the current lab. Do not scan ahead or use other `reference/` material unless this recovery path explicitly tells you to.

If the layered hook surface gets tangled — duplicate entries, malformed JSON, hooks firing in surprising order — restore a known-good layered config from `reference/lab05/settings-final.json`. That file contains a complete `.claude/settings.json` with all six exercises' hooks wired correctly.

After applying the rescue:

1. exit Claude Code
2. reopen the project
3. continue from the exercise where you got stuck
4. when you reach Exercise 8, the cleanup step is the same regardless of whether you were on the rescue config or your own

The maintainer-side smoke test at `maintainer-tools/claude-hook-smoke-test.sh` covers every hook category in this lab. If you are debugging a stuck hook and want a deterministic check, ask the maintainer to run the relevant mode for you.
</details>
