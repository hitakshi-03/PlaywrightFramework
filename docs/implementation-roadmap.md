# Playwright Agent-Driven Implementation Roadmap

## Purpose and Execution Rules

This roadmap is the execution blueprint for a Playwright + TypeScript framework targeting Scripted QA at <https://www.scriptedqa.com/>. The application is a QA practice playground with a Shopping catalog/cart, not a confirmed production retail system. Use the site behavior and feature inventory in `docs/framework-vision.md`; use `docs/framework-architecture.md` as the implementation authority.

Run the phases in order. Each phase has a copy-paste prompt for GitHub Copilot Chat in **Agent Mode**. Start a new Agent Mode task for each phase, provide the phase prompt and any referenced artifacts, inspect the diff, run the stated validation, and obtain human approval before proceeding.

### Global Guardrails

- **No application-specific page objects before Phase 6.** Phases 0-5 must not create `LoginPage`, `HomePage`, `SearchPage`, `ShoppingPage`, `ProductPage`, `CartPage`, `CheckoutPage`, page-object fixtures, or equivalent route-specific objects. Phase 3 may create the shared `BasePage` foundation only; it must not contain application locators or workflows.
- Use only behavior supported by the observed UI or approved product requirements. Mark unknown behavior **To Be Confirmed**; do not invent APIs, flows, or expected results.
- Never put credentials, tokens, cookies, or authenticated state in source control, prompts, reports, or logs. Never run order placement against production or an unapproved environment.
- Planner output is a draft. Copilot cannot approve its own plan. Phase 5 may place review candidates in `specs/approved-test-plans/`, but they remain unusable while `PENDING HUMAN APPROVAL`; a designated human owner must record `APPROVED` status, approver, and date before Generator implementation.
- Healer may repair test selectors/interactions after evidence-based diagnosis, but must never modify framework architecture or weaken meaningful coverage.
- Keep each phase focused. Do not silently skip failed validation or carry forward unresolved architecture decisions as facts.

## Phase 0 - Documentation and Architecture

### Objective

Review the framework vision, architecture, and roadmap for consistency, completeness, and executable sequencing before implementation begins.

### Tasks

- [ ] Read all three framework documents.
- [ ] Compare the roadmap phases, dependencies, deliverables, and gates against the architecture and vision.
- [ ] Check that observed Scripted QA behavior is distinguished from assumptions and **To Be Confirmed** features.
- [ ] Verify agent responsibilities and human approval gates are unambiguous.
- [ ] Verify the no-page-objects-before-Phase-6 constraint is consistent throughout.
- [ ] Record findings and propose documentation-only changes; do not generate implementation code.

### Deliverables

- Reviewed documentation with contradictions/gaps corrected.
- A concise list of remaining decisions and application facts that require confirmation.

### Definition of Done

- [ ] All three documents agree on scope, feature status, and agent responsibilities.
- [ ] Every phase has the required five sections and an Agent Mode prompt.
- [ ] No unverified feature is presented as existing behavior.
- [ ] Human owner confirms the architecture and roadmap are ready for Phase 1.

### GitHub Copilot Execution Prompt

> Act as a Senior QA Automation Architect. Review `docs/framework-vision.md`, `docs/framework-architecture.md`, and `docs/implementation-roadmap.md` as one system. Check for contradictions, missing dependencies, vague completion criteria, unsupported claims about Scripted QA at https://www.scriptedqa.com/, and gaps in the Planner → human approval → Generator → Healer workflow. Confirm that no application-specific page objects are introduced before Phase 6, and that Phase 3's shared BasePage is not a route-specific page object. Make documentation-only edits needed to resolve verified issues; do not create or modify implementation code. Treat unobserved registration, product detail, checkout results, order history/profile, and APIs as To Be Confirmed. Summarize changed files, unresolved decisions, and why the roadmap is executable.

## Phase 1 - Playwright Setup

### Objective

Initialize a reproducible Playwright Test + TypeScript project and establish environment-aware Playwright settings.

### Tasks

- [ ] Inspect existing files, scripts, package manager, and runtime versions before changing project setup.
- [ ] Initialize Playwright Test only if it is not already configured.
- [ ] Configure TypeScript strictness and project scripts.
- [ ] Configure `baseURL`, browser projects, timeouts, worker/retry defaults, and artifact paths through Playwright configuration.
- [ ] Define environment selection and validate required environment variables without placing secrets in source.
- [ ] Add/verify ignore rules for generated reports, test results, local env files, and authenticated state.
- [ ] Do not create application-specific page objects or page-object fixtures.

