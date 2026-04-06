# Lab 11: CI/CD, Permissions & Enterprise Governance

**Duration:** 75 minutes
**Day:** 4 — Mastery
**Builds On:** Labs 5 (hooks), 9–10 (MCP)
**Produces:** Makefile, Jenkinsfile, permissions profile

---

## Learning Objective

You will use Claude Code to generate CI/CD pipeline configuration for enterprise environments, configure a permissions profile that balances productivity with safety, and translate pipeline definitions across CI platforms. These are high-value enterprise skills — companies regularly migrate CI tools, and getting the pipeline right is critical.

---

## The Key Concepts

### CI/CD with Claude Code
Claude can generate, maintain, debug, and translate pipeline configurations for any CI platform — Jenkins, GitLab CI, Azure DevOps, CircleCI, GitHub Actions. The key insight:

> **Use a Makefile as the contract.** The Makefile defines what "build," "test," and "package" mean. The CI tool just calls `make build`, `make test`. This decouples the pipeline stages from the CI platform.

### Permissions & Security
Claude Code has a programmable safety model:
- **`/permissions`** — pre-allow safe commands (shared via `.claude/settings.json`)
- **PreToolUse hooks** — block dangerous operations structurally
- **`.claude/settings.json`** — team-shared permission profiles
- **Never use `--dangerously-skip-permissions`** in production

### Two Levels of Settings

| File | Scope | Committed to git? | Who it applies to |
|------|-------|-------------------|-------------------|
| `~/.claude/settings.json` | User-level — all projects on this machine | No | You only |
| `.claude/settings.json` | Project-level — this repo only | Yes | Whole team |

**Rule of thumb:**
- Hooks that enforce team standards → project-level (`.claude/settings.json`)
- Personal preferences (editor style, model choice) → user-level (`~/.claude/settings.json`)
- `allowedTools` for CI safety → project-level so every developer gets the same profile

### Enterprise Governance = Hooks + Permissions + CI/CD
Together, these three create a governance layer:
```
Hooks: enforce rules locally (every developer, every session)
Permissions: control what Claude can/can't do
CI/CD: enforce rules in the pipeline (every PR, every merge)
```

---

## Setup

```bash
# Verify backend and frontend are in place
cd backend && mvn compile -q && echo "Backend: OK"
cd frontend && npm run build 2>&1 | tail -2
```

---

## Exercise 1: Study the Makefile (15 min)

### Goal
Understand the platform-agnostic pipeline contract.

### Background

The project already has a Makefile at the project root. This is the foundation of the enterprise CI/CD approach — it works on ANY CI system.

### Instructions

1. **Study the Makefile:**
   ```
   Read the Makefile at the project root.
   Explain the composite targets (build, test, lint, package, verify)
   and how they chain the individual backend/frontend targets.
   ```

2. **Test it locally:**
   ```bash
   make help      # Should list all targets
   make test      # Should run backend tests
   ```

3. **Key insight:** This Makefile works on ANY CI system. The CI config just calls `make build`, `make test`. When your company migrates from Jenkins to GitHub Actions, you only rewrite the Jenkinsfile — the Makefile stays.

---

## Exercise 2: Study the Jenkins Pipeline (20 min)

### Goal
Understand the Jenkins pipeline that orchestrates the Makefile targets.

### Background

The project already has a Jenkinsfile with full declarative pipeline syntax, 5 stages, and branch-gated Package stage.

### Instructions

1. **Study the Jenkinsfile:**
   ```
   Read the Jenkinsfile. Walk me through each stage.
   Then explain what happens differently on:
   1. A feature branch (feature/new-page)
   2. The main branch
   ```

2. **Review the Jenkinsfile.** Check:
   - [ ] Declarative syntax (not scripted)?
   - [ ] `when { branch 'main' }` on Package stage?
   - [ ] JUnit results published in `post { always { } }`?
   - [ ] Artifacts archived with fingerprinting?
   - [ ] cleanWs() in post-always?

3. **Ask Claude to explain the Makefile ↔ Jenkinsfile relationship:**
   ```
   How does this Jenkinsfile use the Makefile as a contract?
   Where does it call make directly vs running the commands itself?
   ```

---

## Exercise 3: Add a Governance Stage to the Pipeline (20 min)

### Goal
The hooks from Lab 5 run locally — but only if the developer is using Claude Code.
A developer using a plain editor, or someone who bypassed hooks, can still push
code that violates naming conventions or contains PII in logs.

Add a CI stage that runs the same checks as a pipeline gate.

### Instructions

1. Ask Claude to add a Governance stage to the Jenkinsfile:
   ```
   Add a 'Governance' stage to the Jenkinsfile that runs after Backend Build.
   It should:
   1. Scan all new/changed Java files for class names without the Hr prefix
      (same rule as our PostToolUse naming hook)
   2. Scan all *Service.java files for LOGGER statements containing
      email, phone, salary, password, ssn
      (same rule as our PostToolUse PII hook)
   3. Fail the build (exit 1) if either check finds a violation
   Use shell commands — no extra tools required.
   ```

