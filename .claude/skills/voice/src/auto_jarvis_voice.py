#!/usr/bin/env python3
"""
Jarvis Voice Generator
Uses OpenAI's text-to-speech API to generate voice responses.
"""

import argparse
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed. Run: pip install openai")
    sys.exit(1)


def generate_voice(
    text: str,
    voice: str = "echo",
    model: str = "tts-1",
    format: str = "mp3",
    speed: float = 1.0,
    output_dir: str = "./output",
    api_key: str = None,
    autoplay: bool = False,
    max_length: int = 1000,
) -> str:
    """Generate voice audio from text using OpenAI TTS."""

    # Truncate if needed
    if len(text) > max_length:
        text = text[:max_length] + "..."
        print(f"Warning: Text truncated to {max_length} characters")

    # Initialize client
    client = OpenAI(api_key=api_key)

    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_text = "".join(c if c.isalnum() or c == " " else "" for c in text[:30])
    safe_text = safe_text.replace(" ", "_")
    filename = f"jarvis_{timestamp}_{safe_text}.{format}"
    output_path = Path(output_dir) / filename

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Generate speech
    print(f"Processing: {len(text)} chars")

    response = client.audio.speech.create(
        model=model,
        voice=voice,
        input=text,
        speed=speed,
        response_format=format,
    )

    # Save to file
    response.stream_to_file(str(output_path))
    print(f"Audio saved: {output_path}")

    # Autoplay on macOS
    if autoplay and sys.platform == "darwin":
        subprocess.run(["afplay", str(output_path)], check=False)

    return str(output_path)


def main():
    parser = argparse.ArgumentParser(description="Generate voice using OpenAI TTS")
    parser.add_argument("text", help="Text to convert to speech")
    parser.add_argument("--voice", default="echo", help="Voice: alloy, echo, fable, onyx, nova, shimmer")
    parser.add_argument("--model", default="tts-1", help="Model: tts-1, tts-1-hd")
    parser.add_argument("--format", default="mp3", help="Format: mp3, opus, aac, flac, wav")
    parser.add_argument("--speed", type=float, default=1.0, help="Speed: 0.25-4.0")
    parser.add_argument("--output-dir", default="./output", help="Output directory")
    parser.add_argument("--api-key", help="OpenAI API key")
    parser.add_argument("--autoplay", action="store_true", help="Auto-play audio on macOS")
    parser.add_argument("--max-length", type=int, default=1000, help="Max text length")
    parser.add_argument("--json-output", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: No API key provided")
        sys.exit(1)

    output_path = generate_voice(
        text=args.text,
        voice=args.voice,
        model=args.model,
        format=args.format,
        speed=args.speed,
        output_dir=args.output_dir,
        api_key=api_key,
        autoplay=args.autoplay,
        max_length=args.max_length,
    )

    if args.json_output:
        import json
        print(json.dumps({"path": output_path, "success": True}))


if __name__ == "__main__":
    main()
