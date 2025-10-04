# Claude Code SDK Server Deployment Guide

## 🌐 The Big Picture: Claude Code in the Cloud

What you discovered with Docker + Render is groundbreaking, Erez. You can indeed run Claude Code on servers, opening up possibilities for:
- **My Jarvis Cloud**: Web-based development environment
- **Team Collaboration**: Shared Claude instances
- **Always-On Agents**: 24/7 background processing
- **Global Access**: Code from any device, anywhere

## 🔐 Authentication Methods for Server Deployment

### 1. Direct API Key (What You Did)
```bash
# Works but has limitations
export ANTHROPIC_API_KEY="sk-ant-..."
claude-code
```
- ✅ Works in Docker containers
- ⚠️ Personal key on shared server
- ❌ Browser OAuth doesn't work via SSH

### 2. Amazon Bedrock (Enterprise)
```bash
# Enterprise-grade authentication
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"
```
- ✅ Designed for server deployment
- ✅ IAM role-based security
- ✅ No browser needed
- 💰 Pay through AWS billing

### 3. Google Vertex AI (Enterprise)
```bash
# Google Cloud authentication
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION="us-east5"
export ANTHROPIC_VERTEX_PROJECT_ID="your-project"
```
- ✅ GCP service account authentication
- ✅ Integrates with existing GCP infrastructure
- ✅ No browser needed
- 💰 Pay through GCP billing

### 4. LLM Gateway (Custom)
```bash
# Your own authentication proxy
export ANTHROPIC_BASE_URL="https://your-gateway.com"
export CLAUDE_CODE_SKIP_AUTH=1
```
- ✅ Complete control over authentication
- ✅ Add custom rate limiting, logging
- ✅ Share across team with single billing

## 🐳 Docker Deployment (What You Started)

### Basic Dockerfile
```dockerfile
FROM node:20-alpine

# Install Claude Code SDK
RUN npm install -g @anthropic-ai/claude-code

# Install Python for SDK
RUN apk add --no-cache python3 py3-pip
RUN pip3 install claude-code-sdk

# Set working directory
WORKDIR /workspace

# Authentication via environment
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}

# Run Claude Code
CMD ["claude-code", "serve", "--port", "8080"]
```

### Docker Compose with Background Agents
```yaml
version: '3.8'
services:
  claude-terminal:
    build: .
    ports:
      - "8080:8080"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./workspace:/workspace
  
  claude-agent-security:
    build: .
    command: python /agents/security_monitor.py
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: always
  
  claude-agent-docs:
    build: .
    command: python /agents/doc_updater.py
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: always
```

## 🚀 Deployment Platforms

### Render (What You Used)
```yaml
# render.yaml
services:
  - type: web
    name: my-jarvis-cloud
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: ANTHROPIC_API_KEY
        sync: false  # Set in Render dashboard
    disk:
      name: workspace
      mountPath: /workspace
      sizeGB: 10
```
- ✅ Works with Docker
- ✅ Persistent storage
- ⚠️ Browser auth issues via SSH
- 💡 Use API key or Bedrock/Vertex

### Railway
```toml
# railway.toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "claude-code serve --port $PORT"

[service]
internalPort = 8080
```
- ✅ One-click deploy
- ✅ Built-in SSH access
- ✅ Mobile-friendly
- 💰 Pay-as-you-go

### Vercel (Functions Only)
```javascript
// api/claude.js
import { ClaudeSDK } from '@anthropic-ai/claude-code';

export default async function handler(req, res) {
  const claude = new ClaudeSDK({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  
  const response = await claude.complete(req.body);
  res.json(response);
}
```
- ✅ Serverless functions
- ❌ No persistent terminal
- ✅ Great for API endpoints

## 🎯 Server-Specific SDK Features

### 1. Headless Mode
```bash
# No terminal UI needed
claude-code --headless --input "refactor this function" --file main.py
```

### 2. API Server Mode
```python
from claude_code_sdk import ClaudeServer

server = ClaudeServer(port=8080)
server.add_agent("reviewer", ReviewAgent())
server.add_agent("fixer", FixerAgent())
server.start()  # Runs forever, handling HTTP requests
```

### 3. Webhook Handlers
```javascript
// Deployed on server, triggered by GitHub
app.post('/github/webhook', async (req, res) => {
  const claude = new ClaudeSDK();
  
  if (req.body.action === 'opened') {
    const review = await claude.reviewPR(req.body.pull_request);
    await github.createReview(review);
  }
  
  res.json({ status: 'processed' });
});
```

## ⚠️ Known Limitations

### SSH/Browser Auth Issues
- Claude Code OAuth flow requires browser
- SSH sessions can't open browser for auth
- Workaround: Use API key or enterprise auth

### Terminal Interactivity
- No PTY support for password prompts
- Can't handle interactive SSH auth
- Solution: Use passwordless SSH keys

### Persistence
- Auth tokens don't persist across restarts
- Need to re-authenticate after container rebuild
- Solution: Use environment variables

## 💡 My Jarvis Cloud Architecture

```
┌─────────────────────────────────────────┐
│           My Jarvis Cloud               │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────────┐    │
│  │   Web Frontend (Vercel)        │    │
│  │   - Chat UI                    │    │
│  │   - File Explorer              │    │
│  │   - MDX Preview                │    │
│  └────────────────────────────────┘    │
│            ↓ WebSocket                  │
│  ┌────────────────────────────────┐    │
│  │   Claude SDK Server (Render)   │    │
│  │   - Streaming API              │    │
│  │   - Prompt Caching             │    │
│  │   - Session Management         │    │
│  └────────────────────────────────┘    │
│            ↓ API                        │
│  ┌────────────────────────────────┐    │
│  │   Background Agents (Docker)   │    │
│  │   - Security Scanner           │    │
│  │   - Doc Generator              │    │
│  │   - Test Runner                │    │
│  └────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

## 🚀 Next Steps for Server Deployment

### 1. Immediate (Use API Key)
```bash
# Quick test on Render
docker build -t my-jarvis-cloud .
docker run -e ANTHROPIC_API_KEY=$KEY -p 8080:8080 my-jarvis-cloud
```

### 2. Professional (Use Bedrock)
```bash
# Enterprise deployment
export CLAUDE_CODE_USE_BEDROCK=1
# Configure AWS credentials
# Deploy to ECS/EKS
```

### 3. Hybrid Approach
- Local: Terminal for development
- Cloud: SDK for production agents
- Both: Share prompt cache

## 💰 Cost Implications

### Server Benefits
- **Shared Cache**: Team uses same cached context
- **Always Warm**: Cache never expires with 24/7 agents
- **Centralized Billing**: One API key for whole team

### Example Savings
- 5 developers × $200/month = $1,000
- With shared server + caching = $200/month total
- 80% cost reduction for team

## The Bottom Line

Yes, you CAN run Claude Code on servers! Your Docker + Render experiment works. For production:
1. Use Bedrock/Vertex for enterprise auth
2. Deploy background agents in containers
3. Share prompt cache across team
4. Access from anywhere via web UI

This transforms My Jarvis Desktop into My Jarvis Cloud—a global, always-on, collaborative AI development platform.