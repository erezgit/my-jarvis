# Simple Claude Server for Mobile Access

## Quick Setup Guide

### Step 1: Create the Server (server.js)

```javascript
const express = require('express');
const { ClaudeSDK } = require('@anthropic-ai/claude-code');

const app = express();
app.use(express.json());

// Initialize Claude SDK
const claude = new ClaudeSDK({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Simple auth middleware
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'your-secret-token';
app.use((req, res, next) => {
  if (req.headers.authorization !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Chat endpoint for mobile app
app.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const response = await claude.messages.create({
      messages: [{ role: 'user', content: message }],
      system: context || '',
      max_tokens: 1000
    });
    
    res.json({ 
      response: response.content[0].text,
      usage: response.usage 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Streaming endpoint
app.post('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  const { message } = req.body;
  
  const stream = await claude.messages.stream({
    messages: [{ role: 'user', content: message }],
    stream: true
  });
  
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  
  res.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Claude server running on port ${PORT}`);
});
```

### Step 2: Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install express @anthropic-ai/claude-code

# Copy server code
COPY server.js .

# Environment variables (set in platform)
ENV ANTHROPIC_API_KEY=""
ENV AUTH_TOKEN=""
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
```

### Step 3: Deploy to Render

1. **Create new Web Service on Render**
2. **Connect your GitHub repo**
3. **Set environment variables:**
   - `ANTHROPIC_API_KEY`: Your API key
   - `AUTH_TOKEN`: Secret token for your app
4. **Deploy**

### Step 4: Mobile App Connection (React Native)

```javascript
// ClaudeService.js
const CLAUDE_SERVER = 'https://your-app.onrender.com';
const AUTH_TOKEN = 'your-secret-token';

export const sendMessage = async (message, context = '') => {
  const response = await fetch(`${CLAUDE_SERVER}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify({ message, context })
  });
  
  return response.json();
};

// Usage in React Native component
const ChatScreen = () => {
  const [response, setResponse] = useState('');
  
  const handleSend = async (message) => {
    const result = await sendMessage(message);
    setResponse(result.response);
  };
  
  return (
    <View>
      <TextInput onSubmitEditing={handleSend} />
      <Text>{response}</Text>
    </View>
  );
};
```

## Alternative: Using Railway (Even Simpler)

### railway.toml
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server.js"
restartPolicyType = "always"

[[services]]
protocol = "http"
port = 3000
```

**Deploy command:**
```bash
railway login
railway init
railway up
railway vars set ANTHROPIC_API_KEY=sk-ant-...
railway vars set AUTH_TOKEN=your-secret
```

## Cost Estimates

- **Render**: Free tier (sleeps after 15 min), $7/month for always-on
- **Railway**: $5/month + usage
- **AWS EC2**: t3.micro free tier for 1 year
- **API Costs**: Same as direct usage (~$0.003 per 1k tokens)

## Security Considerations

### Basic (Good for MVP)
- Simple bearer token
- HTTPS only
- Rate limiting

### Production
- Add user authentication (JWT)
- Implement rate limiting per user
- Log usage for billing
- Add request validation

## Testing Your Server

```bash
# Test locally
ANTHROPIC_API_KEY=sk-ant-... AUTH_TOKEN=test node server.js

# Test deployed server
curl -X POST https://your-app.onrender.com/chat \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Claude"}'
```

## Mobile App Features You Can Build

1. **Voice Input**: Record → Transcribe → Send to Claude
2. **Code Highlighting**: Format code responses
3. **Context Management**: Store conversation history
4. **Offline Mode**: Cache responses locally
5. **Push Notifications**: Background agents alert mobile

## Next Steps

1. **Today**: Deploy basic server, test with curl
2. **Tomorrow**: Build simple React Native app
3. **This Week**: Add streaming, better auth
4. **Next Week**: Implement prompt caching for cost savings

This gives you Claude access from anywhere—your iPhone, iPad, or any device—while keeping it simple and secure.