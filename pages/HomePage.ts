import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';

export type PracticeArea =
  | 'Table'
  | 'Dropdown'
  | 'Alerts & Windows'
  | 'Frame'
  | 'Form'
  | 'Calender'
  | 'Mouse Actions';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openShopping(): Promise<void> {
    await this.page.getByRole('link', { name: 'Shopping', exact: true }).click();
  }

  async openPracticeArea(area: PracticeArea): Promise<void> {
    await this.page.getByRole('link', { name: area, exact: true }).click();
  }
}
