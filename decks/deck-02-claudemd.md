# Deck 2: CLAUDE.md — Your Enterprise Constitution

**Duration:** 20 minutes | **Lab:** Lab 1

---

## Slide 1: What Is CLAUDE.md?
A markdown file in the project root. Claude reads it automatically at session start. It's your team's permanent instruction manual.

> **Speaker notes:** Think of it as an onboarding doc — but for AI. Just like you'd give a new engineer your team's conventions, you give Claude a CLAUDE.md.

---

## Slide 2: What to Include vs Exclude

| Include | Exclude |
|---------|---------|
| Build/test commands Claude can't guess | Things Claude does correctly by default |
| Conventions that differ from language defaults | Standard language conventions |
| Architectural decisions, gotchas | Long tutorials (link instead) |
| Environment quirks | File-by-file descriptions |

**The test:** If Claude already does it right without the rule, delete the rule.

> **Speaker notes:** The most common mistake is writing a 500-line CLAUDE.md. Claude starts ignoring rules in bloated files. Boris Cherny's CLAUDE.md is ~100 lines. Every line earns its place.

---

## Slide 3: Hierarchical CLAUDE.md

```
~/. claude/CLAUDE.md          ← Personal preferences
project/CLAUDE.md             ← Team conventions (committed to git)
project/backend/CLAUDE.md     ← Backend-specific rules
project/frontend/CLAUDE.md    ← Frontend-specific rules
```

Child files inherit parent rules. Use subdirectory files for domain-specific constraints.

> **Speaker notes:** This mirrors how senior engineers think — global principles at the top, local constraints at the leaves. A backend CLAUDE.md might say "use MapStruct for mappers." The frontend one might say "use TanStack Query for server state." Neither needs to know about the other.

---

## Slide 4: The Compounding Loop

```
1. Claude makes a mistake
2. You correct it
3. You write a CLAUDE.md rule
4. Claude never repeats it
5. Your CLAUDE.md grows smarter over time
```

**Boris's rule:** *"Anytime we see Claude do something incorrectly, we add it to CLAUDE.md so it doesn't repeat next time."*

> **Speaker notes:** This is the superpower. Code review becomes meta-work — not just catching bugs, but training the system that produces code. Every correction makes future sessions better.

---

## Slide 5: Example — The HR App CLAUDE.md

```markdown
## Naming
- All Java classes prefixed `Hr` (HrEmployee, HrRegionService)

## Database
- database/schema.sql is READ ONLY — never edit
- Use @SQLRestriction NOT @Where (deprecated Hibernate 6.2)

## Logging
- Every service method: HrLogHelper entry/exit
- Never log PII — use MASKED placeholder

## API
- ALL endpoints return HrApiResponse<T>
```

> **Speaker notes:** Notice: no vague rules like "write clean code." Every rule prevents a specific, observed mistake. That's the bar.

---

## Slide 6: Live Demo

*Instructor demonstrates:*
1. Remove one rule from CLAUDE.md (e.g., the `@SQLRestriction` rule)
2. Ask Claude to scaffold an entity
3. Claude uses `@Where` (deprecated) — the mistake the rule prevents
4. Add the rule back, `/clear`, same prompt — Claude uses `@SQLRestriction`

> **Speaker notes:** [DO THIS LIVE. The before/after is the entire selling point of CLAUDE.md. Let the audience see both outputs side by side.]

---

## Slide 7: Your Turn — Lab 1

You'll:
1. Observe Claude fail with an incomplete CLAUDE.md
2. Write rules that fix each failure
3. Verify the rules work on the same task
4. Practice the compounding loop

**Time:** 60 minutes. Go.