2. Test it: introduce a violation and verify the pipeline would catch it:
   ```
   Temporarily create a file called EmployeeValidator.java
   with a class name that doesn't start with 'Hr'.
   Does the governance check catch it?
   ```

3. Ask Claude:
   ```
   What's the relationship between the PostToolUse hooks in
   .claude/settings.json and this Governance stage?
   ```
   Expected answer: they enforce the same rules at different layers —
   hooks catch it during development (fast feedback), CI catches it
   at merge time (safety net).

### Key Insight
Hooks and CI stages should mirror each other for the same rules.
Hooks = fast feedback loop. CI = safety net. Neither replaces the other.

---

## Exercise 4: Permissions Profile (15 min)

### Goal
Configure a permissions profile that allows safe operations and blocks dangerous ones.

### Instructions

1. Ask Claude about current permissions:
   ```
   What commands am I currently allowing Claude to run without prompting?
   What should I pre-allow for this project to reduce friction?
   ```

2. Configure safe command permissions:
   ```
   Update .claude/settings.json to pre-allow these commands without prompting:
   - mvn compile, mvn test, mvn package (build commands)
   - npm ci, npm run lint, npm run build (frontend commands)
   - git status, git diff, git log (read-only git)

   But ensure these still require approval:
   - git push, git reset (destructive git)
   - rm, rmdir (file deletion)
   - Any command with sudo
   ```

   The `allowedTools` syntax uses glob patterns to match commands:
   ```json
   {
     "allowedTools": [
       "Bash(mvn compile*)",
       "Bash(mvn test*)",
       "Bash(mvn package*)",
       "Bash(npm ci*)",
       "Bash(npm run lint*)",
       "Bash(npm run build*)",
       "Bash(git status*)",
       "Bash(git diff*)",
       "Bash(git log*)"
     ]
   }
   ```
   The `*` glob matches any arguments after the command prefix. `Bash(mvn compile*)` allows `mvn compile`, `mvn compile -q`, `mvn compile -f backend/pom.xml`, etc. Without the glob, only the exact string matches.

3. **Test the permissions:**
   ```
   Run mvn test — did it prompt you for permission?  (Should not — the prompt appears inline in the Claude Code terminal if a command isn't pre-allowed)
   Now try: git push origin main — did it prompt you?  (Should prompt)
   ```

4. **Add a safety hook:**
   ```
   Add a PreToolUse hook that blocks any Bash command containing
   "DROP TABLE" or "DELETE FROM" to prevent accidental database mutations.
   ```

---

## Exercise 5: The Self-Improvement Coda (5 min)

1. Add to CLAUDE.md:
   ```markdown
   ## CI/CD
   - Makefile defines pipeline stages (platform-agnostic)
   - Jenkinsfile orchestrates (production CI)
   - Package stage gated to main and release/* branches only

   ## Permissions
   - Build/test/lint commands pre-allowed
   - Git push, file deletion, sudo require approval
   - DROP TABLE / DELETE FROM blocked by hook
   ```

2. **Reflect on settings levels:**
   ```
   What would you put in your personal ~/.claude/settings.json that
   you would NOT want to commit to the team repo?
   ```
   Expected answers: personal model preferences, personal notification settings, allowedTools for tools specific to their machine setup.

3. **Reflect:** The three governance layers are now in place:
   - **Hooks** (Lab 5): schema guard, naming convention, PII detection
   - **Permissions** (this lab): safe commands allowed, dangerous ones blocked
   - **CI/CD** (this lab): automated quality gates on every PR

---

## Success Criteria

- [ ] `Makefile` exists with all composite targets; `make help` works
- [ ] `Jenkinsfile` uses declarative syntax with branch-gated Package stage
- [ ] Jenkinsfile includes Governance stage mirroring Lab 5 hooks
- [ ] Permissions configured: build commands allowed, destructive commands blocked
- [ ] You can explain: Makefile (what) vs Jenkinsfile (how) vs permissions (who can)

---

## Key Takeaways

1. **Makefile is the contract** — CI tools change; the Makefile stays. Migrate CI platforms by rewriting one file.
2. **Permissions are team-shared** — `.claude/settings.json` in git. Every developer gets the same safety profile.
3. **Hooks and CI mirror each other** — hooks catch violations during development (fast feedback), CI catches them at merge time (safety net). Neither replaces the other.
4. **Two levels of settings** — project-level `.claude/settings.json` for team governance, user-level `~/.claude/settings.json` for personal preferences.
5. **Three governance layers** — hooks (local enforcement), permissions (action control), CI/CD (pipeline gates). Together they create enterprise-grade safety.

---

<details>
<summary><strong>Escape Hatch</strong> — Governance stage reference</summary>

Study the Governance stage already in the Jenkinsfile (line ~44):

```bash
grep -n "Governance" Jenkinsfile
```

The Jenkinsfile already contains the full Governance stage implementation.
If it doesn't match what the exercise asks for, ask Claude to update the
existing stage to include the naming convention and PII checks.
</details>
