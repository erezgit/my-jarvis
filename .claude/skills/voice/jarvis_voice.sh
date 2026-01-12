#!/bin/bash
# Jarvis Voice Skill
# Generates voice responses using OpenAI's text-to-speech API

# Get the directory where this script is located
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SKILL_DIR/config/.env" ]; then
  source "$SKILL_DIR/config/.env"
fi

# Defaults
VOICE="echo"
MODEL="tts-1"
FORMAT="mp3"
SPEED="1.0"
OUTPUT_DIR="$SKILL_DIR/output"
MAX_LENGTH="1000"

# Usage
show_usage() {
  echo "Usage: jarvis_voice.sh [options] \"message\""
  echo ""
  echo "Options:"
  echo "  --voice VALUE    Voice: alloy, echo, fable, onyx, nova, shimmer (default: echo)"
  echo "  --model VALUE    Model: tts-1, tts-1-hd (default: tts-1)"
  echo "  --format VALUE   Format: mp3, opus, aac, flac, wav (default: mp3)"
  echo "  --speed VALUE    Speed: 0.25-4.0 (default: 1.0)"
  echo "  --help           Show this help"
  exit 1
}

# Parse arguments
POSITIONAL_ARGS=()
JSON_OUTPUT="false"

while [[ $# -gt 0 ]]; do
  case $1 in
    --voice) VOICE="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    --format) FORMAT="$2"; shift 2 ;;
    --speed) SPEED="$2"; shift 2 ;;
    --max-length) MAX_LENGTH="$2"; shift 2 ;;
    --json) JSON_OUTPUT="true"; shift ;;
    --help) show_usage ;;
    -*|--*) echo "Unknown option $1"; show_usage ;;
    *) POSITIONAL_ARGS+=("$1"); shift ;;
  esac
done

set -- "${POSITIONAL_ARGS[@]}"

# Check for text
if [ $# -eq 0 ]; then
  echo "Error: No text provided."
  show_usage
fi

TEXT="$*"

# Validate API key
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY not set. Add it to $SKILL_DIR/config/.env"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Run Python generator
CMD="python3 \"$SKILL_DIR/src/auto_jarvis_voice.py\""
CMD="$CMD \"$TEXT\""
CMD="$CMD --voice $VOICE"
CMD="$CMD --model $MODEL"
CMD="$CMD --format $FORMAT"
CMD="$CMD --speed $SPEED"
CMD="$CMD --max-length $MAX_LENGTH"
CMD="$CMD --output-dir \"$OUTPUT_DIR\""
CMD="$CMD --api-key=\"$OPENAI_API_KEY\""
CMD="$CMD --autoplay"

if [ "$JSON_OUTPUT" = "true" ]; then
  CMD="$CMD --json-output"
else
  echo "Generating voice response..."
fi

eval $CMD
exit 0
