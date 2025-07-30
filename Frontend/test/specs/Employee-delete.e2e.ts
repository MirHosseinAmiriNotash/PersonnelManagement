import { expect, browser } from "@wdio/globals";

describe("Employee Management - Delete Functionality", () => {
  beforeEach(async () => {
    await browser.url("http://localhost:5173/");
    await browser.pause(2000);
  });

  it("should allow to delete an existing employee", async () => {
    const initialCountElement = await $(".personnelCount");
    const initialCountText = await initialCountElement.getText();
    const initialCountString = initialCountText
      .replace("تعداد کل پرسنل:", "")
      .trim();
    const initialCount = parseInt(initialCountString.trim());

    const addButton = await $("#AddEmployeeBtn");
    await addButton.click();
    await browser.pause(2000);

    const pCode = "40010241054049";

    await $("#EmployeeFname").setValue("جواد");
    await $("#EmployeeLname").setValue("واثقی پور");
    await $("#EmployeeDepartment").setValue("فناوری اطلاعات");
    await $("#EmployeePersonnel_code").setValue(pCode);
    await $("#EmployeeNid").setValue("1368057473");
    await $("#EmployeePhoneNumber").setValue("09142970562");

    const selectBox = await $("#EmployeeEducation_level");
    selectBox.click();
    await browser.pause(500);
    const Option = await $(`[value='bachelor']`);
    await Option.waitForExist({ timeout: 5000 });
    await Option.click();

    const hireDateInput = await $("#EmployeeHire_date");
    hireDateInput.click();
    await hireDateInput.clearValue();
    await hireDateInput.setValue("1403-01-10");
    await browser.pause(500);

    const birthDateInput = await $("#EmployeeBirth_date");
    birthDateInput.click();
    await birthDateInput.clearValue();
    await birthDateInput.setValue("1381-11-13");
    await browser.pause(500);

    const saveButton = await $("#saveEmployeeBtn");
    await saveButton.click();
    await browser.pause(2000);

    const successNotification = await $(".mantine-Notifications-notification");
    await expect(successNotification).toBeExisting();
    await expect(successNotification).toBeDisplayed();

    const notifTitle = await $(".mantine-Notification-title");
    await expect(notifTitle).toBeExisting();
    await expect(notifTitle).toHaveText("موفق");
    await browser.pause(2000);

    const personnelCountElement = await $(".personnelCount");
    await expect(personnelCountElement).toBeExisting();
    const fullText = await personnelCountElement.getText();
    const countString = fullText.replace("تعداد کل پرسنل:", "").trim();
    const totalEmployeesCount = parseInt(countString);
    await expect(totalEmployeesCount).toEqual(initialCount + 1);
    await browser.pause(2000);

    // const personnel_code = pCode;

    const deleteButton = await $(
      `//table[contains(@class, 'MainTable')]//tr[td[4][contains(text(), '${pCode}')]]//button[contains(@class, 'DeleteButton')]`
    );

    await expect(deleteButton).toBeExisting();
    await expect(deleteButton).toBeDisplayed();
    await deleteButton.click();
    await browser.pause(1000);

    const deleteModal = await $(".mantine-Modal-content");
    await deleteModal.waitForExist({
      timeout: 10000,
      timeoutMsg: "Delete confirmation modal did not appear.",
    });
    await expect(deleteModal).toBeDisplayed();

    const confirmDeleteButton = await deleteModal.$("button=حذف");
    await confirmDeleteButton.waitForClickable({
      timeout: 5000,
      timeoutMsg: "Confirm delete button in modal is not clickable.",
    });
    await expect(confirmDeleteButton).toBeExisting();
    await expect(confirmDeleteButton).toBeDisplayed();
    await confirmDeleteButton.click();
    await browser.pause(2000);

    const deleteSuccessNotification = await $(
      ".mantine-Notifications-notification"
    );
    await expect(deleteSuccessNotification).toBeExisting();
    await expect(deleteSuccessNotification).toBeDisplayed();

    const notificationTitle = await $(".mantine-Notification-title");
    await expect(notificationTitle).toBeExisting();
    await expect(notificationTitle).toHaveText("عملیات موفق");

    await browser.pause(2000);
    const personnelCountElement2 = await $(".personnelCount");
    await expect(personnelCountElement2).toBeExisting();
    const fullText2 = await personnelCountElement2.getText();
    const countString2 = fullText2.replace("تعداد کل پرسنل:", "").trim();
    const totalEmployeesCount2 = parseInt(countString2);
    await expect(totalEmployeesCount2).toEqual(totalEmployeesCount - 1);
    await browser.pause(2000);
  });
});

// <button
//   class="mantine-focus-auto mantine-active m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root"
//   type="button"
//   style="--button-bg: var(--mantine-color-red-filled); --button-hover: var(--mantine-color-red-filled-hover); --button-color: var(--mantine-color-white); --button-bd: calc(0.0625rem * var(--mantine-scale)) solid transparent;"
// >
//   <span class="m_80f1301b mantine-Button-inner">
//     <span class="m_811560b9 mantine-Button-label">حذف</span>
//   </span>
// </button>;
