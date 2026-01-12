---
name: composio-integrations
description: Set up Composio MCP, connect external apps, manage integrations, use RUBE tools. Use when connecting apps, setting up integrations, using Composio, Gmail, Calendar, or any external service automation.
allowed-tools: Bash
---

# Composio Integrations

Connect and automate 500+ apps through Composio MCP.

## MCP Configuration

**Config Path**: `~/.claude.json`

```json
{
  "mcpServers": {
    "composio": {
      "command": "npx",
      "args": ["-y", "composio-mcp"]
    }
  }
}
```

## RUBE Tool Workflow

### 1. Search for Tools
```
mcp__rube__RUBE_SEARCH_TOOLS({
  queries: [{ use_case: "send email", known_fields: "recipient: john@example.com" }],
  session: { generate_id: true }
})
```

### 2. Connect Apps (if needed)
```
mcp__rube__RUBE_MANAGE_CONNECTIONS({
  toolkits: ["gmail", "google_calendar"]
})
```
Follow OAuth link in response to authenticate.

### 3. Execute Tools
```
mcp__rube__RUBE_MULTI_EXECUTE_TOOL({
  tools: [{
    tool_slug: "GMAIL_SEND_EMAIL",
    arguments: { to: "john@example.com", subject: "Test", body: "Hello" }
  }],
  session_id: "<from search response>",
  memory: {}
})
```

## Common Toolkits

| Toolkit | Purpose |
|---------|---------|
| gmail | Email automation |
| google_calendar | Calendar management |
| slack | Team communication |
| hubspot | CRM operations |
| xero | Accounting/invoices |
| github | Code repositories |

## Connected Apps (Current)

| App | Account |
|-----|---------|
| Gmail | erezfern@gmail.com |
| Google Calendar | erezfern@gmail.com |
| Supabase | Project database |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tool not found | Check app connection status |
| Auth failed | Re-authenticate via OAuth |
| Rate limited | Check API quotas |

## Quick Commands

```bash
# Check MCP config
cat ~/.claude.json | jq '.mcpServers'

# List connections
# Use RUBE_MANAGE_CONNECTIONS to check status
```

