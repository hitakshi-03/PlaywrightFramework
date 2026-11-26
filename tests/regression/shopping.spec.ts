import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

import { getE2ECredentials } from '../support/test-environment';
import { openShoppingAsTestUser } from '../support/shopping-test-helpers';

test('SHOP-001 shows catalog discovery controls @smoke', async ({ page }) => {
  const credentials = getE2ECredentials();
  if (!credentials) {
    test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
    return;
  }

  await openShoppingAsTestUser(page, credentials);

  await expect(page.getByRole('heading', { name: 'Products', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search products...', exact: true })).toBeVisible();
  await expect(page.getByRole('combobox')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Add to Cart', exact: true })).not.toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Checkout Items:/ })).toBeVisible();
});

test('SHOP-002 exact search keeps the runtime-observed product visible @regression', async ({
  page,
}) => {
  const credentials = getE2ECredentials();
  if (!credentials) {
    test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
    return;
  }

  const shoppingPage = await openShoppingAsTestUser(page, credentials);
  const products = await shoppingPage.getVisibleProducts();
  const productName = products[0]?.name;

  expect(productName).toBeDefined();
  if (!productName) {
    throw new Error('SHOP-002 requires at least one product in the loaded catalog.');
  }

  await shoppingPage.searchProducts(productName);
  await expect(page.getByText(productName, { exact: true })).toBeVisible();
});

test('SHOP-003 no-match search hides the previously visible products @regression', async ({
  page,
}) => {
  const credentials = getE2ECredentials();
  if (!credentials) {
    test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
    return;
  }

  const shoppingPage = await openShoppingAsTestUser(page, credentials);
  const productNames = (await shoppingPage.getVisibleProducts()).map(({ name }) => name);
  const noMatchTerm = `no-match-${randomUUID()}`;

  expect(productNames.length).toBeGreaterThan(0);
  await shoppingPage.searchProducts(noMatchTerm);
  await expect.poll(() => shoppingPage.getVisibleProducts()).toEqual([]);
});

test('SHOP-004 category filter leaves only products in the selected category @regression', async ({
  page,
}) => {
  const credentials = getE2ECredentials();
  if (!credentials) {
    test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
    return;
  }

  const shoppingPage = await openShoppingAsTestUser(page, credentials);
  const category = (await shoppingPage.getCategoryOptions()).find(
    (option) => option !== 'All Categories',
  );

  expect(category).toBeDefined();
  if (!category) {
    throw new Error('SHOP-004 requires at least one category option besides All Categories.');
  }

  await shoppingPage.selectCategory(category);
  const expectedCategory = category.toLowerCase();
  await expect
    .poll(async () =>
      (await shoppingPage.getVisibleProducts()).every(
        (product) => product.category.toLowerCase() === expectedCategory,
      ),
    )
    .toBe(true);
});

function isPriceWithinDisplayedRange(priceText: string, range: string): boolean {
  const price = Number(priceText.replace(/[$,]/g, ''));
  if (!Number.isFinite(price)) {
    throw new Error(`Could not parse displayed product price "${priceText}".`);
  }

  const under = /^Under \$(\d+(?:\.\d+)?)$/.exec(range);
  if (under?.[1]) {
    return price <= Number(under[1]);
  }

  const over = /^Over \$(\d+(?:\.\d+)?)$/.exec(range);
  if (over?.[1]) {
    return price >= Number(over[1]);
  }

  const bounded = /^\$(\d+(?:\.\d+)?) to \$(\d+(?:\.\d+)?)$/.exec(range);
  if (bounded?.[1] && bounded[2]) {
    // Include cutoffs here so either boundary convention remains acceptable.
    return price >= Number(bounded[1]) && price <= Number(bounded[2]);
  }

  throw new Error(`Unsupported displayed price range "${range}".`);
}

for (const priceRange of [
  'Under $25',
  '$25 to $50',
  '$50 to $100',
  '$100 to $500',
  'Over $500',
]) {
  test(`SHOP-005 selected range excludes prices outside ${priceRange} @regression`, async ({
    page,
  }) => {
    const credentials = getE2ECredentials();
    if (!credentials) {
      test.skip(true, 'Requires a dedicated test identity in E2E_USERNAME and E2E_PASSWORD.');
      return;
    }

    const shoppingPage = await openShoppingAsTestUser(page, credentials);
    const ranges = await shoppingPage.getPriceRangeOptions();

    expect(ranges).toContain(priceRange);
    await shoppingPage.selectPriceRange(priceRange);
    await expect
      .poll(async () =>
        (await shoppingPage.getVisibleProductPrices()).every((price) =>
          isPriceWithinDisplayedRange(price, priceRange),
        ),
      )
      .toBe(true);
  });
}
