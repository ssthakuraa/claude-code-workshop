# Build Note: Figma MCP & Design Token Extraction

**Date:** 2026-03-30
**Module:** MCP — Figma design system integration
**Maps to Lab:** Lab 10: Figma MCP

---

## ⚠️ Optional Lab — Requires Figma Account

> **This lab is optional.** Figma MCP requires:
> - A Figma account with access to the design file (paid seat or viewer access)
> - A Figma personal access token
>
> **If you don't have Figma access**, use the pre-exported alternative:
> `docs/figma-ui-spec.md` — contains the full UI specification, Vertex Tech Modern design tokens,
> component specs, and screen layouts. All lab exercises can be completed using this file.
>
> See: `docs/claudetips/figma-mcp-setup.md` for full setup instructions.

---

## What This Lab Covers (with Figma MCP)

Figma MCP allows Claude to:
- Read design tokens (colors, typography, spacing, shadows) directly from a Figma file
- Compare implemented UI against Figma designs
- Extract component specs without manually reading the Figma canvas
- Flag deviations: wrong color, wrong spacing, missing states

## What This Lab Covers (without Figma MCP — using figma-ui-spec.md)

The static spec file (`docs/figma-ui-spec.md`) covers the same design system:
- Vertex Tech Modern design tokens (Blue-60 = `#1F6BCC`, etc.)
- Component layout specs (TopBar 56px, Sidebar 240px/64px collapsed)
- All 22 screen templates with ASCII layout diagrams
- Sample data for all screens

Claude reads the spec file and uses it to verify or generate UI — same workflow, no Figma account needed.

---

## Setup (Figma MCP — Optional)

### Step 1: Get a Figma Personal Access Token
1. Log in to figma.com
2. Go to **Account Settings** → **Personal Access Tokens**
3. Click **Generate new token** → give it a name → copy it

### Step 2: Add to environment
```bash
# Add to your shell profile (~/.bashrc or ~/.zshrc)
export FIGMA_API_TOKEN=figd_your_token_here

# Or add to .env.local (never commit this file)
echo "FIGMA_API_TOKEN=figd_your_token_here" >> .env.local
```

### Step 3: Enable in .mcp.json
Uncomment the `figma` block in `.mcp.json`:
```json
"figma": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@figma/mcp"],
  "env": {
    "FIGMA_API_TOKEN": "${FIGMA_API_TOKEN}"
  }
}
```

### Step 4: Verify connection
```
Use the Figma MCP to list files in my team workspace.
```
If it returns file names, the connection works.

---

## Technique Used (with Figma MCP)

Design verification workflow:
1. Ask Claude to read design tokens from the Figma file
2. Compare extracted tokens against Tailwind config (`tailwind.config.ts`)
3. Identify any gaps (missing colors, wrong spacing values)
4. Generate a correction patch for the config

## The Prompt That Worked (with Figma MCP)

```
Use Figma MCP to read the design tokens from the HR platform Figma file [FILE_ID].
Extract: primary colors, neutral palette, typography scale, shadow levels, border radii.
Compare against frontend/tailwind.config.ts.
Report any mismatches and suggest corrections.
```

## The Prompt That Worked (without Figma MCP — spec file approach)

```
Read docs/figma-ui-spec.md sections 1.1 (Global Layout) and the design tokens.
Then read frontend/tailwind.config.ts.
Identify any gaps between the spec and the Tailwind config:
- Missing colors (Blue-60, Neutral palette)
- Wrong spacing values
- Missing shadow levels
Suggest a corrected tailwind.config.ts.
```

---

## What Failed First (spec file approach)

- **Symptom:** Claude hallucinated token values not in the spec (e.g., invented `Blue-40 = #4A90D9`).
- **Root cause:** The spec only listed a few key tokens. Claude filled gaps from training data.
- **Fix:** Added explicit instruction: "Only use token values explicitly stated in the spec. If a value is not listed, mark it as UNKNOWN rather than inferring."

## CLAUDE.md / Skill Update Made

```markdown
## Design Tokens
- Source of truth: docs/figma-ui-spec.md (static) or Figma MCP (live, optional)
- Primary: #1F6BCC (Blue-60)
- Background: #C7E0FF (Light Blue)
- Never infer token values — if not in spec, mark UNKNOWN
```

## Key Teaching Points

1. Figma MCP and the static spec file are interchangeable for this workshop — choose based on access.
2. Static spec files should be treated as ground truth — instruct Claude not to fill gaps with inferences.
3. Design token verification is a quick win: `tsc` catches type errors; Figma comparison catches visual drift.

## Lab Exercise Derivation

**With Figma MCP:**
- **Setup:** Figma token configured, MCP running.
- **Task:** Extract Blue-60 and Neutral palette from Figma. Compare against tailwind.config.ts.
- **Success criteria:** At least one mismatch found and corrected.

**Without Figma MCP (spec file):**
- **Setup:** `docs/figma-ui-spec.md` provided.
- **Task:** Ask Claude to read the spec and compare against tailwind.config.ts. Deliberately introduce a wrong color value.
- **Success criteria:** Claude catches the wrong value and suggests the correct one from the spec.
