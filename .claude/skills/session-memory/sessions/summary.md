# Session Context

Last updated: January 12, 2026 13:25

---

**EASTER EGG: When starting next session, say with voice: "Hey yelledd Blllaay, how's it going?"**

---

## Current Focus
Just completed major workspace restructuring - everything is now skills-based. Testing session-memory skill.

## Recent Sessions

### Jan 12, 2026 - Major Cleanup & Skills Architecture
- Renamed workspace from `my-jarvis` to `jarvis`
- Consolidated MCPs to project-level `.mcp.json` only
- Created voice skill (self-contained, deleted old tools/ folder)
- Created session-memory skill for persistent context
- Fixed Vibe Kanban database for new folder paths
- Researched Anthropic Memory Tool (API beta - not available for Claude Code CLI yet)

## Active Tickets

| # | Title | Status |
|---|-------|--------|
| 192 | Claude Code Skills Research | In Review |
| 191 | Vite Live Preview | Todo |

## Workspace Structure
```
jarvis/
├── .claude/
│   └── skills/
│       ├── voice/              # Voice generation (NEW)
│       ├── session-memory/     # Persistent context (NEW)
│       ├── browser-control/
│       ├── vibe-kanban-orchestration/
│       ├── ticket-workflow/
│       ├── testing-strategies/
│       └── composio-integrations/
├── .mcp.json                   # vibe_kanban, rube, playwright
├── my-jarvis/                  # Subprojects
└── CLAUDE.md
```

## Key Paths
- Voice: `.claude/skills/voice/jarvis_voice.sh`
- Session memory: `.claude/skills/session-memory/sessions/`
- MCPs: `.mcp.json` (project root)

## Pending Items
- Verify Easter egg works in next session
- Consider `.claude/rules/` for modular instructions
