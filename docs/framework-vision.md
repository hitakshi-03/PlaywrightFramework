# Playwright Automation Framework Vision

## Project Overview

This document defines the vision for a production-quality Playwright and TypeScript test framework for **Scripted QA** at [https://www.scriptedqa.com/](https://www.scriptedqa.com/).

The site identifies itself as “Your QA Automation Playground.” Its authenticated home page offers interactive practice areas, including a Shopping experience. The Shopping area resembles a small storefront, but the public site is a QA practice application rather than a confirmed production e-commerce business. Framework coverage must therefore reflect the behavior visible in the playground and must not imply that unobserved retail capabilities exist.

## Application URL

- Application entry point: <https://www.scriptedqa.com/>
- Observed authenticated home: `/home`
- Observed shopping catalog: `/shopping`
- Observed cart/bill: `/cart`
- Other home-page categories observed: `/webTable`, `/dropDown`, `/alertsAndWindows`, `/frame`, `/form`, `/calender`, and `/mouseActions`
- Environment-specific URLs and deployment tiers: **To Be Confirmed**

## Business Objectives

- Provide a browser-accessible playground for practicing real-world automation scenarios.
- Demonstrate common UI interactions and automation best practices.
- Offer a simple shopping scenario with a product catalog and cart for commerce-like test practice.
- Keep the demo experience stable and understandable for learners.

The application's ownership, commercial objectives, supported user population, and service-level commitments are **To Be Confirmed**.

## Automation Objectives

- Exercise verified user-visible behavior with maintainable, independent Playwright tests.
- Cover UI, smoke, and regression scenarios across the available playground and Shopping areas.
- Establish a structure for API tests, while deferring endpoint-specific tests until an API contract is available.
- Support repeatable local and CI execution, controlled parallelism, environment configuration, useful reports, and AI-assisted test authoring/repair.
- Make development agent-driven but review-gated: Planner discovers and specifies, a human reviews/approves, Generator implements approved plans, and Healer diagnoses bounded test failures.
- Keep test data isolated and avoid placing credentials or other sensitive values in source control.
- Treat destructive or state-changing actions, such as placing an order, as opt-in until the target environment and reset strategy are confirmed.

## Agent-Driven Development Workflow

The framework is developed through a controlled sequence of Copilot Agent Mode tasks:

1. Establish and review the documentation and architecture before implementation.
2. Set up Playwright and TypeScript, then configure the Planner, Generator, and Healer using a supported Playwright/Copilot agent mechanism.
3. Build framework foundations without creating route-specific page objects.
4. Use Planner to discover user journeys and produce business-focused test-plan drafts under `specs/planner-output/`.
5. Review those drafts for evidence, gaps, duplicates, risk, and priority. Keep review candidates in `specs/approved-test-plans/` with an explicit pending status; a human owner records approval before Generator may use them.
6. Design/create only the page objects required by approved scenarios.
7. Use Generator to create tests from approved plans and the established framework.
8. Run tests and use Healer for bounded test/selector stability repairs.
9. Add contract-based API coverage, reporting, CI/CD, and ongoing framework health work.

Copilot agents must distinguish observed behavior from assumptions, preserve the framework's architecture, avoid secrets, and never treat an unreviewed plan as approval. Before Phase 6, no application-specific page object classes may be created. The shared `BasePage` foundation, if approved in Phase 3, is not permission to create concrete page objects.

## Testing Scope

### In Scope

- Sign-in using a dedicated test identity.
- Home-page navigation to the observed practice categories.
- Shopping catalog rendering, search, category and price filtering.
- Adding products to the cart, verifying cart count and totals, clearing the cart, and returning to shopping.
- Cart and order-placement UI behavior in a dedicated test environment.
- Table, dropdown, alerts/windows, frame, form, calendar (shown as “Calender” in the UI), and mouse-action exercises, where the expected behaviors can be defined.
- Framework-level smoke/regression tags, browser projects, reporting, and CI integration.
- API framework setup and contract-driven test skeletons, pending API discovery.

### Out of Scope

- Real payment processing, fulfillment, inventory, refunds, or customer data workflows; none were established by the public UI inspection.
- Production transactions or tests that place orders against an unapproved environment.
- Registration, account recovery, product detail, user profile, or order-history automation unless those features are confirmed.
- Security, performance, accessibility, and load testing as a substitute for their dedicated requirements and approvals.
- Backend/API behavior inferred solely from the visible UI.

## In-Scope Features

Observed application behavior:

- **Authentication:** The entry page presents Username and Password fields and a Sign In button. A demo credential hint is displayed by the site; credentials must not be copied into framework documentation, committed files, or logs.
- **Home/navigation:** After sign-in, the home page shows navigation categories for Table, Dropdown, Alerts & Windows, Frame, Form, Calender, Mouse Actions, and Shopping.
- **Shopping catalog:** The `/shopping` page presents products, a search field, category filter, price-range filter, and Add to Cart buttons.
- **Visible catalog categories:** `electronics`, `Fruits`, `Vegitables` (spelling as displayed), and `Sports & Fitness`.
- **Cart:** The header cart control shows an item count. The `/cart` page displays item, price, quantity, line total, and grand total, with Clear Cart, Back to Shopping, and Place Order controls.
- **Home-page guidance:** The authenticated landing page presents automation best-practice guidance. Whether this content is functionally tested or treated as informational is a project decision.

The current catalog contents and displayed prices should be treated as fixture data, not business invariants, unless the application owner confirms otherwise.

## Critical User Journeys

| Journey | Current assessment | Initial automation intent |
|---|---|---|
| Login | Confirmed | Sign in with a dedicated test account; verify navigation to `/home`; verify invalid-credential behavior after it is documented. |
| Registration | **To Be Confirmed** | No registration link or flow was observed. Do not create a registration page object or tests until confirmed. |
| Product Search | Confirmed | Search by a known catalog product and verify the resulting list; empty/no-match behavior is **To Be Confirmed**. |
| Product Details | **To Be Confirmed** | Catalog entries were visible, but a product detail route or detail action was not observed. |
| Add To Cart | Confirmed | Add one product and verify the cart count changes. Verify repeat-add behavior only after its intended quantity semantics are confirmed. |
| Cart Management | Partially confirmed | Verify product, quantity, price, totals, Clear Cart, and Back to Shopping. Quantity editing/removal controls were not observed. |
| Checkout | Partially confirmed | A Place Order button is present on `/cart`; the resulting flow and any confirmation step have not been exercised. |
| Order Confirmation | **To Be Confirmed** | No confirmation state was inspected. Validate only in a dedicated environment after order side effects are understood. |
| Order History | **To Be Confirmed** | No order history navigation or page was observed. |
| User Profile | **To Be Confirmed** | No profile/account settings navigation was observed. |
| Practice-category navigation | Confirmed | Verify access to the observed category routes and their basic page landmarks. Detailed expected behavior is **To Be Confirmed** for each exercise. |

## Quality Goals

- Prefer accessible, user-facing locators (`getByRole`, `getByLabel`, and `getByText`) and stable test IDs where the application provides them.
- Keep tests isolated, deterministic, and runnable in any order.
- Avoid fixed sleeps and brittle DOM/CSS implementation details.
- Capture actionable failure evidence, including traces and screenshots on failure.
- Make environment, browser, test tags, and parallelism explicit and reproducible.
- Ensure CI smoke coverage is fast and regression coverage is diagnostically useful.
- Keep agent output traceable to approved plans and require human review of plans, generated code, and repairs.
- Define and review reliability, runtime, and coverage thresholds after a baseline is collected; numerical targets are **To Be Confirmed**.

## Browser Support

- Framework baseline: current supported Playwright Chromium, Firefox, and WebKit projects, subject to the site's browser compatibility and CI capacity.
- Initial smoke coverage should run on Chromium.
- Cross-browser regression coverage should be enabled after compatibility baselining.
- Mobile device emulation, real mobile browsers, and the application's official browser support matrix are **To Be Confirmed**.

## Environment Strategy

- Support local development and a dedicated shared or ephemeral test environment.
- Configure the base URL through environment configuration rather than hard-coding environment-dependent values in tests.
- Use a separate test identity and synthetic test data; manage secrets through local ignored configuration and CI secret storage.
- Do not run order-placement scenarios against production. The existence of a staging/test environment and a data-reset mechanism is **To Be Confirmed**.
- Keep browser contexts and cart state isolated per test. Confirm whether application state is session-scoped, user-scoped, or shared before increasing parallel workers.

## Reporting Strategy

- Use Playwright's HTML report for interactive local and CI investigation.
- Add Allure reporting in Phase 10 after compatibility and dependency-policy checks; if it is not approved or supported, record the owner decision and do not claim the Allure deliverable is complete.
- Publish JUnit-compatible output for CI test summaries.
- Retain traces, screenshots, and video according to failure/debugging policy; avoid recording credentials or sensitive values.
- Add a hosted reporting service only if required by the team's existing CI/reporting standards.
- Report suite, browser, environment, test title, retry, and failure evidence without exposing secrets.

## Success Criteria

- Confirmed sign-in, navigation, catalog, and cart behavior is covered by independently runnable smoke and regression tests.
- Test execution is configurable for local and CI environments without changing test source.
- Failures include enough evidence to diagnose the issue, and secrets are not present in artifacts or logs.
- CI can run a fast smoke suite and a separately selectable regression suite.
- Planner output is reviewed and approved before Generator implementation; each generated test can be traced to an approved scenario.
- Healer changes are limited to verified test stability issues and do not alter framework architecture or weaken meaningful assertions.
- API coverage begins only when an endpoint contract and test environment are available.
- Registration, detailed checkout, order confirmation/history, profile, browser guarantees, and performance targets are explicitly resolved before they are represented as implemented coverage.
