# 2C2P Admin Plugin (fe-admin)

Admin-side surface for the 2C2P ASEAN payment gateway.

## Routes

| Path | Purpose |
|------|---------|
| `/admin/c2p2/transactions` | 2C2P transactions list with refund action |

## Store

`useC2P2Store` — Pinia. Holds the transaction list and exposes
`fetchTransactions(api)` and `refund(invoiceNo, amount, api)`.

## Config

2C2P merchant credentials are surfaced by the core **Settings →
Plugins → 2C2P** page, driven by the backend plugin's
`admin-config.json`. This plugin doesn't duplicate that UI.

## Backend

Pairs with [`vbwd-plugin-c2p2`](https://github.com/VBWD-platform/vbwd-plugin-c2p2).
Calls:
- `GET /api/v1/plugins/c2p2/transactions` — list
- `POST /api/v1/plugins/c2p2/payments/:invoice/refund` — refund

## Testing

```bash
cd vbwd-fe-admin
npm run test
```

---

## Related

| | Repository |
|-|------------|
| 🗄 Backend | [vbwd-plugin-c2p2](https://github.com/VBWD-platform/vbwd-plugin-c2p2) |
| 👤 User | [vbwd-fe-user-plugin-c2p2](https://github.com/VBWD-platform/vbwd-fe-user-plugin-c2p2) |

**Core:** [vbwd-fe-admin](https://github.com/VBWD-platform/vbwd-fe-admin)
