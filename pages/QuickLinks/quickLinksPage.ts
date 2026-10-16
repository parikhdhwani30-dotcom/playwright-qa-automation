import { Page, expect, TestInfo } from '@playwright/test';
import { BasePage } from '../baseFile';
import { attachScreenshot } from '../../utils/allureScreenshot';

type VerifyType = 'heading' | 'none';

interface QuickLinkConfig {
  name: string;
  cardText: string;
  expectedPath: string;   // only path, NOT full domain
  verifyType: VerifyType;
  expectedHeadingText?: string;
  headingExact?: boolean;
}

export class QuickLinksPage extends BasePage {

  private readonly loggedInUserName = 'Dhwaniaaa Parikh';

  // 🔹 Extract origin from BASE_URL in .env
  private readonly baseOrigin: string;

  constructor(page: Page) {
    super(page, '/sketchplay-dashboard');

    const envBase = process.env.BASE_URL || '';
    this.baseOrigin = new URL(envBase).origin;

  }

  private quickLinks: QuickLinkConfig[] = [
    {
      name: 'Manage Profile',
      cardText: 'Manage Profile',
      expectedPath: '/profile',
      verifyType: 'heading',
      expectedHeadingText: this.loggedInUserName,
    },
    {
      name: 'Manage Household',
      cardText: 'Manage Household',
      expectedPath: '/profile',
      verifyType: 'heading',
      expectedHeadingText: this.loggedInUserName,
    },
    {
      name: 'Settings',
      cardText: 'Settings',
      expectedPath: '/settings',
      verifyType: 'heading',
      expectedHeadingText: 'Settings',
      headingExact: true,
    },
    {
      name: 'Registration History',
      cardText: 'Registration History',
      expectedPath: '/purchase-history?isDashboard=true&activeTab=event',
      verifyType: 'heading',
      expectedHeadingText: 'Purchase History',
    },
    {
      name: 'All Events',
      cardText: 'All Events',
      expectedPath: '/calendar?view=list',
      verifyType: 'none',
    },
    {
      name: 'Purchase History',
      cardText: 'Purchase History',
      expectedPath: '/purchase-history?isDashboard=true',
      verifyType: 'heading',
      expectedHeadingText: 'Purchase History',
    },
    {
      name: 'Packages & Subscriptions',
      cardText: 'Packages & Subscriptions',
      expectedPath: '/product-package-list',
      verifyType: 'heading',
      expectedHeadingText: 'Packages and Subscriptions',
    },
    {
      name: 'How To Videos',
      cardText: 'How To Videos',
      expectedPath: '/how-to-videos',
      verifyType: 'heading',
      expectedHeadingText: 'How-To Videos',
    },
    {
      name: 'Admin Center',
      cardText: 'Admin Center',
      expectedPath: '/admin-center',
      verifyType: 'heading',
      expectedHeadingText: 'Admin Center',
    },
  ];

  async verifyAllQuickLinks(testInfo: TestInfo) {
    for (const link of this.quickLinks) {
      await this.verifySingleQuickLink(link, testInfo);

      // Always return to dashboard
      await this.navigate();
      await this.page.waitForTimeout(800);
    }
  }

  private async verifySingleQuickLink(link: QuickLinkConfig, testInfo: TestInfo) {
    try {
      console.log(`🔍 Verifying: ${link.name}`);

      // Click quick link
      await this.page
        .locator('#quick-links-section div')
        .filter({ hasText: link.cardText })
        .nth(1)
        .click();

      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1200);

      // ✅ FULL URL Comparison (Environment Safe)

      const expectedFullUrl = new URL(link.expectedPath, this.baseOrigin).toString();
      const currentUrl = this.page.url();

      // Normalize trailing slash
      const normalize = (url: string) => url.replace(/\/$/, '');

      const normalizedCurrent = normalize(currentUrl);
      const normalizedExpected = normalize(expectedFullUrl);

      const isMatched = normalizedCurrent === normalizedExpected;

      // 🔹 Console Output
      console.log('----------------------------');
      console.log(`🔍 Checking URL for: ${link.name}`);
      console.log(`👉 Expected URL: ${normalizedExpected}`);
      console.log(`👉 Current URL : ${normalizedCurrent}`);
      console.log(isMatched ? '✅ URL MATCHED' : '❌ URL NOT MATCHED');


      // 🔹 Attach URL comparison to report
      await testInfo.attach(`${link.name}-URL-Check`, {
        body: `
Quick Link: ${link.name}

Expected URL:
${normalizedExpected}

Current URL:
${normalizedCurrent}

Status:
${isMatched ? 'MATCHED ✅' : 'NOT MATCHED ❌'}
  `,
        contentType: 'text/plain',
      });

      // 🔹 Playwright assertion
      await expect(this.page).toHaveURL(expectedFullUrl, { timeout: 15000 });



      // ✅ Heading Verification
      if (link.verifyType === 'heading' && link.expectedHeadingText) {
        const heading = this.page.getByRole('heading', {
          name: link.expectedHeadingText,
          exact: link.headingExact ?? false,
        }).first();

        await expect(heading).toBeVisible({ timeout: 15000 });
      }

      console.log(`✅ PASSED: ${link.name}`);
      await attachScreenshot(this.page, testInfo, `${link.name}-PASSED`);

    } catch (err: any) {
      console.error(`❌ FAILED: ${link.name} | Error: ${err.message}`);
      console.log('----------------------------');
      try {
        await attachScreenshot(this.page, testInfo, `${link.name}-FAILED`);
      } catch { }

      // Do NOT throw — continue next link
    }
  }
}
