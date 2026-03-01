---
name: "💡 Idea → Task"
description: "Capture an idea, data dump, bug, or task — one template for everything."
title: "[IDEA] "
labels: ["idea"]
body:
  - type: markdown
    attributes:
      value: |
        ## Quick Capture
        Use this template for any kind of input — a half-baked idea, a link you want to save, a bug you noticed, or a concrete task. Fill in what's relevant; skip what's not.

  - type: dropdown
    id: type
    attributes:
      label: "Type"
      description: "What kind of item is this?"
      options:
        - Idea
        - Task
        - Bug
        - Data Dump
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: "Priority"
      description: "How urgent is this?"
      options:
        - Low
        - Medium
        - High
        - Urgent
    validations:
      required: false

  - type: dropdown
    id: project
    attributes:
      label: "Related Project"
      description: "Which workstream does this belong to?"
      options:
        - momentum-hub (this repo)
        - csp-scanner
        - etf-analysis
        - etf-dashboard
        - portfolio-tracker
        - options-flow
        - macro-signals
        - sector-rotation
        - earnings-tracker
        - dividend-screener
        - risk-parity
        - alpha-research
        - backtest-engine
        - data-pipeline
        - ml-models
        - trade-journal
        - market-monitor
        - news-sentiment
        - factor-model
        - volatility-lab
        - other (specify in context)
    validations:
      required: false

  - type: textarea
    id: context
    attributes:
      label: "Context / Data"
      description: "Paste links, code snippets, data, screenshots, or raw thoughts here."
      placeholder: |
        - Link: https://example.com/interesting-article
        - Data snippet: KYLD weight is showing 0% but should be ~2.3%
        - Thought: What if we combined momentum + quality factors?
    validations:
      required: false

  - type: textarea
    id: action_items
    attributes:
      label: "Action Items"
      description: "What needs to happen next? Use a checklist."
      placeholder: |
        - [ ] Research the approach
        - [ ] Build a prototype
        - [ ] Write tests
        - [ ] Deploy to staging
    validations:
      required: false

  - type: textarea
    id: notes
    attributes:
      label: "Additional Notes"
      description: "Anything else — related issues, deadlines, who should look at this."
      placeholder: "Related to #42. Would be great to have by end of sprint."
    validations:
      required: false
---
