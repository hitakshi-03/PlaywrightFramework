# Cart Management Candidate Plan

> **Status: APPROVED — GENERATOR MAY USE THIS DEFINED SCOPE**  
> **Approver:** mr.reviewer  
> **Approval date:** 22 Nov 2026

## Scope and Priority

Cart scenarios mutate state and remain blocked from execution until environment, isolation, and cleanup are approved. Checkout submission is excluded.

| Scenario | Priority | Layer | Risk |
|---|---|---|---|
| `SHOP-007` Add one product / update cart count | P1 | UI smoke | High until cart scope is known |
| `CART-001` Review cart item and totals | P1 | UI regression | High until cart scope is known |
| `CART-002` Clear a populated cart | P1 | UI regression | High — destructive to cart contents |
| `CART-003` Return to Shopping | P2 | UI regression | Low |

## SHOP-007 — Add One Product

- **Goal:** Add a selected product to the user's cart.
- **Preconditions:** Authenticated approved non-production environment; isolated cart confirmed empty using an owner-approved setup/reset mechanism.
- **Steps:** Select one product card's Add to Cart action; inspect its visible quantity indicator and header cart count.
- **Expected result:** The selected product is added; count/indicator changes consistently with one added unit. Do not generalize count semantics beyond the one-add case.
- **Data:** One product currently visible in the catalog.
- **Cleanup:** Use the approved Clear Cart cleanup only after confirming state scope. Otherwise stop and report cleanup blocker. Never use Place Order.
- **Evidence:** One add updated the count and product control in a prior observation; cart isolation/clean state remains `TBC-007` and `TBC-010`.

## CART-001 — Review Cart Item and Summary

- **Goal:** Confirm cart contents correspond to the product added.
- **Preconditions:** Approved non-production session with exactly one known product in the cart.
- **Steps:** Open the cart from its count control; inspect item, price, quantity, line total, and grand total.
- **Expected result:** Added product and its displayed fields are present. Exact arithmetic/currency/rounding assertions require `TBC-009`; no tax/discount behavior is assumed.
- **Data:** Product name and displayed price read from the current catalog.
- **Cleanup:** Approved Clear Cart procedure or disposable account/context; do not submit an order.
- **Evidence:** Cart columns were observed; sample arithmetic was previously displayed but does not establish a general pricing rule.

## CART-002 — Clear Populated Cart

- **Goal:** Remove cart contents using Clear Cart.
- **Preconditions:** Human-approved non-production environment; synthetic cart item; clear action's scope understood; cleanup owner approved.
- **Steps:** Select Clear Cart; inspect the cart and cart-count state.
- **Expected result:** Items are removed and the cart reflects the empty state. Exact empty copy, confirmation/undo, persistence, and scope remain `TBC-010`/`TBC-011`.
- **Data:** Disposable synthetic product selection.
- **Cleanup:** Verify empty state; close context. Never click Place Order.
- **Evidence:** Control observed; action outcome unverified.

## CART-003 — Return to Shopping

- **Goal:** Allow a user to resume browsing from the cart.
- **Preconditions:** Authenticated approved session on `/cart`.
- **Steps:** Select Back to Shopping.
- **Expected result:** Shopping catalog route `/shopping` is displayed.
- **Data:** None required.
- **Cleanup:** Close context; do not mutate cart.
- **Evidence:** Control observed; resulting route not freshly exercised.

## Deferred Cart Scenarios

- Empty-cart presentation (`CART-004`): exact UI and clean-state semantics unknown (`TBC-010`, `TBC-011`).
- Edit/remove controls (`CART-005`): no such controls observed (`TBC-012`).
- Repeated add (`SHOP-008`): count and aggregation semantics unresolved (`TBC-007`).
- Place Order (`CHECKOUT-001`): affordance only; never submit without explicit side-effect/environment approval (`TBC-001`, `TBC-013`, `TBC-014`).

## Approval / Execution Gate

No cart-mutating scenario may run against the public environment unless an owner explicitly approves its use and cleanup policy. Keep cart tests serial until state isolation is demonstrated.
