import type { Locator, Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly signInHeading: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signInHeading = page.getByRole('heading', { name: 'Sign In', exact: true });
    this.usernameInput = page.getByRole('textbox', { name: 'Username', exact: true });
    this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async submit(): Promise<void> {
    await this.signInButton.click();
  }

  async isSignInFormVisible(): Promise<boolean> {
    return (
      (await this.signInHeading.isVisible()) &&
      (await this.usernameInput.isVisible()) &&
      (await this.passwordInput.isVisible()) &&
      (await this.signInButton.isVisible())
    );
  }
}
