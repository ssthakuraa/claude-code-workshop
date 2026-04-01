# Deck 6: Hooks — Enterprise Guardrails

**Duration:** 25 minutes
**When:** Day 2, 9:15 AM (first lecture of the day)
**Lab:** Lab 5 (Hooks — Deterministic Quality Gates)

---

## Slide 1: The Problem

Yesterday you wrote CLAUDE.md rules.

**Question:** What happens when Claude ignores them?

- At 85% context, CLAUDE.md rules get deprioritized
- Under complex prompts, Claude may skip steps
- A new team member might not have all rules in their CLAUDE.md

**CLAUDE.md = advisory. Claude *might* follow them.**

> **Speaker notes:** This is a real problem, not a theoretical one. Yesterday in Lab 1, you saw Claude follow your rules. But what happens in a 2-hour session at high context? Or when someone gives Claude a conflicting instruction? CLAUDE.md is powerful but not infallible. Today we fix that.

---

## Slide 2: Hooks = Structural Enforcement

Hooks are shell commands that fire at lifecycle events.

```
Claude tries to edit schema.sql
    → PreToolUse hook fires
        → Checks file path
            → Prints "BLOCKED: schema.sql is READ ONLY"
                → Exit code 1 = hard stop
                    → Claude cannot proceed
```

**Claude did not choose to follow the rule. The rule was enforced on Claude.**

> **Speaker notes:** This is the key difference. CLAUDE.md says "please don't edit schema.sql." A hook says "you physically cannot edit schema.sql." In enterprise governance, "please" is not enough.

---

## Slide 3: The Two Events That Matter Most

| Event | When | Use For |
|-------|------|---------|
| **PreToolUse** | Before Edit/Write | **Blocking** — prevent forbidden actions |
| **PostToolUse** | After Edit/Write | **Validating** — check and catch violations |

```
PreToolUse + exit 1 = Claude cannot do the thing
PostToolUse + exit 1 = Claude did it, sees the error, must fix it
```

> **Speaker notes:** PreToolUse is a gate. PostToolUse is a validator. Use PreToolUse for inviolable rules (read-only files, security). Use PostToolUse for conventions (naming, linting, PII). The distinction matters because PostToolUse still lets Claude try — it just makes sure the output is correct.

---

## Slide 4: Hook Anatomy

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "f=$(jq -r '.tool_input.file_path // empty'); ...",
        "timeout": 10,
        "statusMessage": "Checking..."
      }]
    }]
  }
}
```

**Key pieces:**
- `matcher`: which tools trigger it (`Edit|Write`, `Bash`, etc.)
- `type`: `command` (shell), `http`, `prompt`, or `agent`
- `command`: the actual check — receives JSON on stdin
- `exit 1`: block the action
- `exit 0`: allow the action

> **Speaker notes:** The command receives the full tool input as JSON on stdin. Use `jq` to parse it — extract the file path, the content being written, etc. This is the interface between Claude's actions and your enforcement logic.

---

## Slide 5: Enterprise Hook Patterns

| Hook | What It Prevents | Business Impact |
|------|-----------------|----------------|
| Read-only file guard | Schema drift, config corruption | Database stability |
| Naming convention | Convention drift across 50 devs | Codebase consistency |
| PII leak detector | Sensitive data in logs | Regulatory compliance |
| Flyway naming check | Silent migration failures | Production reliability |
| Env file warning | Secrets in git commits | Security breach |

> **Speaker notes:** Each of these is a real enterprise problem. Code review catches some of them sometimes. Hooks catch all of them every time. At scale — 50 developers using Claude Code — hooks are the governance layer that makes adoption safe.

---

## Slide 6: Project vs Personal Settings

```
.claude/settings.json        ← Team-shared (committed to git)
.claude/settings.local.json  ← Personal (gitignored)
~/.claude/settings.json      ← Global personal
```

**Rule:** Governance hooks go in `settings.json` (team-shared). Personal preferences go in `settings.local.json`.

> **Speaker notes:** This is the enterprise deployment model. The security team writes hooks in `settings.json`, commits to git, and every developer gets them automatically. Individual developers can add personal hooks in `settings.local.json` without affecting the team. This is how you scale governance without slowing anyone down.

---

## Slide 7: CLAUDE.md + Hooks = Defense in Depth

| | CLAUDE.md | Hook |
|-|-----------|------|
| **When** | Loaded at session start | Fires every action |
| **Enforcement** | Advisory | Structural |
| **Context dependent** | Yes (degrades at high context) | No (fires regardless) |
| **Best for** | Conventions, patterns | Inviolable rules, compliance |

**Use both:**
- CLAUDE.md: "Use `@SQLRestriction`, not `@Where`" (convention)
- Hook: "Cannot edit `schema.sql`" (inviolable)

> **Speaker notes:** They're complementary, not competing. CLAUDE.md handles the 90% — conventions Claude should follow. Hooks handle the 10% — rules Claude must never violate. Together, they create defense in depth.

---

## Slide 8: Live Demo

*Instructor demonstrates:*

1. Ask Claude to edit `database/schema.sql`
2. Hook blocks with clear error message
3. Claude pivots to creating a Flyway migration
4. No human intervention needed — the hook guided Claude to the right path

> **Speaker notes:** [DO THIS LIVE. Let the audience see the block happen in real-time. The "aha" moment is watching Claude try, get blocked, read the error message, and self-correct. This is the moment that sells hooks to enterprise audiences.]

---

## Slide 9: Your Turn — Lab 5

In the next 60 minutes, you'll build 3 hooks:

1. **schema.sql guard** — PreToolUse, hard block (access control)
2. **Hr naming convention** — PostToolUse, hard block (team standards)
3. **PII leak detector** — PostToolUse, hard block (compliance)

After each hook, you'll trigger it deliberately and watch Claude self-correct.

**Key question to carry into the lab:**
> *"What's the most dangerous file in YOUR codebase that you'd protect with a PreToolUse hook?"*

> **Speaker notes:** Give them 2 minutes to think about this question before they start the lab. It anchors the abstract concept in their real-world experience. You'll come back to this question in the Day 2 retro.
