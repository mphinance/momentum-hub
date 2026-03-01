import os
import sys
from datetime import datetime

DIARY_PATH = "Gemini.md"

def sync_diary(status=None, next_task=None, done=None, raw_text=None):
    """
    Consolidates terminal insights/logs into Gemini.md using token-efficient labeling.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M UTC")
    
    entry = f"\n### {timestamp}\n"
    if status: entry += f"- [STATUS]: {status}\n"
    if done:   entry += f"- [DONE]: {done}\n"
    if next_task: entry += f"- [NEXT]: {next_task}\n"
    if raw_text: entry += f"- [LOG]: {raw_text}\n"

    if not os.path.exists(DIARY_PATH):
        with open(DIARY_PATH, "w") as f:
            f.write("## Dev Log\n")

    with open(DIARY_PATH, "a") as f:
        f.write(entry)
    
    print(f"Synced entry to {DIARY_PATH}")

if __name__ == "__main__":
    # Simple CLI wrapper for OpenClaw to use
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--status")
    parser.add_argument("--done")
    parser.add_argument("--next")
    parser.add_argument("--text")
    args = parser.parse_args()
    
    sync_diary(status=args.status, next_task=args.next, done=args.done, raw_text=args.text)
