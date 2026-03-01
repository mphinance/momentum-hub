# MomentumHub — AI Knowledge Base

> This file tells Claude Code (and any AI assistant) how this repository works.
> Read it fully before taking any action in this repo.

---

## 1. What Is This Repo?

**MomentumHub** is a unified Task Tracker for 20+ workstreams.
GitHub **Issues** and **Projects (v2)** are the single source of truth for ideas, tasks, bugs, and data dumps.

Michael (the lead) is the primary source of ideas and data.
When he creates an issue it is either a **Live Idea** (something to explore or build) or a **Data Dump** (raw links, snippets, or analysis to be organized later).

---

## 2. The Golden Rule — Search Before You Ask

> **Before asking Michael "can you remind me…?" or "what was that thing…?",
> search the Issues and Projects first.**

Concrete steps:

1. Search **open issues** by keyword.
2. Check the **Project board** columns (Backlog → Active → Review → Done).
3. Look at **closed issues** — the answer may already exist.
4. Only if nothing relevant is found, ask Michael.

This rule exists so that no idea is ever lost and no one has to repeat themselves.

---

## 3. Workflow

```
Michael has an idea or data
        │
        ▼
  Creates a GitHub Issue
  (uses the "Idea → Task" template)
        │
        ▼
  Issue lands in Project board → "Backlog"
        │
        ▼
  Dev picks it up → moves card to "Active"
        │
        ▼
  Work happens (branches, PRs, commits reference the issue)
        │
        ▼
  PR opened → card moves to "Review"
        │
        ▼
  PR merged / issue closed → card moves to "Done"
```

### Status updates — what Claude should do

| When this happens…                  | Do this                                         |
|--------------------------------------|--------------------------------------------------|
| You start working on an issue        | Move the Project card to **Active**              |
| You open a PR that addresses it      | Move the card to **Review**                      |
| The issue is fully resolved          | Close the issue; card auto-moves to **Done**     |
| You need more info from Michael      | Add a comment on the issue and tag `@mphinance`  |

---

## 4. Repo Layout

```
momentum-hub/
├── CLAUDE.md                          ← You are here
├── README.md                          ← Repo overview & quick start
├── capture.py                         ← CLI to create issues from the terminal
├── requirements.txt                   ← Python deps for capture.py
├── docs/
│   └── PROJECT_BOARD_SETUP.md         ← How to configure the GitHub Project board
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── idea-to-task.md            ← Universal issue template
└── archive/
    └── dashboard/                     ← Original watchlist/dashboard app (preserved)
```

---

## 5. Labels & Taxonomy

| Label          | Meaning                                  |
|----------------|------------------------------------------|
| `idea`         | A raw idea or exploration prompt         |
| `task`         | A concrete, actionable work item         |
| `bug`          | Something broken that needs fixing       |
| `data-dump`    | Raw links, data, or analysis to organize |
| `priority:low` | Nice to have                             |
| `priority:med` | Should be done soon                      |
| `priority:high`| Do this next                             |
| `priority:urgent` | Drop everything                      |

---

## 6. How to Use `capture.py`

Quick-push an idea from the terminal:

```bash
# Simple idea
python capture.py "Explore momentum factor weighting" --project etf-analysis

# Data dump with high priority
python capture.py "KYLD holdings data is stale" --type data-dump --priority high

# Run with --help for all options
python capture.py --help
```

Requires `GITHUB_TOKEN` environment variable with `repo` scope.

---

## 7. Tone & Philosophy

- **Helpful and organized**, never restrictive.
- The goal is to make documenting things so easy that nobody ever has to ask "can you remind me?"
- When in doubt, **create an issue** — it's cheap and searchable.
- Prefer action over process. If something is faster to just do, do it and log it afterward.
