# Scripted QA Approved-Test-Plan Review Index

> **Plan status: APPROVED for the candidate scope listed below**  
> **Approver:** mr.reviewer  
> **Approval date:** 22 Nov 2026  
> Approval authorizes Generator to use only these reviewed candidate scopes; it does not waive scenario prerequisites or execution safety gates.

## Review Basis

Reviewed every artifact in `specs/planner-output/` (including its README), `docs/framework-vision.md`, `docs/framework-architecture.md`, and `.github/copilot-instructions.md`. Application evidence is taken from the discovery report's current unauthenticated inspection and its explicitly attributed prior authenticated UI observations. No order was submitted.

## Candidate Plans

| Candidate | Priority | Execution layer | Candidate scope | Key approval conditions |
|---|---|---|---|---|
| [Authentication and Access](./authentication-access.md) | P0/P1 | UI smoke + regression | `AUTH-001`–`AUTH-003`, `ACCESS-001` | Dedicated approved test identity required; invalid/empty input assertions limited to remaining unauthenticated until error contract is confirmed. |
| [Shopping Catalog](./shopping-catalog.md) | P1/P2 | UI smoke + regression | `SHOP-001`–`SHOP-005` | Search/filter output expectations stay bounded to the plan; price-boundary and combined-filter semantics remain unresolved. |
| [Cart Management](./cart-management.md) | P1/P2 | UI smoke + regression | `SHOP-007`, `CART-001`–`CART-003` | Approved non-production environment, clean-cart setup, state isolation, and cleanup policy required before state-mutating scenarios. |
| [Practice Navigation](./practice-navigation.md) | P2 | UI regression | `NAV-001`–`NAV-007` | Authenticated home must be available; only reachability is approved until each practice area is inspected. |

## Deferred / Not Candidate for Implementation

See [deferred-items.md](./deferred-items.md) for scenarios that are duplicate, unsupported, or blocked by unresolved requirements or side effects. These are not approved plans and must not be passed to Generator.

## Priority and Execution-Layer Rationale

- **P0:** Successful sign-in is the access prerequisite for most authenticated journeys; without an approved test identity, authenticated suite execution is blocked.
- **P1:** Catalog discovery and the basic add/review/clear cart path represent the application's observed primary shopping journey. Cart scenarios carry higher operational risk because they mutate state.
- **P2:** No-match and secondary practice-category navigation are useful regression coverage but are not prerequisites for the core journey.
- **Smoke:** Only a small entry/navigation/catalog/basic-add subset should be considered for fast smoke after prerequisites are confirmed. Cart-mutating smoke is still blocked until environment and state cleanup are approved.
- **Regression:** Search/filter variations, negative input, category navigation, cart clearing, and other repeatable behavior belong in regression after the relevant expected outcomes and setup are confirmed.
- **API:** No API candidate is listed; API layer is deferred because no supported contract is available.

## Source Artifact Review and Consolidation

| Planner artifact | Review outcome |
|---|---|
| `discovery-report.md` | Evidence-aware. Distinguishes current unauthenticated inspection from prior authenticated UI observations. Environment, API, and checkout unknowns retained. |
| `journey-map.md` | Useful navigation map. Its journey IDs are retained as source references, not scenario IDs. Practice navigation was consolidated into independent candidate scenarios. |
| `scenario-catalog.md` | Main scenario source. All confirmed and partially supported scenarios were reviewed; conditional behaviors and state risks are retained. |
| `scriptedqa-scenario-plan.md` | Overlaps the scenario catalog. Its `SHOP-006` means “add one product” while catalog `SHOP-006` means “combine filters”; its `SHOP-007` means “repeat add” while catalog `SHOP-007` means “add one product.” Candidate IDs follow the catalog; structured-plan references are crosswalked below. |
| `to-be-confirmed.md` | Unknowns retained and referenced. No unresolved answer is treated as an expected result. |
| `README.md` | Confirms Planner artifacts are drafts and future test file paths are not generated tests. |

## Scenario ID Crosswalk

