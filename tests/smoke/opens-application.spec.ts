import { expect, test } from '@playwright/test';

test('opens the application @smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Scripted QA');
});
