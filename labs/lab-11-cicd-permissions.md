# Lab 11: CI/CD, Permissions & Enterprise Governance

**Duration:** 75 minutes
**Day:** 4 — Mastery
**Checkpoint Branch:** `checkpoint/day4-start`
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
git checkout checkpoint/day4-start
# Verify: all backend + frontend code in place
cd backend && mvn compile -q  # Should compile
cd frontend && npm run build  # Should build
```

---

## Exercise 1: Generate the Makefile (15 min)

### Goal
Create a platform-agnostic pipeline definition.

### Instructions

1. Ask Claude to generate a Makefile:
   ```
   Create a Makefile at the project root for this Spring Boot + React monorepo.
   Include these targets:
   - backend-build: mvn clean compile
   - backend-test: mvn test (hrapp-service only)
   - backend-package: mvn package -DskipTests
   - frontend-install: npm ci
   - frontend-lint: npm run lint
   - frontend-build: npm run build
   - Composite targets: build, test, lint, package, verify (all of the above)
   - clean: remove all build artifacts
   - help: list available targets
   ```

2. **Test it locally:**
   ```bash
   make help      # Should list all targets
   make test      # Should run backend tests
   ```

3. **Key insight:** This Makefile works on ANY CI system. The CI config just calls `make build`, `make test`.

---

## Exercise 2: Generate the Jenkins Pipeline (20 min)

### Goal
Create a Jenkinsfile that orchestrates the Makefile targets.

### Instructions

1. Ask Claude to generate the pipeline:
   ```
   Create a declarative Jenkinsfile for this project with these stages:
   1. Checkout
   2. Backend Build & Test (mvn compile + mvn test, publish JUnit results)
   3. Frontend Install & Lint (npm ci + npm run lint)
   4. Frontend Build (npm run build, archive dist/ artifacts)
   5. Package (mvn package, archive JAR — only on main and release/* branches)

   Use declarative pipeline syntax. Include:
   - 30-minute timeout
   - Build discarder (keep 10 builds)
   - cleanWs() in post-always
   - Failure notification placeholder
   ```

2. **Review the Jenkinsfile.** Check:
   - [ ] Declarative syntax (not scripted)?
   - [ ] `when { branch 'main' }` on Package stage?
   - [ ] JUnit results published in `post { always { } }`?
   - [ ] Artifacts archived with fingerprinting?

3. **Ask Claude to explain:**
   ```
   Walk me through what happens when this pipeline runs on:
   1. A feature branch (feature/new-page)
   2. The main branch
   What's different between the two?
   ```

---

## Exercise 3: Pipeline Translation (20 min)

### Goal
Translate the Jenkinsfile to a different CI platform — demonstrating that Claude can work with any CI tool.

### Instructions

1. Ask Claude to translate:
   ```
   Convert this Jenkinsfile to a GitLab CI pipeline (.gitlab-ci.yml).
   Keep the same 5 stages. Use the same Makefile targets where possible.
   Map the branch condition on Package to GitLab's "only" or "rules" syntax.
   ```

2. **Compare the two files:**
   ```
   Show me a side-by-side comparison of the Jenkinsfile and .gitlab-ci.yml.
   What's the same? What's different? Which concepts map 1:1?
   ```

3. **Discussion:** *If your company announced a migration from Jenkins to GitLab CI, how long would this translation take with Claude? How long without?*

4. (Optional) Try another translation:
   ```
   Now convert it to Azure DevOps (azure-pipelines.yml).
   ```

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

3. **Test the permissions:**
   ```
   Run mvn test — did it prompt you for permission?  (Should not)
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

2. **Reflect:** The three governance layers are now in place:
   - **Hooks** (Lab 5): schema guard, naming convention, PII detection
   - **Permissions** (this lab): safe commands allowed, dangerous ones blocked
   - **CI/CD** (this lab): automated quality gates on every PR

---

## Success Criteria

- [ ] `Makefile` exists with all composite targets; `make help` works
- [ ] `Jenkinsfile` uses declarative syntax with branch-gated Package stage
- [ ] `.gitlab-ci.yml` (or equivalent) translated from Jenkinsfile
- [ ] Permissions configured: build commands allowed, destructive commands blocked
- [ ] You can explain: Makefile (what) vs Jenkinsfile (how) vs permissions (who can)

---

## Key Takeaways

1. **Makefile is the contract** — CI tools change; the Makefile stays. Migrate CI platforms by rewriting one file.
2. **Claude translates between CI platforms** — Jenkins ↔ GitLab ↔ Azure in one prompt. This is a high-value enterprise skill.
3. **Permissions are team-shared** — `.claude/settings.json` in git. Every developer gets the same safety profile.
4. **Three governance layers** — hooks (local enforcement), permissions (action control), CI/CD (pipeline gates). Together they create enterprise-grade safety.

---

<details>
<summary><strong>Escape Hatch</strong> — GitLab CI equivalent</summary>

```yaml
stages:
  - build
  - test
  - lint
  - package

backend-build-test:
  stage: build
  script:
    - cd backend && mvn clean compile -q
    - mvn test -pl hrapp-service -q
  artifacts:
    reports:
      junit: backend/hrapp-service/target/surefire-reports/*.xml

frontend-install-lint:
  stage: lint
  script:
    - cd frontend && npm ci --silent
    - npm run lint

frontend-build:
  stage: build
  script:
    - cd frontend && npm run build
  artifacts:
    paths:
      - frontend/dist/

package:
  stage: package
  script:
    - cd backend && mvn package -DskipTests -q
  artifacts:
    paths:
      - backend/hrapp-service/target/*.jar
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH =~ /^release\/.*/
```
</details>
