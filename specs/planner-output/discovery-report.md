# Scripted QA Application Discovery

**Status:** Planner draft; not approved for implementation  
**Application:** <https://www.scriptedqa.com/>  
**Discovery date:** 2026-11-22

## Summary

Scripted QA describes itself as a QA automation playground. The public entry page is a sign-in screen. In a fresh unauthenticated browser context, direct navigation to `/shopping` returned to `/`, where the sign-in form was displayed. The login page displays a credential hint; its values are intentionally neither transcribed nor retained in this report or the plan artifacts.

The framework's current vision/architecture and previously captured authenticated UI observations document the authenticated `/home`, Shopping catalog at `/shopping`, and cart/bill at `/cart`. Those observations show a small storefront-style exercise within the playground, not evidence of a complete production e-commerce system. The current discovery pass did not authenticate and did not submit any state-changing order.

## Evidence Classification

- **Observed in this discovery pass:** page title `Scripted QA`; sign-in form with Username, Password, and Sign In; unauthenticated direct `/shopping` navigation returned to `/`; username input had no native HTML `required` constraint at inspection.
- **Documented from previous authenticated UI inspection:** `/home` navigation categories; `/shopping` catalog controls and products; `/cart` totals and controls. Treat these as observed controls/content, not a guarantee of application-owner business requirements.
- **Not verified:** detailed behavior after invalid/empty sign-in, actual search/filter result semantics, empty-cart behavior, repeated additions/quantity rules, category exercise workflows, order submission, persistence, API contracts, environment isolation, and reset behavior.
- No on-page credential values, tokens, cookies, or personal data are included.

## Route and Feature Inventory

| Route / area | Evidence | Confirmed surface | Planning disposition |
|---|---|---|---|
| `/` | Direct browser snapshot | Scripted QA sign-in page; Username, Password, Sign In | Plan successful login only with a dedicated approved identity; invalid/empty outcomes remain partially To Be Confirmed. |
| `/home` | Prior authenticated UI observation in framework documentation | Welcome content and category links | Plan navigation availability; detailed category behavior requires discovery. |
| `/webTable` | Prior home navigation observation | Table category link | Route behavior and table operations To Be Confirmed. |
| `/dropDown` | Prior home navigation observation | Dropdown category link | Options and expected selections To Be Confirmed. |
| `/alertsAndWindows` | Prior home navigation observation | Alerts & Windows category link | Dialog/window types and outcomes To Be Confirmed. |
| `/frame` | Prior home navigation observation | Frame category link | Frame contents and expected interactions To Be Confirmed. |
| `/form` | Prior home navigation observation | Form category link | Fields, validation rules, and submission outcome To Be Confirmed. |
| `/calender` | Prior home navigation observation | “Calender” category link (spelling as displayed) | Calendar selection behavior and boundary rules To Be Confirmed. |
| `/mouseActions` | Prior home navigation observation | Mouse Actions category link | Supported gestures and expected outcomes To Be Confirmed. |
| `/shopping` | Prior authenticated UI observation; current unauthenticated access redirects | Products heading; search, category, price controls; product cards; Add to Cart; cart count | Plan catalog discovery and observable cart interactions; expected filter semantics need confirmation. |
| `/cart` | Prior authenticated UI observation | Item/Price/Qty/Total, Grand Total, Clear Cart, Back to Shopping, Place Order | Plan cart display/clear/back behavior; do not activate Place Order. Empty-cart and quantity behavior To Be Confirmed. |

No separate product detail, registration, profile, order-history, order-confirmation, or supported API route was confirmed.

## Shopping Controls Observed Previously

- Search textbox labeled “Search products...”
- Category selector: All Categories, electronics, Fruits, Vegitables, Sports & Fitness
- Price selector: All Prices, Under $25, $25 to $50, $50 to $100, $100 to $500, Over $500
- Product cards with displayed name, category, price, and Add to Cart button
- Header cart control showing an item count
- Cart row fields for item, price, quantity, line total, and grand total
- Clear Cart, Back to Shopping, and Place Order controls

These are UI observations. Exact price-boundary inclusivity, combined-filter behavior, search matching rules, repeat-add behavior, cart persistence, and order side effects are not established.

## Risk and Safety Notes

- The public environment's intended use for automation and availability guarantees are To Be Confirmed.
- The only currently configured base URL is public. Do not run checkout/order placement against it.
- Until cart isolation is proven, use a single worker/serial execution for cart-mutating scenarios and avoid shared accounts.
- Use a dedicated test identity from an approved secret store. Do not copy the site's visible credential hint into plans, test data, reports, or logs.
- Test cleanup may use Clear Cart only in an explicitly approved test environment and only after confirming the action's scope. Never use Place Order as cleanup.
- The existing seed test opens the entry page only; it does not authenticate or establish an empty cart.

## Recommended Planning Outcome

Proceed to human test-plan review with scenarios tagged by evidence and priority. Keep undocumented exercise-specific behavior, order placement, API tests, and account lifecycle features in the To Be Confirmed register. Do not generate tests or page objects during this discovery phase.
