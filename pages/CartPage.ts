import type { Locator, Page } from '@playwright/test';

import { BasePage } from './BasePage';

export type CartSummaryField = 'Item' | 'Price' | 'Qty' | 'Total' | 'Grand Total';

export class CartPage extends BasePage {
  private readonly billHeading: Locator;
  private readonly clearCartButton: Locator;
  private readonly backToShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.billHeading = page.getByRole('heading', { name: '🧾 Bill', exact: true });
    this.clearCartButton = page.getByRole('button', {
      name: 'Clear Cart',
      exact: true,
    });
    this.backToShoppingButton = page.getByRole('button', {
      name: 'Back to Shopping',
      exact: true,
    });
  }

  async isCartPageVisible(): Promise<boolean> {
    return this.billHeading.isVisible();
  }

  async isProductVisible(productName: string): Promise<boolean> {
    return this.page.getByText(productName, { exact: true }).isVisible();
  }

  async isSummaryFieldVisible(field: CartSummaryField): Promise<boolean> {
    return this.page.getByText(field, { exact: true }).isVisible();
  }

  async clearCart(): Promise<void> {
    await this.clearCartButton.click();
  }

  async backToShopping(): Promise<void> {
    await this.backToShoppingButton.click();
  }
}
