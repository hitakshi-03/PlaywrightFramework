# Scripted QA Playwright Framework — Master Recreation Prompt

> **How to use this document:** Paste this entire file into GitHub Copilot Chat in **Agent Mode** in an empty repository (or a new folder). Execute it phase by phase, starting a fresh Agent Mode task for each phase. Review diffs, run validations, and obtain human approval at every gate before continuing. Do not skip gates, do not invent application behavior, and never commit secrets.

---

## Project Overview

### Goal

Build a production-quality, maintainable **Playwright + TypeScript** end-to-end test framework for the **Scripted QA** practice application at `https://www.scriptedqa.com/`.

The framework is not just a test suite. It is a governed, agent-assisted quality engineering system with:

- A clear architecture (separation of config, pages, tests, fixtures, helpers, utilities, API scaffolding, specs, and reports).
- A human-gated, AI-assisted workflow: **Planner** discovers and drafts scenarios, **Human Review** approves, **Generator** implements approved scenarios, **Healer** repairs verified test defects.
- Safety-first execution: no secrets in source, no unapproved state-changing actions, no invented behavior, and no weakening assertions to hide failures.
- Reproducible local and CI execution with actionable failure artifacts.

### Application Context

- **Application:** Scripted QA — “Your QA Automation Playground”.
- **Approved initial base URL:** `https://www.scriptedqa.com/` (public). Treat this as the default local/smoke target unless a human supplies and approves another environment.
- **Observed authenticated areas:** `/home`, `/shopping`, `/cart`, and practice routes `/webTable`, `/dropDown`, `/alertsAndWindows`, `/frame`, `/form`, `/calender`, `/mouseActions`.
- **Observed shopping behavior:** catalog search, category filter, price-range filter, Add to Cart, cart count, cart bill with item/price/qty/total/grand total, Clear Cart, Back to Shopping, Place Order control visible on cart.
- **Not confirmed / To Be Confirmed:** registration, password recovery/MFA, profile, product detail routes, exact search/filter semantics, cart quantity semantics, empty-cart behavior, checkout outcome/order confirmation, order history, API contract, browser support matrix, environment tiers, data reset lifecycle, and rate/availability guarantees.

### Design Rationale

- **Practice app, not production retail:** The site looks commerce-like, but unverified retail capabilities must not be asserted. This prevents false-confidence tests and dangerous side effects.
- **Agent-driven but review-gated:** AI accelerates discovery and implementation, but humans own approval, risk acceptance, and product truth. This prevents hallucinated coverage from becoming “approved” behavior.
- **No page objects before Phase 6:** Early abstraction causes speculative POMs. Page objects are created only when approved scenarios prove they are needed.
- **Safety gates for state-changing tests:** Login negative probes, cart mutation, and order placement can have side effects or policy implications. They require explicit approval, non-public targets, isolation, and cleanup.

---

## Architecture Blueprint

### Target Folder Structure

Create folders incrementally by phase. Do not create every file on day one except where Phase 1/2/3 require it. The end-state structure is:

