import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import {
  getE2ECredentials,
  isAuthNegativeAttemptApproved,
  signIn,
} from '../support/test-environment';

test('AUTH-001 reaches authenticated home after sign-in @smoke', async ({ page }) => {
  const credentials = getE2ECredentials();
  if (!credentials) {
    test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
    return;
  }

  await signIn(page, credentials);

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('link', { name: 'Table', exact: true })).toBeVisible();
});

test('AUTH-002 invalid credentials do not authenticate @regression', async ({
  page,
  baseURL,
}) => {
  test.skip(
    !isAuthNegativeAttemptApproved(baseURL),
    'Requires E2E_AUTH_NEGATIVE_TESTS_APPROVED=true and an approved non-public target.',
  );

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.signIn(`invalid-${randomUUID()}@example.invalid`, randomUUID());

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Sign In', exact: true })).toBeVisible();
});

test('AUTH-003 empty sign-in does not authenticate @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.submit();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Sign In', exact: true })).toBeVisible();
});

test('ACCESS-001 signed-out access to Shopping returns to sign-in @smoke', async ({ page }) => {
  await page.goto('/shopping');

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Sign In', exact: true })).toBeVisible();
});
