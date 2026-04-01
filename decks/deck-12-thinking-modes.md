# Deck 12: Thinking Modes & Effort Calibration

**Duration:** 20 minutes | **Workshop:** Thinking Modes Exercise (30 min)

---

## Slide 1: Not All Tasks Need the Same Thinking

| Trigger Keyword | Thinking Depth | Use For |
|----------------|---------------|---------|
| *(default)* | Standard | Most tasks |
| `"think"` | Extended | Multi-step problems |
| `"think hard"` | Deep | Architecture decisions |
| `"think harder"` | Very deep | Tricky debugging |
| `"ultrathink"` | Maximum | Complex refactoring, critical decisions |

Also: `/effort` command to set effort level persistently.

> **Speaker notes:** Higher thinking = more tokens = more cost + latency. But for the right tasks, it's dramatically better output. The skill is matching effort to task complexity.

---

## Slide 2: The Demo

*Same task at two levels:*

**Default effort:** "Refactor HrEmployeeService to reduce code duplication."
→ Surface-level: extracts 1-2 helper methods.

**Ultrathink:** "Ultrathink: Refactor HrEmployeeService to reduce code duplication."
→ Architectural: identifies the masking pattern, the job-history pattern, and the idempotency pattern as cross-cutting concerns. Proposes a cleaner separation.

> **Speaker notes:** [DO THIS LIVE if time allows. Show both outputs side by side. The default version is okay; the ultrathink version is insightful.]

---

## Slide 3: Calibration Rules

| Task Type | Recommended Effort |
|-----------|-------------------|
| Rename a variable | Default (don't overthink) |
| Add a simple endpoint | Default or "think" |
| Design a multi-service feature | "think hard" |
| Debug a race condition | "think harder" |
| Refactor 500-line service | "ultrathink" |

> **Speaker notes:** The expensive model isn't better for simple tasks — it's just slower. Match the tool to the job.

---

## Slide 4: Workshop (30 min)

Pick a refactoring or debugging task in the HR app. Run it at default effort, then at "ultrathink." Compare:
- What did each version identify?
- What was the quality difference?
- Was the extra thinking time justified?


---

## Slide 5: CI/CD + Permissions + Enterprise Governance: The Three Governance Layers

```
Hooks:        enforce rules locally (every developer, every session)
Permissions:  control what Claude can/can't do
CI/CD:        enforce rules in the pipeline (every PR, every merge)
```

Together = enterprise-grade safety for AI-assisted development.

> **Speaker notes:** Hooks are Day 2. Permissions + CI/CD are today. By the end of this lab, you'll have all three layers operational.

---

## Slide 6: The Makefile as Contract

```makefile
build: backend-build frontend-build
test:  backend-test
lint:  frontend-lint
```

**The Makefile defines what "build" means.** The CI tool just calls `make build`.

Migrating from Jenkins to GitLab CI? Rewrite one file. The Makefile stays.

> **Speaker notes:** This is the architectural insight. Decouple the pipeline definition (Makefile) from the orchestrator (Jenkins/GitLab/Azure). It's the same principle as decoupling business logic from frameworks.

---

## Slide 7: Enterprise CI/CD Is Not GitHub Actions

| Platform | Enterprise Adoption |
|----------|-------------------|
| **Jenkins** | Banks, healthcare, telco |
| **GitLab CI** | Self-hosted enterprises, EU companies |
| **Azure DevOps** | Microsoft ecosystem, government |
| **Bamboo** | Atlassian shops |
| **TeamCity** | JetBrains ecosystem |

Claude can generate and translate pipeline configs for ALL of them.

> **Speaker notes:** The lab demonstrates Jenkins, then translates to GitLab CI. The skill is the translation — not memorizing one CI syntax.

---

## Slide 8: Pipeline Translation Demo

*Show Claude converting Jenkinsfile → .gitlab-ci.yml in one prompt.*

Concepts that map 1:1:
- `stage` → `stage`
- `when { branch 'main' }` → `rules: [if: $CI_COMMIT_BRANCH == "main"]`
- `junit` → `artifacts.reports.junit`
- `archiveArtifacts` → `artifacts.paths`

> **Speaker notes:** [If possible, do this live. Give Claude the Jenkinsfile and ask for GitLab CI. The output is clean and correct. Then ask "now Azure DevOps" — same quality.]

---

## Slide 9: Permissions Profile

```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["mvn *", "npm *", "git status", "git diff", "git log"],
    "deny": ["git push *", "rm -rf *", "sudo *"]
  }
}
```

**Allow safe commands.** Block dangerous ones. Team-shared via git.

> **Speaker notes:** Boris does NOT use `--dangerously-skip-permissions`. He uses `/permissions` to pre-allow safe commands. This is the enterprise-safe approach.

---

## Slide 10: Your Turn — Lab 11

You'll:
1. Generate a Makefile with pipeline targets
2. Generate a Jenkinsfile orchestrating those targets
3. Translate to GitLab CI (or Azure DevOps)
4. Configure a permissions profile
5. Add a safety hook (block DROP TABLE)

**Time:** 75 minutes. Go.
