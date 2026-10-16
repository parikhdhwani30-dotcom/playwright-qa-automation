import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config(); // Load .env file first
const environment = process.env.TEST_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${environment}`), override: true });

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global-setup'),

  reporter: [
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  retries: 0,
  workers: 1,
  maxFailures: 0,

  // 👇 Define separate projects for different tag groups
  projects: [
    {
      name: 'Sanity Test',
      grepInvert: /@register|@public/, // 🚫 skip public or register tests
      use: {
        baseURL: process.env.BASE_URL,
        storageState: './auth/state.json', // ✅ normal logged-in flow
        headless: false,
        viewport: null, trace: 'on', video: 'on', screenshot: 'on',
        // Using fresh Chromium (no channel specified)
        launchOptions: {
          args: ['--start-maximized',
            '--disable-cache',
            '--disk-cache-size=0'
          ],
        },
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'public', // 👇 for registration or public flows
      grep: /@register|@public/, // match these tags
      use: {
        baseURL: process.env.BASE_URL,
        storageState: undefined, // ✅ no saved session
        headless: false,
        viewport: null,
        // Using fresh Chromium (no channel specified)
        launchOptions: {
          args: ['--start-maximized', '--disable-cache', '--disk-cache-size=0'],
        },
      },
    },
  ],
});
