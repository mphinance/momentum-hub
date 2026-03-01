#!/usr/bin/env python3
"""
create_test_issues.py — One-time script to create the 2 test issues:
  1. traders-anon/trader-social — open issue from dashboard
  2. mphinance/momentum-hub     — watchlist fix issue from screenshot

Usage:
    GITHUB_TOKEN=ghp_... python3 create_test_issues.py
"""

import json
import os
import sys
from urllib import request as urllib_request
from urllib.error import HTTPError


def create_issue(token, repo, title, body, labels):
    url = f"https://api.github.com/repos/{repo}/issues"
    payload = json.dumps({"title": title, "body": body, "labels": labels}).encode()
    req = urllib_request.Request(url, data=payload, method="POST", headers={
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
    })
    try:
        with urllib_request.urlopen(req) as resp:
            result = json.loads(resp.read())
            print(f"  ✅  #{result['number']} — {result['title']}")
            print(f"      {result['html_url']}\n")
            return result
    except HTTPError as e:
        body_text = e.read().decode() if e.fp else ""
        print(f"  ❌  {repo}: {e.code} — {body_text}")
        return None


def main():
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("❌  Set GITHUB_TOKEN first.")
        sys.exit(1)

    print("\n🚀  Creating test issues...\n")

    # Issue 1 — trader-social: from the dashboard "open issue"
    create_issue(
        token=token,
        repo="traders-anon/trader-social",
        title="[TASK] Dashboard integration — track open issues via MomentumHub",
        body="""## Task

Set up the MomentumHub Issues Dashboard to track this repo.

### Context / Data

- Dashboard lives at: `momentum-hub/dashboard.html`
- Pulls open/closed issues from GitHub API in real-time
- Supports labels, priority chips, and per-repo collapsible views

### Action Items

- [ ] Confirm traders-anon/trader-social is added to the dashboard config
- [ ] Add a `GITHUB_TOKEN` with read access to the `dashboard.html` token field
- [ ] Verify issues from this repo appear in the Status view

### Related Project
`trader-social`
""",
        labels=["task"],
    )

    # Issue 2 — momentum-hub: watchlist fix from Trading_With_Art screenshot
    create_issue(
        token=token,
        repo="mphinance/momentum-hub",
        title="[IDEA] Fix Watchlist — make it actually useful",
        body="""## Live Idea

> "Aside from the number crunching can we use your brain to finalize the 'Watchlist'
> I hate how it's useless. Everything else is ready I cleaned up the legal as well.
> Updated the support page added a feedback form."
> — Trading_With_Art (Discord, 9:02 PM)

### Context / Data

The archived dashboard at `archive/dashboard/` has a watchlist component that was
described as "useless." The rest of the app is apparently in good shape (legal cleaned
up, support page updated, feedback form added). This is the last major feature gap.

### Action Items

- [ ] Review existing `archive/dashboard/src/components/Watchlist.tsx`
- [ ] Identify what's missing / broken vs. what would make it "useful"
- [ ] Design the improvement (better data, better UX, or both?)
- [ ] Implement and ship

### Related Project
`etf-dashboard`
""",
        labels=["idea", "priority:high"],
    )

    print("Done! Open dashboard.html in a browser to see them live.")


if __name__ == "__main__":
    main()