```text
project-root/
├── .github/
│   ├── agents/
│   │   ├── playwright-test-planner.agent.md
│   │   ├── playwright-test-generator.agent.md
│   │   └── playwright-test-healer.agent.md
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── copilot-setup-steps.yml
│       └── playwright.yml
├── .vscode/
│   └── mcp.json                  # optional; may be empty or include MCP config
├── .mcp.json                     # Playwright test MCP server config
├── api/
│   ├── clients/
│   │   └── README.md
│   └── schemas/
│       └── README.md
├── config/
│   └── environments.ts
├── docs/
│   ├── framework-vision.md
│   ├── framework-architecture.md
│   ├── implementation-roadmap.md
│   ├── ci.md
│   ├── reporting.md
│   └── framework-recreation-prompt.md
├── fixtures/
│   └── README.md                 # custom fixtures only when justified; no page-object fixtures before Phase 6
├── helpers/
│   └── README.md
├── pages/
│   ├── BasePage.ts               # Phase 3: shared foundation only, no app locators
│   ├── LoginPage.ts              # Phase 6+: only if approved
│   ├── HomePage.ts               # Phase 6+: only if approved
│   ├── ShoppingPage.ts           # Phase 6+: only if approved
│   └── CartPage.ts               # Phase 6+: only if approved
├── specs/
│   ├── README.md
│   ├── planner-output/
│   │   ├── README.md
│   │   ├── discovery-report.md
│   │   ├── journey-map.md
│   │   ├── scenario-catalog.md
│   │   ├── scriptedqa-scenario-plan.md
│   │   └── to-be-confirmed.md
│   └── approved-test-plans/
│       ├── README.md
│       ├── index.md
│       ├── authentication-access.md
│       ├── shopping-catalog.md
│       ├── cart-management.md
│       ├── practice-navigation.md
│       └── deferred-items.md
├── test-data/
│   └── README.md
├── tests/
│   ├── smoke/
│   │   └── opens-application.spec.ts
│   ├── regression/
│   │   ├── authentication.spec.ts
│   │   ├── shopping.spec.ts
│   │   ├── cart-management.spec.ts
│   │   └── practice-navigation.spec.ts
│   └── support/
│       ├── test-environment.ts
│       └── shopping-test-helpers.ts
├── utils/
│   └── logger.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

### Folder Responsibilities

| Path | Responsibility | Rationale |
|---|---|---|
| `config/` | Environment resolution and validation. | Keeps env parsing out of tests and config files; fails fast on bad config. |
| `pages/` | Page Object Model classes for confirmed routes/components. | Encapsulates locators and user actions; keeps tests readable and maintainable. |
| `tests/smoke/` | Fast, high-value checks. | Quick confidence signal for PRs and local sanity. |
| `tests/regression/` | Broader approved coverage. | Deeper behavior checks run separately from smoke. |
| `tests/support/` | Test-only helpers (env gates, login/navigation helpers). | Reuse without polluting page objects or production-like utils. |
| `fixtures/` | Custom Playwright fixtures when justified. | Centralizes shared setup/teardown only when reuse is real. |
| `utils/` | Small generic utilities (logger). | Avoids one-off wrappers scattered across tests. |
| `api/clients`, `api/schemas` | Future contract-based API testing. | Reserves structure without pretending an API exists. |
| `specs/planner-output/` | Draft plans/discovery from Planner. | Keeps AI drafts separate from approved implementation inputs. |
| `specs/approved-test-plans/` | Human-reviewed/approved plans. | Enforces approval gate and traceability. |
| `reports/`, `test-results/` | Generated artifacts; ignored. | Evidence is useful but should not be committed. |
| `docs/` | Vision, architecture, roadmap, CI/reporting, recreation prompt. | Makes intent and process explicit and reviewable. |

---

## Documentation Requirements

Create these docs before or alongside implementation. They are control documents, not optional notes.

| File | Purpose | Must Include |
|---|---|---|
| `docs/framework-vision.md` | Product/test scope and quality goals. | App URL, observed behavior, To Be Confirmed items, in/out of scope, critical journeys, quality goals, browser/env/reporting strategy, success criteria. |
| `docs/framework-architecture.md` | Technical blueprint and conventions. | Tech stack, evolving folder structure, POM standards, BasePage design, fixtures, env/auth/test-data strategy, reporting/logging, API strategy, CI/CD, agent boundaries, naming/coding standards. |
| `docs/implementation-roadmap.md` | Phase-by-phase execution plan. | Global guardrails, phases 0-12, each with Objective/Tasks/Deliverables/Definition of Done/GitHub Copilot Execution Prompt, reusable prompt library. |
| `docs/ci.md` | CI configuration and required secrets/vars. | Workflow triggers, required GitHub vars/secrets, protected environment rules, artifact retention, local equivalents. |
| `docs/reporting.md` | Report generation and evidence policy. | Commands, output paths, Allure lifecycle, evidence capture policy, privacy/retention. |
| `docs/framework-recreation-prompt.md` | This master recreation prompt. | Everything needed to recreate the framework in an empty repo. |

### Documentation Rationale

- **Vision prevents scope creep.** It distinguishes observed behavior from assumptions.
- **Architecture prevents inconsistency.** It defines where code belongs and what patterns are allowed.
- **Roadmap prevents chaotic implementation.** It sequences work and defines gates.
- **CI/reporting docs prevent tribal knowledge.** A new contributor can run and diagnose the suite without guessing.

---

## Playwright Configuration Standards

### `package.json`

Use a clear package name, private package, Node engine, and scripts that encode the workflow.

```json
{
  "name": "scriptedqa-playwright-framework",
  "version": "1.0.0",
  "private": true,
  "description": "Playwright and TypeScript test framework for Scripted QA",
  "scripts": {
    "clean:allure-results": "node -e \"require('node:fs').rmSync('reports/allure-results', { recursive: true, force: true })\"",
    "pretest": "npm run clean:allure-results",
    "test": "playwright test",
    "pretest:smoke": "npm run clean:allure-results",
    "test:smoke": "playwright test --project=chromium --grep @smoke",
    "pretest:regression": "npm run clean:allure-results",
    "test:regression": "playwright test --project=chromium tests/regression",
    "report:allure": "allure generate reports/allure-results --clean -o reports/allure-html",
    "report:allure:open": "allure open reports/allure-html",
    "typecheck": "tsc --noEmit"
  },
  "engines": { "node": ">=20" },
  "devDependencies": {
    "@playwright/test": "^1.65.1",
    "@types/node": "^26.6.6",
    "allure-commandline": "^2.46.1",
    "allure-playwright": "^3.15.0",
    "dotenv": "^18.0.10",
    "typescript": "^7.0.2"
  }
}
```

**Rationale:**
- `private: true` prevents accidental publishing.
- `engines` makes Node expectations explicit.
- `pretest*` cleans raw Allure results so reports represent a single run. Direct `npx playwright test` is allowed but does not clean old Allure results; docs must state this.
- `typecheck` is separate from tests for fast feedback and CI gating.
- Dependencies are dev-only; this repo is a test framework, not a runtime app.

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": [
    "config/**/*.ts",
    "pages/**/*.ts",
    "playwright.config.ts",
    "tests/**/*.ts",
    "utils/**/*.ts"
  ],
  "exclude": ["node_modules", "reports", "test-results"]
}
```

**Rationale:** `strict` catches unsafe assumptions early. `noEmit` keeps TS as type-checking only. `NodeNext` matches modern Node/ESM interop. Include only source-relevant dirs to keep typecheck focused.

### `playwright.config.ts`

```ts
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig } from './config/environments';

const { baseURL, isCI } = getEnvironmentConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    ['allure-playwright', {
      resultsDir: 'reports/allure-results',
      detail: false,
      reportMatchers: true,
      environmentInfo: {
        executionEnvironment: isCI ? 'CI' : 'local',
        browserProject: 'chromium',
        nodeVersion: process.version,
      },
    }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

**Rationale:**
- `dotenv/config` loads local `.env` for developer convenience; `.env` is ignored.
- `getEnvironmentConfig()` centralizes validation and prevents invalid/missing base URL surprises.
- `forbidOnly` in CI prevents accidentally committed `.only`.
- Retries are limited to CI (`1`) for evidence, not to mask flakiness. Local runs default to 0 for fast feedback.
- Workers are explicit: CI conservative (2), local moderate (4). Cart-mutating tests still use serial mode where needed.
- Failure artifacts are retained on failure only — enough for diagnosis, limited noise/privacy risk.
- Allure `detail: false` and no auto API-call steps reduce sensitive payload leakage; environment info contains no secrets/URLs.
- Chromium-first project keeps initial signal fast; cross-browser expansion is a later, evidence-based decision.

### `config/environments.ts`

```ts
const DEFAULT_BASE_URL = 'https://www.scriptedqa.com/';

export interface EnvironmentConfig {
  baseURL: string;
  isCI: boolean;
}

function resolveBaseURL(value: string | undefined): string {
  const configuredValue = value?.trim() || DEFAULT_BASE_URL;
  let url: URL;
  try {
    url = new URL(configuredValue);
  } catch {
    throw new Error(
      `Invalid BASE_URL "${configuredValue}". Set BASE_URL to an absolute HTTP or HTTPS URL.`,
    );
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(
      `Invalid BASE_URL "${configuredValue}". Only HTTP and HTTPS URLs are supported.`,
    );
  }
  return url.toString();
}

