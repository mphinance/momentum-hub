#!/usr/bin/env python3
"""
capture.py — Quick idea capture → GitHub Issue.

Push a thought from your terminal straight into a GitHub Issue.

Usage:
    python capture.py "Fix the ETF weight bug" --project csp-scanner --priority high
    python capture.py "Look into KYLD data" --type data-dump
    python capture.py "Explore momentum factor weighting"

Requires:
    GITHUB_TOKEN env var with `repo` scope.
    GITHUB_REPO   env var (optional, defaults to mphinance/momentum-hub).
"""

import argparse
import json
import os
import sys
from urllib import request as urllib_request
from urllib.error import HTTPError

# ── Defaults ──────────────────────────────────────────────────────────────────

DEFAULT_REPO = "mphinance/momentum-hub"

VALID_TYPES = ["idea", "task", "bug", "data-dump"]
VALID_PRIORITIES = ["low", "medium", "high", "urgent"]

PROJECTS = [
    "momentum-hub", "csp-scanner", "etf-analysis", "etf-dashboard",
    "portfolio-tracker", "options-flow", "macro-signals", "sector-rotation",
    "earnings-tracker", "dividend-screener", "risk-parity", "alpha-research",
    "backtest-engine", "data-pipeline", "ml-models", "trade-journal",
    "market-monitor", "news-sentiment", "factor-model", "volatility-lab",
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_token() -> str:
    """Return the GitHub token or exit with a helpful message."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("❌  GITHUB_TOKEN environment variable is not set.")
        print("   Create a token at https://github.com/settings/tokens")
        print("   with 'repo' scope and export it:")
        print("     export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx")
        sys.exit(1)
    return token


def get_repo() -> str:
    """Return the target repo in 'owner/repo' format."""
    return os.environ.get("GITHUB_REPO", DEFAULT_REPO)


def build_body(title: str, issue_type: str, priority: str | None, project: str | None) -> str:
    """Build the Markdown body for the issue."""
    lines = []

    lines.append(f"## {issue_type.replace('-', ' ').title()}")
    lines.append("")
    lines.append(f"> {title}")
    lines.append("")

    if project:
        lines.append(f"**Related Project:** `{project}`")
        lines.append("")

    if priority:
        emoji = {"low": "🟢", "medium": "🟡", "high": "🟠", "urgent": "🔴"}.get(priority, "⚪")
        lines.append(f"**Priority:** {emoji} {priority.title()}")
        lines.append("")

    lines.append("### Context / Data")
    lines.append("")
    lines.append("_Captured via `capture.py` CLI._")
    lines.append("")

    lines.append("### Action Items")
    lines.append("")
    lines.append("- [ ] Triage and refine this item")
    lines.append("")

    return "\n".join(lines)


def build_labels(issue_type: str, priority: str | None) -> list[str]:
    """Build the list of labels for the issue."""
    labels = [issue_type]
    if priority:
        labels.append(f"priority:{priority}")
    return labels


def create_issue(
    token: str,
    repo: str,
    title: str,
    body: str,
    labels: list[str],
) -> dict:
    """Create a GitHub issue via the REST API. Returns the JSON response."""
    url = f"https://api.github.com/repos/{repo}/issues"
    payload = json.dumps({
        "title": title,
        "body": body,
        "labels": labels,
    }).encode("utf-8")

    req = urllib_request.Request(
        url,
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )

    try:
        with urllib_request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except HTTPError as exc:
        error_body = exc.read().decode("utf-8") if exc.fp else ""
        print(f"❌  GitHub API error ({exc.code}): {error_body}")
        sys.exit(1)


# ── CLI ───────────────────────────────────────────────────────────────────────

def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        prog="capture",
        description="⚡ Quick idea capture → GitHub Issue",
        epilog="Examples:\n"
               "  python capture.py \"Fix the ETF weight bug\" --project csp-scanner --priority high\n"
               "  python capture.py \"Look into KYLD data\" --type data-dump\n"
               "  python capture.py \"Explore momentum weighting\"\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "title",
        help="The idea, thought, or task to capture (becomes the issue title).",
    )
    parser.add_argument(
        "--type", "-t",
        dest="issue_type",
        choices=VALID_TYPES,
        default="idea",
        help="Type of item (default: idea).",
    )
    parser.add_argument(
        "--priority", "-p",
        choices=VALID_PRIORITIES,
        default=None,
        help="Priority level (default: none).",
    )
    parser.add_argument(
        "--project", "-P",
        choices=PROJECTS,
        default=None,
        help="Related workstream / project.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be created without calling the API.",
    )

    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    """Entry point."""
    args = parse_args(argv)
    token = get_token()
    repo = get_repo()

    issue_title = f"[{args.issue_type.upper()}] {args.title}"
    body = build_body(args.title, args.issue_type, args.priority, args.project)
    labels = build_labels(args.issue_type, args.priority)

    if args.dry_run:
        print("── DRY RUN ──────────────────────────────────────")
        print(f"  Repo:   {repo}")
        print(f"  Title:  {issue_title}")
        print(f"  Labels: {', '.join(labels)}")
        print(f"  Body:\n{body}")
        print("─────────────────────────────────────────────────")
        return

    print(f"⚡ Creating issue in {repo}…")
    result = create_issue(token, repo, issue_title, body, labels)

    print(f"✅  Issue #{result['number']} created!")
    print(f"    {result['html_url']}")


if __name__ == "__main__":
    main()
