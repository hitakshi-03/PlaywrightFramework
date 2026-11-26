# Scripted QA Scenario Catalog

**Status:** Draft for review; none of these scenarios are approved for implementation.  
**Seed context:** `tests/smoke/opens-application.spec.ts` opens the public entry page only. Authenticated scenarios require an authorized test identity and an approved environment; the seed does not log in, seed data, or guarantee an empty cart.

## Priority and Risk Scale

- **P0:** Authentication/access prerequisite that blocks most authenticated testing.
- **P1:** Core catalog/cart journey.
- **P2:** Secondary navigation or low-risk supporting behavior.
- **Deferred:** Requires owner confirmation or safe environment before executable testing.
- **Risk:** Low/Medium/High based on data mutation, state sharing, unverified semantics, or external side effects.

For every scenario, preserve plan ID traceability in any later approved plan/test. "Observed surface" means the control or route was seen; it does not mean the behavior is a confirmed product requirement.

## Authentication and Access

### AUTH-001 — Successful sign-in

- **Business goal:** Allow an authorized learner/test user to enter the playground.
- **Preconditions:** Fresh browser context; dedicated approved test identity is available through the secret store.
- **Steps:** Open `/`; enter the approved identity without logging its values; submit Sign In.
- **Expected result:** Authenticated home at `/home` is displayed with category navigation.
- **Priority / risk:** P0 / Medium (account/session behavior).
- **Data needs:** Dedicated test identity; never store the site's visible credential hint.
- **Cleanup:** End the browser context; sign out if required by the approved test-environment policy.
- **Evidence status:** Sign-in controls observed; successful `/home` transition documented in prior authenticated observation. Dedicated identity lifecycle remains To Be Confirmed.

### AUTH-002 — Invalid credentials do not authenticate

- **Business goal:** Prevent unauthenticated access when sign-in credentials are invalid.
- **Preconditions:** Fresh context; approved environment and non-sensitive invalid test values.
- **Steps:** Open `/`; submit deliberately invalid values.
- **Expected result:** User remains unauthenticated; a visible validation/error response is expected but its exact contract is To Be Confirmed.
- **Priority / risk:** P1 / Medium (avoid repeated attempts that might trigger lockout).
- **Data needs:** Synthetic invalid values only; no real user credentials.
- **Cleanup:** Close context; no application state should be created.
- **Evidence status:** Form observed; invalid-auth outcome not tested. Requires owner confirmation before assertion text is finalized.

### AUTH-003 — Empty sign-in submission

- **Business goal:** Establish the form's behavior when required identity fields are omitted.
- **Preconditions:** Fresh context at `/`.
- **Steps:** Submit with both fields empty; inspect visible validation and whether navigation occurs.
- **Expected result:** Authentication must not be granted. Exact inline/form validation is To Be Confirmed. Username had no native HTML `required` constraint during inspection; this does not establish application-level validation.
- **Priority / risk:** P2 / Low.
- **Data needs:** None.
- **Cleanup:** Close context.
- **Evidence status:** Username native constraint inspected; submission outcome/error presentation not confirmed.

### ACCESS-001 — Unauthenticated direct access to Shopping

- **Business goal:** Keep protected Shopping content behind sign-in.
- **Preconditions:** Fresh context without cookies/storage state.
- **Steps:** Navigate directly to `/shopping`.
- **Expected result:** Redirect to `/` and sign-in form shown.
- **Priority / risk:** P1 / Low.
- **Data needs:** None; isolated context.
- **Cleanup:** Close context.
- **Evidence status:** Redirect to `/` observed in current discovery pass.

## Home and Practice Navigation

### NAV-001 — Open each observed practice category

- **Business goal:** Let authenticated users reach the advertised practice areas.
- **Preconditions:** Authenticated home page.
- **Steps:** Verify and open links for Table, Dropdown, Alerts & Windows, Frame, Form, Calender, Mouse Actions, and Shopping, one at a time.
- **Expected result:** Each selected link navigates to its recorded path: `/webTable`, `/dropDown`, `/alertsAndWindows`, `/frame`, `/form`, `/calender`, `/mouseActions`, and `/shopping`. Page-specific success criteria are deferred until direct inspection.
- **Priority / risk:** P2 / Low.
- **Data needs:** Dedicated test identity for home access.
- **Cleanup:** Return to `/home` or close context; no state mutation expected.
- **Evidence status:** Labels and hrefs recorded in prior authenticated UI observation; category page content not discovered in this pass.

## Shopping Catalog

### SHOP-001 — Catalog exposes product discovery controls