export function getEnvironmentConfig(env: NodeJS.ProcessEnv = process.env): EnvironmentConfig {
  const ciValue = env.CI?.trim().toLowerCase();
  if (ciValue && !['true', 'false', '1', '0'].includes(ciValue)) {
    throw new Error(`Invalid CI value "${env.CI}". Set CI to true, false, 1, or 0.`);
  }
  return {
    baseURL: resolveBaseURL(env.BASE_URL),
    isCI: ciValue === 'true' || ciValue === '1',
  };
}
```

**Rationale:** Validation is explicit and testable. Default base URL is safe for public smoke navigation. Invalid config fails before tests run with confusing errors. Accepting `env` parameter makes the function unit-testable without mutating global process env.

### Environment Variables

`.env.example` (committed, placeholders only):

```dotenv
# Copy this file to .env to override the default application URL.
BASE_URL=https://www.scriptedqa.com/
```

Local `.env` (ignored) may also contain, for approved local runs only:

```dotenv
# Playwright test settings
# BASE_URL: approved test environment URL; public scriptedqa.com targets block state-changing checks.
# E2E_USERNAME / E2E_PASSWORD: dedicated test identity used by authenticated AUTH, SHOP, CART, and NAV scenarios.
# E2E_AUTH_NEGATIVE_TESTS_APPROVED: set true only with owner approval for AUTH-002 on a non-public test target.
# E2E_CART_MUTATION_APPROVED: set true only with owner approval, an isolated empty cart, and an agreed cleanup policy for SHOP-007/CART-001/CART-002.

BASE_URL=https://www.scriptedqa.com/
E2E_USERNAME=<dedicated-test-username>
E2E_PASSWORD=<dedicated-test-password>
E2E_AUTH_NEGATIVE_TESTS_APPROVED=false
E2E_CART_MUTATION_APPROVED=false
```

**Rationale:** Separate base URL from credentials and risk gates. Gates are default-off. Public targets are blocked for negative-auth and cart mutation by code, not by trust. Never commit real credentials.

### `.gitignore`

```gitignore
node_modules/

.env
.env.*
!.env.example

reports/
test-results/
playwright-report/
blob-report/
allure-results/
allure-report/
playwright/.auth/
storage-state/
*.storage-state.json
```

**Rationale:** Prevents secrets, generated reports, traces, videos, and authenticated storage state from entering version control. This is a security and noise control.

---

## Framework Standards

### Page Object Model (POM)

#### Rules

- Create page objects only in **Phase 6+**, and only for **approved** scenarios.
- One class per confirmed route/cohesive page responsibility.
- Extend `BasePage`.
- Keep locators `private readonly` and initialize in constructor.
- Expose business-readable actions and state queries (e.g., `signIn`, `openCart`, `getVisibleProducts`, `isCartPageVisible`).
- Do **not** put scenario assertions in page objects. Assertions belong in tests.
- Prefer accessible locators: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder` equivalent accessible names. Use exact matching where ambiguity is risky.
- Avoid XPath/CSS-position selectors except when no stable semantic alternative exists; document the reason in a short comment.
- Do not make page objects responsible for env selection, secrets, or cross-route orchestration beyond simple user navigation already represented by the page.

#### `BasePage`

```ts
import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}
}
```

**Rationale:** Minimal by design. A fat base class becomes a hidden god object and couples all pages to unrelated behavior. Shared behavior should earn its place.

#### Page Object Pattern Examples

**LoginPage** — form actions/state, no assertions:
```ts
export class LoginPage extends BasePage {
  private readonly signInHeading: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signInHeading = page.getByRole('heading', { name: 'Sign In', exact: true });
    this.usernameInput = page.getByRole('textbox', { name: 'Username', exact: true });
    this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
  }

  async open(): Promise<void> { await this.page.goto('/'); }
  async signIn(username: string, password: string): Promise<void> { /* fill + click */ }
  async submit(): Promise<void> { await this.signInButton.click(); }
  async isSignInFormVisible(): Promise<boolean> { /* visibility checks */ }
}
```

**HomePage** — navigation only, typed practice areas:
```ts
export type PracticeArea = 'Table' | 'Dropdown' | 'Alerts & Windows' | 'Frame' | 'Form' | 'Calender' | 'Mouse Actions';
export class HomePage extends BasePage {
  async openShopping(): Promise<void> { await this.page.getByRole('link', { name: 'Shopping', exact: true }).click(); }
  async openPracticeArea(area: PracticeArea): Promise<void> { await this.page.getByRole('link', { name: area, exact: true }).click(); }
}
```

**ShoppingPage** — catalog discovery/filter/cart controls; handles observed DOM limitations with narrow, documented locator strategy:
```ts
export interface VisibleProduct { name: string; category: string; }
```
- Use `getByRole('textbox', { name: 'Search products...', exact: true })` for search.
- For comboboxes lacking unique accessible names, filter by a stable child option: `page.getByRole('combobox').filter({ has: page.getByRole('option', { name: 'All Categories', exact: true }) })`.
- For product cards without semantic card roles, scope from observed product image alt text and traverse minimally (`image.locator('..').locator('..')`) with a comment explaining why. This is a deliberate, documented compromise; prefer improving app test IDs if available.
- Parse cart count from button text and throw a clear error if format changes.

**CartPage** — cart state queries and actions; no order placement action.

**Rationale:** POM reduces duplication and isolates UI churn. Keeping assertions in tests preserves test intent visibility and avoids hidden assertion behavior.

### Fixtures

- Default to Playwright built-in fixtures: `page`, `context`, `browser`, `request`.
- Add custom fixtures only when setup/teardown is reused and justified.
- Do not add page-object fixtures before Phase 6. After Phase 6, add them only for approved scenarios.
- Keep fixtures lazy: a test that does not need auth should not pay auth cost.
- No broad `try/catch` that hides cleanup failures.

### Test Support Helpers

Place test-only helpers in `tests/support/`.

**`test-environment.ts` responsibilities:**
- Read `E2E_USERNAME` / `E2E_PASSWORD` from env; return `undefined` when missing.
- Provide `signIn(page, credentials)` using `LoginPage`.
- Gate dangerous scenarios:
  - `isApprovedNonPublicTarget(baseURL)` — true only when hostname is not `scriptedqa.com` or its subdomains.
  - `isAuthNegativeAttemptApproved(baseURL)` — requires `E2E_AUTH_NEGATIVE_TESTS_APPROVED=true` and non-public target.
  - `isCartMutationApproved(baseURL)` — requires `E2E_CART_MUTATION_APPROVED=true` and non-public target.

