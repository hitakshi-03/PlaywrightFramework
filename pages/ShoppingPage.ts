import type { Locator, Page } from '@playwright/test';

import { BasePage } from './BasePage';

export interface VisibleProduct {
  name: string;
  category: string;
}

export class ShoppingPage extends BasePage {
  private readonly searchInput: Locator;
  private readonly categorySelect: Locator;
  private readonly priceSelect: Locator;
  private readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('textbox', {
      name: 'Search products...',
      exact: true,
    });
    this.categorySelect = page.getByRole('combobox').filter({
      has: page.getByRole('option', { name: 'All Categories', exact: true }),
    });
    this.priceSelect = page.getByRole('combobox').filter({
      has: page.getByRole('option', { name: 'All Prices', exact: true }),
    });
    this.cartButton = page.getByRole('button', { name: /^Checkout Items:/ });
  }

  async searchProducts(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption({ label: category });
  }

  async selectPriceRange(priceRange: string): Promise<void> {
    await this.priceSelect.selectOption({ label: priceRange });
  }

  async getCategoryOptions(): Promise<string[]> {
    return (await this.categorySelect.getByRole('option').allTextContents()).map((option) =>
      option.trim(),
    );
  }

  async getPriceRangeOptions(): Promise<string[]> {
    return (await this.priceSelect.getByRole('option').allTextContents()).map((option) =>
      option.trim(),
    );
  }

  async getVisibleProducts(): Promise<VisibleProduct[]> {
    const images = this.page.getByRole('img');
    const products: VisibleProduct[] = [];

    for (let index = 0; index < (await images.count()); index += 1) {
      const image = images.nth(index);
      const name = await image.getAttribute('alt');

      if (!name || name.toLowerCase() === 'logo' || !(await image.isVisible())) {
        continue;
      }

      products.push({
        name,
        // The observed catalog groups each product image with its category label.
        category: (await image.locator('..').innerText()).trim(),
      });
    }

    return products;
  }

  async getVisibleProductPrices(): Promise<string[]> {
    return (
      await this.page
        .getByText(/^\$\s?[\d,]+(?:\.\d+)?$/)
        .allTextContents()
    ).map((price) => price.trim());
  }

  async isProductVisible(productName: string): Promise<boolean> {
    return this.page.getByText(productName, { exact: true }).isVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    // Product cards have no distinct role, so scope the action from the observed product image.
    const productImage = this.page.getByRole('img', { name: productName, exact: true });
    const productCard = productImage.locator('..').locator('..');
    await productCard.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  }

  async getCartCount(): Promise<number> {
    const buttonText = await this.cartButton.innerText();
    const count = buttonText.match(/(\d+)\s*$/);

    if (!count) {
      throw new Error('Could not read the item count from the Shopping cart control.');
    }

    return Number(count[1]);
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }
}
