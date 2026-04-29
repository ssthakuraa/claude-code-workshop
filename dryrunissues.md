# Dry Run Issues Log

**Date:** 2026-04-28
**Dry-run repo:** `/home/ssthakur/projects/claude-workshop-dryrun`
**Role:** Acting as student, following lab flow from Setup → Lab 01.

---

## SETUP — claudelabsetup.md / verify-setup.sh

### ISSUE-01: AIHR_* table count mismatch in expected output
**Severity:** Low (cosmetic but confusing)
**Location:** `lab-materials/claudelabsetup.md` — example receipt output
**What happens:** The example receipt in `claudelabsetup.md` shows `AIHR_* tables   14 found`. The actual dry-run repo produces `19 found` (lab12 schema tables are included). A student comparing their output against the example will think something is wrong.
**Fix:** Update the expected output example to match the actual table count, or note that the count may vary.

---

### ISSUE-02: Frontend not running but verify-setup.sh prints "All checks passed"
**Severity:** Medium
**Location:** `lab-materials/verify-setup.sh`
**What happens:** The frontend service check uses `warn` (yellow `~`) rather than `fail` (red `✗`), so `FAILURES` stays at 0 and the final line prints `✓  All checks passed — you are ready for Lab 01` even when the frontend is not running. A student who relies on the receipt to confirm readiness will proceed to Lab 01 with the frontend down.
**Fix:** Either change the frontend check to `fail` so a down frontend blocks the "all passed" result, or add a note in the receipt that warns/failures on services still require attention before starting labs.

---

## LAB 01 — claudelab01.md

### ISSUE-03: Region module already exists in the student source tree (critical)
**Severity:** High — breaks the core exercise
**Location:** `backend/hrapp-service/src/main/java/com/company/hr/resource/HrRegionResource.java` and `backend/hrapp-service/src/main/java/com/company/hr/repository/HrRegionJdbcRepository.java`
**What happens:** Lab 01 asks the student to scaffold a new Region backend slice as Exercise 1. But `HrRegionResource.java` and `HrRegionJdbcRepository.java` already exist in the live source tree. When Claude Code receives the scaffolding prompt and reads the named comparison files, it is likely to either (a) find the existing Region files and refuse to create duplicates, (b) silently overwrite them, or (c) produce confusing output about files that already exist. The exercise premise — "scaffold a new module and observe what goes wrong" — requires those files to be absent.
**Fix:** Remove `HrRegionResource.java` and `HrRegionJdbcRepository.java` from the student source tree before publishing `claude-workshop`. The completed versions live correctly under `reference/lab01/`.

---

### ISSUE-04: Starter CLAUDE.md already contains strong Golden Rule — undermines Exercise 1
**Severity:** Medium — reduces learning impact
**Location:** `CLAUDE.md` (root of student repo)
**What happens:** Exercise 1's goal is to observe Claude Code drift/failure when there are no good project rules in CLAUDE.md. But the starter CLAUDE.md already contains a detailed Golden Rule block with four explicit rules about staying inside the lab, not scanning ahead, and acting as a student partner. These rules materially reduce the chance of observing failure, making it harder for students to surface the "correct-by-inference" vs "correct-by-rule" distinction that the exercise teaches.
**Fix:** Decide how sparse the starter CLAUDE.md should be for Lab 01. The current level is closer to a mid-lab state. Consider stripping the Golden Rule section from the published starter so students genuinely observe drift in Exercise 1, then write those rules as part of Exercise 2.

---

### ISSUE-05: Duplicate step number `2.` in Exercise 1 instructions
**Severity:** Low (clarity)
**Location:** `lab-materials/claudelab01.md` — Exercise 1, Instructions, items at lines ~49 and ~58
**What happens:** Two consecutive instruction items are both numbered `2.` — one says "For this exercise, if Claude Code needs repo comparison points..." and the next says "Ask Claude Code to scaffold the Region backend slice...". Markdown renders the second `2.` as a new list item at the same level, which looks like a copy-paste error and may confuse students counting steps.
**Fix:** Renumber so the list reads 1, 2, 3 without a repeated `2.`.

---

## Summary

| ID | Chapter | Severity | Short description |
|----|---------|----------|-------------------|
| ISSUE-01 | Setup | Low | AIHR_* table count in example output (14) doesn't match actual (19) |
| ISSUE-02 | Setup | Medium | Frontend not running but receipt prints "All checks passed" |
| ISSUE-03 | Lab 01 | High | Region source files already exist — breaks Exercise 1 scaffolding premise |
| ISSUE-04 | Lab 01 | Medium | Starter CLAUDE.md already has strong rules — reduces Exercise 1 failure signal |
| ISSUE-05 | Lab 01 | Low | Duplicate step number `2.` in Exercise 1 instructions |
