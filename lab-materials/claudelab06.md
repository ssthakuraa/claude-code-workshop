# Lab 06: Bad-Agent Recovery — Catching and Correcting Drift

**Duration:** 60 minutes

## Learning Objective

You will read a Claude Code session that goes off-track, learn to recognize the moments drift starts, then practice the moves that catch drift early, redirect surgically, and salvage usable work without throwing the whole run away. By the end you should know when to interrupt, what to interrupt with, and when a clean restart is cheaper than a rescue.

---

## The Key Concept

A "bad agent run" is rarely one big mistake. It is a chain of small drifts: an invented layer, a hallucinated table, a file read "for context" that pollutes the next decision, a redirect prompt that was too vague to land. Each drift is cheap to fix at the moment it happens and expensive to fix later.

**The four recovery moves:**

| Move | Use When |
|---|---|
| **Spot early** | Reading the agent's plan or first tool calls — drift in plan output is the cheapest moment to intervene |
| **Redirect surgically** | One localized invention, session is otherwise on-task, context still clean |
| **Restart cleanly** | Context is polluted, session contradicts itself, drift has spread across files |
| **Salvage selectively** | Bad run produced some correct fragments worth re-deriving from a clean prompt |

Lab 04 taught you that context degrades. This lab teaches you what to do when degradation has already produced bad output. Lab 05 hooks are structural prevention; recovery is the human-in-the-loop complement.

---

## Setup

This lab uses a pre-baked simulated transcript instead of a live drift run, because a 60-minute live session cannot reliably reproduce the specific drift moments the lesson depends on.

The transcript lives at:

- `lab-materials/docs/lab06-bad-agent-transcript.md`

Open it in a separate window now. You will reference it throughout the lab. Do **not** read the annotated answer key at `reference/lab06/transcript-annotated.md` until you have finished Exercise 1 on your own.

If you need rescue help during this lab, the `reference/lab06/` escape hatch contains the answer keys for Exercises 1 and 4. Do not consult it ahead of time — the point of the lab is to develop your own eye for drift.

You should have a working `CLAUDE.md` from Labs 01–05. If not, restore it from `reference/lab01/CLAUDE.md` first.

---

## Exercise 1: Watch the Bad Run (15 min)

### Goal
Read the simulated transcript end-to-end and mark the moments drift starts. Score what went wrong before you learn what to do about it.

### Instructions

1. Open `lab-materials/docs/lab06-bad-agent-transcript.md`. The transcript shows a Claude Code session asked to scaffold a read-only `Region` lookup endpoint — the same task Lab 01 used. The agent has no fresh CLAUDE.md guardrails active for this exercise.

2. Read the transcript straight through once, without notes. Notice how the work feels reasonable in the moment but produces a final state that does not match what was asked for.

3. **Now read it again, slowly.** As you go, mark every moment the agent drifted. For each drift, capture three things in your own notes:
   - **What drifted** — invented architecture, hallucinated schema, scope creep, context fill, contradiction, something else
   - **Earliest visible signal** — the first sentence in the transcript where you could have caught it
   - **What you would have done** — interrupt with a redirect, restart, ignore

   Use a simple table:

   | # | Drift type | Earliest signal (transcript line) | Your move |
   |---|---|---|---|

4. **Score yourself.** A complete Drift Inventory should capture **at least 4 distinct drift moments** out of the five planted in the transcript. If you only found one or two, read again — the transcript is dense on purpose.

5. **Do not consult the answer key yet.** Exercises 2–4 will sharpen your eye further; the answer key is a comparison check at the end.

### What You Should See

The transcript contains five planted drift moments:
- an invented `RegionService` layer the repo does not use
- a hallucinated `AIHR_REGIONS_V2` table that does not exist in `database/hrschema.sql`
- scope creep into `HrJobResource.java` for "consistency"
- context-fill thrashing — three large files read for no immediate reason
- a self-contradiction late in the session, after context has filled

You do not need to find all five on this pass. You need to find the **pattern** — drift starts small, signals appear in the agent's plan output before they appear in the diff, and "looks reasonable in the moment" is the trap.

> **This is the teaching moment.** Drift is hard to catch only because we are reading the output for content rather than for signals. Once you know the signals, drift is loud.

---

## Exercise 2: Spot Drift Early (10 min)

### Goal
Catch drift in the agent's plan output before it produces code.

### Instructions

1. Open a fresh Claude Code session from your workspace root.

2. Give it the same prompt the bad transcript started with, but this time ask for a **plan first**:
   ```text
   This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use `reference/` unless this chapter explicitly allows it or you need rescue help.

   I want a plan first, not code.

   Design a read-only Region scaffold for the HR app:
   - GET /app/hr/api/v1/regions
   - response DTO + JDBC repository + Jersey resource only
   - no request DTOs, no write endpoints, no service layer
   - target the existing AIHR_REGIONS table

   Show me the plan: which files will be created, which will be touched,
   what the data flow looks like, and what verification you will run.
   Do not implement yet.
   ```

