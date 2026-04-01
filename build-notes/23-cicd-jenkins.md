# Build Note: CI/CD Pipeline — Jenkins + Makefile

**Date:** 2026-03-31
**Module:** CI/CD Pipeline Integration
**Maps to Lab:** Lab 14: CI/CD (Updated — Jenkins focus)

---

## What We Built

A two-layer CI/CD setup appropriate for enterprise environments:

1. **`Makefile`** (project root) — platform-agnostic pipeline targets that any CI system can call
2. **`Jenkinsfile`** (project root) — declarative Jenkins pipeline with 5 stages wired to Makefile targets

### Why Two Layers?

The Makefile decouples the *what* (build, test, lint, package) from the *how* (which CI tool). If the company migrates from Jenkins to GitLab CI or Azure DevOps, only the pipeline file changes — the Makefile targets stay identical.

---

## Pipeline Stages

| Stage | Backend | Frontend | Triggered On |
|-------|---------|----------|--------------|
| Checkout | ✅ | ✅ | All branches |
| Backend Build & Test | `mvn compile` + `mvn test` | — | All branches |
| Frontend Install & Lint | — | `npm ci` + `npm run lint` | All branches |
| Frontend Build | — | `npm run build` | All branches |
| Package (JAR) | `mvn package -DskipTests` | — | `main` and `release/*` only |

Package stage is gated to `main`/`release/*` using `when { branch }` — feature branches don't produce artifacts.

---

## Technique Used

Claude Code used to:
- Generate the Makefile from a description of the project's build tools and desired stages
- Generate the Jenkinsfile from the Makefile targets + Jenkins declarative pipeline conventions
- Demonstrate pipeline translation (see Lab Exercise below)

---

## The Prompt That Worked

```
This is a Spring Boot + React monorepo. Backend uses Maven (Java 21),
frontend uses npm/Vite. Write:
1. A Makefile with targets: backend-build, backend-test, backend-package,
   frontend-install, frontend-lint, frontend-build, and composite targets:
   build, test, lint, package, verify.
2. A declarative Jenkinsfile with stages: Checkout, Backend Build & Test,
   Frontend Install & Lint, Frontend Build, Package.
   Package stage should only run on main and release/* branches.
   Publish JUnit results and archive artifacts.
Keep Makefile and Jenkinsfile in sync — Jenkins calls make targets where possible.
```

---

## What Failed First

- **Symptom:** First Jenkinsfile used scripted pipeline syntax (`node { stage(...) }`) instead of declarative (`pipeline { stages { stage(...) } }`).
- **Root cause:** Claude defaulted to scripted syntax, which is older. Most modern Jenkins setups use declarative.
- **Fix:** Added "declarative pipeline" explicitly to the prompt.

- **Symptom:** `junit` step path was wrong — pointed to `target/` directly instead of `target/surefire-reports/*.xml`.
- **Root cause:** Maven puts Surefire XML in a subdirectory, not the root target folder.
- **Fix:** Claude corrected it after being shown the actual directory structure.

---

## Key Teaching Points

### 1. Enterprise CI/CD is NOT GitHub Actions
Most large enterprises run Jenkins, GitLab CI (self-hosted), Azure DevOps, Bamboo, or TeamCity on internal infrastructure. Training on GitHub Actions is fine for the internet, but misses the enterprise audience. The Makefile pattern bridges this — it works everywhere.

### 2. The Makefile as the Real Pipeline Definition
The Makefile is the contract. It defines exactly what "build" means, "test" means, "package" means. The CI tool file (Jenkinsfile, `.gitlab-ci.yml`, `azure-pipelines.yml`) is just an orchestrator that calls these targets. This means:
- Developers can run `make verify` locally and get the exact same result as CI
- Onboarding a new CI tool is a 1-hour task, not a week-long project

### 3. Claude Code Can Translate Between Pipeline Formats
This is a high-value skill for enterprise. Companies regularly migrate SCM or CI tools. Claude can:
- Convert a Jenkinsfile to GitLab CI syntax in one prompt
- Add a new stage to both files simultaneously
- Debug a failing pipeline by reading the log output

Demonstrate this in the lab: show Claude translating the Jenkinsfile to `.gitlab-ci.yml`.

### 4. Branch-Based Stage Gating
The `when { branch 'main' }` pattern prevents feature branches from producing deployment artifacts. This is standard enterprise practice — show it explicitly because it confuses developers who expect all branches to behave the same.

### 5. Post-Stage Actions: Archive + Notify
The `archiveArtifacts` and `junit` steps in `post { }` blocks are where Jenkins adds value over just running shell commands. Claude can add these systematically once the basic pipeline is working.

---

## Lab Exercise Derivation

### Lab 14: CI/CD with Jenkins (25 minutes)

**Setup:** Students have the Makefile and Jenkinsfile committed to the repo. Jenkins is not actually running — the lab is about the files and the Claude Code workflow, not about running a live pipeline.

**Task 1 — Understand the structure (5 min):**
Ask Claude: *"Walk me through what happens when this pipeline runs on a feature branch vs the main branch."*
Expected: Claude explains the `when` gate on Package stage.

**Task 2 — Add a coverage gate (10 min):**
Ask Claude: *"Add a stage after Backend Build & Test that fails the build if unit test coverage is below 60%. Use JaCoCo."*
Expected: Claude adds JaCoCo to `pom.xml`, updates the Makefile target, adds the stage to the Jenkinsfile.

**Task 3 — Translate to GitLab CI (10 min):**
Ask Claude: *"Convert this Jenkinsfile to a GitLab CI pipeline (.gitlab-ci.yml). Keep the same 5 stages. Use the same Makefile targets."*
Expected: Claude produces a valid `.gitlab-ci.yml` with equivalent stages, including the branch condition on the package job.

**Discussion prompt:** *"In your current company's CI system, what would be the equivalent of the `when { branch 'main' }` gate? How would you explain to Claude what your pipeline tool is?"*

**Success criteria:**
- `Jenkinsfile` and `Makefile` are in sync (Jenkinsfile calls `make` targets)
- `make verify` runs locally without error
- Student can describe what each stage does and why Package is gated

---

## Connection to Other Build Notes

- **Build Note #12 / #22** (hooks) — hooks enforce quality locally; the pipeline enforces it in CI. Complementary layers.
- **Build Note #02** (HrLogHelper) — backend tests called by `make test` / `mvn test` are the same tests from this note.
- **Build Note #21** (capstone) — termination flow is covered by E2E tests; those could be added as a post-package pipeline stage.