| Canonical candidate ID | Source reference(s) | Resolution |
|---|---|---|
| `AUTH-001`–`AUTH-003`, `ACCESS-001` | Scenario catalog and structured plan | IDs and intent align. Negative/empty cases use only the observable assertion “not authenticated”; error copy remains To Be Confirmed. |
| `SHOP-001`–`SHOP-005` | Scenario catalog and structured plan | IDs align for catalog render, search, no-match, category, and price selection. |
| `SHOP-006` | Scenario catalog; structured-plan `SHOP-006` is different | Canonical catalog meaning is combined search/filters; deferred pending a confirmed filter-composition rule. |
| `SHOP-007` | Scenario-catalog `SHOP-007`; structured-plan `SHOP-006` | Canonical meaning is one-product add/count update. |
| `SHOP-008` | Scenario-catalog `SHOP-008`; structured-plan `SHOP-007` | Canonical meaning is repeated add; deferred pending quantity/count semantics. |
| `CART-001`–`CART-005` | Scenario catalog and structured plan | IDs align; `CART-004` empty-cart and `CART-005` item edit/remove are deferred. |
| `NAV-001` | Scenario-catalog `NAV-001`; journey-map `J-NAV-01`; structured-plan `NAV-001` | Drafts combine several pages into one scenario. Split into independent `NAV-001`–`NAV-007`; Shopping is covered by `SHOP-001`. |
| Checkout affordance | `CHECKOUT-001`, journey-map `J-CHECKOUT-01` | Not a test candidate. Retained as a read-only discovery note; never click Place Order. |
| `PRACTICE-001` | Scenario catalog | Duplicate of `NAV-001` category navigation; consolidated and not separately carried forward. |

## Review Findings

### Gaps to Close

- The seed opens `/` only; no approved login/session fixture or clean-cart setup exists.
- Authenticated user identity, cart persistence scope, and safe reset procedure are unknown.
- Category page bodies and expected user outcomes have not been independently inspected; current navigation candidates cover reachability only.
- Error, empty, loading, and boundary-state UX is not fully documented.
- No supported API, test/staging URL, browser support matrix, or CI suitability contract was supplied.
- The only seed file opens `/`; authenticated state and test data setup require a separate approved provisioning decision.

### Duplicates and Ambiguities

- `PRACTICE-001` duplicates `NAV-001`; merged into independent navigation scenarios.
- `SHOP-006` and `SHOP-007` collide between two source artifacts with different meanings; canonical mappings are documented above.
- Shopping navigation is already part of `SHOP-001`, so it is excluded from the separate practice-navigation list.
- The structured `CHECKOUT-001` proposed a test filename despite an instruction not to submit orders. It is removed from executable plans and retained only as deferred discovery.
- “Cart count,” repeated add, price inclusivity, combined filtering, and totals were described too concretely in some draft expectations. Those assertions are conditional until semantics are confirmed.

### Missing / Restricted Negative Scenarios

- Invalid and empty sign-in attempts are retained as bounded negative candidates, but only “authentication is not granted” is assertable now. Exact copy, lockout, and retry rules are deferred.
- No-match search can assert no unrelated product cards; empty-state wording and clear behavior remain unresolved.
- Empty-cart behavior, category with no products, exact price boundaries, network failure, and order failure paths are deferred because their expected outcomes are not evidenced.
- Do not add failure-injection/API cases without an approved API contract.

## Human Approval Record

The authorized human explicitly approved all four candidates. Each candidate plan records the same approver and date. Approval is limited to the defined scenarios and does not resolve any To Be Confirmed item, authorize Place Order, or permit execution against an unapproved environment.

| Candidate | Decision | Authorized approver | Date | Conditions / notes |
|---|---|---|---|---|
| Authentication and Access | Approved | mr.reviewer | 22 Nov 2026 | Dedicated identity and environment prerequisites remain. |
| Shopping Catalog | Approved | mr.reviewer | 22 Nov 2026 | Exact boundaries, combined filters, and unsupported result semantics remain deferred. |
| Cart Management | Approved | mr.reviewer | 22 Nov 2026 | No state-mutating execution until non-production target, isolation, and cleanup are approved. Never submit Place Order. |
| Practice Navigation | Approved | mr.reviewer | 22 Nov 2026 | Reachability only; detailed category behaviors remain To Be Confirmed. |