- **Business goal:** Let a signed-in user browse products and start discovery.
- **Preconditions:** Authenticated session; `/shopping` loads.
- **Steps:** Verify Products heading, product cards, search textbox, category selector, price selector, Add to Cart controls, and cart-count control.
- **Expected result:** Catalog and discovery controls are visible and usable; do not assert a fixed catalog count or price as an invariant.
- **Priority / risk:** P1 / Low.
- **Data needs:** None for render-only assertions.
- **Cleanup:** Close context; no cart action.
- **Evidence status:** Controls and product cards observed previously; availability/loading/error state contract To Be Confirmed.

### SHOP-002 — Search for a known displayed product

- **Business goal:** Find a product by its visible name.
- **Preconditions:** Authenticated session; product currently visible in catalog.
- **Steps:** Enter the exact visible product name in the search textbox.
- **Expected result:** Matching product remains visible; unrelated products should not be presented as matches. Exact matching/case/whitespace behavior needs owner confirmation.
- **Priority / risk:** P1 / Medium (search semantics are unverified).
- **Data needs:** A product name obtained from the current catalog at runtime or approved fixture; avoid assuming a permanently fixed catalog.
- **Cleanup:** Clear the search field if supported; otherwise close context.
- **Evidence status:** Search control and product cards observed; search action/result not exercised.

### SHOP-003 — Search with no matching result

- **Business goal:** Provide understandable feedback for an unmatched search.
- **Preconditions:** Authenticated session; catalog available.
- **Steps:** Enter a unique term not present in the current catalog.
- **Expected result:** No unrelated products match. Empty-state wording and clear/reset behavior are To Be Confirmed.
- **Priority / risk:** P2 / Medium.
- **Data needs:** Unique synthetic search text.
- **Cleanup:** Clear search if supported or close context.
- **Evidence status:** Search behavior and empty state not observed.

### SHOP-004 — Filter catalog by category

- **Business goal:** Narrow product discovery by category.
- **Preconditions:** Authenticated session; catalog loaded.
- **Steps:** Select one category (the UI showed electronics, Fruits, Vegitables, and Sports & Fitness); inspect visible product category labels.
- **Expected result:** Results conform to the selected category; reset-to-All and empty-category behavior are To Be Confirmed.
- **Priority / risk:** P1 / Medium.
- **Data needs:** Category option labels read from UI; spelling “Vegitables” is as displayed and not corrected in test data absent confirmation.
- **Cleanup:** Reset to All Categories if supported; otherwise close context.
- **Evidence status:** Options observed; filtering outcome not exercised.

### SHOP-005 — Filter catalog by price range

- **Business goal:** Narrow products by the displayed price bands.
- **Preconditions:** Authenticated session; catalog loaded.
- **Steps:** Exercise All Prices, Under $25, $25 to $50, $50 to $100, $100 to $500, and Over $500 in independent runs; compare displayed numeric prices to the chosen range.
- **Expected result:** Products fall within the selected band. Inclusivity at exact boundary prices and currency/rounding behavior must be confirmed before strict boundary assertions.
- **Priority / risk:** P1 / Medium.
- **Data needs:** Current displayed prices as runtime data; do not treat today's catalog prices as business invariants.
- **Cleanup:** Reset to All Prices if available; otherwise close context.
- **Evidence status:** Options and sample prices observed; selection behavior and exact boundaries not tested.

### SHOP-006 — Combine search and filters

- **Business goal:** Support efficient product discovery using multiple criteria.
- **Preconditions:** Authenticated session; search and selectors present.
- **Steps:** Apply a known search term, then category and price filters; vary order in separate cases.
- **Expected result:** Combined result set follows documented conjunction/order semantics. Whether filters combine, reset, or override each other is To Be Confirmed.
- **Priority / risk:** P2 / Medium.
- **Data needs:** Product/category/price combination verified in current catalog.
- **Cleanup:** Reset controls if supported or close context.
- **Evidence status:** Controls observed; composition not exercised.

### SHOP-007 — Add one product and verify cart count

- **Business goal:** Add a selected product to a shopping cart.
- **Preconditions:** Authenticated approved environment; isolated, confirmed-clean cart.
- **Steps:** Add exactly one identified product using its card's Add to Cart button.
- **Expected result:** Cart count increments by one; product card shows its added quantity, consistent with the previously observed single-add result.
- **Priority / risk:** P1 / High until cart isolation is known.
- **Data needs:** One visible catalog product; clean cart established by approved setup.
- **Cleanup:** Clear the cart only if the environment and cleanup semantics are approved; otherwise use a disposable account/context and record cleanup blocker.
- **Evidence status:** Single add updated the count and button quantity in prior observation; clean-state and persistence semantics are unverified.

### SHOP-008 — Add the same product more than once

- **Business goal:** Define quantity aggregation for repeated adds.
- **Preconditions:** Approved non-production environment; isolated clean cart.
- **Steps:** Add the same product twice and compare cart count, per-product quantity, and card control.
- **Expected result:** Must match owner-confirmed semantics; it is not yet known whether the cart count represents total units or distinct products.
- **Priority / risk:** P2 / High (mutates shared cart state).
- **Data needs:** One stable current catalog product.
- **Cleanup:** Approved Clear Cart procedure only; never submit an order.
- **Evidence status:** Repeated-add semantics To Be Confirmed.

