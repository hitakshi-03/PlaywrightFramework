# Playwright Framework Architecture

## Architecture Principles

- Use Playwright Test with TypeScript as the test runner and language.
- Keep test intent, page interactions, test data, environment configuration, and reporting concerns separate.
- Model only observed application pages and confirmed user flows. Mark unverified behavior as **To Be Confirmed**.
- Isolate each test's browser context and mutable cart state; do not rely on test order.
- Prefer built-in Playwright capabilities before adding framework dependencies.
- Use agents in explicit roles with human approval gates: Planner plans, Generator implements approved plans, and Healer performs bounded test repairs.
- Create no application-specific page objects until Phase 6, after approved test plans identify the required pages.

## Technology Stack

| Concern | Recommendation |
|---|---|
| Language | TypeScript with strict compiler options |
| Browser automation and runner | `@playwright/test` |
| UI test organization | Playwright Test projects, tags, fixtures, and page/component objects |
| API testing | Playwright `APIRequestContext`, once base URL and API contract are known |
| Local/CI report | Playwright HTML reporter plus JUnit-compatible output |
| Failure evidence | Playwright trace, screenshot, and optionally video on failure |
| CI provider | Existing organization CI; GitHub Actions is a suitable example if no provider is mandated (**To Be Confirmed**) |
| Dependency management | npm with a committed lockfile, unless the repository standard specifies another package manager |

No application API, service contract, CI provider, or existing framework constraints were discovered during site inspection.

## Recommended Evolving Folder Structure

This is the target structure as phases are completed, not a requirement to create every file at project setup. In particular, concrete application page objects are added only in Phase 6 and only when approved scenarios require them.

```text
project-root/
├── api/
│   ├── clients/
│   └── schemas/
├── config/
│   └── environments.ts
├── docs/
│   ├── framework-vision.md
│   ├── framework-architecture.md
│   └── implementation-roadmap.md
├── fixtures/
│   └── test-fixtures.ts
├── helpers/
├── pages/
│   └── BasePage.ts          # Shared foundation only in Phase 3
├── test-data/
│   ├── products.ts
│   └── users.example.ts
├── tests/
│   ├── api/
│   ├── regression/
│   │   ├── authentication.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── shopping.spec.ts
│   └── smoke/
├── utils/
├── reports/                 # generated; do not commit
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example             # names/placeholders only; no secrets
└── .gitignore
```

Add concrete page-object files under `pages/` only after Phase 6 approval and only when approved scenarios need them.

`reports/`, generated results, and any authenticated browser state must be excluded from version control. The `api/` directory is an architectural provision, not evidence that the site exposes a supported API.

Agent-driven development adds these workflow assets when Phase 2 is executed. If the official Playwright initializer uses canonical filenames different from the suggested names below, retain its supported names and document the mapping rather than renaming generated files.

```text
.github/
├── agents/
│   ├── playwright-planner.agent.md
│   ├── playwright-generator.agent.md
│   └── playwright-healer.agent.md
└── copilot-instructions.md
specs/
├── planner-output/
└── approved-test-plans/
```

Use the official Playwright agent initialization mechanism supported by the installed version when it is available. If it is not available, use the repository's supported Copilot custom-agent format and document the deviation. Do not create speculative configuration keys or install unrelated/unverified agent packages. The agent files must define their role, input sources, allowed output/change scope, and safety boundaries.

## Page Object Model Standards

- Page objects are intentionally deferred until Phase 6. Phases 0-5 must not create concrete application page objects or page-object fixtures.
- The Phase 3 `BasePage` is a small shared foundation only; it must not contain route-specific locators or become a collection of application workflows.
- Keep page objects focused on one route or cohesive page responsibility.
- Expose meaningful user actions and state queries, not raw locator collections.
- Keep scenario assertions and business expectations in the tests; page objects may provide narrowly scoped readiness checks.
- Use semantic locators and accessible names first. Use a test ID when semantics are insufficient and the application can provide a stable one.
- Avoid XPath, generated class names, and positional selectors unless no stable alternative exists and the reason is documented.
- Do not make a page object responsible for test setup, environment selection, or unrelated routes.

### Candidate Page Objects (Only After Approval)

- `LoginPage`: create only if an approved plan includes sign-in behavior.
- `HomePage`: create only if an approved plan includes authenticated home/navigation behavior.
- `ShoppingPage` (or `SearchPage` only if a separate search route is verified): create only if approved plans require catalog search/filter/product-list behavior.
- `ProductPage`: create only if a product-detail route and approved scenarios are confirmed.
- `CartPage`: create only if approved plans include cart behavior.
- `CheckoutPage`: create only if checkout safety, expected behavior, and approved scenarios are confirmed.