**Rationale:** Centralizes safety policy. Tests declare intent; helper enforces gates. This prevents accidental state-changing runs against public/prod-like targets.

**`shopping-test-helpers.ts`:** compose login + home navigation + shopping assertion for reuse by shopping/cart tests. Keep it small and explicit.

### Utilities

`utils/logger.ts` provides a tiny scoped console logger (`debug/info/warn/error`) with `[scope]` prefix. 

**Rationale:** Useful for debugging; must never log secrets, tokens, cookies, or PII. Prefer Playwright test steps/attachments for test evidence; logger is for framework/runtime diagnostics.

### Test Organization and Style

- Test files: `<area>.spec.ts` in `tests/smoke` or `tests/regression`.
- Tags in titles: `@smoke`, `@regression`.
- Include scenario ID in title where traceability exists (e.g., `AUTH-001 ... @smoke`).
- Add traceability comment where useful: `// spec: specs/approved-test-plans/<plan>.md`.
- Tests are independent, deterministic, and parallel-safe by default.
- Use `test.describe.configure({ mode: 'serial' })` only when state isolation requires it (e.g., cart mutation scenarios sharing account state). Document why.
- Use `test.skip(condition, reason)` for explicit environment/prerequisite gates. Skip reasons must be actionable.
- Use web-first assertions (`await expect(locator).toBeVisible()`, `toHaveURL`, `toHaveCount`, `expect.poll(...)`).
- Never use fixed sleeps. Never use `networkidle` as a generic wait.
- Cleanup state-changing tests in `finally` where feasible. Cleanup failures should be visible.
- Do not weaken assertions to make tests pass.

### API Layer

- `api/clients/` and `api/schemas/` start with README placeholders.
- No API endpoints are inferred from UI routes or browser network calls.
- Add typed API clients only after a reviewed API contract, auth method, base URL, and test-data policy are confirmed.
- Use Playwright `APIRequestContext` for API tests. Keep them isolated and tagged `@api`.

### Reporting

- **Playwright HTML report:** `reports/playwright-html`, `open: 'never'`.
- **Allure:** raw results in `reports/allure-results`, generated HTML in `reports/allure-html`.
- **Artifacts:** `test-results/` for traces/screenshots/videos; failure-only by default.
- **Privacy:** do not expose secrets/credentials in report metadata, attachments, logs, or environment info. Review artifacts before sharing.
- **Retention:** local cleanup manual; CI artifacts 7 days.

### CI/CD

Two workflows:

1. **`.github/workflows/playwright.yml`** — PR smoke + manual dispatch smoke/regression.
   - `pull_request` and `workflow_dispatch` with `suite` choice (`smoke`/`regression`).
   - `permissions: contents: read`.
   - Concurrency by workflow/ref with cancel-in-progress.
   - **Smoke job:** runs on PR or dispatch smoke. Validates `E2E_SMOKE_BASE_URL` is absolute HTTP(S) using Node. Installs deps, Chromium, typechecks, runs `npm run test:smoke`. No secrets passed. Uploads reports/artifacts always, 7-day retention.
   - **Regression job:** only manual dispatch with `suite=regression`. Uses protected GitHub environment `scriptedqa-e2e-nonprod`. Validates `E2E_BASE_URL` is HTTP(S) and **not** `scriptedqa.com` or subdomain. Requires `E2E_USERNAME` and `E2E_PASSWORD` secrets in protected environment. Does **not** pass `E2E_AUTH_NEGATIVE_TESTS_APPROVED` or `E2E_CART_MUTATION_APPROVED` — those scenarios remain skipped in CI until owner explicitly enables them with proper environment protection. Generates Allure report if result files exist. Uploads artifacts always.

2. **`.github/workflows/copilot-setup-steps.yml`** — provisions Copilot coding agent environment. Triggered by workflow_dispatch and changes to itself. Installs Node LTS, deps, Playwright browsers with deps, runs typecheck.

**Rationale:** Smoke gives fast PR signal with no credentials. Regression is protected because it may touch authenticated state and requires dedicated non-public target. The public-host block is a hard safety rail. Least-privilege permissions and finite artifact retention reduce risk.

---

## Agent Driven Workflow

### Where Agent Definitions Live

- `.github/agents/playwright-test-planner.agent.md`
- `.github/agents/playwright-test-generator.agent.md`
- `.github/agents/playwright-test-healer.agent.md`
- `.github/copilot-instructions.md` (shared rules)
- `.mcp.json` / VS Code MCP config for `playwright-test` MCP server (`npx playwright run-test-mcp-server`)

### Common Rules (all agents)

- Read `docs/framework-vision.md`, `docs/framework-architecture.md`, and `.github/copilot-instructions.md` before acting.
- Never commit or expose secrets, credentials, tokens, cookies, or authenticated state.
- Treat unobserved behavior as `To Be Confirmed`.
- Do not invent APIs, flows, or expected results.
- Use accessible locators and web-first assertions.

### Planner Agent

**Purpose:** Explore the application and produce business-focused test-plan drafts.

**Tools:** Playwright browser MCP tools + `planner_setup_page`, `planner_save_plan`.

**Workflow:**
1. `planner_setup_page` once.
2. Explore via browser snapshot/navigation/click/evaluate (no screenshots unless necessary).
3. Map user journeys and critical paths.
4. Design positive, negative, boundary, and error scenarios where behavior is observable.
5. Save plan via `planner_save_plan`.

**Output contract:** Markdown plans under `specs/planner-output/`. Each scenario has clear title, preconditions/assumptions, step-by-step instructions, expected outcomes, success/failure conditions. Scenarios must be independent.

**Boundaries:**
- Drafts only in `specs/planner-output/`.
- No tests, no page objects, no fixtures, no app code, no approval decisions.
- No order placement or other state-changing actions.
- Mark unknowns as `To Be Confirmed`.

**Rationale:** Planner maximizes discovery coverage but cannot self-authorize implementation. Drafts preserve evidence and uncertainty.

### Human Review

**Purpose:** Convert drafts into approved, implementation-ready plans without losing risk context.

