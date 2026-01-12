# Session Memory Skill

Persist context across chat sessions with structured memory files.

## When to Use

Trigger: User says "update session memory", "save session", "update memory", or "let's wrap up"

## What to Do

### Step 1: Create Session File

Create a new file at:
```
/Users/erezfern/Workspace/jarvis/.claude/skills/session-memory/sessions/YYYY-MM-DD-HH-MM.md
```

Use current timestamp. Content format:

```markdown
# Session: [Date] [Time]

## What We Did
- [Bullet points of key accomplishments]

## Decisions Made
- [Key decisions and reasoning]

## Open Items
- [Things not yet resolved]

## Technical Details
- [Specific code, configs, or commands worth remembering]
```

### Step 2: Update Summary

Update the rolling summary at:
```
/Users/erezfern/Workspace/jarvis/.claude/skills/session-memory/sessions/summary.md
```

Format:

```markdown
# Session Context

Last updated: [timestamp]

## Current Focus
[What we're actively working on - 1-2 sentences]

## Recent Sessions

### [Date] - [Brief Title]
[2-3 bullet points of what happened]

### [Previous Date] - [Brief Title]
[2-3 bullet points]

[Keep last 5-7 sessions, remove older ones]

## Active Tickets
- [List any open tickets with status]

## Pending Items
- [Things to pick up next]
```

## Guidelines

1. **Be concise** - Summary should be scannable in 30 seconds
2. **Focus on context** - What would help you pick up where we left off?
3. **Remove stale info** - Delete sessions older than a week
4. **Keep summary fresh** - Only last 5-7 sessions in the rolling summary

## Session Start Behavior

At the start of each session, read:
```
/Users/erezfern/Workspace/jarvis/.claude/skills/session-memory/sessions/summary.md
```

This gives you context to continue naturally without asking "what were we working on?"