No observed product detail, registration, profile, order history, or order-confirmation page currently justifies a page object. Do not infer a page from a journey name in a generic e-commerce template. Page objects must map to confirmed application routes/components and approved scenarios.

## Base Page Design

Use a small `BasePage` only for genuinely shared behavior, such as holding a `Page` reference and a common navigation/readiness helper if multiple pages need it. Keep page-specific selectors and workflows in their page classes. Avoid a large base class containing every Playwright method, global assertions, retries, or hidden waits.

## Fixture Strategy

- Rely on Playwright's built-in `page`, `context`, `browser`, and `request` fixtures by default.
- Add custom fixtures only when shared setup/teardown is justified. Page-object fixtures such as `loginPage`, `homePage`, `shoppingPage`, and `cartPage` may be added after Phase 6 when approved scenarios require them.
- Keep fixtures lazy and focused; a test that does not need authentication should not be forced through login.
- Use a per-test browser context for isolation. Determine whether cart state persists across sessions before introducing shared accounts or parallel workers.
- Keep cleanup explicit. Do not silently catch cleanup failures or hide a failed cart reset.

## Environment Strategy

- Read `baseURL` from Playwright configuration and environment variables, with a safe local default only if approved.
- Maintain named environment profiles (for example local, test, staging) in configuration, not conditional branches across test files.
- Validate required configuration at startup and fail clearly when a selected environment is missing required values.
- Store local secret values in an ignored environment file; use the CI provider's secret store in pipelines.
- Provide `.env.example` with variable names and dummy placeholders only.
- Do not write live demo credentials into code, docs, reports, traces, or logs.
- Production is not an allowed target for state-changing tests unless explicitly approved with safeguards.

Environment URLs, identity lifecycle, and a reliable test-data reset mechanism are **To Be Confirmed**.

## Authentication Strategy

- Start with a UI login fixture using a dedicated test identity supplied securely through environment variables or the approved test identity provider.
- Verify the authenticated landing route and a stable signed-in indicator before continuing.
- Consider `storageState` reuse only after verifying session lifetime, invalidation, and account isolation. Protect state files as secrets, ignore them in Git, and regenerate them in CI.
- Do not assume the credential hint rendered by the public site is a production-grade identity contract or embed its value in framework artifacts.
- Registration, password reset, multi-factor behavior, and account lockout rules are **To Be Confirmed**.

## Test Data Management Strategy

- Use small, typed, deterministic fixtures for known catalog categories and products.
- Treat the currently displayed product names/prices as observed sample data, not guaranteed invariants; assert stable behavior and use confirmed data contracts where available.
- Use unique data only when the application supports it; avoid collisions when tests share a backend.
- Keep data setup/cleanup in explicit fixtures or API helpers after supported APIs are documented.
- Do not use a real payment instrument, personal information, or real customer record.
- Confirm whether order placement persists data, whether it can be reset, and whether carts are isolated before exercising it in CI.

## Reporting Strategy

- Configure the Playwright HTML reporter for local investigation and retain CI artifacts for failures.
- Emit JUnit XML for CI test integration.
- Attach trace and screenshot on failure; record video on failure only when artifact size and privacy rules permit.
- Add the planned Allure reporter in Phase 10 only after confirming the compatible Playwright adapter/version and repository dependency policy; keep Playwright HTML as the baseline report. If blocked by policy or compatibility, record the decision and leave the Allure deliverable incomplete pending owner approval.
- Use clear test titles and include browser/environment in the report metadata.
- Set an explicit retention policy and ensure artifacts do not contain secrets or unnecessary personal data.

## Logging Strategy

- Prefer Playwright's test steps, assertions, attachments, and trace viewer for test-level diagnostics.
- Log concise scenario context (route, product fixture identifier, environment label), not passwords, tokens, cookies, or full request headers.
- Keep application/browser console capture scoped and actionable; do not suppress errors globally.
- Surface setup, configuration, and teardown errors as test failures with context rather than broad catches or success-shaped fallbacks.

## API Testing Strategy

