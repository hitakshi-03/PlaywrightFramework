# Playwright Framework

A TypeScript end-to-end testing framework built with Playwright Test for the public Scripted QA application. It includes Chromium smoke and regression tests, environment validation, HTML and Allure reporting, GitHub Actions workflows, and role-specific Copilot agent guidance.

## Requirements

- Node.js 20 or later
- npm

## Setup

Install dependencies and the Chromium browser:

```powershell
npm ci
npx playwright install chromium
```

By default, tests use `https://www.scriptedqa.com/`. To override the target locally, copy the example environment file and edit `BASE_URL`:

```powershell
Copy-Item .env.example .env
```

Use only an authorized test environment for tests that require authentication or change cart state. Do not put credentials in source files or commit `.env`; provide `E2E_USERNAME` and `E2E_PASSWORD` through your local environment or a secret manager.

Authentication-negative and cart-mutation scenarios require additional explicit approval flags and an owner-approved non-public target:

```text
E2E_AUTH_NEGATIVE_TESTS_APPROVED=true
E2E_CART_MUTATION_APPROVED=true
```

Only enable the relevant flag after confirming the dedicated test identity, data isolation, and cleanup policy. Cart-mutation tests also expect an isolated empty cart. These scenarios remain skipped unless their requirements are met.

## Run tests

```powershell
npm run typecheck
npm run test:smoke
npm run test:regression
```

Run the complete Playwright suite with:

```powershell
npm test
```

The smoke and regression scripts target Chromium. Tests that need credentials are skipped when credentials are not configured. See [docs/ci.md](docs/ci.md) for GitHub Actions setup and its protected regression environment.

## Reports

Playwright HTML reports are written to `reports/playwright-html/`. Open the latest report with:

```powershell
npx playwright show-report reports/playwright-html
```

Allure results are written to `reports/allure-results/`. Generate and open an Allure report with:

```powershell
npm run report:allure
npm run report:allure:open
```

Reports, traces, screenshots, videos, and test results may contain application state. Keep them out of version control and handle them as sensitive data.

## Repository layout

| Path | Purpose |
| --- | --- |
| `tests/smoke/` | Fast application availability checks |
| `tests/regression/` | Authentication, navigation, shopping, and cart scenarios |
| `tests/support/` | Test environment and scenario helpers |
| `pages/` | Playwright page objects |
| `config/` | Environment configuration and validation |
| `specs/planner-output/` | Draft scenario and journey planning artifacts |
| `specs/approved-test-plans/` | Candidate test plans and approval records |
| `.github/agents/` | Planner, Generator, and Healer agent instructions |
| `.github/workflows/` | GitHub Actions workflows |
| `docs/` | Framework architecture, reporting, and CI guidance |

Review candidate plans for human approval before using them to generate tests. Agent roles and repository boundaries are described in `.github/copilot-instructions.md`.
