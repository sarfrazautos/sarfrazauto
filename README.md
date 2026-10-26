# Sarfraz Autos — Project Architecture & Workflow

Website + Wholesale Portal + Admin Business Management Software
Wholesale Motorcycle Spare Parts Distributor

---

## 1. High-Level Structure

```
sarfraz-autos/
│
├── Home Page (Landing)
│   └── Hero Section
│       ├── [Button] Retail Shop        ──▶ goes to Retail Flow
│       ├── [Button] Wholesale Login    ──▶ goes to Wholesale Flow
│       └── [Button] Admin Login        ──▶ goes to Admin Flow
│
├── retail/
│   ├── product-listing/
│   │   ├── browse-by-category.js
│   │   └── browse-by-bike-model.js
│   ├── product-detail.js         (retail price shown)
│   ├── cart.js
│   ├── checkout.js
│   ├── order-status.js           (Pending → Confirmed → Processing → Dispatched → Completed/Cancelled)
│   └── order-history.js
│
├── wholesale/
│   ├── registration/
│   │   └── request-form.js       (Shop Name, Owner, Mobile, WhatsApp, City, Address, CNIC)
│   ├── pending-approval.js       (shown while Admin has not approved yet)
│   ├── login.js                  (only works after Admin approval)
│   ├── dashboard/
│   │   ├── overview.js
│   │   ├── products-wholesale-price.js
│   │   ├── schemes.js            (e.g. 10+1, auto-applied in cart)
│   │   ├── quick-order.js        (bulk add multiple products at once)
│   │   ├── cart.js
│   │   ├── orders/
│   │   │   ├── current-orders.js
│   │   │   └── previous-orders.js
│   │   ├── invoices.js
│   │   ├── ledger.js             (outstanding balance / khata)
│   │   ├── payment-history.js
│   │   └── profile.js
│
└── admin/
    ├── login.js                  (single admin account only — shared, no separate roles)
    ├── dashboard/
    │   ├── overview.js           (today's sales, purchases, low stock, new orders, cash/bank)
    │   ├── branch-wise-sales.js
    │   └── combined-all-branches-report.js
    │
    ├── branches/
    │   ├── add-edit-branch.js
    │   ├── deactivate-branch.js
    │   └── [branch-id]/
    │       ├── warehouse/                (Godam — stock physically stored here)
    │       │   ├── stock-list.js
    │       │   ├── stock-transfer.js     (move stock: Branch A godam → Branch B godam)
    │       │   └── low-stock-alerts.js
    │       ├── sales.js
    │       ├── purchases.js
    │       ├── customers.js
    │       ├── suppliers.js
    │       ├── expenses.js
    │       ├── cash.js
    │       └── bank.js
    │
    ├── products/
    │   ├── add-edit-product.js   (name, part number, brand, model compatibility,
    │   │                          purchase price, wholesale price, retail price)
    │   └── set-schemes.js
    │
    ├── wholesale-requests/
    │   └── accept-reject-pending.js
    │
    ├── orders/
    │   ├── retail-orders.js
    │   └── wholesale-orders.js
    │
    ├── suppliers/
    │   ├── supplier-profile.js   (contact, address, location-on-file)
    │   └── supplier-ledger.js    (purchases, payments, outstanding, aging)
    │
    ├── customers/
    │   └── customer-ledger.js    (invoices, sales, payments, returns, balance, aging)
    │
    ├── aging-reports/
    │   ├── customer-receivables.js   (0–7 / 8–15 / 16–27 / 28+ days)
    │   └── supplier-payables.js      (due / overdue / days outstanding)
    │
    ├── reports/
    │   ├── sales-reports.js      (daily, monthly, branch-wise, product-wise, customer-wise)
    │   ├── purchase-report.js
    │   ├── stock-report.js
    │   ├── profit-loss.js
    │   ├── cash-report.js
    │   ├── expense-report.js
    │   ├── payment-report.js
    │   └── export-excel-pdf.js
    │
    ├── whatsapp-integration/
    │   └── notifications.js      (order confirmation, status updates → customer + admin)
    │
    └── ai-search/
        └── product-search.js     (natural language → matching products; scope TBD)
```

