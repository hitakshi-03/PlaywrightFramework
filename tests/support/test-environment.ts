import type { Page } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage';

export interface E2ECredentials {
  username: string;
  password: string;
}

export function getE2ECredentials(): E2ECredentials | undefined {
  const username = process.env.E2E_USERNAME?.trim();
  const password = process.env.E2E_PASSWORD;

  if (!username || !password) {
    return undefined;
  }

  return { username, password };
}

export async function signIn(page: Page, credentials: E2ECredentials): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.signIn(credentials.username, credentials.password);
}

export function isApprovedNonPublicTarget(baseURL: string | undefined): boolean {
  if (!baseURL) {
    return false;
  }

  const hostname = new URL(baseURL).hostname.toLowerCase();
  return hostname !== 'scriptedqa.com' && !hostname.endsWith('.scriptedqa.com');
}

export function isAuthNegativeAttemptApproved(baseURL: string | undefined): boolean {
  return (
    process.env.E2E_AUTH_NEGATIVE_TESTS_APPROVED === 'true' &&
    isApprovedNonPublicTarget(baseURL)
  );
}

export function isCartMutationApproved(baseURL: string | undefined): boolean {
  return (
    process.env.E2E_CART_MUTATION_APPROVED === 'true' &&
    isApprovedNonPublicTarget(baseURL)
  );
}
