# What-If Finance Static Market Snapshot Bundle

This directory is the isolated publish bundle for public, sanitized market snapshots consumed by What-If Finance and compatible learning surfaces.

Files:

- `static-market-snapshot-manifest.json`
- `whatif-market-snapshot-sample.json`

Publish rules:

- Serve as static HTTPS files only.
- Do not put this behind Glint admin, broker, Kite/Zerodha, VPS-private, cookie-authenticated, or account-linked routes.
- Do not add user-imported CSV, orders, positions, holdings, funds, account IDs, bot state, private logs, or tokens.
- Keep app behavior resilient: the app must still work with bundled fallback data if this endpoint fails.

Verification:

```sh
python3 tools/verify_static_market_snapshot.py build/static-public-market/what-if-finance/static-market-snapshot-manifest.json
```
