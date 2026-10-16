import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import { handlePopups } from './utils/popupHandler';

dotenv.config(); // Load .env file first
const environment = process.env.TEST_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${environment}`), override: true });

async function globalSetup(config: FullConfig) {
  const storagePath = path.resolve('./auth/state.json');

  /* ============================
     Clean Allure folders
     ============================ */
  try {
    if (fs.existsSync('allure-results')) {
      fs.rmSync('allure-results', { recursive: true, force: true });
    }
    if (fs.existsSync('allure-report')) {
      fs.rmSync('allure-report', { recursive: true, force: true });
    }
    console.log('✨ Allure folders cleaned');
  } catch (err) {
    console.warn('⚠️ Allure cleanup failed:', err);
  }

  /* ============================
     Detect public (no-auth) runs
     ============================ */
  const args = process.argv.join(' ');
  const isPublicRun =
    args.includes('@public') ||
    args.includes('@register') ||
    args.includes('register.spec');

  if (isPublicRun) {
    console.log('🚫 Public suite detected — skipping login');
    if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);
    return;
  }

  /* ============================
     Fresh auth state
     ============================ */
  if (fs.existsSync(storagePath)) {
    fs.unlinkSync(storagePath);
  }

  /* ============================
     Browser launch (FAST)
     ============================ */
  const browser = await chromium.launch({
    headless: true, // 🔥 critical for speed
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  /* ============================
     Login
     ============================ */
  console.time('🔐 Login time');

  await page.goto(process.env.BASE_URL!, {
    waitUntil: 'domcontentloaded',
  });

  await page.fill('#username', process.env.UNAME!);
  await page.fill('#password', process.env.PASSWORD!);
  await page.click('#loginBtn');

  // Wait only for what matters
  await page.waitForURL('**/sketchplay-dashboard', { timeout: 15000 });

  console.timeEnd('🔐 Login time');

  /* ============================
     Optional popups (non-blocking)
     ============================ */
  await handlePopups(page); // must NOT contain waits

  /* ============================
     Save session (very fast)
     ============================ */
  console.time('💾 Storage save');
  await context.storageState({ path: storagePath });
  console.timeEnd('💾 Storage save');

  console.log('✅ Auth session saved at:', storagePath);

  await browser.close();
}

export default globalSetup;
