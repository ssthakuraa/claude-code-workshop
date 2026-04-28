# Lab 11: Enterprise Governance — Rollout Readiness, Safety Posture & Evidence

**Duration:** 75 minutes

> Recommended Day 2 order: **Lab 09 → Lab 08 → Lab 07 → Lab 10 → Lab 11 → optional Lab 12**.
> This file is the fifth stop in that sequence, after you already have browser,
> API, and database verification evidence to govern.

## Learning Objective

You will translate individual Claude Code success into something a team, architect group, or enablement owner could trust at scale. The focus is not just building artifacts. The focus is evidence, review roles, bounded safety posture, and rollout discipline.

## The Key Concepts

### Rollout Readiness

Enterprise adoption usually fails from weak operating discipline, not lack of model capability. A team-ready workflow needs:

- safety posture
- review roles
- evidence quality
- expansion criteria

### Repo Safety Posture

In Claude Code, the repo-level safety configuration lives in `.claude/settings.json`:

- `permissions.allow` — tools or operations explicitly permitted without prompting
- `permissions.deny` — tools or operations explicitly blocked
- `mcpServers` — project-scoped MCP integrations

There is no `config.toml` or `approval_policy`/`sandbox_mode` key in Claude Code. The equivalent of a bounded-pilot posture is a `permissions.deny` list that restricts write operations outside the workspace. This lab should not try to recreate an old command-allowlist story. The modern repo-level safety model is a deny-first permissions block and explicit evidence.

### Enterprise Governance = Safety Posture + Review Roles + Expansion Gates

Together, these create a governance layer:

```text
Config: approval and sandbox posture for the repo
Evidence + review: determine whether the workflow is safe to expand
```

---

## Setup

Ask Claude Code to run these compile/build checks for you:

```
This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use `reference/` unless this chapter explicitly allows it or you need rescue help.

Run these verification checks and tell me whether both succeed:
- `cd backend && ./build-jersey-service.sh compile`
- `cd frontend && npm run build`
```

Client capability notes:

- `.claude/settings.json` changes are loaded at session start, not always hot-reloaded into an already-running Claude Code session
- for this lab, expect to save the config, then start a fresh Claude Code session from the repo root before you judge whether the safety posture is active
- `.claude/` can be edited directly by Claude Code if permissions allow; if not, ask Claude Code to draft the exact content and then apply it yourself
- acceptable proof in a constrained client is: file state, smoke-helper output, and fresh-context verification where possible; do not pretend a missing live prompt means the repo config is absent

---

## Exercise 1: Write the Rollout Recommendation (15 min)

### Goal
Create a concise rollout recommendation for a skeptical enterprise audience.

### Instructions

1. Ask Claude Code to generate a short rollout recommendation:
   ```
   This is a student exercise. Stay inside the named tasks, inspect only the files this chapter explicitly tells you to inspect, and do not use `reference/` unless this chapter explicitly allows it or you need rescue help.

   Write a rollout recommendation for introducing Claude Code into this HR repo.
   It must answer:
   1. who should use it first
   2. what repo safety posture is safe enough for the first wave
   3. what review roles are mandatory
   4. what evidence is required before expansion
   5. what stop conditions should pause the rollout
   ```

2. **Review the recommendation.** It should be practical, slightly conservative, and tied to real observed workflow risks from the course.

---

## Exercise 2: Define the Evidence Package (20 min)

### Goal
Define the evidence package a team lead would need before approving broader use.

### Instructions

1. Ask Claude Code to produce an evidence checklist:
   ```
   Create an enterprise evidence checklist for this repo.
   Include:
   - implementation evidence
   - test evidence
   - browser verification evidence
   - data verification evidence
   - code-review evidence
   - rollback or stop-condition evidence
   ```

2. **Review the checklist.** Ask whether each evidence item reduces a real failure mode or just adds ceremony.

3. Ask Claude Code one more question:
   ```
   Which pieces of this evidence package are mandatory before expansion,
   and which are optional for a first bounded pilot?
   ```

---

## Exercise 3: Define the Review Model (15 min)

### Goal
Define the review model and bounded pilot criteria.

### Instructions

