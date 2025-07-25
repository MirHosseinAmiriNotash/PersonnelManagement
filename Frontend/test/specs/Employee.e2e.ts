import { expect, browser } from "@wdio/globals";

describe("Employee Management", () => {
  beforeEach(async () => {
    await browser.url("http://localhost:5173/");
    await browser.pause(2000);
  });

  //Add Employee
  it("should allow to add a new employee with valid data", async () => {
    const initialCountElement = await $(".personnelCount");
    const initialCountText = await initialCountElement.getText();
    const initialCountString = initialCountText
      .replace("تعداد کل پرسنل:", "")
      .trim();
    const initialCount = parseInt(initialCountString.trim());
    const addButton = await $("#AddEmployeeBtn");
    await addButton.click();
    await browser.pause(2000);

    await $("#EmployeeFname").setValue("احسان");
    await $("#EmployeeLname").setValue("علیزاده");
    await $("#EmployeeDepartment").setValue("فناوری اطلاعات");
    await $("#EmployeePersonnel_code").setValue("40010241054056");
    await $("#EmployeeNid").setValue("1363256876");
    await $("#EmployeePhoneNumber").setValue("09148974321");

    const selectBox = await $("#EmployeeEducation_level");
    selectBox.click();
    await browser.pause(500);
    const Option = await $(`[value='phd']`);
    await Option.waitForExist({ timeout: 5000 });
    await Option.click();

    const hireDateInput = await $("#EmployeeHire_date");
    hireDateInput.click();
    await hireDateInput.clearValue();
    await hireDateInput.setValue("1402-05-10");
    await browser.pause(500);

    const birthDateInput = await $("#EmployeeBirth_date");
    birthDateInput.click();
    await birthDateInput.clearValue();
    await birthDateInput.setValue("1378-05-20");
    await browser.pause(500);

    const saveButton = await $("#saveEmployeeBtn");
    await saveButton.click();
    await browser.pause(2000);

    const successNotification = await $(".mantine-Notifications-notification");
    await expect(successNotification).toBeExisting();
    await expect(successNotification).toBeDisplayed();

    const notificationTitle = await $(".mantine-Notification-title");
    await expect(notificationTitle).toBeExisting();
    await expect(notificationTitle).toHaveText("موفق");
    await browser.pause(2000);

    const personnelCountElement = await $(".personnelCount");
    await expect(personnelCountElement).toBeExisting();
    const fullText = await personnelCountElement.getText();
    const countString = fullText.replace("تعداد کل پرسنل:", "").trim();
    const totalEmployeesCount = parseInt(countString);
    await expect(totalEmployeesCount).toEqual(initialCount + 1);
    await browser.pause(2000);
  });
});
