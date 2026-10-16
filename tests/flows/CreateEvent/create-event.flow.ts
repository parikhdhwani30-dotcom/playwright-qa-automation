import { Page } from "@playwright/test";
import CreateEventPage from "../../../pages/CreateEvent/create-event.page";

export async function createEventFlow(page: Page, testInfo: any) {
  const eventPage = new CreateEventPage(page);

  // Step 1: Go to module
  await eventPage.navigate();
  await eventPage.announcementpopup();
  await eventPage.openCampsModule();

  // Step 2: Fill event info
  await eventPage.fillEventDetails("Sport Event", "This is an automated golf camp event");

  // Step 3: Select timing
  await eventPage.selectEventTimes();

  // Step 4: Add cost
  await eventPage.addEventCost("40");

  // Step 5: Add location info
  await eventPage.fillLocationDetails();

  // Step 6: Save & Preview
  await eventPage.saveAndPreview();

  console.log("✅ Event created successfully!");
}
