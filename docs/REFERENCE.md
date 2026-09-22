# Command reference

Use `node bin/roast.js` from the pinned source checkout described in the [README](../README.md). The entries below describe the inspected implementation.

| Command or argument | Behavior |
| --- | --- |
| `--author EMAIL` | Analyze one author; defaults to git config user.email. |
| `--team` | Analyze up to ten authors ranked by commit count. |
| `--json` | Emit underlying statistics instead of humorous prose. |
| `(no flags)` | Read Git history and local reflog without rewriting either. |

For prerequisites, file writes, external services and known limitations, see [Behavior and limits](../README.md#behavior-and-limits).

Implementation: [bin/roast.js](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/bin/roast.js), [src/analyzer.js](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/src/analyzer.js); [review evidence](RESEARCH.md).
