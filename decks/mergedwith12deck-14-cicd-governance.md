# Deck 14: CI/CD + Permissions + Enterprise Governance

**Duration:** 30 minutes | **Lab:** Lab 11

---

## Slide 1: The Three Governance Layers

```
Hooks:        enforce rules locally (every developer, every session)
Permissions:  control what Claude can/can't do
CI/CD:        enforce rules in the pipeline (every PR, every merge)
```

Together = enterprise-grade safety for AI-assisted development.

> **Speaker notes:** Hooks are Day 2. Permissions + CI/CD are today. By the end of this lab, you'll have all three layers operational.

---

## Slide 2: The Makefile as Contract

```makefile
build: backend-build frontend-build
test:  backend-test
lint:  frontend-lint
```

**The Makefile defines what "build" means.** The CI tool just calls `make build`.

Migrating from Jenkins to GitLab CI? Rewrite one file. The Makefile stays.

> **Speaker notes:** This is the architectural insight. Decouple the pipeline definition (Makefile) from the orchestrator (Jenkins/GitLab/Azure). It's the same principle as decoupling business logic from frameworks.

---

## Slide 3: Enterprise CI/CD Is Not GitHub Actions

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

## Slide 4: Pipeline Translation Demo

*Show Claude converting Jenkinsfile → .gitlab-ci.yml in one prompt.*

Concepts that map 1:1:
- `stage` → `stage`
- `when { branch 'main' }` → `rules: [if: $CI_COMMIT_BRANCH == "main"]`
- `junit` → `artifacts.reports.junit`
- `archiveArtifacts` → `artifacts.paths`

> **Speaker notes:** [If possible, do this live. Give Claude the Jenkinsfile and ask for GitLab CI. The output is clean and correct. Then ask "now Azure DevOps" — same quality.]

---

## Slide 5: Permissions Profile

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

## Slide 6: Your Turn — Lab 11

You'll:
1. Generate a Makefile with pipeline targets
2. Generate a Jenkinsfile orchestrating those targets
3. Translate to GitLab CI (or Azure DevOps)
4. Configure a permissions profile
5. Add a safety hook (block DROP TABLE)

**Time:** 75 minutes. Go.
