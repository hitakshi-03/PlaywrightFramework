# Scripted QA User Journey Map

**Status:** Planner draft; human review required  
**Evidence basis:** Current unauthenticated browser inspection plus authenticated UI observations recorded in the framework documentation.

| Journey ID | User journey | Route sequence | Preconditions | Positive outcome / next state | Negative or boundary branches | Evidence / status | Priority |
|---|---|---|---|---|---|---|---|
| J-AUTH-01 | Sign in | `/` → `/home` | Dedicated approved test identity available through a secret store | Authenticated home is reached | Invalid credentials, empty fields, error wording and lockout are **To Be Confirmed** | Sign-in form observed; authenticated home recorded in prior UI observation | P0 |
| J-ACCESS-01 | Request protected Shopping route while signed out | `/` → direct `/shopping` → `/` | Fresh unauthenticated browser context | Sign-in page remains the entry state | Redirect destination/return URL behavior beyond redirect to `/` **To Be Confirmed** | Redirect back to `/` observed in this pass | P1 |
| J-NAV-01 | Navigate practice categories | `/home` → category route | Authenticated session | Selected category route opens | Category-specific page behavior and error states **To Be Confirmed** | Category labels/links and paths recorded in prior UI observation | P2 |
| J-SHOP-01 | Discover products in catalog | `/home` → `/shopping` | Authenticated session | Product cards and search/filter controls are visible | Empty catalog, loading/error states **To Be Confirmed** | Controls/catalog recorded in prior UI observation | P1 |
| J-SHOP-02 | Search for a product | `/shopping` | Catalog loaded | Matching product is displayed | No-match state, partial/case/whitespace matching, clearing search **To Be Confirmed** | Search control and products observed; search outcomes not exercised | P1 |
| J-SHOP-03 | Filter by category | `/shopping` | Catalog loaded | Items match selected category | Empty category, All Categories reset, filter/search interaction **To Be Confirmed** | Category selector/options observed; result semantics unverified | P1 |
| J-SHOP-04 | Filter by price band | `/shopping` | Catalog loaded | Items fit selected price band | Exact lower/upper boundary inclusion and combined filters **To Be Confirmed** | Price selector/options observed; result semantics unverified | P1 |
| J-CART-01 | Add a product | `/shopping` → `/shopping` | Authenticated session; clean isolated cart | Cart count reflects addition | Duplicate additions, quantity aggregation and maximum quantity **To Be Confirmed** | Add action and updated count observed once previously | P1 |
| J-CART-02 | Review cart | `/shopping` → `/cart` | Product has been added | Item, price, quantity and totals are shown | Empty-cart rendering, rounding/currency and stale-cart behavior **To Be Confirmed** | Cart layout/controls observed previously | P1 |
| J-CART-03 | Clear cart | `/cart` → `/cart` | Non-empty cart in an approved test environment | Cart becomes empty and totals update | Clear confirmation/undo and persistence scope **To Be Confirmed** | Clear Cart control observed; action outcome unverified | P1 |
| J-CART-04 | Return to Shopping | `/cart` → `/shopping` | Cart page is open | Product catalog is displayed | Whether cart state is retained **To Be Confirmed** | Back to Shopping control observed | P2 |
| J-CHECKOUT-01 | Inspect checkout affordance | `/cart` | Approved non-production test environment; cart prepared safely | Place Order control is visible | Submission, confirmation, payment, persistence, cancellation and reset are **To Be Confirmed** | Control presence observed; must not click during discovery | Deferred |

## Practice Category Coverage

| Category | Observed navigation label | Observed route | Current plan boundary |
|---|---|---|---|
| Table | Table | `/webTable` | Plan navigation only until table fields/actions and expected results are inspected. |
| Dropdown | Dropdown | `/dropDown` | Plan navigation only until option values and behavior are inspected. |
| Alerts/windows | Alerts & Windows | `/alertsAndWindows` | Plan navigation only until alert/window variants and outcomes are inspected. |
| Frame | Frame | `/frame` | Plan navigation only until frame content and interactions are inspected. |
| Form | Form | `/form` | Plan navigation only until fields, validation, and submission behavior are inspected. |
| Calendar | Calender | `/calender` | Plan navigation only until date selection and boundary rules are inspected. |
| Mouse actions | Mouse Actions | `/mouseActions` | Plan navigation only until supported actions and results are inspected. |
| Shopping | Shopping | `/shopping` | Catalog/cart scenarios are planned separately. |

## Explicitly Unmapped Journeys

Registration, password recovery, product details, user profile, order history, order confirmation, real checkout/payment, and application API workflows are not mapped because no routes/contracts were confirmed. See [to-be-confirmed.md](./to-be-confirmed.md).
