# GitHub Actions

## Workflow runs

`.github/workflows/playwright.yml` runs the Chromium smoke suite on pull requests. A manual `workflow_dispatch` run can select `smoke` or `regression`; regression runs only against the protected `scriptedqa-e2e-nonprod` GitHub environment.

## Required GitHub configuration

- Add the repository Actions variable `E2E_SMOKE_BASE_URL` for the smoke target.
- Create the GitHub environment `scriptedqa-e2e-nonprod` and require owner/reviewer approval before allowing regression jobs to start.
- In that environment, set the Actions variable `E2E_BASE_URL` to an owner-approved non-production URL. The workflow rejects the public `scriptedqa.com` host and its subdomains.
- Add `E2E_USERNAME` and `E2E_PASSWORD` as secrets in that protected environment. The workflow does not pass credentials to PR smoke runs.
- The workflow intentionally does not set `E2E_AUTH_NEGATIVE_TESTS_APPROVED` or `E2E_CART_MUTATION_APPROVED`. Invalid-login and cart-mutating scenarios therefore remain skipped in CI. Do not enable them until the application owner has approved the environment, dedicated account, isolation, and cleanup policy; also configure GitHub environment protection.

The workflow checks required values without printing them. Keep URLs, credentials, and approval settings in GitHub Actions variables/secrets, not YAML or source files.

## Reports and artifacts

Both jobs install dependencies with `npm ci`, install Chromium, type-check, and publish the configured Playwright HTML report, Allure results/report, and test failure artifacts when present. Artifacts are uploaded even when tests fail and retained for 7 days. Traces and videos are retained only for failures; screenshots are captured only on failure. Treat artifacts as sensitive because traces and screenshots can include application state.

Local equivalents are `npm run typecheck`, `npm run test:smoke`, and `npm run test:regression`. For CI-equivalent runs, leave `E2E_AUTH_NEGATIVE_TESTS_APPROVED` and `E2E_CART_MUTATION_APPROVED` unset or false; the workflow deliberately does not pass them. Report commands and output paths are documented in [reporting.md](./reporting.md).