---

## 2. Role Behavior Summary

| Role | Can Upload Products? | Can Sell? | Needs Approval? | Sees Prices |
|---|---|---|---|---|
| **Retail Customer** | ❌ No | ❌ No (buys only) | No | Retail Price |
| **Wholesale Customer** | ❌ No | ❌ No (buys only) | ✅ Yes, by Admin | Wholesale Price + Schemes |
| **Admin** | ✅ Yes | — (manages everything) | — (single account) | Sees all |

> Not a marketplace (unlike Daraz/OLX) — only Admin lists products. Both customer types can only purchase.

---

## 3. Branch & Warehouse (Godam) Structure

Each branch is fully self-contained and includes its own **warehouse (godam)**:

```
Branch (e.g. Branch A)
│
├── Warehouse / Godam         ← physical stock storage for this branch
│   ├── Stock List
│   ├── Minimum Stock Alerts
│   └── Stock Transfer (to/from other branches' godams)
│
├── Sales
├── Purchases
├── Customers
├── Suppliers
├── Expenses
├── Cash
└── Bank
```

Admin can view each branch's godam individually, **or** see combined stock across all branches/godams from one dashboard.

---

## 4. Core Workflows

### Retail Flow
```
Home → Retail Shop → Browse Products → Add to Cart → Checkout
     → Order Placed → Status Tracking → WhatsApp Confirmation
```

### Wholesale Flow
```
Home → Wholesale Login → (First time?) → Registration Form
     → Status: Pending → Admin Reviews → Accept / Reject
     → (If Accepted) Login → Dashboard → Wholesale Prices + Schemes
     → Quick Order / Cart → Checkout → Ledger Updated → WhatsApp Confirmation
```

### Admin Flow
```
Home → Admin Login → Dashboard
     → Manage Products → Manage Branches & Godams
     → Approve/Reject Wholesale Requests
     → Track Orders (Retail + Wholesale separately)
     → Manage Customer & Supplier Ledgers
     → View Aging Reports
     → Generate Reports (Excel/PDF export)
```

---

## 5. Key Business Rules

- **Schemes**: e.g. "10+1" = buy 10 units, get 1 free — set by Admin per product, auto-applied at checkout.
- **Ledger (Khata)**: tracks Debit (customer buys → owes more) vs Credit (customer pays → owes less), running balance per customer/supplier.
- **Aging Reports**: shows how many days a payment has been outstanding (0–7 / 8–15 / 16–27 / 28+ days) for customers, and due/overdue days for suppliers.
- **Supplier Location**: stored as address/location on file (one-time capture, like a location-permission popup) — **not** continuous live GPS tracking.
- **Payments**: Phase 1 is manual entry only (cash/bank/cheque) — online gateway (JazzCash/Easypaisa) blocked for now due to merchant account approval difficulty for small businesses.
- **WhatsApp**: via official Business API (Twilio/Gupshup/Wati) — has its own separate recurring monthly cost, not included in dev fee.
- **Admin Access**: single shared login only — no separate staff roles (Branch Manager, Sales Staff, etc.) in this scope.

---

## 6. Open Items to Confirm with Client

- [ ] AI search — get 2–3 real example queries from client before building
- [ ] WhatsApp API provider — which one, who pays the monthly subscription
- [ ] Does retail registration also need admin approval, or wholesale only?
- [ ] Existing product data to migrate, or starting fresh?
- [ ] Branding assets (logo, colors, reference content)

---

## 7. Phases (from Proposal)

| Phase | Scope | Timeline |
|---|---|---|
| Phase 1 | Core website + retail/wholesale ordering + basic admin | 1–2 weeks |
| Phase 2 | Multi-branch (incl. godam), ledger, aging reports, full reporting | 2–3 weeks |
| Phase 3 | WhatsApp API, AI search, testing, handover | 1–2 weeks |

**Total: 5–7 weeks**


===========