**Process:**
- Review for evidence, missing paths, duplicates, vague assertions, safety, isolation, cleanup, and priority.
- Produce/update candidates in `specs/approved-test-plans/` with status `PENDING HUMAN APPROVAL`.
- Record deferred/rejected items with reasons.
- Only an authorized human may mark a plan `APPROVED`, recording approver, approval date, approved scenario IDs, and scope/environment constraints.
- Generator must ignore pending plans.

**Rationale:** Human approval is the accountability boundary. AI can prepare; humans decide what is true enough and safe enough to automate.

### Generator Agent

**Purpose:** Implement tests from explicitly approved plans.

**Tools:** Playwright browser/test MCP tools, `generator_setup_page`, `generator_read_log`, `generator_write_test`.

**Workflow:**
1. Read approved plan, architecture, copilot instructions, and existing framework.
2. `generator_setup_page`.
3. Manually execute each step/verification with Playwright tools.
4. Read generator log.
5. Write test via `generator_write_test`.

**Boundaries:**
- Only scenarios from plans marked `APPROVED` with approver/date.
- Reuse existing framework/page objects; no duplicate framework.
- No application page objects before Phase 6.
- No invented APIs/behavior, no secrets, no weakened assertions, no unapproved state-changing actions.
- Preserve traceability: scenario IDs in titles/comments/traceability docs.

**Rationale:** Generator turns approved intent into executable checks while preserving architecture and traceability.

### Healer Agent

**Purpose:** Diagnose and fix failing Playwright tests with evidence.

**Tools:** `test_run`, `test_debug`, browser snapshot/console/network/evaluate, `edit`, `locator` generation.

**Workflow:**
1. Run tests / debug failing test.
2. Inspect error, snapshot, console, network, trace context.
3. Classify: product defect, test defect, environment issue, or unresolved expectation.
4. Apply smallest evidence-backed fix for selector/interaction stability.
5. Re-run until passing or escalate.

**Boundaries:**
- May fix verified test selectors/interaction stability.
- Must preserve meaningful assertions and test intent.
- Must **never** modify framework architecture, `playwright.config.ts`, shared fixtures/utilities, `BasePage`, reporting, agent definitions, package setup, or CI workflows.
- No fixed sleeps, swallowed errors, weakened assertions, `test.fixme` as hiding strategy, or retry/timeout inflation to mask failures.
- Escalate product defects and unresolved expectations.

**Rationale:** Healer reduces maintenance toil but cannot silently rewrite the product contract or erode framework quality.

---

## Phase-by-Phase Implementation Guide

Execute phases in order. For each phase, start a fresh Agent Mode task with the phase prompt. Do not combine phases unless a human explicitly approves.

### Phase 0 — Documentation and Architecture

- **Objective:** Create/review vision, architecture, and roadmap so implementation has an authoritative baseline.
- **Deliverables:** `docs/framework-vision.md`, `docs/framework-architecture.md`, `docs/implementation-roadmap.md`; documented unresolved/To Be Confirmed items.
- **Implementation Prompt:**

```text
Act as a Senior QA Automation Architect. In this repository, create or review `docs/framework-vision.md`, `docs/framework-architecture.md`, and `docs/implementation-roadmap.md` as one system for a Playwright + TypeScript framework targeting Scripted QA at https://www.scriptedqa.com/.

Requirements:
- Distinguish observed behavior from assumptions. Mark unobserved registration, product detail, checkout outcomes/order confirmation, order history/profile, APIs, browser guarantees, and reset/data lifecycle behavior as `To Be Confirmed`.
- Define agent-driven workflow: Planner discovers and drafts in `specs/planner-output/`; human reviews and approves in `specs/approved-test-plans/`; Generator implements only approved scenarios; Healer repairs only verified test defects and never changes architecture.
- Enforce: no application-specific page objects before Phase 6. Phase 3 may create only a shared `BasePage` with no app locators/workflows.
- Include global guardrails, phase gates, and a copy-paste Agent Mode prompt for every phase (0-12).
- Do not create implementation code. Make documentation-only edits.

Validate by checking cross-document consistency. Report changed files, unresolved decisions, and why the roadmap is executable.
```

### Phase 1 — Playwright Setup

- **Objective:** Initialize Playwright + TypeScript with environment-aware config and a minimal smoke check.
- **Deliverables:** `package.json`, `package-lock.json`, `tsconfig.json`, `playwright.config.ts`, `config/environments.ts`, `.env.example`, `.gitignore`, `tests/smoke/opens-application.spec.ts`.
- **Implementation Prompt:**

```text
Implement Phase 1 of the Scripted QA Playwright framework. Inspect the repo first and preserve existing conventions.

Read `docs/framework-vision.md` and `docs/framework-architecture.md`. Initialize `@playwright/test` if needed. Configure strict TypeScript, npm scripts (test, test:smoke, test:regression, typecheck), and `playwright.config.ts` with environment-driven `baseURL` (default https://www.scriptedqa.com/), Chromium project, explicit timeouts/workers/retries, HTML + list reporters, and failure-only trace/screenshot/video. 

Create `config/environments.ts` that validates `BASE_URL` as absolute HTTP/HTTPS and validates `CI` as true/false/1/0. Add `.env.example` with names/placeholders only. Ensure `.env`, reports, test-results, and auth storage state are gitignored.

Add only a minimal smoke test that opens `/` and asserts the title contains/equals `Scripted QA`. Do not create page objects, fixtures, app flows, or real credentials.

Run the smallest relevant install/typecheck/test commands. Report results, changed files, and blockers.
```

### Phase 2 — Playwright Agent Setup

- **Objective:** Configure Planner/Generator/Healer agent definitions and shared Copilot instructions.
- **Deliverables:** `.github/agents/playwright-test-planner.agent.md`, `.github/agents/playwright-test-generator.agent.md`, `.github/agents/playwright-test-healer.agent.md`, `.github/copilot-instructions.md`, `.mcp.json`, `specs/README.md`, `specs/planner-output/README.md`, `specs/approved-test-plans/README.md`.
- **Implementation Prompt:**

```text
Implement Phase 2 only. Inspect installed Playwright version and available agent initialization support. Prefer the official Playwright agent initializer if supported by the installed version; otherwise create supported GitHub Copilot custom agent files.

Create `.github/agents/playwright-test-planner.agent.md`, `.github/agents/playwright-test-generator.agent.md`, `.github/agents/playwright-test-healer.agent.md`. Define clear role, tools, workflow, and boundaries. Add `.github/copilot-instructions.md` with shared project rules. Add `.mcp.json` for the Playwright test MCP server if needed. Create `specs/planner-output/` and `specs/approved-test-plans/` with README guidance.

Boundaries: Planner drafts only, no code/page objects/orders. Generator implements only human-approved plans. Healer fixes only verified test defects and never changes framework architecture/config/reporting/CI/agent definitions. No application page objects before Phase 6. No secrets.

Validate agent file format/discoverability. Report setup method, files, and any deviations.
```

