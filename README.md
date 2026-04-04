# Claude Code Enterprise Training Lab

This repository contains a 4-day hands-on workshop for mastering Claude Code in enterprise development environments.

## Repository Structure

- **main branch** - Training materials only (labs, decks, instructor guides)
- **checkpoint branches** - HR Enterprise Platform code at each workshop stage
  - `checkpoint/day1-start` - Backend only, minimal CLAUDE.md
  - `checkpoint/day2-start` - Full backend + complete CLAUDE.md + skills
  - `checkpoint/day3-start` - Full backend + frontend + hooks configured
  - `checkpoint/day4-start` - Full backend + frontend + MCP servers configured

## Getting Started

### For Students

1. Clone this repository:
   ```bash
   git clone https://github.com/ssthakuraa/claudetraining.git
   cd claudetraining
   ```

2. Start with Day 1 materials:
   ```bash
   git checkout checkpoint/day1-start
   ```

3. Follow the environment setup guide in `envsetup-student.md`

4. Begin with Lab 1: `labs/lab-01-claudemd.md`

### For Instructors

- Presentation decks: `decks/`
- Instructor flow guide: `instructor/flow-guide.md`
- Lab exercises: `labs/`

## Workshop Overview

This 4-day workshop teaches enterprise-grade Claude Code usage through hands-on labs:

**Day 1 - Foundation**: CLAUDE.md, Plan Mode, Skills & Commands, Context Management
**Day 2 - Productivity**: Hooks, Subagents, Parallel Sessions & Git Worktrees, Verification Loops
**Day 3 - Integration**: Playwright MCP, MySQL MCP
**Day 4 - Mastery**: CI/CD & Permissions, Capstone Project

Each lab builds on the previous ones, progressively teaching Claude Code features while building an HR Enterprise Platform (Spring Boot + React).

## Three Core Truths

1. Context management is the #1 constraint
2. Planning before implementation is non-negotiable
3. Simplicity beats complexity

## License

See individual files for licensing information.