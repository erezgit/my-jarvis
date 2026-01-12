---
name: testing-strategies
description: Test features, debug issues, run manual or automated tests, collect logs. Use when testing, debugging, validating, running tests, or analyzing errors.
allowed-tools: Bash, Read
---

# Testing Strategies

Test and debug features with visual verification and log analysis.

## Development Environment

| Component | Location | Purpose |
|-----------|----------|---------|
| Frontend | localhost:3000 | Local Next.js |
| Backend | my-jarvis-dev.fly.dev | Deployed on Fly.io |

## Manual Testing Protocol

### 1. Start App
```bash
# Kill existing process on port
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start app (run in background)
npm run dev
```

### 2. Run Test
- Tell user: "App running, go ahead and test"
- Wait for user to perform actions
- User confirms action done

### 3. Collect Logs
```bash
# Frontend/backend logs from npm process
# Check background task output

# Fly.io logs if testing deployed version
fly logs -a my-jarvis-dev --recent
```

### 4. Analyze
Use Problem → Root Cause → Solution format

## What to Look For

- Frontend console errors
- Backend API route errors
- Network request failures
- WebSocket connection issues
- Authentication failures

## Unit Testing

```bash
npm test                    # All tests
npm test [file-path]       # Specific file
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## Test Checklist

### Before
- [ ] Backend deployed to Fly.io
- [ ] Frontend running locally
- [ ] Test credentials ready

### During
- [ ] One action at a time
- [ ] Document unexpected behavior

### After
- [ ] Findings documented
- [ ] Issues logged in roadmap

## Debugging Pattern

1. Reproduce consistently
2. Narrow scope
3. Test smallest unit
4. Work outward
5. Document findings

