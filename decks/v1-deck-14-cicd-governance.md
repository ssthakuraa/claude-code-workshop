# Deck 14 v1: CI/CD + Permissions + Enterprise Governance

**Duration:** 30 minutes | **Lab:** Lab 11
**Day:** 4 — Mastery

---

## Slide 1: The Three Governance Layers

```
Hooks:        enforce rules locally      (every developer, every session)
Permissions:  control what Claude can do (every session, every project)
CI/CD:        enforce rules in pipeline  (every PR, every merge, on a schedule)
```

Together = enterprise-grade safety for AI-assisted development.

**Today adds the third layer.** Hooks (Day 2) and permissions are local.
CI/CD makes enforcement organizational — it runs even when no one is watching.

> **Speaker notes:** Hooks are Day 2. Permissions are configured today. CI/CD is the layer that closes the loop — it's the difference between "we have rules" and "rules are enforced regardless of individual behavior." The org doesn't rely on every developer remembering to run checks.

---

## Slide 2: The Makefile as Contract

```makefile
build:  backend-build frontend-build
test:   backend-test frontend-test
lint:   frontend-lint
verify: test lint
```

**The Makefile defines what "build" means.** The CI tool just calls `make build`.

Migrating from Jenkins to GitLab CI? Rewrite one file. The Makefile stays.

> **Speaker notes:** This is the architectural insight. Decouple the pipeline definition (Makefile) from the orchestrator (Jenkins/GitLab/Azure). It's the same principle as decoupling business logic from frameworks. Show the actual Makefile in the project — 8 targets, each calls a standard command. Any CI tool can orchestrate it.

---

## Slide 3: Enterprise CI/CD Is Not GitHub Actions

| Platform | Enterprise Adoption |
|----------|-------------------|
| **Jenkins** | Banks, healthcare, telco — still majority of enterprise CI |
| **GitLab CI** | Self-hosted enterprises, EU companies |
| **Azure DevOps** | Microsoft ecosystem, government |
| **Bamboo** | Atlassian shops |
| **TeamCity** | JetBrains ecosystem |

Claude can generate AND translate pipeline configs for all of them.

The skill is translation — not memorizing syntax.

> **Speaker notes:** Most of your students work with Jenkins or Azure DevOps, not GitHub Actions. The lab demonstrates Jenkins (Jenkinsfile), then Claude translates it to GitLab CI in one prompt. The takeaway: you never need to learn new CI syntax — describe what you want and Claude translates.

---

## Slide 4: Claude Code in Non-Interactive Mode

```bash
# Run a task and get text output
claude -p "List all API endpoints missing @PreAuthorize"

# JSON output for script parsing (use in CI scripts)
claude -p "Check for PII in log statements" --output-format json

# Restrict tools for CI safety — only allow what's needed
claude -p "Fix lint errors in src/" --allowedTools "Edit,Bash(npm run lint)"

# Auto-approve mode for unattended pipeline runs
claude --permission-mode autoAccept \
  -p "Fix all failing tests and commit the fixes"
```

**`claude -p` = Claude Code without the interactive UI.**
Use it anywhere a shell script runs: CI pipelines, git hooks, cron jobs, scheduled tasks.

> **Speaker notes:** This is the bridge from "local tool" to "organizational capability." Every student has been using Claude interactively. Now show them it's also a CLI you can invoke from Jenkins, GitHub Actions, a bash script, or a cron job. The `--allowedTools` flag is critical for CI safety — you don't want an unattended agent to git push or send emails.

---

## Slide 5: Automated PR Review in CI

```bash
#!/bin/bash  # scripts/ci-review.sh — runs on every PR

FINDINGS=$(claude -p "Review the git diff for:
- Missing @PreAuthorize on new endpoints
- PII in log statements (salary, email, phone)
- Exposed JPA entities in API responses
- Missing @Valid on request DTOs
Output: JSON array with severity, file, line, description." \
  --output-format json)

# Post as PR comment via GitHub/GitLab API
echo "$FINDINGS" | post-pr-comment

# Fail CI on CRITICAL findings
CRITICAL=$(echo "$FINDINGS" | jq '[.[] | select(.severity=="CRITICAL")] | length')
[ "$CRITICAL" -gt 0 ] && exit 1
```

