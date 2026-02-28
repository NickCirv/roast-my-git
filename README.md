# roast-my-git

Your git habits, mercilessly analyzed. Night commits, Friday afternoon deploys, `wip` messages — it sees everything.

<p align="center">
  <img src="https://img.shields.io/npm/v/roast-my-git.svg" alt="npm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="node >= 18" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
</p>

## Why

Code reviews catch bad code. Nothing catches bad git habits — until now. `roast-my-git` analyzes your full commit history and produces a no-mercy report on when you commit (2am?), how often you use conventional messages, how long your streaks last, your most active day, your branch naming style, and your biggest single-commit blast radius.

## Quick Start

```bash
npx roast-my-git
```

Run from any git repository. Analyzes the author matching your git config by default.

## What It Analyzes

- **Commit timing** — hour-by-hour breakdown; flags night commits (10pm–4am), morning, afternoon, evening counts
- **Weekend commits** — counts and percentage of commits on Saturday/Sunday
- **Friday afternoon commits** — specifically tracks 2pm–6pm Friday pushes
- **Monday commits** — because Monday is when damage gets cleaned up
- **Conventional commit compliance** — percentage of commits following `feat/fix/docs/chore/etc.:` format
- **Commit message quality** — average message length; short message percentage (4 chars or fewer)
- **Longest streak** — consecutive days with at least one commit
- **Commit frequency** — commits per day and per week over the repo lifetime
- **Biggest single commit** — largest line change count in one commit (your blast radius record)
- **Average commit size** — lines changed per commit
- **Branch naming style** — detects whether you use kebab-case, snake_case, or camelCase
- **Merge commit ratio** — percentage of commits that are merges (merge vs rebase preference)
- **Force push count** — detected from git reflog

## Example Output

```
  roast-my-git
  Analyzing nick@example.com

  ────────────────────────────────────────────────────────────
  Total commits        347
  Commits per week     4.2
  Longest streak       12 days
  Active since         847 days

  Timing
  Most active hour     11pm  (night owl detected)
  Most active day      Wednesday
  Night commits        42  (12%)  — you live dangerously
  Weekend commits      31  (9%)
  Friday PM commits    8   (2%)   — classic

  Message Quality
  Conventional         61%  — room to grow
  Short messages       23   (7%)  — "wip", "fix", "x" count here
  Avg message length   38 chars

  Commit Size
  Average size         84 lines/commit
  Biggest single       1,204 lines  — that's a war crime

  Style
  Branch naming        kebab-case
  Merge commits        18%
  Force pushes         3   — you monster

  ────────────────────────────────────────────────────────────
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--author <email>` | Analyze a specific author | git config user.email |
| `--team` | Analyze all authors (top 10) | off |

## Install Globally

```bash
npm i -g roast-my-git
```

## License

MIT