3. **Read the plan with a drift-signal checklist in hand.** Mark anything that looks like:
   - [ ] An invented layer not in the prompt (controller, service, manager, helper, factory)
   - [ ] A schema name not in `database/hrschema.sql`
   - [ ] A file in the "files to touch" list that the prompt did not name
   - [ ] A side-trip ("I'll also clean up X" / "while I'm here, let me also Y")
   - [ ] A research step ("I'll read these five large files first")
   - [ ] An action verb the prompt forbade (write, mutate, register, modify wiring)

4. If any signal fires, **redirect in the plan, not in the code.** Iterate the plan until the checklist is clean.

5. Save your drift-signal checklist as a personal artifact — it is the cheapest reusable tool from this lab.

### What You Should See

In a clean session with explicit constraints, the plan usually lands on the first or second pass. If it doesn't, you have learned something more important: **drift signals appear in plan text long before they appear in code.** Catching them in the plan costs one redirect prompt; catching them in the code costs a restart.

---

## Exercise 3: Surgical Correction vs. Full Restart (15 min)

### Goal
Decide when a redirect prompt is enough and when a fresh session is cheaper.

### Instructions

1. Two short scenarios, both drawn from the transcript. For each, **decide redirect or restart** and write the prompt you would use:

   **Scenario A — context already polluted.** The session has read three large files, has been running for an hour, and just produced output that contradicts something it said earlier. You only wanted a Region scaffold.

   **Scenario B — one localized invention.** The session is otherwise on-task. The plan looks fine except it added a `RegionService` layer the prompt forbade. Nothing has been written to disk yet.

   Write your decision and your prompt for each, in your own notes:

   ```
   Scenario A: redirect / restart  (circle one)
   My prompt: ...

   Scenario B: redirect / restart  (circle one)
   My prompt: ...
   ```

2. Now actually run both. Open two fresh Claude Code sessions:
   - In session 1, simulate Scenario A: ask Claude Code to read three unrelated large files (`database/hrschema.sql`, `lab-materials/docs/requirement.md`, `lab-materials/docs/technical-design-jersey-rewrite.md`), then ask for the Region plan, then **try to redirect** with whatever prompt you wrote.
   - In session 2, simulate Scenario B: ask for the plan and gently nudge it to include a `RegionService` ("first plan it, then add a service layer for clarity"), then **try to redirect** away from the service layer with whatever prompt you wrote.

3. Compare the outcomes. Which redirect actually landed? Which session would have been cheaper to restart?

### What You Should See

Restart usually wins when context is already polluted. The Lab 04 lesson reapplies: a thrashed session keeps thrashing, and a redirect prompt that has to compete with three large files in context rarely wins. Redirect usually wins when the drift is one localized invention before any code has been written.

> **The cost lens.** A fresh session is free. A redirect prompt is cheap. Debugging an output that drifted after you tried to redirect a thrashed session is expensive. Pick the cheap move first.

Capture a two-row decision card in your own notes:

```text
Redirect when: ...
Restart when: ...
```

---

## Exercise 4: Writing Redirect Prompts That Work (10 min)

### Goal
Practice the two-part redirect: stop the wrong path explicitly, restate the correct constraints concretely.

### Instructions

1. Three weak redirect prompts are below. Each one tries to redirect the same drift — the agent has just proposed adding a `RegionService` layer. Rewrite each into a strong redirect prompt.

   **Weak A:**
   ```
   no don't do that
   ```

   **Weak B:**
   ```
   go back, that's not what i asked for
   ```

   **Weak C:**
   ```
   please be more careful and follow the conventions
   ```

2. A strong redirect prompt usually has four parts:
   - explicit stop ("do not add a service layer")
   - restate the only files in scope ("the only files to create are: ...")
   - restate the original contract ("the endpoint is GET /app/hr/api/v1/regions returning HrApiResponse<List<HrRegionDTO>>")
   - confirm before acting ("show me the revised plan first")

3. Rewrite all three weak prompts, in your own notes. Then test one of them in a real Claude Code session by reproducing the drift (ask for a Region plan that includes a service layer) and applying your strong-redirect rewrite. Confirm the next plan no longer contains the service layer.

4. Save your strongest rewrite as a redirect-prompt template you can paste into future sessions.

### What You Should See

Vague redirects often re-trigger the same drift. The agent reads "no don't do that" against three previous turns of context, infers what "that" might mean, and frequently picks the wrong target. Specific redirects with named files and explicit forbids usually land on the first try.

> **The pattern.** "Stop X. Do only Y. The contract is Z. Show me the plan before you act." Four sentences. Memorize the shape.

---

## Exercise 5: Salvaging Good Work (8 min)

### Goal
Decide what to keep from a bad run and how to extract it cleanly.

### Instructions

1. Open the transcript again with your Drift Inventory from Exercise 1 in hand. Walk the diffs the bad session produced and label each one:

   - **keep** — the agent got this right; you would re-derive it the same way
   - **discard** — drift output, no salvage value
   - **re-derive** — the answer is probably right but anchored on bad context; cheaper to ask a clean session for it again than to copy-paste