1. Ask Claude Code to define the review model:
   ```
   Define the review model for a bounded Claude Code pilot in this repo.
   Name:
   - learner/self-review responsibilities
   - peer or senior colleague review responsibilities
   - tech lead / architect review responsibilities
   - the conditions required before expanding the pilot
   ```

2. **Review the model.** Ask whether any role is overloaded or whether any important sign-off is missing.

3. **Discussion:** What reviewer roles already exist in your organization, and which of them would actually need evidence from this workflow?

---

## Exercise 4: Define the Repo Safety Posture (20 min)

### Goal
Configure a bounded-pilot safety posture using the current Claude Code repo config surface.

### Instructions

1. Ask Claude Code about the current repo safety posture:
   ```
   Read `.claude/settings.json` if it exists and summarize the current repo safety posture.
   Tell me:
   - what permissions.allow entries are present
   - what permissions.deny entries are present
   - whether Playwright MCP is configured under mcpServers
   ```

2. Ask Claude Code to draft or apply a bounded-pilot config:
   ```
   Update `.claude/settings.json` for a bounded pilot.
   Preserve any existing sections already present (especially mcpServers if
   Lab 09 already created it).
   Do not invent unrelated keys unless they already exist in the file.

   Add or confirm a permissions block that:
   - denies write operations outside the workspace (equivalent of sandbox-write posture)
   - allows in-repo build and test commands

   Explain what those settings mean in practice for this repo.

   If my client cannot edit `.claude/` directly, draft the exact JSON content for
   me and tell me where to place it.
   ```

   The important point is not an old-style command allowlist. The important point is that the repo now has an explicit bounded-pilot permissions posture.

3. **Reload Claude Code so the repo settings are active.** This is a manual learner action in the client:
   ```
   Exit the current Claude Code session.
   Restart Claude Code from the repo root (there is no resume command — re-open the project).
   Ask Claude Code to read `.claude/settings.json` and summarize the active
   permissions and MCP settings before you run the checks below.
   ```

4. **Test the posture with Claude Code:**
   ```
   From the repo root, run these checks and tell me which ones prompted,
   which ones ran, and which ones were blocked:

   cd backend && ./build-jersey-service.sh test
   rm -rf /tmp/some-test-folder
   cp CLAUDE.md /tmp/lab11-agents-copy.md
   ```

   Expected direction:

   - the in-repo build command should usually run inside the bounded pilot posture
   - destructive or out-of-repo operations should usually prompt or be blocked by the client posture

   If your environment still does not show prompts after the restart:

   - read `.claude/settings.json` and confirm the permissions posture is present
   - record that live prompt enforcement was not observable in this client
   - continue the lab using the configured repo safety posture as the governance artifact

## Exercise 5: Final Reflection (5 min)

1. Add to `CLAUDE.md`:
   ```markdown
   ## Enterprise Rollout
   - Start with a bounded pilot, not broad rollout
   - Require explicit evidence before expanding
   - Name review roles and stop conditions

   ## Claude Code Safety Posture
   - Use `.claude/settings.json` permissions block for repo safety posture
   - Keep a deny-first bounded pilot until the evidence is stronger
   - Re-verify the repo posture from a fresh session before you trust it
   ```

2. **Reflect:** The three governance layers are now in place:

   - **Repo safety posture** (this lab): deny-first permissions block in `.claude/settings.json`
   - **Evidence + review** (this lab): bounded rollout discipline
   - **Verification stack** (Labs 08-10): tests, browser checks, and data checks

---

## Success Criteria

- [ ] A bounded rollout recommendation exists
- [ ] An evidence checklist exists
- [ ] A named review model exists
- [ ] `.claude/settings.json` expresses a bounded-pilot permissions posture without destroying any existing config sections, especially MCP config already added earlier
- [ ] Live enforcement was either observed after restart or recorded as a client limitation
- [ ] You can explain approval posture, sandbox posture, review roles, evidence, and stop conditions

---

## Key Takeaways

1. Enterprise rollout needs bounded scope; start with a conservative pilot, not a broad mandate.
2. Current Claude Code repo safety is expressed through `permissions.allow` / `permissions.deny` in `.claude/settings.json` and explicit verification, not an old command-allowlist story.
3. Stop conditions matter; if you cannot say what pauses expansion, the rollout is not ready.
4. Governance is architecture work, not admin overhead added after the fact.

---
