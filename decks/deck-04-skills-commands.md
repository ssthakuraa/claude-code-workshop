# Deck 4: Skills, Commands & On-Demand Knowledge

**Duration:** 20 minutes | **Lab:** Lab 3

---

## Slide 1: The Context Budget Problem
CLAUDE.md is loaded every session. If you put everything there, it bloats → Claude ignores rules.

**Solution:** Skills load **on-demand** — only when relevant to the current task.

> **Speaker notes:** Think of CLAUDE.md as the constitution (always in effect). Skills are the reference manuals (pulled off the shelf when needed).

---

## Slide 2: Skills vs Commands

| | Skills (`.claude/skills/`) | Commands (`.claude/commands/`) |
|-|---------------------------|-------------------------------|
| **Discovery** | Auto-matched by description | Explicit `/command` invocation |
| **Structure** | SKILL.md + templates + scripts | Single markdown file |
| **Best for** | Domain knowledge, patterns | Repeatable workflows |
| **Example** | Entity scaffolding pattern | `/run-tests`, `/commit-push-pr` |

> **Speaker notes:** In practice, they blur — a scaffolding skill often gets a slash command too. The distinction is: skills carry knowledge, commands carry actions.

---

## Slide 3: Skill Anatomy

```yaml
---
name: scaffold-entity
description: Scaffold a complete HR entity with all layers
user-invocable: true
---

## Pattern
1. Entity with @SQLRestriction
2. Repository extends JpaRepository
3. DTO + Request with validation
4. Mapper (MapStruct)
5. Service with HrLogHelper
6. Controller with HrApiResponse

## Gotchas
- Use @SQLRestriction NOT @Where
- Column names match schema exactly
```

> **Speaker notes:** The `description` field is what Claude matches against. Write it like a search query — specific enough to trigger when relevant, not so broad it triggers on everything.

---

## Slide 4: The Productivity Multiplier

| | Manual (re-explain every time) | With Skill |
|-|-------------------------------|------------|
| Prompts per entity | 3–5 | **1** |
| Convention drift risk | High (each prompt different) | **Zero** (skill is the pattern) |
| Onboarding new devs | Re-teach patterns | Skill carries knowledge |

> **Speaker notes:** This is the most tangible productivity number in the workshop. 10 entities × 4 prompts = 40 prompts manually. 10 entities × 1 prompt = 10 with a skill. And the skill version has zero convention drift.

---

## Slide 5: Command Example — /run-tests

```markdown
# .claude/commands/run-tests.md
Run the backend test suite and report results:
\`\`\`bash
cd backend && mvn test -pl hrapp-service 2>&1 | tail -20
\`\`\`
If $ARGUMENTS contains "frontend", also run:
\`\`\`bash
cd frontend && npm run lint 2>&1
\`\`\`
Summarize: total tests, passed, failed.
```

**Boris's rule:** *"If you do something more than once a day, make it a command."*

> **Speaker notes:** Commands pre-compute context with inline bash. The git diff, test output, or log snippet is already in the prompt — Claude doesn't waste tokens fetching it.

---

## Slide 6: Team-Shared via Git

```
.claude/
├── skills/
│   └── scaffold-entity/
│       └── SKILL.md         ← Checked into git
├── commands/
│   └── run-tests.md         ← Checked into git
└── settings.json             ← Also checked into git
```

Every team member gets the same skills and commands. New hires get them on `git clone`.

> **Speaker notes:** This is the enterprise scaling mechanism. One engineer writes a skill, commits it, and 50 developers benefit immediately. Skills compound across the team, not just across sessions.

---

## Slide 7: Your Turn — Lab 3

You'll:
1. Scaffold Country manually (feel the re-explanation pain)
2. Create a `/scaffold-entity` skill
3. Use it to scaffold Location in one prompt
4. Create a `/run-tests` slash command

**Time:** 60 minutes. Go.
