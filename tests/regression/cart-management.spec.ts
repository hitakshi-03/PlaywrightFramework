import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { CartPage } from '../../pages/CartPage';
import { ShoppingPage } from '../../pages/ShoppingPage';
import {
  getE2ECredentials,
  isCartMutationApproved,
  signIn,
} from '../support/test-environment';
import { openShoppingAsTestUser } from '../support/shopping-test-helpers';

async function getFirstProductName(shoppingPage: ShoppingPage): Promise<string> {
  const productName = (await shoppingPage.getVisibleProducts())[0]?.name;
  if (!productName) {
    throw new Error('Cart scenarios require at least one product in the loaded catalog.');
  }
  return productName;
}

async function clearTestProduct(page: Page, productName: string): Promise<void> {
  const shoppingPage = new ShoppingPage(page);
  if (new URL(page.url()).pathname !== '/cart') {
    await shoppingPage.openCart();
  }

  const cartPage = new CartPage(page);
  await cartPage.clearCart();
  await expect.poll(() => cartPage.isProductVisible(productName)).toBe(false);
}

function skipUnlessCartExecutionIsApproved(baseURL: string | undefined): void {
  test.skip(
    !isCartMutationApproved(baseURL),
    'Requires E2E_CART_MUTATION_APPROVED=true and an owner-approved non-public target, cart isolation, and cleanup policy.',
  );
}

test.describe('Approved cart mutation scenarios', () => {
  test.describe.configure({ mode: 'serial' });

  test('SHOP-007 one add updates the cart count by one @smoke', async (
    { page, baseURL },
  ) => {
    skipUnlessCartExecutionIsApproved(baseURL);
    const credentials = getE2ECredentials();
    if (!credentials) {
      test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
      return;
    }

    const shoppingPage = await openShoppingAsTestUser(page, credentials);
    const initialCount = await shoppingPage.getCartCount();
    test.skip(initialCount !== 0, 'Requires an owner-confirmed isolated empty cart.');
    const productName = await getFirstProductName(shoppingPage);
    let cleanupRequired = false;

    try {
      cleanupRequired = true;
      await shoppingPage.addProductToCart(productName);
      await expect.poll(() => shoppingPage.getCartCount()).toBe(initialCount + 1);
    } finally {
      if (cleanupRequired) {
        await clearTestProduct(page, productName);
      }
    }
  });

  test('CART-001 cart shows the added product and summary fields @regression', async ({
    page,
    baseURL,
  }) => {
    skipUnlessCartExecutionIsApproved(baseURL);
    const credentials = getE2ECredentials();
    if (!credentials) {
      test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
      return;
    }

    const shoppingPage = await openShoppingAsTestUser(page, credentials);
    const initialCount = await shoppingPage.getCartCount();
    test.skip(initialCount !== 0, 'Requires an owner-confirmed isolated empty cart.');
    const productName = await getFirstProductName(shoppingPage);
    let cleanupRequired = false;

    try {
      cleanupRequired = true;
      await shoppingPage.addProductToCart(productName);
      await expect.poll(() => shoppingPage.getCartCount()).toBe(initialCount + 1);
      await shoppingPage.openCart();
      await expect(page).toHaveURL(/\/cart$/);

      const cartPage = new CartPage(page);
      await expect.poll(() => cartPage.isProductVisible(productName)).toBe(true);
      for (const field of ['Item', 'Price', 'Qty', 'Total', 'Grand Total'] as const) {
        await expect.poll(() => cartPage.isSummaryFieldVisible(field)).toBe(true);
      }
    } finally {
      if (cleanupRequired) {
        await clearTestProduct(page, productName);
      }
    }
  });

  test('CART-002 clearing the populated cart removes its test item @regression', async ({
    page,
    baseURL,
  }) => {
    skipUnlessCartExecutionIsApproved(baseURL);
    const credentials = getE2ECredentials();
    if (!credentials) {
      test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
      return;
    }

    const shoppingPage = await openShoppingAsTestUser(page, credentials);
    const initialCount = await shoppingPage.getCartCount();
    test.skip(initialCount !== 0, 'Requires an owner-confirmed isolated empty cart.');
    const productName = await getFirstProductName(shoppingPage);
    let cleanupRequired = false;

    try {
      cleanupRequired = true;
      await shoppingPage.addProductToCart(productName);
      await expect.poll(() => shoppingPage.getCartCount()).toBe(initialCount + 1);
      await shoppingPage.openCart();

      const cartPage = new CartPage(page);
      await cartPage.clearCart();
      await expect.poll(() => cartPage.isProductVisible(productName)).toBe(false);
      cleanupRequired = false;
    } finally {
      if (cleanupRequired) {
        await clearTestProduct(page, productName);
      }
    }
  });
});

test('CART-003 Back to Shopping returns to the catalog @regression', async ({ page }) => {
  const credentials = getE2ECredentials();
  if (!credentials) {
    test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
    return;
  }

  await signIn(page, credentials);
  await expect(page).toHaveURL(/\/home$/);
  await page.goto('/cart');

  const backToShopping = page.getByRole('button', {
    name: 'Back to Shopping',
    exact: true,
  });
  if (!(await backToShopping.isVisible())) {
    test.skip(true, 'Requires the observed cart state that exposes Back to Shopping.');
    return;
  }

  await new CartPage(page).backToShopping();
  await expect(page).toHaveURL(/\/shopping$/);
});
