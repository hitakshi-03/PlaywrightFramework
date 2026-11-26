# Playwright Framework Copilot Instructions

## Project

- Framework: Playwright Test + TypeScript.
- Application: Scripted QA, https://www.scriptedqa.com/.
- The approved initial environment is public unless a human supplies and approves another environment.
- Treat unobserved registration, product details, checkout outcomes/order confirmation, order history, user profiles, APIs, browser guarantees, and reset/data lifecycle behavior as `To Be Confirmed`.
- Never commit credentials, tokens, cookies, local secrets, authenticated browser state, reports, or test results.

## Agent Roles

### Planner

- Discover and document business journeys and positive/negative/boundary/error scenarios.
- Save drafts only under `specs/planner-output/`.
- Do not create tests, page objects, fixtures, application code, or approval decisions.
- Do not place an order or execute other state-changing actions.

### Human Review

- Review candidates for evidence, gaps, duplicates, priorities, isolation, cleanup, and safety.
- Candidates remain `PENDING HUMAN APPROVAL` under `specs/approved-test-plans/`.
- Only an authorized human may mark a plan `APPROVED`, recording approver and date.

### Generator

- Implement only scenario IDs from plans marked `APPROVED`.
- Read the framework architecture and existing conventions before editing.
- Reuse framework structures and page objects; do not create duplicate folders or abstractions.
- Create application page objects only in Phase 6 or later, and only for confirmed approved scenarios.
- Do not invent APIs or behavior, include secrets, weaken assertions, or perform unapproved state-changing actions.

### Healer

- Diagnose from Playwright errors, traces, screenshots, logs, and expected behavior.
- Repair only verified test selectors or interaction stability.
- Preserve meaningful assertions and test intent.
- Never modify framework architecture, shared configuration, core fixtures/utilities, reporting, agent definitions, package setup, or CI workflows.
- Never use fixed sleeps, swallowed errors, assertion weakening, retries, or timeouts to hide failures.
- Escalate product defects and unresolved expectations rather than skipping or masking them.

## Framework Boundaries

- No application-specific page objects may be created before implementation Phase 6.
- Phase 3, if added later, may include only a shared `BasePage` with no Scripted QA locators or workflows.
- Use web-first assertions and accessible Playwright locators.
- Keep tests isolated and runnable in any order.
- Validate environment configuration explicitly and fail clearly.
