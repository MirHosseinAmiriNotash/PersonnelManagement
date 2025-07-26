describe("Employee Management", () => {
  beforeEach(async () => {
    await browser.url("http://localhost:5173/");
    await browser.pause(2000);
  });
  it("should allow to edit an existing employee", async () => {
    const initialCountElement = await $(".personnelCount");
    const initialCountText = await initialCountElement.getText();
    const initialCountString = initialCountText
      .replace("تعداد کل پرسنل:", "")
      .trim();
    const initialCount = parseInt(initialCountString.trim());
    const personnel_code = "40010241054035";

    const editButton = await $(
      `//table[contains(@class, 'MainTable')]//tr[td[4][contains(text(), '${personnel_code}')]]//button[contains(@class, 'EditButton')]`
    );

    await editButton.click();
    await browser.pause(2000);

    const fname = await $("#EmployeeFname");
    fname.clearValue();
    fname.setValue("فرزاد");
    await browser.pause(800);

    const lname = await $("#EmployeeLname");
    lname.clearValue();
    lname.setValue("ناری");
    await browser.pause(800);

    const Department = await $("#EmployeeDepartment");
    Department.clearValue();
    Department.setValue("مالی");
    await browser.pause(800);

    const Personnel_code = await $("#EmployeePersonnel_code");
    Personnel_code.clearValue();
    Personnel_code.setValue("40010241054073");
    const changedPid = await $("#EmployeePersonnel_code").getValue();
    await browser.pause(800);

    const Nid = await $("#EmployeeNid");
    Nid.clearValue();
    Nid.setValue("1362381294");
    await browser.pause(800);

    const Phone = await $("#EmployeePhoneNumber");
    Phone.clearValue();
    Phone.setValue("09307205486");
    await browser.pause(800);

    const selectBox = await $("#EmployeeEducation_level");
    selectBox.click();
    await browser.pause(500);
    const Option = await $(`[value='phd']`);
    await Option.waitForExist({ timeout: 5000 });
    await Option.click();
    await browser.pause(800);

    const hireDateInput = await $("#EmployeeHire_date");
    hireDateInput.click();
    await hireDateInput.clearValue();
    await hireDateInput.setValue("1395-03-10");
    await browser.pause(800);

    const birthDateInput = await $("#EmployeeBirth_date");
    birthDateInput.click();
    await birthDateInput.clearValue();
    await birthDateInput.setValue("1382-06-22");
    await browser.pause(800);

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
    await expect(totalEmployeesCount).toEqual(initialCount);

    const value = await $(
      `//table[contains(@class, 'MainTable')]//tr[td[4][contains(text(), '${changedPid}')]]`
    );

    await expect(value).toBeExisting();
    await browser.pause(2000);
  });
});
