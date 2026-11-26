import 'dotenv/config';

import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig } from './config/environments';

const { baseURL, isCI } = getEnvironmentConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : 4,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        detail: false,
        reportMatchers: true,
        environmentInfo: {
          executionEnvironment: isCI ? 'CI' : 'local',
          browserProject: 'chromium',
          nodeVersion: process.version,
        },
      },
    ],
  ],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
