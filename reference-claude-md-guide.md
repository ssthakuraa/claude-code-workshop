# Guide to Writing Effective CLAUDE.md Files

> Source: [claude.com/blog/using-claude-md-files](https://claude.com/blog/using-claude-md-files)

---

## What is CLAUDE.md?

A special file that Claude reads at the start of every conversation. It provides persistent context that Claude automatically incorporates — coding standards, build commands, architectural decisions, and workflow rules.

---

## Core Structure

A well-structured CLAUDE.md should cover:

1. **Project summary and purpose**
2. **High-level directory structure** with key directories mapped
3. **Technology stack** and main dependencies
4. **Coding standards and conventions**
5. **Standard workflows** for different task types
6. **Common commands** with examples
7. **Custom tools and integrations**
8. **Development environment setup**

---

## Essential Content for Enterprise Codebases

### 1. Architectural Mapping

Provide a clear directory tree showing where different components live:

```
main.py
├── modules/
│   ├── cli.py
│   ├── logging_utils.py
│   ├── media_handler.py
├── tests/
├── config/
```

Document architectural patterns explicitly — domain-driven design, microservices, monolith structure — so Claude makes contextually appropriate decisions.

### 2. Coding Standards Documentation

Specify requirements that prevent rework:

- Type hints on all functions (with language-specific syntax)
- Line length constraints (e.g., "PEP 8 with 100 character lines")
- Testing framework and fixture locations
- Naming conventions for classes, functions, constants
- Import organization rules
- Documentation requirements

Example: `"Type hints required on all functions. pytest for testing (fixtures in tests/conftest.py). PEP 8 with 100 character lines."`

### 3. Workflow Definition

Define standard processes before code changes:

1. Investigation phase (what should be explored first?)
2. Planning phase (what needs a detailed implementation plan?)
3. Information gathering (what's missing before starting?)
4. Testing strategy (how will success be validated?)

Provide specific workflows for different task types:
- Feature implementation (explore-plan-code-commit cycle)
- Bug fixes (test-driven reproduction before changes)
- Security reviews (isolated context in subagents)
- UI/UX changes (visual iteration approach)

### 4. Tool Integration

Document custom utilities and scripts with usage patterns:

```markdown
## Custom Tools

### Deployment Script
- Location: scripts/deploy.sh
- Usage: ./deploy.sh [environment] [version]
- Common invocations:
  - ./deploy.sh production v1.2.3
  - ./deploy.sh staging latest
- Check ./deploy.sh --help for full options
```

For MCP servers, include:
- Connection details and any usage restrictions
- Rate limits or quotas
- Approved use cases
- Explicit warnings for what NOT to do

### 5. Project-Specific Context

Capture institutional knowledge that wouldn't appear in code:

- API versioning strategy ("/api/v1 prefix on all routes")
- Token expiration policies ("JWT tokens expire after 24 hours")
- Database migration procedures
- Deployment approval requirements
- Code review expectations
- Branch naming conventions
- Critical dependencies or gotchas

---

## Content Prioritization

**Start minimal and expand deliberately.** Since CLAUDE.md adds to context on every interaction:

- Document only information Claude cannot easily infer
- Remove generic guidance that doesn't apply specifically to your project
- Break large information blocks into separate markdown files referenced within CLAUDE.md
- Keep file size reasonable to preserve context window efficiency

---

## What NOT to Include

Never commit sensitive information:

- API keys, credentials, or connection strings
- Database passwords
- Detailed security vulnerability information
- PII or confidential business data
- Infrastructure secrets

---

## Using /init Command

Generate a starting CLAUDE.md:

```bash
cd your-project
claude
/init
```

Claude analyzes the codebase and generates tailored configuration covering detected build commands, test instructions, key directories, and conventions.

---

## Custom Commands

Store frequently-used prompts as markdown files in `.claude/commands/`:

```markdown
# performance-optimization

Analyze code for database query issues, algorithm efficiency,
memory management, and caching opportunities...
```

Commands become available as `/performance-optimization` and support arguments through `$ARGUMENTS`.

---

## Evolution Strategy

Treat CLAUDE.md as a living document:

- Add instructions for patterns Claude repeats incorrectly
- Remove guidance that no longer applies
- Update as new tools or conventions enter your workflow
- Share improvements with your team

**The most effective CLAUDE.md files solve real operational friction** — documenting commands you type repeatedly, capturing architectural decisions that take ten minutes to explain, and establishing workflows that prevent common rework scenarios.