### Phase 3 — Framework Foundation

- **Objective:** Create shared framework scaffolding without application-specific page objects.
- **Deliverables:** `pages/BasePage.ts`, `utils/logger.ts`, placeholder READMEs in `api/clients`, `api/schemas`, `fixtures`, `helpers`, `test-data`; baseline reporting/config verified.
- **Implementation Prompt:**

```text
Implement Phase 3 using `docs/framework-architecture.md`. Create approved folder structure and minimal shared foundations: `pages/BasePage.ts` (no app locators/workflows), `utils/logger.ts` (scoped debug/info/warn/error), and README placeholders for `api/clients`, `api/schemas`, `fixtures`, `helpers`, `test-data` describing intended use and constraints.

Ensure environment config and Playwright reporting are in place. Do not create LoginPage/HomePage/ShoppingPage/CartPage/ProductPage/CheckoutPage, no page-object fixtures, no application tests. Keep secrets out of code. Run typecheck and smallest relevant validation. Explicitly confirm no application page objects were created.
```

### Phase 4 — Test Plan Generation

- **Objective:** Use Planner to discover and draft business-focused scenarios.
- **Deliverables:** `specs/planner-output/discovery-report.md`, `journey-map.md`, `scenario-catalog.md`, `scriptedqa-scenario-plan.md`, `to-be-confirmed.md`.
- **Implementation Prompt:**

```text
Act as the Playwright Planner Agent. Read vision, architecture, and copilot instructions. Explore https://www.scriptedqa.com/ using available browser tools. Do not record or repeat any on-page credential values. Do not submit orders or perform state-changing actions.

Produce draft artifacts under `specs/planner-output/`: discovery report, journey map, scenario catalog, structured scenario plan, and To Be Confirmed register. Cover auth, navigation, shopping search/filter/cart where evidence exists, and other observed practice categories. For each scenario include stable ID, goal, preconditions, steps, expected results, priority/risk, data, cleanup, and evidence/assumption status.

Mark registration, product details, checkout outcome/order confirmation, order history/profile, API behavior, and unverified edge behavior as To Be Confirmed. No tests, no page objects, no code changes outside planner-output docs.
```

### Phase 5 — Test Plan Review

- **Objective:** Human-review Planner drafts into traceable, prioritized, approval-gated candidate plans.
- **Deliverables:** `specs/approved-test-plans/index.md`, candidate plan files, `deferred-items.md`; statuses `PENDING HUMAN APPROVAL` until human approval.
- **Implementation Prompt:**

```text
Act as a senior test-plan reviewer. Review all `specs/planner-output/` artifacts against docs and observed behavior. Identify gaps, duplicates, ambiguous assertions, missing negatives, unsafe actions, and unsupported assumptions.

Create/update `specs/approved-test-plans/` with index, candidate plans, and deferred-items register. Assign P0-P2 priority and smoke/regression/UI/API layer with rationale. Include traceability, environment/data/cleanup requirements, and scenario ID crosswalk where drafts conflict.

Mark every candidate `PENDING HUMAN APPROVAL`. Do not self-approve. Stop and request explicit human sign-off. Only after an authorized human explicitly approves may status become `APPROVED` with approver and date. No tests, no page objects, no invented behavior.
```

### Phase 6 — Page Object Design

- **Objective:** Create only the page objects required by approved scenarios.
- **Deliverables:** Approved-scenario-to-page-object traceability; `pages/LoginPage.ts`, `HomePage.ts`, `ShoppingPage.ts`, `CartPage.ts` etc., only as justified.
- **Implementation Prompt:**

```text
Implement Phase 6 only. Read architecture, copilot instructions, BasePage, and only plans marked `APPROVED` in `specs/approved-test-plans/`. Build a traceability map from approved UI scenario IDs to minimum required confirmed routes/components.

Create or update only required page objects. Use accessible locators and focused user actions/state queries. Keep assertions in tests. Reuse existing objects; do not invent routes/selectors/behavior. No speculative ProductPage/CheckoutPage/ProfilePage unless approved and confirmed.

Run typecheck and relevant focused validation. Report each new/changed page object and the approved scenario IDs that justify it.
```

### Phase 7 — Automated Test Generation

- **Objective:** Implement approved scenarios as independent Playwright tests.
- **Deliverables:** Tests under `tests/smoke` and `tests/regression`, support helpers, updated traceability in plan index.
- **Implementation Prompt:**

```text
Act as the Playwright Generator Agent. Implement only human-approved scenario IDs from `specs/approved-test-plans/`. Read architecture, copilot instructions, existing tests/page objects/support code.

Reuse existing structures. Create isolated tests with explicit business assertions, accessible locators, web-first assertions, and no fixed sleeps. Add scenario IDs in titles and traceability comments. For risky scenarios, add explicit env gates and skip reasons. Do not invent behavior, expose secrets, weaken assertions, or perform unapproved state-changing actions.

Run smallest relevant test command. Update traceability with file/test name/result. Report files, results, and remaining To Be Confirmed items.
```

### Phase 8 — Test Execution and Healing

- **Objective:** Run suites, classify failures, and apply bounded repairs.
- **Deliverables:** Execution summary, failure classifications, minimal test/POM fixes, unresolved defects/blockers.
- **Implementation Prompt:**

```text
Act as the Playwright Healer Agent. Run requested approved tests. Inspect errors, traces, screenshots, and logs before editing. Classify each failure as product defect, test defect, environment issue, or unresolved expectation.

For verified test defects only, make the smallest selector/interaction repair in affected tests or existing page objects while preserving intent and meaningful assertions. Never modify architecture docs, playwright.config.ts, shared fixtures/utilities, BasePage, reporting strategy, agent definitions, package setup, or CI workflows. No fixed sleeps, swallowed errors, weakened assertions, retries/timeouts to hide failures, or unapproved state changes.

Re-run affected tests. Report evidence, classification, changed files, and unresolved blockers.
```

