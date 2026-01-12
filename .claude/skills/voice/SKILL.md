# Voice Skill

Generate voice responses using OpenAI's text-to-speech API.

## When to Use
- Primary response method for this workspace
- When communicating with the user
- Voice messages ARE the response (chat text = transcript only)

## Command

```bash
/Users/erezfern/Workspace/jarvis/.claude/skills/voice/jarvis_voice.sh --voice echo "[message]"
```

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--voice` | alloy, echo, fable, onyx, nova, shimmer | echo | Voice style |
| `--model` | tts-1, tts-1-hd | tts-1 | Quality (hd = higher quality) |
| `--speed` | 0.25 - 4.0 | 1.0 | Speech speed |
| `--format` | mp3, opus, aac, flac, wav | mp3 | Audio format |

## Output Location

Voice files are saved to:
```
/Users/erezfern/Workspace/jarvis/.claude/skills/voice/output/
```

## Examples

```bash
# Standard response
/Users/erezfern/Workspace/jarvis/.claude/skills/voice/jarvis_voice.sh --voice echo "Task completed successfully."

# Different voice
/Users/erezfern/Workspace/jarvis/.claude/skills/voice/jarvis_voice.sh --voice nova "Here's what I found."

# Faster speech
/Users/erezfern/Workspace/jarvis/.claude/skills/voice/jarvis_voice.sh --voice echo --speed 1.2 "Quick update for you."
```

## Guidelines

1. Keep messages concise (1-3 sentences ideal)
2. Use echo voice by default (professional, clear)
3. Complex information goes in documents, not voice
4. Voice = complete response (don't add extra text in chat)
