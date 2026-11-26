import { expect, test } from '@playwright/test';

import { HomePage, type PracticeArea } from '../../pages/HomePage';
import { getE2ECredentials, signIn } from '../support/test-environment';

const practiceRoutes: Array<{ id: string; area: PracticeArea; path: string }> = [
  { id: 'NAV-001', area: 'Table', path: '/webTable' },
  { id: 'NAV-002', area: 'Dropdown', path: '/dropDown' },
  { id: 'NAV-003', area: 'Alerts & Windows', path: '/alertsAndWindows' },
  { id: 'NAV-004', area: 'Frame', path: '/frame' },
  { id: 'NAV-005', area: 'Form', path: '/form' },
  { id: 'NAV-006', area: 'Calender', path: '/calender' },
  { id: 'NAV-007', area: 'Mouse Actions', path: '/mouseActions' },
];

for (const { id, area, path } of practiceRoutes) {
  test(`${id} navigation reaches ${path} @regression`, async ({ page }) => {
    const credentials = getE2ECredentials();
    if (!credentials) {
      test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
      return;
    }

    await signIn(page, credentials);
    await expect(page).toHaveURL(/\/home$/);
    await new HomePage(page).openPracticeArea(area);
    await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}$`));
    await expect(page.locator('body')).toBeVisible();
  });
}
