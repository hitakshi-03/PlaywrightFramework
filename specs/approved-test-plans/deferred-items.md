# Deferred and Rejected Scenario Register

**Record type:** Review disposition, not an executable test plan.  
**Status:** No item below is approved for implementation.

| Source ID / topic | Disposition | Priority / layer if later approved | Reason and required input |
|---|---|---|---|
| `SHOP-006` combined search/category/price filtering | Deferred | P2 / UI regression | Whether filters combine, override, or reset is unknown. Resolve `TBC-008`. |
| `SHOP-008` repeated product add | Deferred | P2 / UI regression | Cart count (units vs distinct products) and quantity aggregation unknown. Resolve `TBC-007`; cart isolation/cleanup also required. |
| `CART-004` empty cart | Deferred | P2 / UI regression | Empty UI and a reliable empty-cart setup/reset are unknown. Resolve `TBC-010` and `TBC-011`. |
| `CART-005` edit/remove line item | Deferred / not evidenced | Deferred / UI regression | No edit/remove controls were observed. Re-plan only if direct inspection confirms them (`TBC-012`). |
| `CHECKOUT-001` Place Order | Rejected from executable plan; retained as discovery note | Deferred / UI only after safety approval | Never submit during discovery. Need a safe environment, side-effect contract, cleanup, and explicit owner approval (`TBC-001`, `TBC-013`, `TBC-014`). The control's presence is not an order-flow test. |
| Registration / password recovery / MFA / profile | Deferred / not evidenced | To be prioritized after confirmation | No link/route confirmed (`TBC-004`). |
| Product details / variants / inventory | Deferred / not evidenced | To be prioritized after confirmation | No detail action/route confirmed (`TBC-005`). |
| Order confirmation/history/cancel | Deferred / not evidenced | To be prioritized after confirmation | No route/outcome confirmed; order submission has potential side effects (`TBC-013`, `TBC-014`). |
| API client and API scenarios | Deferred | API only after contract review | No reviewed, supported API contract or approved API scenario IDs exist. API endpoint inventory/base URL, authentication method, request/response/error schemas, and test-data setup, isolation, side effects, and cleanup policy are all **To Be Confirmed** (`TBC-015`; the approved test/staging environment is also unknown). |
| Practice-specific forms, alerts, frame, dropdown, calendar, table, mouse interactions | Deferred beyond navigation | UI regression after discovery | Only navigation labels/paths were observed; page behavior is not established (`TBC-016`). |
| Invalid/empty login error copy and lockout handling | Deferred assertion detail | P1/P2 / UI regression | Assert only “not authenticated” in current candidates; exact copy, retry, and lockout rules require owner input (`TBC-003`). |
| Product search match semantics and empty-state message | Deferred assertion detail | P2 / UI regression | Exact/partial/case/whitespace and empty-state behavior unresolved (`TBC-006`). |
| Price exact-boundary and cart arithmetic assertions | Deferred assertion detail | P1/P2 / UI regression | Inclusive/exclusive band boundaries, currency, rounding, taxes unknown (`TBC-009`). |
| UI state after network failure, loading, or empty product inventory | Deferred | P2 / UI regression | No error/loading/empty contract observed; define expected behavior before planning tests. |

## Duplicate / ID Conflict Disposition

- `PRACTICE-001` duplicates the home navigation scenario `NAV-001`; it is consolidated into `NAV-001`–`NAV-007`.
- `SHOP-006` / `SHOP-007` have conflicting meanings across the scenario catalog and structured plan. The canonical IDs and source crosswalk are documented in [index.md](./index.md).
- The structured plan's checkout item named a future test file despite prohibiting order submission; it is retained here only as an affordance discovery note.
- The `tests/smoke/opens-application.spec.ts` seed only opens `/`. It does not authenticate, establish cart contents, or guarantee a clean cart. No current scenario may treat it as doing so.