### Deliverables

- Playwright Test and TypeScript project configuration.
- Environment template with variable names and placeholder values only.
- Reproducible scripts for type checking and test execution.

### Definition of Done

- [ ] Dependencies and browser setup follow the existing package manager/repository conventions.
- [ ] A minimal non-page-object smoke check can open the configured application URL.
- [ ] Missing required environment settings fail with a clear message.
- [ ] Secrets and generated state are excluded from source control.
- [ ] No application-specific page object has been created.

### GitHub Copilot Execution Prompt

> You are implementing Phase 1 of the Scripted QA Playwright framework. First inspect the repository and preserve its existing package manager, conventions, and user changes. Read `docs/framework-vision.md` and `docs/framework-architecture.md`. Initialize `@playwright/test` only if needed; configure TypeScript strict mode, scripts for type-checking and running tests, and `playwright.config.ts` with environment-driven `baseURL` (the approved initial URL is https://www.scriptedqa.com/), Chromium smoke execution, explicit timeouts/workers/retries, and failure artifact defaults. Add a safe `.env.example` containing names/placeholders only and ensure local env files, reports, test results, and authenticated state are ignored. Validate required configuration clearly. Add only a minimal browser-open smoke check if needed; do not create page objects, fixtures, application test flows, or real credentials. Run the smallest relevant install/type-check/test commands and report results, changed files, and any environment blockers.

## Phase 2 - Playwright Agent Setup

### Objective

Configure dedicated Planner, Generator, and Healer agents using a supported Playwright/Copilot mechanism with explicit roles, inputs, outputs, and boundaries.

### Tasks

- [ ] Inspect the installed Playwright version and available official agent initialization/help before choosing a setup mechanism.
- [ ] Prefer the official Playwright agent initializer when supported; otherwise use the repository's supported GitHub Copilot custom-agent format.
- [ ] Create separate Planner, Generator, and Healer agent profiles.
- [ ] Add shared repository instructions for architecture, privacy, test isolation, evidence, and human review.
- [ ] Create the planner/approved-plan output directories and explain their workflow.
- [ ] Do not install an unverified third-party agent package or duplicate an existing agent setup.
- [ ] Do not create application-specific page objects.

### Deliverables

- Three discoverable Planner, Generator, and Healer agent profiles (suggested custom-agent paths: `.github/agents/playwright-planner.agent.md`, `.github/agents/playwright-generator.agent.md`, and `.github/agents/playwright-healer.agent.md`; retain official initializer paths if they differ)
- `.github/copilot-instructions.md`
- `specs/planner-output/README.md` and `specs/approved-test-plans/README.md` (or equivalent tracked directory guidance)
- Setup notes documenting the supported initialization method and any generated configuration.

### Definition of Done

- [ ] Planner only discovers and plans; it does not implement tests or page objects.
- [ ] Generator implements only explicitly approved plans and reuses the established framework.
- [ ] Healer repairs evidence-backed test issues and is prohibited from architecture/configuration changes.
- [ ] All three agents inherit common safety and coding instructions.
- [ ] Agent files use a supported format and are discoverable in the target Copilot environment; any initializer-specific filenames are mapped in the setup notes.
- [ ] No application-specific page objects have been created.

### GitHub Copilot Execution Prompt

> Implement Phase 2 only. Inspect the repository, installed Playwright version, and available Playwright agent initialization command/help. Use the official Playwright initialization mechanism if this installed version supports it. Otherwise configure supported GitHub Copilot custom agents using the suggested paths `.github/agents/playwright-planner.agent.md`, `.github/agents/playwright-generator.agent.md`, and `.github/agents/playwright-healer.agent.md`; do not invent unsupported frontmatter or install an unverified third-party package. If the official initializer emits different canonical paths, retain them and document the mapping rather than renaming generated files. Add `.github/copilot-instructions.md` for project-wide rules and README guidance under `specs/planner-output/` and `specs/approved-test-plans/`. Define Planner as analysis/planning only, Generator as implementation from human-approved plans only, and Healer as evidence-based test/selector repair only, with an absolute prohibition on changing framework architecture. Include Scripted QA's verified scope and To Be Confirmed boundaries from the docs. State that no application page objects may be created before Phase 6. Do not create tests or page objects. Validate agent file discovery/format using available tooling and report the chosen setup method and expected files.

## Phase 3 - Framework Foundation

### Objective

Create shared framework foundations, environment management, utilities, logging, and baseline reporting without implementing application-specific pages.

### Tasks

- [ ] Create the approved folder structure for tests, fixtures, helpers, utilities, API clients, test data, config, docs, reports, and specs.
- [ ] Implement a minimal shared `BasePage` foundation with no app-specific selectors or navigation flows.
- [ ] Add a small typed logger/utilities layer only for shared needs.
- [ ] Implement validated environment configuration and safe secret handling.
- [ ] Configure baseline Playwright HTML reporting, trace, screenshot, and video policies.
- [ ] Add only generic fixtures required by the framework; do not add page-object fixtures.
- [ ] Add or refine architecture and coding conventions in repository instructions.

### Deliverables

- Framework folders and shared foundation utilities.
- Generic environment, logging, and fixture support.
- Playwright HTML report and bounded failure artifact configuration.

### Definition of Done

- [ ] Shared utilities are typed, focused, and fail explicitly on invalid configuration.
- [ ] `BasePage` contains no Scripted QA locators or application-specific actions.
- [ ] No concrete page classes/page objects or page-object fixtures exist.
- [ ] Reports/artifacts are generated in ignored locations and do not intentionally log secrets.
- [ ] Type checking and a minimal framework validation pass.

### GitHub Copilot Execution Prompt

> Implement Phase 3 using `docs/framework-architecture.md` as the source of truth. Create the approved framework folder structure, a minimal shared `BasePage` foundation with no application-specific locators/workflows, a small typed logger and genuinely reusable utilities, validated environment management, generic fixtures only where justified, and baseline Playwright HTML/trace/screenshot/video-on-failure reporting configuration. Reuse existing code and dependencies; do not create duplicate abstractions. Do not create `LoginPage`, `HomePage`, `SearchPage`, `ShoppingPage`, `ProductPage`, `CartPage`, `CheckoutPage`, any route-specific page object, or page-object fixture. Do not implement application tests. Keep secrets out of code and reports, and ensure generated output is ignored. Run type-checking and the smallest relevant validation. Summarize the foundation and explicitly confirm that no application page objects were created.

## Phase 4 - Test Plan Generation

### Objective

Use the Playwright Planner to inspect the available application and produce comprehensive, business-focused test-plan drafts grounded in observed behavior.

### Tasks

- [ ] Provide the Planner with the vision, architecture, application URL, and safe test environment details.
- [ ] Discover available routes, page areas, and user journeys from the site.
- [ ] Identify positive, negative, boundary, and error scenarios where expected behavior is observable/confirmed.
- [ ] Cover authentication, navigation, catalog search/filter, cart, and other confirmed practice categories as appropriate.
- [ ] Mark unsupported journeys and results (registration, product detail, full checkout, order history/profile, API) **To Be Confirmed**.
- [ ] Do not submit Place Order or perform other side-effecting actions.
- [ ] Write all drafts and supporting discovery artifacts under `specs/planner-output/`.

### Deliverables

- Planner index and application feature/route inventory.
- Business journey maps and scenario plans with IDs, preconditions, steps, expected outcomes, priority/risk, and evidence status.
- Explicit assumptions and To Be Confirmed register.

### Definition of Done

- [ ] Plans distinguish observed behavior, inferred behavior, and unknowns.
- [ ] Positive and negative cases are included where supported by actual behavior.
- [ ] Plans identify setup, isolation, cleanup, risk, and environment requirements.
- [ ] No test code, page objects, secrets, or order-placement action is produced.
- [ ] All Planner output is saved under `specs/planner-output/`.

### GitHub Copilot Execution Prompt

> Act as the Playwright Planner Agent. Read `docs/framework-vision.md`, `docs/framework-architecture.md`, `.github/copilot-instructions.md`, and the repository's test conventions. Analyze the publicly visible application at https://www.scriptedqa.com/ and its reachable pages using the available browser tools; do not repeat or save any on-page credential values. Discover routes, functional areas, and user journeys. Produce comprehensive business-focused plans with positive, negative, boundary, and error scenarios where the expected behavior can be supported by evidence. Prioritize sign-in/navigation and the observed Shopping catalog search/category/price filters/add-to-cart/cart summary, and inventory the other observed practice categories. For every scenario include a stable ID, business goal, preconditions, steps, expected results, priority/risk, data needs, cleanup, and evidence/assumption status. Mark registration, product details, checkout outcome/order confirmation, order history/profile, API behavior, and any unverified edge behavior To Be Confirmed. Do not place an order, create tests, create page objects, or modify application/framework code. Save the discovery report, journey map, scenario plans, and To Be Confirmed register under `specs/planner-output/`. Summarize coverage and remaining unknowns.

## Phase 5 - Test Plan Review

### Objective

Review Planner drafts for completeness, evidence, gaps, duplicates, feasibility, and risk, then prepare a human-approval-ready set of prioritized plans.

### Tasks

- [ ] Read all Planner output and compare it with the vision, architecture, and observed app.
- [ ] Find missing journey branches, negative cases, duplicates, vague assertions, unsafe actions, and unsupported assumptions.
- [ ] Assign priority and execution layer (UI/API/smoke/regression) with rationale.
- [ ] Map candidate scenarios to business goals and requirements/observations.
- [ ] Write review notes and candidate plans under `specs/approved-test-plans/`, with each candidate marked `PENDING HUMAN APPROVAL`.
- [ ] Preserve deferred and rejected scenarios with reasons.
- [ ] Define a human sign-off step: only an authorized owner may change a candidate to `APPROVED`, recording approver and date.

### Deliverables

- Reviewed candidate test plans and index under `specs/approved-test-plans/`; candidates remain unusable until human approval is recorded.
- Gap/duplicate review and priority rationale.
- Deferred/rejected/To Be Confirmed register.
- Explicit plan status transition: `PENDING HUMAN APPROVAL` → human-recorded `APPROVED` with approver/date.

### Definition of Done

- [ ] Each candidate scenario is traceable to evidence or a confirmed requirement.
- [ ] Duplicates are consolidated and unsupported expectations removed or flagged.
- [ ] Priority, test layer, environment, state risk, and cleanup are explicit.
- [ ] Generator cannot consume a pending plan; `APPROVED` status includes an authorized approver and date.
- [ ] No tests or page objects are generated in this phase.

### GitHub Copilot Execution Prompt

> Act as a senior test-plan reviewer. Review every artifact in `specs/planner-output/` against `docs/framework-vision.md`, `docs/framework-architecture.md`, and the observable Scripted QA behavior. Identify coverage gaps, duplicate scenarios, ambiguous or non-verifiable assertions, missing negative cases, data/isolation/cleanup risks, and unsupported assumptions. Assign business-focused priorities (for example P0/P1/P2) and execution layer (smoke/regression/UI/API) with reasons. Create a traceable, review-ready plan index and scenario plans under `specs/approved-test-plans/`; consolidate duplicates, preserve deferred/rejected items and reasons, and mark all plan candidates `PENDING HUMAN APPROVAL`. Do not self-approve or change a candidate to `APPROVED` during this task. Stop after preparing the candidates and request explicit human sign-off. Only after an authorized human explicitly approves a candidate may its status change to `APPROVED`; record the approver and date, and require Generator to ignore all pending plans. Do not implement tests, create page objects, or convert To Be Confirmed assumptions into expected behavior. Do not include credentials or authorize Place Order against an unapproved environment. Summarize gaps, duplicates, priorities, and decisions requiring human approval.

## Phase 6 - Page Object Design

### Objective

Design and implement only the page objects required by explicitly human-approved scenarios.

### Tasks

- [ ] Confirm plan status is `APPROVED` and review the approved scenarios and architecture.
- [ ] Map each approved UI scenario to the minimum required routes/components.
- [ ] Reuse existing page objects and the shared `BasePage`; avoid redundant page classes.
- [ ] Create page objects only for confirmed routes and approved behavior.
- [ ] Add semantic locators and user-level actions/state queries; keep test assertions in tests.
- [ ] Do not create speculative objects for unconfirmed product details, checkout, profile, or order history.

### Deliverables

- A page-object-to-approved-scenario traceability map.
- Minimum required page objects, such as `LoginPage`, `SearchPage`/`ShoppingPage`, `ProductPage`, `CartPage`, or `CheckoutPage` only if approved plans require them.
- Locator and page-object design notes for unresolved app affordances.

### Definition of Done

- [ ] Every page object maps to at least one approved scenario and a confirmed page/route.
- [ ] No speculative or duplicate page object exists.
- [ ] Page objects follow architecture and expose business actions/state, not scenario assertions.
- [ ] The page-object layer type-checks and its behavior is validated through approved tests or focused checks.

### GitHub Copilot Execution Prompt

> Implement Phase 6 only. Read `docs/framework-architecture.md`, `.github/copilot-instructions.md`, the shared `BasePage`, and only plans explicitly marked `APPROVED` under `specs/approved-test-plans/`. Build a traceability map from each approved UI scenario to the minimum required confirmed route/component. Create or update only the page objects that those plans need, using accessible locators and focused business actions/state queries. Candidate names include `LoginPage`, `SearchPage` or `ShoppingPage`, `ProductPage`, `CartPage`, and `CheckoutPage`, but create each only if an approved plan requires it and the corresponding UI is verified. Reuse existing objects; do not invent routes, selectors, or behavior. Do not create tests in this phase. Keep assertions in tests, not page objects. Run type-checking and relevant focused validation; list each new/changed page object and the approved scenario IDs that justify it.

## Phase 7 - Automated Test Generation

### Objective

Use the Playwright Generator to implement tests from approved plans using the established architecture and page objects.

### Tasks

- [ ] Read only `APPROVED` plans and their traceability IDs.
- [ ] Read framework architecture, Copilot instructions, fixtures, and existing tests/page objects.
- [ ] Generate isolated smoke/regression tests with explicit business assertions.
- [ ] Reuse existing fixtures and page objects; avoid duplicate framework structures.
- [ ] Label tests consistently and preserve test-plan IDs in test metadata/titles.
- [ ] Run targeted tests and update plan traceability with file/test references.

### Deliverables

- Tests under the established `tests/` structure.
- Updated scenario-to-test traceability.
- Targeted test execution results.

### Definition of Done

- [ ] Every generated test maps to an approved scenario and tests confirmed behavior.
- [ ] Tests are independent, deterministic, and use web-first assertions without fixed sleeps.
- [ ] No duplicate fixtures, configuration, folder structures, or page objects are introduced.
- [ ] Targeted validation passes or failures are classified and documented.

### GitHub Copilot Execution Prompt

> Act as the Playwright Generator Agent. Read the plans marked `APPROVED` in `specs/approved-test-plans/`, `docs/framework-architecture.md`, `.github/copilot-instructions.md`, and the existing tests, fixtures, and page objects. Implement only the approved scenario IDs assigned for this task. Reuse existing framework structures and page objects; do not create duplicate frameworks, folders, fixtures, configuration, or page objects. Keep tests independent, business-focused, and traceable to plan IDs; use accessible locators and web-first assertions, never fixed sleeps. Do not invent application behavior/API endpoints, embed credentials, weaken assertions, or submit Place Order unless the plan explicitly permits it in an approved non-production environment. Add or update only the required test/data files, run the smallest relevant test command, and update the scenario traceability map with test file/name and result.

## Phase 8 - Test Execution and Healing

### Objective

Run approved test suites, diagnose failures from evidence, and use the Healer for bounded selector/interaction stability repairs.

### Tasks

- [ ] Execute the requested smoke/regression tests in the specified approved environment.
- [ ] Capture and inspect Playwright errors, traces, screenshots, and relevant logs.
- [ ] Classify each failure as product defect, test defect, environment issue, or unresolved expectation.
- [ ] Ask Healer to repair only verified test selector/interaction defects.
- [ ] Preserve meaningful assertions and business intent.
- [ ] Escalate suspected product defects, missing expectations, or architectural problems instead of masking them.

### Deliverables

- Test execution summary and failure classification.
- Minimal test/page-object repair diffs where justified.
- Remaining defects, blockers, and flaky tests with evidence.

### Definition of Done

- [ ] Target suite has been executed and results are recorded.
- [ ] Every repair has evidence and addresses a root cause.
- [ ] Healer has not modified framework architecture, shared configuration, core fixtures, agent definitions, or CI design.
- [ ] No fixed sleeps, swallowed errors, weakened assertions, or retries used to hide a failure.
- [ ] Product defects and unresolved expectations remain visible.

### GitHub Copilot Execution Prompt

> Act as the Playwright Healer Agent. Run the requested approved tests and inspect the failure output, traces, screenshots, and relevant logs before editing. Classify each failure as application/product defect, test defect, environment issue, or unresolved expectation. For verified test defects only, make the smallest selector or flaky-interaction repair in the affected test or existing page object, preserving the approved scenario and all meaningful assertions. Never modify framework architecture: do not edit architecture/vision/roadmap docs, project configuration, BasePage, shared fixtures/utilities, reporting strategy, agent definitions, package/tooling setup, or CI workflows. Do not add fixed sleeps, suppress errors, weaken assertions, accept unknown behavior, or increase retries/timeouts as a workaround. Do not place orders or mutate an unapproved environment. Re-run the failing test and report evidence, classification, files changed, and any product defect/blocker left unresolved.

## Phase 9 - API Testing

### Objective

Add API clients, validations, and assertions only when a supported API contract and approved environment are available.

### Tasks

- [ ] Obtain and review API specifications, base URL, authentication contract, and test-data/reset policy.
- [ ] Confirm API endpoints are supported contracts, not guessed from UI routes or internal traffic.
- [ ] Implement typed API clients using Playwright `APIRequestContext`.
- [ ] Add status, schema, error, and business-rule assertions from the contract.
- [ ] Keep API setup/cleanup explicit and independently runnable.
- [ ] If no contract is available, document the blocker and keep API coverage **To Be Confirmed**.

### Deliverables

- Typed API clients and contract-based API tests, if an API is confirmed.
- API scenario traceability and environment/auth/data documentation.
- A clear To Be Confirmed record if the contract is unavailable.

### Definition of Done

- [ ] Every endpoint and assertion maps to a reviewed API contract and approved scenario.
- [ ] Authentication and test data are managed securely.
- [ ] API tests are isolated, tagged, and do not depend on UI test order.
- [ ] No endpoint is guessed or inferred from browser implementation details.

### GitHub Copilot Execution Prompt

> Implement Phase 9 only. First inspect the repository for a reviewed API specification and approved API scenarios under `specs/approved-test-plans/`. If no supported contract, base URL, authentication method, and test-data policy are present, do not invent endpoints or add speculative API code; record the missing inputs as To Be Confirmed and stop. If they are present, implement typed API clients using Playwright `APIRequestContext`, then add contract-grounded status, schema, error, and business assertions for approved scenario IDs. Keep API tests isolated from UI flows and use only documented setup/cleanup operations. Store secrets in environment/CI secret configuration, never source or logs. Reuse existing config and avoid duplicate clients/helpers. Run the targeted API tests and report the contract references, changed files, and results.

## Phase 10 - Reporting

### Objective

Provide useful HTML and Allure reports plus privacy-safe screenshots, videos, and traces for local and CI diagnosis.

### Tasks

- [ ] Verify the existing Playwright HTML reporter and artifact policies.
- [ ] Add Allure reporter integration only with a compatible, approved dependency/version.
- [ ] Configure screenshot, video, and trace capture policies, preferably on failure/retry as appropriate.
- [ ] Configure report output paths and cleanup/retention expectations.
- [ ] Verify report metadata and attachments do not expose secrets or unnecessary personal data.
- [ ] Document local commands for generating/opening supported reports.

### Deliverables

- Playwright HTML and Allure reporting configuration.
- Screenshots/videos/traces attached or retained according to policy.
- Report generation instructions and artifact privacy/retention notes.

### Definition of Done

- [ ] A representative test run produces valid Playwright HTML and Allure output.
- [ ] Failure evidence is captured and linked to useful test context.
- [ ] Artifacts are stored in ignored output directories and do not reveal secrets.
- [ ] Dependencies and artifact retention comply with project policy.
- [ ] If Allure is blocked by dependency policy or compatibility, the phase remains blocked until the owner approves and documents an HTML-only exception.

### GitHub Copilot Execution Prompt

> Implement Phase 10 reporting in the existing Playwright framework. Inspect current package versions, reporters, scripts, and artifact paths first. Preserve Playwright HTML reporting and add a compatible Allure Playwright reporter only after verifying version compatibility and repository dependency policy. Configure screenshots, videos, and traces with an explicit bounded policy (capture useful failure/retry evidence without recording everything unnecessarily); ensure report outputs are ignored by Git. Include test, browser, and environment context without secrets or sensitive state. Add or update concise report-generation instructions. Do not change test assertions, framework architecture, or CI workflow in this phase. Run a small representative test, generate both reports, and verify expected files exist and contain no credential values. Summarize configuration, validation, and retention assumptions.

## Phase 11 - CI/CD Integration

### Objective

Run Playwright smoke and regression suites in GitHub Actions and publish reports/artifacts securely.

### Tasks

- [ ] Confirm Phase 10's approved reporter outputs and publish only reporters that are configured and approved.
- [ ] Add or update GitHub Actions workflow(s) following existing repository conventions.
- [ ] Run install, type checking, and Chromium smoke tests on pull requests.
- [ ] Provide a separately selectable regression job (branch, schedule, or workflow dispatch as approved).
- [ ] Configure base URL and secrets through Actions variables/secrets.
- [ ] Upload HTML/Allure reports and failure artifacts with finite retention.
- [ ] Use least-privilege workflow permissions and avoid production state-changing tests.
- [ ] Make browser, suite, workers, and environment explicit inputs where appropriate.

### Deliverables

- GitHub Actions workflow for smoke and regression execution.
- Secure secret/environment configuration guidance.
- Report and artifact publishing configuration.

### Definition of Done

- [ ] Workflow syntax is valid and jobs can be selected/run as documented.
- [ ] Smoke and regression execution are distinct and reproducible.
- [ ] Configured, approved report artifacts publish on success/failure and expire according to policy; an unapproved/missing Allure report is not treated as a successful Allure deliverable.
- [ ] No credentials are committed or printed; permissions are least privilege.
- [ ] State-changing tests are restricted to approved non-production environments.

### GitHub Copilot Execution Prompt

> Implement Phase 11 for GitHub Actions after Phase 10's reporting decision is recorded. Inspect existing workflows, package scripts, environment configuration, and actual approved reporter output paths before editing. Add/update workflow YAML to install dependencies reproducibly, install required Playwright browsers, run type checking, execute a fast Chromium smoke suite on pull requests, and provide a separately selectable regression run using the repository's approved triggers. Configure environment/base URL and credentials only through GitHub Actions variables/secrets; never add secrets or echo them. Publish each configured and approved report (including Allure only if Phase 10 enabled it) and failure traces/screenshots/videos as appropriate with finite retention, including artifacts on failed jobs. Use least-privilege permissions, avoid duplicate workflows, and ensure any state-changing scenario is restricted to an explicitly approved non-production environment. Validate YAML/workflow syntax using available tooling and run the local equivalents of pipeline commands where possible. Summarize triggers, jobs, secrets required by name only, artifacts, and validation.

## Phase 12 - Framework Optimization

### Objective

Improve maintainability, runtime, stability, and framework health using measured evidence rather than speculative abstraction.

### Tasks

- [ ] Review test runtime, flaky/retry trends, worker utilization, failure categories, and artifact sizes.
- [ ] Identify and remove duplicated test logic, fixtures, selectors, and helpers without changing behavior.
- [ ] Refactor only repeated patterns with clear reuse value; preserve approved test traceability.
- [ ] Optimize slow setup and execution without introducing shared mutable state or fixed waits.
- [ ] Review dependency health, TypeScript strictness, locator quality, secret handling, and agent boundaries.
- [ ] Produce a health report with prioritized improvements and unresolved risks.

### Deliverables

- Evidence-backed refactor/performance improvements.
- Framework health check report and follow-up recommendations.
- Updated suite metrics/baseline.

### Definition of Done

- [ ] Targeted and relevant full suites preserve behavior and pass.
- [ ] Runtime/stability changes are supported by before/after evidence.
- [ ] Duplicate removal does not create a second abstraction or weaken assertions.
- [ ] Agent boundaries and approved-plan traceability remain intact.
- [ ] Remaining risks and recommended next work are documented.

### GitHub Copilot Execution Prompt

> Perform Phase 12 as a measured framework health review. Inspect test results/reports, runtime and retry data, existing tests/page objects/fixtures, dependency status, TypeScript checks, and CI artifacts. First report evidence-backed findings; then make only low-risk, behavior-preserving refactors that remove real duplication or improve measured performance/stability. Do not add abstractions without demonstrated reuse, change approved scenario intent, weaken assertions, use fixed sleeps, hide errors, or share mutable state across tests. Preserve the Planner/Generator/Healer boundaries and scenario traceability. Run targeted checks plus the smallest relevant regression suite. Produce a concise health report with before/after evidence, changed files, unresolved risks, and prioritized recommendations.

## Reusable Prompt Library

Use these prompts as reusable starting points. Replace bracketed inputs and provide the relevant approved plan, test evidence, and environment details. Keep all global guardrails in force.

### 1. Planner Agent

> Act as the Playwright Planner Agent for Scripted QA at https://www.scriptedqa.com/. Read `docs/framework-vision.md`, `docs/framework-architecture.md`, and `.github/copilot-instructions.md`. Analyze the application area `[AREA/URL]` using available browser tools and supplied requirements. Discover business journeys and write positive, negative, boundary, and error scenarios only where behavior is supported by evidence. For each scenario include ID, goal, preconditions, steps, observable expected results, priority, test layer, data, cleanup, and evidence status. Mark unknown behavior To Be Confirmed. Do not expose credentials, submit orders, write code, or create page objects. Save drafts under `specs/planner-output/` and summarize scope, gaps, and risks.

### 2. Generator Agent

> Act as the Playwright Generator Agent. Implement only the human-approved scenario IDs `[SCENARIO IDS]` from `specs/approved-test-plans/`. Read `docs/framework-architecture.md`, `.github/copilot-instructions.md`, and existing tests, fixtures, and page objects. Reuse existing structures; do not create duplicate framework layers. Use accessible locators, isolated setup, web-first assertions, and test-plan traceability. Do not invent behavior or APIs, include secrets, add fixed sleeps, weaken assertions, or perform unapproved state-changing actions. Run targeted tests, update traceability, and report files and results.

### 3. Healer Agent

> Act as the Playwright Healer Agent. Diagnose the failure in `[TEST FILE/TEST NAME]` using the supplied error, trace, screenshot, logs, and expected behavior. Classify it as product defect, test defect, environment issue, or unresolved expectation before editing. For verified test defects, make the smallest selector/interaction repair while preserving test intent and assertions. Never modify framework architecture, configuration, shared fixtures/utilities, CI, reporting strategy, or agent definitions. Do not add sleeps, suppress errors, weaken assertions, or raise retries/timeouts to mask failure. Re-run the affected test and report evidence, changes, and unresolved issues.

### 4. Architecture Review

> Act as a Senior QA Automation Architect. Review `[FILES/DIFF]` against `docs/framework-vision.md`, `docs/framework-architecture.md`, approved test plans, and `.github/copilot-instructions.md`. Check responsibilities, dependencies, duplication, maintainability, test isolation, security/privacy, agent boundaries, and scenario traceability. Verify no feature or API behavior was invented and no page object exists without an approved scenario. Do not modify files until you present findings. After approval, make only the requested documentation/architecture corrections, validate, and summarize risks.

### 5. Framework Refactoring

> Refactor `[SCOPE]` in the Playwright framework only where evidence shows duplication or maintainability/performance problems. First inspect existing usages and relevant tests. Preserve behavior, approved-plan IDs, locator semantics, and failure visibility. Do not add speculative abstractions, change test intent, introduce fixed waits/shared mutable state, or bypass architecture. Make a minimal change, run targeted and relevant regression checks, and report the rationale and before/after evidence.

### 6. New Feature Automation

> Automate the newly approved feature `[FEATURE]` for Scripted QA. Read its `APPROVED` plan in `specs/approved-test-plans/`, the framework architecture, Copilot instructions, and existing tests/page objects. Verify the UI/contract evidence before implementation. Reuse existing page objects; create or change a page object only if the approved scenarios require it and Phase 6 has been completed. Implement independent tests for the approved positive/negative scenarios, use accessible locators and web-first assertions, and keep the plan ID traceable. Do not guess behavior, add secrets, or perform unapproved side effects. Run targeted validation and report coverage, files, results, and remaining To Be Confirmed items.
