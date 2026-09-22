# Source review — roast-my-git

## Revision and method

Inspected public commit: [`3916336bd2dd124e89f1abfac438c4a02dcd9d93`](https://github.com/NickCirv/roast-my-git/commit/3916336bd2dd124e89f1abfac438c4a02dcd9d93). Source tree: `0e3cc33f06dd2fa31da6d98d38d04c48327adc1d`. Capture scope: all eligible text files; 6 of 6 eligible files.

This review read captured implementation and documentation. It did not install dependencies, execute project commands, call project APIs, check package publication or establish live CI status. Examples are source-derived, not captured execution transcripts.

## Claim ledger

| Claim | Evidence | Status |
| --- | --- | --- |
| CLI author/team/JSON modes | [bin/roast.js](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/bin/roast.js) | Verified in inspected source; execution unverified |
| Git queries and reflog heuristic | [src/analyzer.js](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/src/analyzer.js) | Verified in inspected source; execution unverified |

## Findings and verification gaps

These statistics are not a productivity or wellbeing assessment. Local reflog force-push heuristics are not a complete remote history and are not author-specific in the same way as the commit query. Squashing, rebasing, aliases and shallow history can skew results.

The package test only prints help and was not executed. It provides no behavioral coverage of Git statistics.

| Dimension | Result |
| --- | --- |
| Purpose and documented commands | Partially verified: static source inspection |
| Clean installation and examples | Unverified |
| Test suite and live CI | Unverified |
| Performance and security guarantees | Unverified |
| Publication | Local documentation only |

## Documentation inventory

- [README.md](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/README.md) — Rewritten; historic section anchors retained where practical.
- [LICENSE](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/LICENSE) — protected document preserved unchanged.

## Captured source inventory

- [LICENSE](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/LICENSE) — Git blob `05b804beeec7d1a6c933d087387ba4adf6463d93`.
- [README.md](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/README.md) — Git blob `6f0982495d01116755875831ffd9314ece3f5b23`.
- [package.json](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/package.json) — Git blob `9b4f84e5ab518b4eb02c8121d5d42f3daa8c5949`.
- [.github/workflows/ci.yml](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/.github/workflows/ci.yml) — Git blob `44515034a394670de44454a7a1bd2c7ef0c9836e`.
- [bin/roast.js](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/bin/roast.js) — Git blob `71361b006a11b6b6b33a1ee3f74e091a9d3bda40`.
- [src/analyzer.js](https://github.com/NickCirv/roast-my-git/blob/3916336bd2dd124e89f1abfac438c4a02dcd9d93/src/analyzer.js) — Git blob `f575050cfd2b3ce120541a16e7c368afb7ade5e3`.

## Scope boundary

Capture excludes lockfiles, binary artwork, generated output, vendored dependencies and files above the acquisition size limit. The tree records their existence; no verification claim is made for omitted content. Protected documents and historical records are not replaced.

## Reference coverage

Added [command reference](REFERENCE.md) from the argument parser, command handlers and source-defined help at the pinned revision. README examples remain unexecuted.