- No API endpoints, schema, authentication protocol, or supported API contract were discovered through the public UI.
- When documentation is provided, create typed API clients using Playwright `APIRequestContext`, validate status, schema, and meaningful business behavior, and reuse environment-specific authentication safely.
- Keep API tests independent of UI tests. Use API setup/cleanup only for documented, supported endpoints and where doing so does not bypass the behavior under test.
- Do not guess endpoint paths from UI routes or treat internal network calls as a stable public contract.
- Until the contract is confirmed, mark endpoint inventory, API authentication, data seeding, and API test coverage **To Be Confirmed**.

## CI/CD Strategy

- Run type-checking and a fast Chromium smoke suite on pull requests.
- Run the broader regression matrix on the default branch or scheduled pipeline; include Firefox/WebKit when the compatibility baseline is ready.
- Configure workers and retries explicitly. Use limited parallelism until shared-state behavior is understood; retry only to collect evidence, not to mask flaky tests.
- Upload HTML/JUnit reports and failure traces as artifacts with a defined retention period.
- Keep secrets in the CI secret store and restrict state-changing test jobs to an approved non-production environment.
- Make base URL, browser, test tag, and worker count configurable pipeline inputs.
- Provider, branch policies, deployment gates, and retention periods are **To Be Confirmed**.

## Playwright Agent Workflow and Boundaries

### Planner

- Read the vision, architecture, application entry point, and relevant observed application UI.
- Discover business journeys and positive/negative scenarios, and record assumptions as **To Be Confirmed**.
- Write draft plans, journey maps, priorities, and traceability under `specs/planner-output/`.
- Do not create tests, page objects, fixtures, or application code.
- Do not place orders or exercise other state-changing flows unless the test environment and approval are explicit.

### Human Plan Review

- Review Planner output for evidence, missing paths, duplicates, risk, feasibility, and priorities.
- Keep review candidates under `specs/approved-test-plans/` with status `PENDING HUMAN APPROVAL`; record deferred/rejected items and reasons. A plan is usable by Generator only after an authorized human records `APPROVED` status and approver/date.
- Copilot may prepare review-ready plans but cannot grant human approval. A plan must be explicitly approved by its designated owner before Generator uses it.

### Generator

- Read only approved plans, this architecture, project Copilot instructions, and existing framework/page-object patterns.
- Reuse existing framework structures and implement tests traceable to approved scenario IDs.
- Create or change page objects only after Phase 6 and only when approved scenarios require them.
- Do not add a competing folder structure, invent application behavior/API endpoints, embed secrets, or run unapproved side-effecting scenarios.

### Healer

- Use failing test output and trace evidence to classify product defects, test defects, environment issues, and unresolved expectations.
- Make the smallest repair to test selectors or interactions while preserving meaningful assertions and test intent.
- Never modify framework architecture: architecture documents, shared framework conventions, project configuration, core fixtures, reporting strategy, agent definitions, or CI design are outside its scope.
- Do not use fixed sleeps, suppress errors, weaken assertions, or increase retries/timeouts as substitutes for diagnosis.
- Escalate when the evidence indicates a product defect, missing test expectation, or architectural change.

### Agent Setup and Governance

- Keep Planner, Generator, and Healer role instructions in separate, version-controlled agent profiles using the supported Copilot/Playwright mechanism.
- Share common security, locator, test-isolation, and behavior-evidence rules through repository Copilot instructions.
- Give each agent the minimum repository context and tool permissions required for its task.
- Review every agent-authored plan, code change, and repair through normal human review and test execution.
- Do not include credentials or sensitive browser state in prompts, plans, traces, or generated files.

## Naming Conventions

- Page classes: PascalCase, suffixed with `Page` (for example, `ShoppingPage`).
- Fixture functions and variables: camelCase and descriptive (`shoppingPage`, `signedInUser`).
- Test files: `<area>.spec.ts` (for example, `shopping.spec.ts`).
- Test titles: describe the user-observable behavior, such as `shows matching products when a category is selected`.
- Tags: use a small agreed vocabulary such as `@smoke`, `@regression`, and `@api`.
- Test data: descriptive, typed, and separated from test logic; avoid generic names like `data1`.

## Coding Standards

- Enable strict TypeScript checks and avoid `any`.
- Await all Playwright operations and use web-first assertions.
- Avoid fixed sleeps; use locator assertions and observable navigation/state.
- Keep each test focused and independent; do not communicate through execution order.
- Avoid broad catches, swallowed failures, and hard-coded secrets.
- Review changes to selectors, fixtures, and shared configuration as production code.
- Keep setup/teardown visible and bounded; no test should leave persistent test data without an approved cleanup plan.
