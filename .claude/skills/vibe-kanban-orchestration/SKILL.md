---
name: vibe-kanban-orchestration
description: Dispatch AI agents via Vibe Kanban MCP, monitor agent status, send follow-up messages, read agent outputs, manage worktrees. Use when orchestrating agents, spawning parallel tasks, checking agent status, or any multi-agent workflow.
allowed-tools: Bash
---

# Vibe Kanban Agent Orchestration

Orchestrate multiple AI agents working in parallel on isolated git worktrees.

## MCP Tools Available

| Tool | Parameters | Description |
|------|------------|-------------|
| `list_projects` | none | Get all projects with IDs |
| `list_repos` | `project_id` | List repositories in a project |
| `list_tasks` | `project_id`, `status?`, `limit?` | List tasks |
| `create_task` | `project_id`, `title`, `description?` | Create new task |
| `get_task` | `task_id` | Get task details |
| `update_task` | `task_id`, `title?`, `description?`, `status?` | Modify task |
| `delete_task` | `task_id` | Remove task |
| `start_workspace_session` | `task_id`, `executor`, `repos[]` | Spawn agent |

**Executors**: `CLAUDE_CODE`, `GEMINI`, `CODEX`, `CURSOR_AGENT`, `OPENCODE`

## Complete Workflow (11 Steps)

### Step 1-3: Prepare Locally
```bash
# 1. Create local ticket folder
mkdir -p agent-workspace/tickets/XXX-ticket-name/

# 2. Add files/instructions to folder

# 3. COMMIT TO GIT (Critical - agent can't see uncommitted files!)
git add . && git commit -m "Ticket XXX: [description]"
```

### Step 4-7: Create & Dispatch via MCP
```
4. list_projects → get project_id
5. create_task(project_id, title, description) → get task_id
6. list_repos(project_id) → get repo_id
7. start_workspace_session(task_id, "CLAUDE_CODE", [{repo_id, base_branch: "main"}])
```

### Step 8-9: Monitor & Guide
```bash
# 8. Check status via get_task or browser at http://127.0.0.1:3100

# 9. Send follow-up messages via REST API
curl -X POST "http://localhost:3100/api/sessions/{session_id}/follow-up" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Your message to the agent"}'
```

### Step 10-11: Review & Cleanup
```bash
# 10. Merge agent work
git merge vk/xxxx-ticket-name

# 11. Cleanup (REQUIRES USER CONFIRMATION!)
git worktree remove --force "/path/to/worktree"
git branch -D vk/xxxx-ticket-name
git worktree prune
```

## Get Session ID for Follow-ups

```bash
sqlite3 "~/Library/Application Support/ai.bloop.vibe-kanban/db.sqlite" \
  "SELECT lower(printf('%s-%s-%s-%s-%s',
    substr(hex(s.id),1,8),
    substr(hex(s.id),9,4),
    substr(hex(s.id),13,4),
    substr(hex(s.id),17,4),
    substr(hex(s.id),21,12)
  )) FROM sessions s
  JOIN workspaces w ON s.workspace_id=w.id
  WHERE w.task_id=X'TASK_ID_HEX'
  ORDER BY s.created_at DESC LIMIT 1;"
```

## Read Agent Output from SQLite

```bash
# Database location
~/Library/Application Support/ai.bloop.vibe-kanban/db.sqlite

# Get latest agent responses
sqlite3 "~/Library/Application Support/ai.bloop.vibe-kanban/db.sqlite" \
  "SELECT logs FROM execution_process_logs WHERE logs LIKE '%result%' ORDER BY inserted_at DESC LIMIT 3;"
```

## Task Status Values

| Status | Meaning |
|--------|---------|
| `todo` | Not started |
| `inprogress` | Agent actively working |
| `inreview` | Ready for code review |
| `done` | Completed and merged |
| `cancelled` | Abandoned |

## Critical Rules

| DO | DON'T |
|----|-------|
| Commit before dispatching | Dispatch with uncommitted files |
| Use follow-ups to guide agents | Fire and forget |
| Ask user before cleanup | Delete worktrees without confirmation |
| Keep branch until ticket DONE | Delete branch mid-ticket |

## Troubleshooting

### Branch Creation Fails
Edit `~/Library/Application Support/ai.bloop.vibe-kanban/config.json`:
```json
{"git_branch_prefix": "vk"}
```

### Follow-up Returns "invalid reference"
Branch was deleted. Agent context is lost - must dispatch new agent.