### Phase 9 — API Testing

- **Objective:** Add contract-based API testing only when a supported API contract exists.
- **Deliverables:** Typed API clients/tests when contract is available; otherwise a documented To Be Confirmed blocker.
- **Implementation Prompt:**

```text
Implement Phase 9 only. First inspect for a reviewed API specification and approved API scenarios in `specs/approved-test-plans/`. If no supported contract, base URL, auth method, and test-data policy exist, do not invent endpoints or API code. Record missing inputs as To Be Confirmed and stop.

If contract exists, implement typed Playwright `APIRequestContext` clients under `api/clients`, schema/validation helpers as needed, and isolated `@api` tests for approved scenarios. Store secrets via env/CI secrets. Run targeted API tests and report contract references, files, and results.
```

### Phase 10 — Reporting

- **Objective:** Provide actionable, privacy-safe Playwright HTML and Allure reporting.
- **Deliverables:** Allure dependency/config, report scripts, `docs/reporting.md`, updated `.gitignore`, evidence policy.
- **Implementation Prompt:**

```text
Implement Phase 10 reporting in the existing Playwright framework. Inspect package versions, reporters, scripts, and artifact paths first. Preserve Playwright HTML reporting. Add compatible Allure reporter only after verifying version compatibility and dependency policy.

Configure failure-only screenshot/video/trace defaults. Keep report outputs in ignored directories. Include non-secret environment metadata only. Add report generation/open commands and `docs/reporting.md`. Do not change test assertions, framework architecture, or CI workflow in this phase.

Run a small representative test, generate both reports, and verify expected files exist. Report config, validation, and retention assumptions.
```

### Phase 11 — CI/CD Integration

- **Objective:** Run smoke/regression in GitHub Actions with secure config and artifact publishing.
- **Deliverables:** `.github/workflows/playwright.yml`, `docs/ci.md`, protected-env guidance.
- **Implementation Prompt:**

```text
Implement Phase 11 for GitHub Actions after Phase 10's reporting decision is recorded. Inspect existing workflows, scripts, env config, and approved report paths.

Create/update `.github/workflows/playwright.yml` with PR smoke and manual dispatch smoke/regression. Use Node setup, npm ci, Playwright Chromium install, typecheck, and suite commands. Read base URL/credentials from GitHub Actions vars/secrets; never print secrets. Block public Scripted QA hosts for regression. Use protected environment for regression secrets. Do not pass cart-mutation or negative-auth approval gates unless explicitly approved.

Upload Playwright HTML, Allure results/html, and test-results artifacts always with 7-day retention. Use least-privilege permissions and concurrency. Validate workflow YAML/syntax where possible and run local equivalent commands. Summarize triggers, required secret/var names, artifacts, and validation.
```

### Phase 12 — Framework Optimization

- **Objective:** Improve health using evidence, not speculative abstraction.
- **Deliverables:** Evidence-backed refactors, health report, updated baseline metrics, unresolved risks.
- **Implementation Prompt:**

```text
Perform Phase 12 as a measured framework health review. Inspect test results/reports, runtime and retry data, tests/page objects/fixtures, dependency status, typecheck, and CI artifacts. First report evidence-backed findings.

Make only low-risk, behavior-preserving refactors that remove real duplication or improve measured performance/stability. Do not add abstractions without demonstrated reuse, change approved scenario intent, weaken assertions, use fixed sleeps, hide errors, or share mutable state across tests. Preserve Planner/Generator/Healer boundaries and scenario traceability.

Run targeted checks plus the smallest relevant regression suite. Produce a concise health report with before/after evidence, changed files, unresolved risks, and prioritized recommendations.
```

---

## GitHub Copilot Prompt Library

Use these prompts as reusable templates. Replace placeholders in `[brackets]`. Always include the global guardrails: no secrets, no invented behavior, no unapproved state changes, no page objects before Phase 6.

### 1. Architecture Review

```text
Act as a Senior QA Automation Architect. Review [FILES/DIFF] against `docs/framework-vision.md`, `docs/framework-architecture.md`, approved plans, and `.github/copilot-instructions.md`. Check for duplication, boundary violations, test isolation, locator quality, secret handling, agent-boundary violations, missing traceability, and invented behavior. Confirm no application page object exists without approved scenario justification. Present findings first; do not modify files until I approve. After approval, make only requested corrections and run relevant validation.
```

### 2. Planner Usage

```text
Act as the Playwright Planner Agent for Scripted QA at https://www.scriptedqa.com/. Read the vision, architecture, and copilot instructions. Explore [AREA/ROUTE] using browser tools. Produce draft scenarios with ID, goal, preconditions, steps, expected results, priority, layer, data, cleanup, and evidence status. Include positive, negative, boundary, and error cases only where behavior is supported by evidence. Mark unknowns To Be Confirmed. Save drafts under `specs/planner-output/`. Do not create tests, page objects, or approval decisions. Do not expose credentials or submit orders.
```

### 3. Generator Usage

```text
Act as the Playwright Generator Agent. Implement only approved scenario IDs [IDS] from [APPROVED PLAN FILE]. Read architecture, copilot instructions, existing tests, page objects, and support helpers. Reuse existing structures; do not duplicate frameworks or page objects. Use accessible locators, web-first assertions, isolated setup, and explicit env/safety gates. Preserve scenario traceability in test title/comment and plan index. Run the smallest relevant tests and report files, results, and gaps.
```

### 4. Healer Usage

```text
Act as the Playwright Healer Agent. Diagnose [FAILING TEST/COMMAND]. Use error output, traces, screenshots, console/network evidence. Classify failure as product defect, test defect, environment issue, or unresolved expectation before editing. For verified test defects only, make the smallest selector/interaction fix. Preserve assertions and intent. Never modify framework architecture, config, BasePage, shared fixtures/utilities, reporting, agent definitions, package setup, or CI workflows. No sleeps, swallowed errors, weakened assertions, or retry/timeout masking. Re-run affected tests and report evidence and outcome.
```

### 5. Page Object Creation

```text
Implement Phase 6 page-object work only for approved scenarios [IDS]. Read the approved plan, architecture, and existing `pages/`. Create or update the minimum page objects required by confirmed routes/components. Extend `BasePage`, keep locators private readonly, expose business actions/state queries, and keep assertions in tests. Use accessible locators; document any unavoidable structural locator. Do not create speculative page objects. Run typecheck and report scenario-to-page-object traceability.
```

