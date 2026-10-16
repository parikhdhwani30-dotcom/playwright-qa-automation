import { Page, expect } from '@playwright/test';
import RegisterPage from '../../../pages/RegistrationPage/registerPage';
import { faker } from '@faker-js/faker';

/**
 * Flow function to automate the user registration process.
 * Can be executed independently or imported into a spec file.
 *
 * @param {Page} page - The Playwright page object
 * @param {any} testInfo - The test information (for screenshots/logs)
 */
export async function registrationFlow(page: Page, testInfo: any) {
  const registerPage = new RegisterPage(page);

  // ✅ Generate unique user details with Faker
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const phone = faker.phone.number({ style: 'national' });
  const password = 'Password@123';
  const otp = '555222';

  console.log(`🧩 Registering user: ${firstName} ${lastName} | ${email} | ${phone}`);

  // ✅ Registration flow

  await registerPage.clickRegisterHere();
  await registerPage.fillUserDetails(firstName, lastName, email, phone);
  await registerPage.acceptTerms();
  await registerPage.setPassword(password);
  await registerPage.enterOTP(otp);
  await registerPage.completeRegistration(testInfo);

}
