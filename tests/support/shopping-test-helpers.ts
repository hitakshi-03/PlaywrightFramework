import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

import { HomePage } from '../../pages/HomePage';
import { ShoppingPage } from '../../pages/ShoppingPage';
import { signIn, type E2ECredentials } from './test-environment';

export async function openShoppingAsTestUser(
  page: Page,
  credentials: E2ECredentials,
): Promise<ShoppingPage> {
  await signIn(page, credentials);
  await expect(page).toHaveURL(/\/home$/);
  await new HomePage(page).openShopping();
  await expect(page).toHaveURL(/\/shopping$/);
  return new ShoppingPage(page);
}
