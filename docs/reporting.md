# Playwright Reports

## Generate reports

Run the full suite:

```powershell
npm test
```

Or run the credential-free browser-open smoke check:

```powershell
npm test -- tests/smoke/opens-application.spec.ts --project=chromium --workers=1
```

Each test run creates the Playwright HTML report at `reports/playwright-html` and raw Allure results at `reports/allure-results`. The `test`, `test:smoke`, and `test:regression` npm scripts clear prior raw Allure results first, so generated Allure reports describe one run rather than accumulating stale results. Direct `npx playwright test` commands do not clear prior results; prefer the npm scripts above. Generate the Allure HTML report with:

```powershell
npm run report:allure
```

Open the reports with:

```powershell
npx playwright show-report reports/playwright-html
npm run report:allure:open
```

## Evidence and privacy

- Screenshots are captured only on failure; traces and videos are retained only for failed tests. Successful-run evidence is not retained.
- Allure includes test results and assertion steps plus the non-secret execution context (`local` or `CI`, Chromium project, and Node.js version). Automatic Playwright API-call steps are disabled so filled values are not recorded. Environment metadata excludes URLs, credentials, cookies, and storage state.
- Screenshots, videos, traces, and reports can contain application data. Review them before sharing and restrict access accordingly.
- Generated reports and artifacts are ignored by Git under `reports/` and `test-results/`. Local retention is manual: remove these generated directories when no longer needed. GitHub Actions artifacts are retained for 7 days.
