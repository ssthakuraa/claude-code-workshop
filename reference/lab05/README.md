# Lab 05 Escape Hatch

This folder contains rescue material for Lab 05 (Hooks — Structural Guardrails).

Use it only when the layered `.claude/settings.json` becomes unworkable mid-lab — for example, malformed JSON after a hand-edit, or hooks firing in an unexpected order — and you want to reset to a known-good layered config without losing the lab's narrative.

Available rescue files:

- `settings-final.json` — a complete `.claude/settings.json` with all six exercises' hooks wired correctly. Drop this in at `.claude/settings.json` if your own copy gets tangled, then continue from the exercise where you got stuck.

## Restore prompt

```text
Restore the Lab 05 layered hook config:

- copy `reference/lab05/settings-final.json` -> `.claude/settings.json`

Do not inspect or modify anything else.
Then tell me the restore is complete and remind me to restart Claude Code so
the hooks load.
```

## What this rescue does NOT do

- It does **not** replace Exercise 8 cleanup. After you finish the lab, you still need to remove the `"hooks"` key from `.claude/settings.json` so the rest of the curriculum runs quietly. The rescue file is for mid-lab recovery, not the post-lab end state.
- It does **not** include the `CLAUDE.md` rule capture from Exercise 8. That edit is small enough to retype from the lab.
- It does **not** include any test artifacts (the `EmployeeRatingResource.java` from Exercise 1, the `LAB05_DEMO_VALUE` const from Exercise 3). Those are throwaway demo edits the lab tells you to clean up inline.

## Maintainer smoke test

`maintainer-tools/claude-hook-smoke-test.sh` is the deterministic way to confirm each hook in `settings-final.json` fires the expected payload. The smoke test is a maintainer tool, not a learner step — it backstops this rescue file's correctness.