**Every PR, automatically. Zero human reviewer time for mechanical checks.**

> **Speaker notes:** This is the enterprise use case that gets budget approved. Manual PR review for security patterns is expensive, inconsistent, and often skipped under time pressure. This script runs every PR in 30 seconds and blocks on critical findings. Show a real example: Claude catches a missing @PreAuthorize that a human reviewer missed.

---

## Slide 6: Scheduled Agents & Recurring Tasks

```
/schedule "Every weekday at 9am:
  1. Query HR database for contracts expiring in 30 days
  2. Check if notification already created in hr_notifications
  3. If not, create notification via API
  4. Post summary to Slack #hr-alerts"
```

```
/loop 5m "Check if CI build passed. If failed,
           analyze the error and suggest a fix."
```

| Tool | Scope | Use For |
|------|-------|---------|
| `/schedule` | Cloud (Anthropic) | Runs even when laptop is closed |
| `/loop` | Local | Polls during active work session (up to 3 days) |

> **Speaker notes:** /schedule is the "set and forget" pattern. The agent runs on Anthropic's cloud on a cron schedule — no laptop needed. /loop is for active monitoring during a work session: "keep checking CI every 5 minutes and tell me when it's green." Both are powerful for enterprise workflows that need periodic attention without a human polling manually.

---

## Slide 7: Permissions Profile

```json
// .claude/settings.json — committed to git, team-shared
{
  "permissions": {
    "allow": ["mvn *", "npm *", "git status", "git diff", "git log"],
    "deny":  ["git push *", "rm -rf *", "sudo *", "curl *"]
  }
}
```

**Allow safe commands. Block dangerous ones. Team-shared via git.**

Boris Cherny does NOT use `--dangerously-skip-permissions`. He pre-allows safe commands.

> **Speaker notes:** The deny list is your safety net for CI and for junior developers using Claude Code unsupervised. git push denied — changes need human review. rm -rf denied — no accidental deletions. curl denied — no reaching external APIs in CI. The allow list is tuned to what your specific project needs. Show the actual project settings.json.

---

## Slide 8: Fan-Out at Scale

```bash
# Step 1: Generate task list
claude -p "List all service files missing HrLogHelper logging" \
  --output-format json > missing.json

# Step 2: Fix each file in parallel
cat missing.json | jq -r '.files[]' | while read f; do
  claude -p "Add HrLogHelper entry/exit to all public methods in $f.
             Mask salary/email/phone. Follow HrRegionService pattern." \
    --allowedTools "Edit" &
done
wait

# Step 3: Verify all fixed
claude -p "Grep all services for public methods still missing HrLogHelper." \
  --output-format json
```

**One human orchestrates. N Claude agents work in parallel. Human reviews the diff.**

> **Speaker notes:** This is the pattern for large-scale migrations. A bank migrating 200 service files to a new logging standard would take a team weeks manually. With fan-out: 30 minutes. The human writes the step 1 + 2 + 3 script, reviews the final diff, approves the PR. The hard part was already done.

---

## Slide 9: Your Turn — Lab 11

In the next 75 minutes, you'll build all three governance layers:

1. **Makefile** — 8 pipeline targets (`build`, `test`, `lint`, `verify`, etc.)
2. **Jenkinsfile** — orchestrates Makefile targets across 5 stages
3. **Pipeline translation** — Jenkins → GitLab CI (or Azure DevOps)
4. **Permissions profile** — allow safe commands, deny risky ones
5. **CI review script** — `claude -p` automated PR check

**The integration question:**
> *"Which of your current manual code review steps could be automated with `claude -p` in CI?"*

> **Speaker notes:** Give them 2 minutes on the integration question first. Most enterprise devs have 3-5 mechanical review steps they do on every PR (naming conventions, security patterns, etc.) — these are all automatable with claude -p. That realization anchors why this lab matters.