## Cart Management

### CART-001 — Review item details and totals

- **Business goal:** Confirm cart contents and price summary after adding a product.
- **Preconditions:** Authenticated approved environment; cart has exactly one known product.
- **Steps:** Open the cart from its count control; inspect item, price, quantity, line total, and grand total.
- **Expected result:** Added product is represented and displayed amount fields are populated. Arithmetic, currency precision, discounts/taxes, and rounding rules require confirmation before exact assertions.
- **Priority / risk:** P1 / High until cart persistence/isolation is understood.
- **Data needs:** Current catalog product and displayed price.
- **Cleanup:** Clear Cart only under approved test-environment policy or dispose of test identity/context.
- **Evidence status:** Table columns and totals observed; one-item sample total observed previously; pricing rules are not a confirmed contract.

### CART-002 — Clear a populated cart

- **Business goal:** Remove items from the current cart using the offered clear action.
- **Preconditions:** Approved non-production environment; cart contains a synthetic item.
- **Steps:** Select Clear Cart; inspect the resulting cart and header count.
- **Expected result:** Items are removed and count/totals reflect emptiness; exact message, confirmation, persistence, and undo are To Be Confirmed.
- **Priority / risk:** P1 / High (destructive to cart state).
- **Data needs:** Disposable synthetic cart contents.
- **Cleanup:** Verify empty state; do not invoke Place Order.
- **Evidence status:** Clear Cart control observed, behavior not executed.

### CART-003 — Return to Shopping

- **Business goal:** Allow a user to continue product discovery from the cart.
- **Preconditions:** Cart route open.
- **Steps:** Select Back to Shopping.
- **Expected result:** `/shopping` catalog is displayed.
- **Priority / risk:** P2 / Low.
- **Data needs:** Authenticated session; cart may be empty or populated if environment permits.
- **Cleanup:** No additional mutation; close context.
- **Evidence status:** Control observed; resulting route not freshly exercised.

### CART-004 — Open cart when empty

- **Business goal:** Present a usable cart state when no products have been added.
- **Preconditions:** Fresh isolated context or confirmed-cleared cart.
- **Steps:** Open `/cart` through the UI or route after authentication.
- **Expected result:** Empty-cart state is clear and stable; exact message/actions are To Be Confirmed.
- **Priority / risk:** P2 / Medium (requires reliable empty-state setup).
- **Data needs:** Confirmed clean cart.
- **Cleanup:** Close context; no order placement.
- **Evidence status:** Empty state not inspected.

### CART-005 — Edit/remove an item

- **Business goal:** Change cart contents/quantity if such controls exist.
- **Preconditions:** Cart contains a synthetic item.
- **Steps:** First inspect for quantity edit or per-item remove controls; only plan interactions if present.
- **Expected result:** **To Be Confirmed**; no quantity editing/removal controls were observed in the available cart snapshot.
- **Priority / risk:** Deferred / Medium.
- **Data needs:** None until capability confirmed.
- **Cleanup:** No action planned until controls and reset semantics are confirmed.
- **Evidence status:** Not observed; do not generate a test/page object for this behavior.

## Practice Category Reconnaissance

### PRACTICE-001 — Navigate to observed practice areas

- **Business goal:** Ensure the home page's advertised practice areas are reachable.
- **Preconditions:** Authenticated home.
- **Steps:** Open Table, Dropdown, Alerts & Windows, Frame, Form, Calender, Mouse Actions, and Shopping one at a time; record route and visible page landmarks without inventing success criteria.
- **Expected result:** Each observed navigation item reaches its linked route; detailed interactions are planned only after category-specific inspection.
- **Priority / risk:** P2 / Low.
- **Data needs:** Dedicated approved test identity.
- **Cleanup:** Navigate back to home or close context; no state mutation intended.
- **Evidence status:** Category labels and routes recorded previously; individual route content not discovered in this pass.

## Deferred Checkout Observation

### CHECKOUT-001 — Inspect Place Order affordance without submission

- **Business goal:** Record whether a checkout action is exposed, without creating an order.
- **Preconditions:** Human-approved non-production environment and safe cart state.
- **Steps:** Inspect the Place Order control; do not activate it.
- **Expected result:** Control presence is recorded. Submit behavior and any order confirmation remain **To Be Confirmed**.
- **Priority / risk:** Deferred / High.
- **Data needs:** None for an affordance-only inspection.
- **Cleanup:** None; do not submit.
- **Evidence status:** Place Order control observed in prior cart snapshot; result, side effects, and test environment are unknown.