2. The honest answer is usually that **most "salvage" temptation is anchoring bias.** Re-deriving from a clean prompt is cheaper than cherry-picking lines from a bad run, because the bad run's context shaped every line — including the lines that look fine.

3. Open a fresh Claude Code session and ask it to do only the keepers, **without pasting the bad transcript itself**:
   ```text
   This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use `reference/` unless this chapter explicitly allows it or you need rescue help.

   Scaffold a read-only Region module for the HR app:
   - response DTO `HrRegionDTO` with fields: regionId, regionName
   - JDBC repository `HrRegionJdbcRepository` reading from AIHR_REGIONS
   - Jersey resource `HrRegionResource` exposing GET /app/hr/api/v1/regions, returning HrApiResponse<List<HrRegionDTO>>

   Do not add request DTOs, write endpoints, services, or runtime registration.
   Use HrLogHelper for error logging only.
   Show me the plan first.
   ```

4. Compare the clean-restart output to what the transcript produced. The clean output should match the Lab 01 conventions on the first try.

### What You Should See

A clean restart usually produces a smaller, more correct slice than the bad run did. The "keepers" you thought you had often turn out to be the same lines the clean session produces anyway — which is the lesson. Anchoring bias makes us overvalue work in front of us; the cheap move is to derive again from clean context.

> **The rule.** Salvage by re-deriving from a clean prompt, not by cherry-picking lines from the bad run. Reuse the file paths and contract decisions from the bad run; do not reuse its code.

---

## Exercise 6: Capture the Rule (2 min)

### Goal
Encode recovery discipline as a durable `CLAUDE.md` rule.

### Instructions

1. Ask Claude Code to update `CLAUDE.md`:
   ```
   Update CLAUDE.md by adding this section. Do not modify any other section.

   ## Recovery Discipline
   - Read the agent's plan before it implements; drift is cheaper to catch in plan output than in code
   - Restart fresh when the session is thrashed; redirect only when the drift is one localized invention before any code is written
   - Redirect prompts must be specific: name what to stop, name the only files in scope, restate the contract, confirm before acting
   - Salvage by re-deriving from a clean prompt, not by cherry-picking lines from the bad run
   ```

2. Exit Claude Code and reopen the project so the updated rule is loaded for later labs.

---

## Common Mistakes & Fixes

- Mistake: trying to redirect a thrashed session with a single short prompt.
  Fix: a thrashed session needs a fresh start, not a stronger redirect.
- Mistake: pasting the entire bad transcript into a fresh session as "context for the recovery."
  Fix: that re-imports the bad context. Restate the original contract from your own understanding instead.
- Mistake: assuming drift means the agent is broken.
  Fix: drift usually means the prompt was under-constrained or context was overloaded. Both are recoverable.
- Mistake: catching drift only at the diff stage.
  Fix: read the plan first; drift is loud in plan text and quiet in code.

---

## Success Criteria

- [ ] Drift Inventory captured at least 4 distinct drift moments from the transcript with earliest-intervention notes
- [ ] You can articulate the redirect-vs-restart decision in one sentence
- [ ] At least one strong-redirect prompt rewrite produced and tested in a fresh session
- [ ] One clean-restart attempt produced a convention-compliant Region slice (matches Lab 01 Exercise 3 checklist)
- [ ] `CLAUDE.md` updated with Recovery Discipline section

---

## Key Takeaways

1. **Drift is loud in plans, quiet in code.** Reading plan output is the cheapest place to intervene.
2. **A fresh session is free; a redirect on a thrashed session is expensive.** Restart is usually the right move once context has filled.
3. **Strong redirect prompts have four parts.** Stop X. Do only Y. The contract is Z. Show me the plan before you act.
4. **Salvage is mostly anchoring bias.** Re-derive from a clean prompt; reuse the contract decisions, not the code.
5. **Recovery discipline is durable.** Encode it in `CLAUDE.md` so the next session starts with the rule, not the regret.

---

<details>
<summary><strong>Recovery Path</strong> — Use this if you get stuck for more than 5 minutes</summary>

Stay inside the current lab. Do not scan ahead or use other `reference/` material unless this recovery path explicitly tells you to.

If your Drift Inventory in Exercise 1 came up nearly empty and reading the transcript again is not helping, you may consult the answer key:

- `reference/lab06/transcript-annotated.md` — the same transcript with the five drift moments labelled inline

Read the annotated transcript, then **return to your own notes** and add the moments you missed with a short why-I-missed-it line. The point is to update your eye, not to copy the answer key.

For Exercise 4, if your strong-redirect rewrites still feel weak after one try, consult:

- `reference/lab06/redirect-prompts.md` — strong-redirect rewrites of the three weak prompts

Then rewrite your version one more time without looking at the answer key.

After consulting either answer key, exit Claude Code and reopen the project so the next lab starts cleanly.
</details>
