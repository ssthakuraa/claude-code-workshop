# Figma MCP Setup Guide

**Lab:** Lab 10 — Figma MCP (Optional)
**Prerequisite:** Figma account with access to the design file (paid seat or viewer access)

---

## Do You Need This?

**No.** The static spec file `docs/figma-ui-spec.md` contains everything needed:
- Oracle Redwood design tokens (colors, typography, spacing, shadows)
- All 22 screen layouts with ASCII diagrams
- Component specs and sample data

Use Figma MCP only if you want live, direct access to the Figma design file.

---

## Step 1: Get a Figma Personal Access Token

1. Log in to [figma.com](https://figma.com)
2. Click your avatar → **Settings**
3. Scroll to **Personal Access Tokens**
4. Click **Generate new token** → give it a name (e.g., `claude-code-lab`)
5. Copy the token — it starts with `figd_`

---

## Step 2: Set the Environment Variable

Add to your shell profile (`~/.bashrc` or `~/.zshrc`):
```bash
export FIGMA_API_TOKEN=figd_your_token_here
```

Then reload:
```bash
source ~/.bashrc
```

Or add to `.env.local` in the project root (this file is gitignored):
```bash
echo "FIGMA_API_TOKEN=figd_your_token_here" >> .env.local
```

---

## Step 3: Enable in .mcp.json

In `.mcp.json`, find the `_FIGMA_MCP_OPTIONAL` block. Copy the `_figma` entry into `mcpServers` and rename it to `figma`:

```json
{
  "mcpServers": {
    "playwright": { ... },
    "mysql": { ... },
    "figma": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@figma/mcp"],
      "env": {
        "FIGMA_API_TOKEN": "${FIGMA_API_TOKEN}"
      }
    }
  }
}
```

> **Note:** Replace `"YOUR_FIGMA_TOKEN_HERE"` with `"${FIGMA_API_TOKEN}"` to read from your environment, not hardcode the token.

---

## Step 4: Verify the Connection

Restart Claude Code (MCP servers load at startup), then test:

```
Use the Figma MCP to list files in my team workspace.
```

If it returns file names, the connection is working.

---

## Step 5: Run the Lab Exercise

```
Use Figma MCP to read the design tokens from the HR platform Figma file [YOUR_FILE_ID].
Extract: primary colors, neutral palette, typography scale, shadow levels, border radii.
Compare against frontend/tailwind.config.ts.
Report any mismatches and suggest corrections.
```

Find the file ID in your Figma file URL:
`https://www.figma.com/file/FILE_ID_HERE/HR-Enterprise-Platform`

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `FIGMA_API_TOKEN not set` | Check env var is exported in shell profile, restart terminal |
| `403 Forbidden` | Token may have expired or lack access to the file — regenerate token |
| `File not found` | Wrong file ID in URL — copy it from the Figma file URL directly |
| MCP server not appearing | Restart Claude Code — MCP servers load at startup, not mid-session |

---

## Without Figma MCP (Static Spec Approach)

If you don't have Figma access, use this prompt instead:

```
Read docs/figma-ui-spec.md sections on design tokens.
Then read frontend/tailwind.config.ts.
Identify any gaps:
- Missing colors (Blue-60 #1F6BCC, Neutral palette)
- Wrong spacing values
- Missing shadow levels
Only use token values explicitly stated in the spec.
If a value is not listed, mark it as UNKNOWN — do not infer.
Suggest a corrected tailwind.config.ts.
```

**Key instruction:** Always tell Claude not to infer missing values. Without this, it fills gaps from training data and invents token values that don't exist in the spec.
