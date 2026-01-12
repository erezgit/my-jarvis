---
name: ticket-workflow
description: Create tickets, roadmaps, and track feature development. Use when user mentions new feature, bug fix, improvement, ticket creation, or needs a roadmap template.
allowed-tools: Bash, Write, Edit, Read
---

# Ticket Workflow

Create and manage development tickets with roadmap templates.

## Ticket Structure

**Location**: `spaces/my-jarvis/tickets/XXX-icon-ticket-name/`
**Format**: Number + emoji icon + descriptive name

## Creating New Ticket

```bash
# 1. Check existing tickets for highest number
ls spaces/my-jarvis/tickets/

# 2. Create new folder
mkdir spaces/my-jarvis/tickets/XXX-🔄-descriptive-name

# 3. Create 1-roadmap.md using template below
```

## Roadmap Template

```markdown
# Ticket XXX: [Feature Name] - Roadmap

**Status**: 🟠 NOT STARTED | **Priority**: HIGH | **Last Updated**: [Date]

---

## Implementation Roadmap

### Phase 1: Research & Analysis
1. 🟠 Analyze existing codebase patterns
2. 🟠 Document current architecture
3. 🟠 Define test scenarios

### Phase 2: Implementation
4. 🟠 Implement backend logic
5. 🟠 Create frontend components
6. 🟠 Connect frontend to backend

### Phase 3: Testing & Polish
7. 🟠 Run end-to-end tests
8. 🟠 Test edge cases
9. 🟠 Deploy to development

---

## Product Section
[Feature overview, user impact, success criteria]

## Architecture Section
[Technical approach, component structure, API design]

## Historical Log
[Date-stamped progress entries]
```

## Status Icons

| Icon | Meaning |
|------|---------|
| 🟠 | Not started |
| 🟡 | In progress |
| ✅ | Complete |
| ❌ | Blocked |

## Discovery Phase

Before creating ticket:
1. **Assess** - Understand what user wants
2. **Challenge** - Ask clarifying questions
3. **Define** - Establish success criteria
4. **Create** - Make ticket once goal is clear

