# 🧠 MomentumHub — The "Just Put It in an Issue" Repo

> Yes, this repo used to be a beautiful React dashboard with charts and everything.
> Then Michael had a vision. We don't talk about the dashboard anymore.
> *(It's in `/archive/dashboard` if you miss it. She lived a good life.)*

---

This is the **one place** to dump ideas, track tasks, and stop losing thoughts to the void across 20+ workstreams. The rule is simple: **if it's not in an Issue, it doesn't exist.**

No DMs. No "hey can you remind me?" No sticky notes. Just Issues. Beautiful, searchable, taggable Issues.

## ⚡ Capture an Idea Right Now

```bash
export GITHUB_TOKEN=ghp_your_token_here

python3 capture.py "That thing I thought of in the shower" --project etf-analysis --priority high
```

It'll push it straight to GitHub as an Issue. You're welcome, future-Michael.

## 📋 Create an Issue the Normal Way

Hit **New Issue** on GitHub and pick the **💡 Idea → Task** template. It works for everything: half-baked idea, concrete task, bug, random data dump — no judgment.

## �️ Live Dashboard

**[mphinance.github.io/momentum-hub](https://mphinance.github.io/momentum-hub/)** — see all open issues across every repo, live, in a dark-mode dashboard. Add a GitHub token in the banner for private repos.


## �🗂️ Repo Layout

```
├── CLAUDE.md              ← AI instructions (seriously, read it)
├── capture.py             ← CLI: brain dump → GitHub Issue
├── docs/
│   └── PROJECT_BOARD_SETUP.md  ← Board setup guide
├── .github/ISSUE_TEMPLATE/
│   └── idea-to-task.md         ← Universal issue template
└── archive/dashboard/          ← RIP the old watchlist app 🕯️
```

## 🤖 For AI Assistants (hi Claude 👋)

Read [CLAUDE.md](CLAUDE.md) before doing anything. It explains the whole workflow, what to do when Michael creates an issue, and how to move cards on the project board. The #1 rule: **search Issues before asking Michael anything.**

## License

[MIT](LICENSE) — take whatever you want, we're too busy shipping to care.
