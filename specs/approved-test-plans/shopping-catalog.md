# Shopping Catalog Candidate Plan

> **Status: APPROVED — GENERATOR MAY USE THIS DEFINED SCOPE**  
> **Approver:** mr.reviewer  
> **Approval date:** 22 Nov 2026

## Scope and Priority

Candidate coverage is limited to the visible catalog controls and basic discovery behavior. No product-detail flow is assumed. The UI controls/products are documented from a prior authenticated snapshot; their results were not exercised in the latest unauthenticated discovery.

| Scenario | Priority | Layer | Risk |
|---|---|---|---|
| `SHOP-001` Catalog controls render | P1 | UI smoke | Low |
| `SHOP-002` Search known displayed product | P1 | UI regression | Medium — matching rules need review |
| `SHOP-003` Search no-match term | P2 | UI regression | Medium — empty-state copy unknown |
| `SHOP-004` Category filter | P1 | UI regression | Medium — reset/empty behavior unknown |
| `SHOP-005` Price-range filter | P1 | UI regression | Medium — exact boundaries unknown |

`SHOP-006` combined search/filter behavior is deferred pending `TBC-008`.

## SHOP-001 — Catalog Controls Render

- **Goal:** A signed-in user can reach catalog discovery controls.
- **Preconditions:** Authenticated approved session; `/shopping` loads.
- **Steps:** Open Shopping from home; inspect the Products heading, cards, search, category/price selectors, Add to Cart controls, and cart count.
- **Expected result:** The catalog and controls are visible. Do not assert a fixed product count, order, or price.
- **Data:** None.
- **Cleanup:** Close context without adding products.
- **Evidence:** These controls were recorded in prior authenticated UI observations; loading/error states remain unverified.

## SHOP-002 — Search for a Displayed Product

- **Goal:** Find a product by its displayed name.
- **Preconditions:** Authenticated session; catalog contains at least one product card.
- **Steps:** Read a product name from the current catalog; enter that exact visible name in Search products.
- **Expected result:** The named product remains visible. Case, partial-match, whitespace, token-order, and clear behavior are not asserted until `TBC-006` is resolved.
- **Data:** Runtime-observed name, not a fixed catalog invariant.
- **Cleanup:** Clear the field only if a supported clear/reset control exists; otherwise close context.
- **Evidence:** Search control/product cards observed; filter result was not exercised. Basic exact-name behavior is a candidate product expectation requiring human review.

## SHOP-003 — Search with No Match

- **Goal:** Avoid presenting unrelated products as matches.
- **Preconditions:** Authenticated session; catalog loaded.
- **Steps:** Enter a synthetic unique term not present in the visible products.
- **Expected result:** No unrelated product card is shown. Exact empty-state message and recovery behavior remain To Be Confirmed.
- **Data:** Synthetic unique term; do not use personal or secret values.
- **Cleanup:** Clear only if supported, otherwise close context.
- **Evidence:** Search empty state was not inspected (`TBC-006`).

## SHOP-004 — Category Filter

- **Goal:** Narrow the visible catalog to a selected category.
- **Preconditions:** Authenticated session; category options are available.
- **Steps:** Select one currently displayed category; inspect visible category labels for the returned product cards.
- **Expected result:** Visible results correspond to the selected category. All Categories reset and zero-result behavior are not asserted until confirmed.
- **Data:** Read category option and product labels at runtime. Preserve “Vegitables” as shown unless the application owner confirms a correction.
- **Cleanup:** Reset only if the UI provides a supported option; otherwise close context.
- **Evidence:** Options observed; result semantics unverified.

## SHOP-005 — Price-Range Filter

- **Goal:** Narrow visible products using the available price bands.
- **Preconditions:** Authenticated session; current products expose readable prices.
- **Steps:** Select each currently displayed range in isolated scenarios; compare prices that fall clearly inside a band.
- **Expected result:** Any displayed result conforms to the selected band for non-boundary values. Do not require every band to return a product, assert inclusivity at exact cutoffs, or assert currency precision/rounding until `TBC-009` is resolved.
- **Data:** Runtime-observed catalog prices; no price is treated as a permanent product invariant.
- **Cleanup:** Reset to All Prices only if supported; otherwise close context.
- **Evidence:** Price options and sample prices observed; selected-result semantics not exercised.

## Excluded from This Candidate

- `SHOP-006` combined filters: deferred because cumulative/override behavior is unknown (`TBC-008`).
- Product detail and product variants: no detail route/action confirmed (`TBC-005`).
- Exact boundaries/no-match copy: unresolved (`TBC-006`, `TBC-009`).
- Add-to-cart/cart state: covered in the separate Cart Management candidate.

## Approval / Implementation Gate

Approval is limited to the scenarios and bounded assertions listed above. Remaining search/filter semantics stay unresolved and must not be added as expected behavior. Approval does not authorize use of the public URL for state-mutating tests.
