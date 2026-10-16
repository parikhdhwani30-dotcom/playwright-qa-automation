import { Page, TestInfo } from "@playwright/test";
import EventRegistrationPage from "../../../pages/CreateEvent/event-registration.page";

export async function eventRegistrationFlow(page: Page, testInfo: TestInfo) {
  const registerPage = new EventRegistrationPage(page);

  await registerPage.navigate();
  await registerPage.announcementpopup();
  await registerPage.openCampsModule();
  await registerPage.selectAthlete();
  await registerPage.completeSteps();
  await registerPage.fillPaymentDetails();
  await registerPage.completePayment(testInfo);

}