## Generated Test Traceability and Latest Run

The latest full Chromium run (`npm test`) completed with **21 passed, 4 skipped, 0 failed** (25 total, including the standalone smoke check). The four skips are `AUTH-002` and the three cart-mutating scenarios, which remain behind their explicit non-public-target and approval gates on the public Scripted QA target. No cart mutation or invalid-credential submission was performed.

| Scenario ID | Test file and test name | Latest result |
|---|---|---|
| `AUTH-001` | [`authentication.spec.ts`](../../tests/regression/authentication.spec.ts) — reaches authenticated home after sign-in | Passed |
| `AUTH-002` | [`authentication.spec.ts`](../../tests/regression/authentication.spec.ts) — invalid credentials do not authenticate | Skipped — non-public-target / explicit approval gate not satisfied in the test run |
| `AUTH-003` | [`authentication.spec.ts`](../../tests/regression/authentication.spec.ts) — empty sign-in does not authenticate | Passed |
| `ACCESS-001` | [`authentication.spec.ts`](../../tests/regression/authentication.spec.ts) — signed-out access to Shopping returns to sign-in | Passed |
| `SHOP-001` | [`shopping.spec.ts`](../../tests/regression/shopping.spec.ts) — shows catalog discovery controls | Passed |
| `SHOP-002` | [`shopping.spec.ts`](../../tests/regression/shopping.spec.ts) — exact search keeps the runtime-observed product visible | Passed |
| `SHOP-003` | [`shopping.spec.ts`](../../tests/regression/shopping.spec.ts) — no-match search hides the previously visible products | Passed |
| `SHOP-004` | [`shopping.spec.ts`](../../tests/regression/shopping.spec.ts) — category filter leaves only products in the selected category | Passed after case-normalization repair |
| `SHOP-005` | [`shopping.spec.ts`](../../tests/regression/shopping.spec.ts) — selected range excludes prices outside each observed range | All five cases passed |
| `SHOP-007` | [`cart-management.spec.ts`](../../tests/regression/cart-management.spec.ts) — one add updates the cart count by one | Skipped — cart mutation safety gate |
| `CART-001` | [`cart-management.spec.ts`](../../tests/regression/cart-management.spec.ts) — cart shows the added product and summary fields | Skipped — cart mutation safety gate |
| `CART-002` | [`cart-management.spec.ts`](../../tests/regression/cart-management.spec.ts) — clearing the populated cart removes its test item | Skipped — cart mutation safety gate |
| `CART-003` | [`cart-management.spec.ts`](../../tests/regression/cart-management.spec.ts) — Back to Shopping returns to the catalog | Passed |
| `NAV-001` | [`practice-navigation.spec.ts`](../../tests/regression/practice-navigation.spec.ts) — Table (`/webTable`) | Passed |
| `NAV-002` | [`practice-navigation.spec.ts`](../../tests/regression/practice-navigation.spec.ts) — Dropdown (`/dropDown`) | Passed |
| `NAV-003` | [`practice-navigation.spec.ts`](../../tests/regression/practice-navigation.spec.ts) — Alerts & Windows (`/alertsAndWindows`) | Passed |
| `NAV-004` | [`practice-navigation.spec.ts`](../../tests/regression/practice-navigation.spec.ts) — Frame (`/frame`) | Passed |
| `NAV-005` | [`practice-navigation.spec.ts`](../../tests/regression/practice-navigation.spec.ts) — Form (`/form`) | Passed |
| `NAV-006` | [`practice-navigation.spec.ts`](../../tests/regression/practice-navigation.spec.ts) — Calender (`/calender`) | Passed |
| `NAV-007` | [`practice-navigation.spec.ts`](../../tests/regression/practice-navigation.spec.ts) — Mouse Actions (`/mouseActions`) | Passed |

`SHOP-006`, `SHOP-008`, `CART-004`, `CART-005`, checkout, and API scenarios remain deferred and have no generated tests.