### 6. Test Generation

```text
Generate Playwright tests for approved scenarios [IDS]. Place tests in the existing `tests/smoke` or `tests/regression` structure. Reuse page objects and `tests/support` helpers. Tag with @smoke/@regression appropriately. Use env-gated skips for missing credentials or unsafe state-changing scenarios. Assert observable behavior only; use `expect.poll` or web-first assertions for async UI updates. Run targeted tests and update `specs/approved-test-plans/index.md` traceability if needed.
```

### 7. Framework Refactoring

```text
Refactor [SCOPE] in the Playwright framework based on evidence, not speculation. First identify duplication, measured runtime/stability issue, or maintenance risk. Preserve behavior, scenario IDs, locator semantics, and assertion strength. Do not add speculative abstractions, shared mutable state, fixed sleeps, or architecture changes. Run typecheck and the smallest relevant test suite. Report before/after evidence, changed files, and remaining risks.
```

### 8. CI/CD Setup

```text
Create or update GitHub Actions for Playwright. Add PR smoke on Chromium and manual dispatch regression in a protected non-production environment. Use npm ci, install Playwright Chromium, run typecheck, then run the selected suite. Read URLs/credentials from GitHub vars/secrets; never print them. Block public production-like targets for state-changing regression. Upload Playwright HTML, Allure results/html, and test-results on success or failure with 7-day retention. Use least-privilege permissions and concurrency cancellation. Validate workflow syntax and document required vars/secrets by name only.
```

---

## Lessons Learned

### Why this architecture

- **Separate config from tests.** `config/environments.ts` validates env once; tests and Playwright config consume a clean value. This avoids scattered `process.env` parsing and inconsistent failures.
- **Thin BasePage, meaningful page objects.** A thin base prevents inheritance bloat. Page objects expose user intent, which keeps tests readable when selectors change.
- **Support helpers for safety gates.** `test-environment.ts` centralizes credential presence and risk approval checks. This prevents every test from reimplementing risky logic incorrectly.
- **Serial mode for shared-state mutations.** Cart tests mutate shared account/cart state in an environment where isolation is not fully proven. `test.describe.configure({ mode: 'serial' })` is a targeted safety choice, not a default.
- **Runtime-observed data over fixed fixtures.** The catalog is a practice app; product names/prices may change. Tests read current visible products/categories/prices and assert behavior patterns, reducing brittleness while still checking intent.
- **Allure + Playwright HTML together.** Playwright HTML is great for quick local debugging; Allure adds historical/structured reporting. Both are generated from the same runs, with raw Allure cleared before scripted runs.
- **Agent boundaries are explicit.** Planner can discover but not approve/implement. Generator can implement but only approved scope. Healer can repair but cannot erode architecture or assertions. This separation is the core safety mechanism for AI-assisted development.
- **Deferred/To Be Confirmed registers are first-class.** They prevent “unknown” from becoming “assumed true.” This is essential when exploring a public practice app with incomplete product contracts.

### Why the workflow is phased

- Documentation first avoids building on ambiguous assumptions.
- Setup before agent authoring ensures tools run in a known environment.
- Foundation before POM prevents premature abstraction.
- Planning/review before generation prevents automating unapproved behavior.
- Healing after execution keeps repairs evidence-based.
- Reporting/CI after tests exist makes artifacts meaningful.
- Optimization last avoids premature tuning.

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Harmful | What This Framework Does Instead |
|---|---|---|
| Creating page objects for every imagined page up front | Produces speculative, unused abstractions and wrong locators. | No app page objects before Phase 6; create only for approved scenarios. |
| Putting assertions in page objects | Hides test intent and makes reuse risky. | Page objects return state/do actions; tests assert. |
| Hard-coding credentials or base URLs in tests | Security risk and environment lock-in. | `config/environments.ts`, `.env.example`, CI vars/secrets, ignored `.env`. |
| Using fixed sleeps | Flaky and slow. | Web-first assertions, `expect.poll`, locator/actionability waits. |
| Weakening assertions to pass CI | Masks regressions and destroys trust in tests. | Healer preserves assertions; unresolved product defects are escalated. |
| Retrying until green | Hides flakiness. | Limited CI retry for evidence; investigate root cause. |
| Treating Planner drafts as approved | Automates unreviewed assumptions. | `PENDING HUMAN APPROVAL` gate; approver/date required. |
| Running state-changing tests on public/prod targets | Data pollution, policy violation, unpredictable side effects. | Non-public host check + explicit approval env gates; protected CI environment. |
| Inferring API contracts from UI/network | Creates brittle, unsupported tests. | API work blocked until reviewed contract exists. |
| Committing reports/traces/storage state | Leaks sensitive data and bloats repo. | `.gitignore` for reports, test-results, auth state, env files. |
| Broad try/catch that returns success-shaped fallback | Hides real failures. | Fail clearly; cleanup errors visible; skips have explicit reasons. |
| Duplicate frameworks/helpers | Maintenance confusion and drift. | Reuse existing structure; add abstraction only with demonstrated reuse. |

---

## Recreate-from-Empty-Repo Checklist

Use this checklist after running the phase prompts:

- [ ] `npm ci` installs dependencies.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test:smoke` passes against approved public/base target.
- [ ] `npm test` or `npm run test:regression` behavior matches env gate expectations (skips are explicit and justified).
- [ ] `npm run report:allure` generates `reports/allure-html` after a run.
- [ ] `specs/planner-output/` contains draft artifacts; `specs/approved-test-plans/` contains reviewed plans with approval metadata.
- [ ] No `.env`, `reports/`, `test-results/`, or auth state files are tracked.
- [ ] CI workflow has no secrets in YAML; protected regression environment is documented.
- [ ] Every automated test maps to an approved scenario ID or is clearly documented as smoke infrastructure.

---

## Final Instruction to the Agent Executing This Prompt

Execute this framework recreation **phase by phase**. After each phase: show changed files, run the smallest relevant validation, report results, list unresolved To Be Confirmed items, and stop for human review. Never create application page objects before Phase 6. Never mark a plan approved. Never commit secrets. Never invent application behavior. Never weaken assertions. If a required fact is unknown, record it as `To Be Confirmed` and proceed only within the confirmed, approved scope.
