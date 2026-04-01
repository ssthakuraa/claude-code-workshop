# Build Note: Quality Hooks (TypeScript Guard)

**Date:** 2026-03-30
**Module:** Quality Gates — Hooks
**Maps to Lab:** Lab 6: Quality Gates

---

## What We Built

A PostToolUse hook in `.claude/settings.json` that automatically runs `tsc --noEmit` after every Edit or Write to a `frontend/src/` file. Errors surface immediately in the Claude Code transcript rather than at build time.

## Technique Used

Claude Code hooks — `PostToolUse` event, `Edit|Write` matcher, `command` type.

## The Prompt That Worked

```
Set up a PostToolUse hook that runs tsc --noEmit after any Edit or Write
to a frontend/src/ file. Add to project settings (.claude/settings.json).
```

## What Failed First

- **Symptom:** First attempt used `$ARGUMENTS` placeholder and piped directly to `xargs npx tsc`. Broke on file paths with spaces and ran tsc even for non-frontend files.
- **Root cause:** `$ARGUMENTS` isn't substituted in command hooks (that's prompt hook syntax). Must parse stdin JSON with `jq`.
- **Fix:** Use `jq -r '.tool_input.file_path // empty'` into a quoted variable, then guard with `grep -q 'frontend/src/'` before running tsc.

## CLAUDE.md / Skill Update Made

This was added to `.claude/settings.json` (project-level, committed to repo):
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "f=$(jq -r '.tool_input.file_path // empty'); if echo \"$f\" | grep -q 'frontend/src/'; then cd /home/ssthakur/app/hr/frontend && npx tsc --noEmit 2>&1 | tail -20; fi",
        "timeout": 60,
        "statusMessage": "TypeScript check..."
      }]
    }]
  }
}
```
**Why:** Catches type errors immediately after every file edit rather than at build time, making regressions obvious before the next prompt.

## Key Teaching Points

1. Hook stdin is JSON — always use `jq` to extract values, never `$ARGUMENTS` in command hooks.
2. Guard conditions (`grep -q`) prevent the hook from running on irrelevant files (e.g. backend Java files).
3. `statusMessage` gives the user visible feedback in the spinner — especially important for 60-second timeout hooks.
4. Project settings (`settings.json`) are committed → whole team gets the same hooks. Personal settings go in `settings.local.json` (gitignored).

## Lab Exercise Derivation

- **Setup:** Clean project, no hooks configured.
- **Task:** Add a PostToolUse hook that runs `tsc --noEmit` only when frontend files change. Introduce a deliberate type error in a component, then edit the file and observe the hook output.
- **Expected discovery:** Students see the hook fire inline in the transcript and catch the error before running any build command.
- **Success criteria:** `jq -e '.hooks.PostToolUse[...]'` exits 0; hook fires on Edit to `frontend/src/`; hook does NOT fire on Java file edits.
