# GitHub Project Board Setup Guide

This document walks you through creating the MomentumHub project board on GitHub Projects (v2).

---

## 1. Create the Project

1. Go to **github.com → Your profile → Projects → New project**.
2. Choose **"Board"** as the template (you can change views later).
3. Name it: **MomentumHub Tracker**.
4. Set visibility to match your repo (Private recommended).

---

## 2. Add Custom Fields

Open **Project settings → Custom fields** and create:

| Field Name | Type            | Options                                                                 |
|------------|-----------------|-------------------------------------------------------------------------|
| Status     | Single select   | `Backlog`, `Active`, `Review`, `Done`                                   |
| Priority   | Single select   | `Low`, `Medium`, `High`, `Urgent`                                       |
| Project    | Single select   | One option per workstream (see list below)                              |
| Type       | Single select   | `Idea`, `Task`, `Bug`, `Data Dump`                                      |

### Workstream list for the "Project" field

Add one option for each of your active workstreams:

```
momentum-hub, csp-scanner, etf-analysis, etf-dashboard,
portfolio-tracker, options-flow, macro-signals, sector-rotation,
earnings-tracker, dividend-screener, risk-parity, alpha-research,
backtest-engine, data-pipeline, ml-models, trade-journal,
market-monitor, news-sentiment, factor-model, volatility-lab
```

> **Tip:** You can add more workstreams at any time without breaking anything.

---

## 3. Create Views

### View 1: Status Board

1. Click **"+ New view" → Board**.
2. Name it **Status**.
3. Set **Column field** = `Status`.
4. You'll get four columns: Backlog | Active | Review | Done.
5. Drag-and-drop cards between columns as work progresses.

### View 2: Roadmap by Project

1. Click **"+ New view" → Table** (or Board).
2. Name it **Roadmap**.
3. **Group by** = `Project`.
4. **Sort by** = `Priority` (descending).
5. This gives you a per-workstream breakdown of everything in flight.

### View 3: My Queue (optional)

1. Click **"+ New view" → Table**.
2. Name it **My Queue**.
3. **Filter**: `assignee:@me status:Active,Review`.
4. **Sort by** = `Priority`.

---

## 4. Automation (Built-in Workflows)

Go to **Project settings → Workflows** and enable:

| Workflow                          | What it does                                      |
|-----------------------------------|---------------------------------------------------|
| **Item added to project**         | Sets status to `Backlog` automatically            |
| **Item closed**                   | Moves status to `Done`                            |
| **Pull request merged**           | Moves status to `Done`                            |
| **Item reopened**                  | Moves status back to `Active`                     |

---

## 5. Link the Repo

1. In the project, click **"+ Add items"**.
2. Search for the `momentum-hub` repo.
3. Bulk-add existing issues, or just let new issues flow in via the template.

---

## 6. Using the `gh` CLI (Optional)

If you prefer the terminal:

```bash
# List your projects
gh project list

# View project items
gh project item-list <PROJECT_NUMBER> --owner @me

# Add an issue to the project
gh project item-add <PROJECT_NUMBER> --owner @me --url <ISSUE_URL>
```

---

## Quick Reference

```
New idea → Create Issue (template) → Lands in Backlog
           Pick it up              → Move to Active
           Open PR                 → Move to Review
           Merge / Close           → Auto-moves to Done
```

That's it. Keep it simple, keep it moving. 🚀
