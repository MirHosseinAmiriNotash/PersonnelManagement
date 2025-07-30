import { expect, browser } from "@wdio/globals";

describe("Employee Excel Export Functionality", () => {
  beforeEach(async () => {
    await browser.url("http://localhost:5173/");
    await browser.pause(2000); // Wait for the page to load
  });
  it("should successfully initiate an Excel file download", async () => {
    const exportButton = await $("#exportExcelBtn");

    await expect(exportButton).toBeExisting();
    await expect(exportButton).toBeDisplayed();

    await exportButton.click();
    await browser.pause(1000);

    const successNotification = await $(".mantine-Notification-root");
    await successNotification.waitForExist({
      timeout: 10000,
      timeoutMsg: "Expected success notification to exist after 10 seconds",
    });
    await successNotification.waitForDisplayed({
      timeout: 5000,
      timeoutMsg:
        "Expected success notification to be displayed after 5 seconds",
    });

    const notificationMessage = await $(".mantine-Notification-description");
    await expect(notificationMessage).toBeExisting();
    await expect(notificationMessage).toHaveText(
      "خروجی اکسل با موفقیت آماده شد"
    );
    await browser.pause(2000);
  });
});
