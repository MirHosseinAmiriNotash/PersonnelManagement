import { expect, browser } from "@wdio/globals";

describe("Employee Management - Form Validations", () => {
  beforeEach(async () => {
    await browser.url("http://localhost:5173/");
    await browser.pause(2000);
  });
  //Add New Employee with Empty Required Fields
  it("should show validation errors when adding an employee with empty required fields", async () => {
    const initialCountElement = await $(".personnelCount");
    const initialCountText = await initialCountElement.getText();
    const initialCountString = initialCountText
      .replace("تعداد کل پرسنل:", "")
      .trim();
    const initialCount = parseInt(initialCountString.trim());
    const AddBtn = await $("#AddEmployeeBtn");
    AddBtn.click();
    await browser.pause(2000);

    const saveButton = await $("#saveEmployeeBtn");
    await saveButton.click();
    await browser.pause(500);

    const firstNameError = await $("#EmployeeFname-error");

    const lastNameError = await $("#EmployeeLname-error");

    const departmentError = await $("#EmployeeDepartment-error");

    const personnelCodeError = await $("#EmployeePersonnel_code-error");

    const nationalIdError = await $("#EmployeeNid-error");

    const phoneNumberError = await $("#EmployeePhoneNumber-error");

    const hireDateError = await $("#EmployeeHire_date-error");

    const birthDateError = await $("#EmployeeBirth_date-error");

    await expect(firstNameError).toBeExisting();
    await expect(firstNameError).toHaveText("نام نمی‌تواند خالی باشد");

    await expect(lastNameError).toBeExisting();
    await expect(lastNameError).toHaveText("نام خانوادگی نمی‌تواند خالی باشد");

    await expect(departmentError).toBeExisting();
    await expect(departmentError).toHaveText("دپارتمان نمی‌تواند خالی باشد");

    await expect(personnelCodeError).toBeExisting();
    await expect(personnelCodeError).toHaveText(
      "کد پرسنلی باید بیشتر از 5 رقم و کمتر از 25 رقم و فقط عدد باشد"
    );

    await expect(nationalIdError).toBeExisting();
    await expect(nationalIdError).toHaveText("کد ملی را وارد کنید");

    await expect(phoneNumberError).toBeExisting();
    await expect(phoneNumberError).toHaveText(
      "لطفا شماره تلفن معتبر وارد کنید(با 09 شروع شود و 11 رقم باشد)"
    );

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    await $("#EmployeeFname").setValue("علی");

    await saveButton.click();
    await browser.pause(1000);

    await expect(lastNameError).toBeExisting();
    await expect(lastNameError).toHaveText("نام خانوادگی نمی‌تواند خالی باشد");

    await expect(departmentError).toBeExisting();
    await expect(departmentError).toHaveText("دپارتمان نمی‌تواند خالی باشد");

    await expect(personnelCodeError).toBeExisting();
    await expect(personnelCodeError).toHaveText(
      "کد پرسنلی باید بیشتر از 5 رقم و کمتر از 25 رقم و فقط عدد باشد"
    );

    await expect(nationalIdError).toBeExisting();
    await expect(nationalIdError).toHaveText("کد ملی را وارد کنید");

    await expect(phoneNumberError).toBeExisting();
    await expect(phoneNumberError).toHaveText(
      "لطفا شماره تلفن معتبر وارد کنید(با 09 شروع شود و 11 رقم باشد)"
    );

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    await $("#EmployeeLname").setValue("دلنواز");

    await saveButton.click();
    await browser.pause(1000);

    await expect(departmentError).toBeExisting();
    await expect(departmentError).toHaveText("دپارتمان نمی‌تواند خالی باشد");

    await expect(personnelCodeError).toBeExisting();
    await expect(personnelCodeError).toHaveText(
      "کد پرسنلی باید بیشتر از 5 رقم و کمتر از 25 رقم و فقط عدد باشد"
    );

    await expect(nationalIdError).toBeExisting();
    await expect(nationalIdError).toHaveText("کد ملی را وارد کنید");

    await expect(phoneNumberError).toBeExisting();
    await expect(phoneNumberError).toHaveText(
      "لطفا شماره تلفن معتبر وارد کنید(با 09 شروع شود و 11 رقم باشد)"
    );

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    await $("#EmployeeDepartment").setValue("فناوری اطلاعات");

    await saveButton.click();
    await browser.pause(1000);

    await expect(personnelCodeError).toBeExisting();
    await expect(personnelCodeError).toHaveText(
      "کد پرسنلی باید بیشتر از 5 رقم و کمتر از 25 رقم و فقط عدد باشد"
    );

    await expect(nationalIdError).toBeExisting();
    await expect(nationalIdError).toHaveText("کد ملی را وارد کنید");

    await expect(phoneNumberError).toBeExisting();
    await expect(phoneNumberError).toHaveText(
      "لطفا شماره تلفن معتبر وارد کنید(با 09 شروع شود و 11 رقم باشد)"
    );

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    await $("#EmployeePersonnel_code").setValue("40010241054035");

    await saveButton.click();
    await browser.pause(1000);

    await expect(nationalIdError).toBeExisting();
    await expect(nationalIdError).toHaveText("کد ملی را وارد کنید");

    await expect(phoneNumberError).toBeExisting();
    await expect(phoneNumberError).toHaveText(
      "لطفا شماره تلفن معتبر وارد کنید(با 09 شروع شود و 11 رقم باشد)"
    );

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    await $("#EmployeeNid").setValue("1362387625");

    await saveButton.click();
    await browser.pause(1000);

    await expect(phoneNumberError).toBeExisting();
    await expect(phoneNumberError).toHaveText(
      "لطفا شماره تلفن معتبر وارد کنید(با 09 شروع شود و 11 رقم باشد)"
    );

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    await $("#EmployeePhoneNumber").setValue("09147206518");

    await saveButton.click();
    await browser.pause(1000);

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    const selectBox = await $("#EmployeeEducation_level");
    selectBox.click();
    await browser.pause(500);
    const Option = await $(`[value='master']`);
    await Option.waitForExist({ timeout: 5000 });
    await Option.click();

    await saveButton.click();
    await browser.pause(1000);

    await expect(hireDateError).toBeExisting();
    await expect(hireDateError).toHaveText("تاریخ استخدام نمی‌تواند خالی باشد");

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    const hireDateInput = await $("#EmployeeHire_date");
    hireDateInput.click();
    await hireDateInput.clearValue();
    await hireDateInput.setValue("1400-08-10");
    await browser.pause(500);

    await saveButton.click();
    await browser.pause(1000);

    await expect(birthDateError).toBeExisting();
    await expect(birthDateError).toHaveText("تاریخ تولد نمی‌تواند خالی باشد");

    const birthDateInput = await $("#EmployeeBirth_date");
    birthDateInput.click();
    await birthDateInput.clearValue();
    await birthDateInput.setValue("1381-11-15");
    await browser.pause(500);

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

  //Add Employee with Duplicate Data (National ID, Personnel Code, Phone)
  it("should show error notification for duplicate employee data", async () => {
    let EmployeeData = {
      FirstName: "فرزاد",
      LastName: "ناری",
      department: "فناوری اطلاعات",
      personnel_code: "40010241054099",
      NationalId: "1362183679",
      phone: "09305124356",
      hire_date: "1399-06-15",
      birth_date: "1379-02-10",
      education_level: "bachelor",
    };
    const initialCountElement = await $(".personnelCount");
    const initialCountText = await initialCountElement.getText();
    const initialCountString = initialCountText
      .replace("تعداد کل پرسنل:", "")
      .trim();
    const initialCount = parseInt(initialCountString.trim());
    const AddBtn = await $("#AddEmployeeBtn");
    AddBtn.click();
    await browser.pause(2000);

    await $("#EmployeeFname").setValue(EmployeeData.FirstName);
    await $("#EmployeeLname").setValue(EmployeeData.LastName);
    await $("#EmployeeDepartment").setValue(EmployeeData.department);
    const selectBox = await $("#EmployeeEducation_level");
    selectBox.click();
    await browser.pause(500);
    const Option = await $(`[value=${EmployeeData.education_level}]`);
    await Option.waitForExist({ timeout: 5000 });
    await Option.click();
    await browser.pause(500);

    await $("#EmployeePersonnel_code").setValue("40010241054035");
    await $("#EmployeeNid").setValue(EmployeeData.NationalId);
    await $("#EmployeePhoneNumber").setValue(EmployeeData.phone);

    const hireDateInput = await $("#EmployeeHire_date");
    hireDateInput.click();
    await hireDateInput.clearValue();
    await hireDateInput.setValue(EmployeeData.hire_date);
    await browser.pause(500);

    const birthDateInput = await $("#EmployeeBirth_date");
    birthDateInput.click();
    await birthDateInput.clearValue();
    await birthDateInput.setValue(EmployeeData.birth_date);
    await browser.pause(500);

    const saveButton = await $("#saveEmployeeBtn");
    await saveButton.click();
    await browser.pause(2000);

    const personnelCountElement = await $(".personnelCount");
    await expect(personnelCountElement).toBeExisting();
    const fullText = await personnelCountElement.getText();
    const countString = fullText.replace("تعداد کل پرسنل:", "").trim();
    const totalEmployeesCount = parseInt(countString);
    await expect(totalEmployeesCount).toEqual(initialCount);
    await browser.pause(2000);

    const employeeForm = await $("#form");
    await expect(employeeForm).toBeDisplayed();

    const personnel_code = await $("#EmployeePersonnel_code");
    personnel_code.clearValue();
    personnel_code.setValue(EmployeeData.personnel_code);
    await browser.pause(2000);

    const NationalId = await $("#EmployeeNid");
    NationalId.clearValue();
    NationalId.setValue("1363526499");
    await browser.pause(2000);
    await saveButton.click();

    const personnelCountElement2 = await $(".personnelCount");
    await expect(personnelCountElement2).toBeExisting();
    const fullText2 = await personnelCountElement.getText();
    const countString2 = fullText2.replace("تعداد کل پرسنل:", "").trim();
    const totalEmployeesCount2 = parseInt(countString2);
    await expect(totalEmployeesCount2).toEqual(initialCount);
    await browser.pause(2000);
    const employeeFormModal2 = await $("#form");
    await expect(employeeFormModal2).toBeDisplayed();
    await browser.pause(2000);

    NationalId.clearValue();
    NationalId.setValue(EmployeeData.NationalId);
    await browser.pause(2000);

    const phone = await $("#EmployeePhoneNumber");
    phone.clearValue();
    phone.setValue("09308141122");
    await browser.pause(2000);

    await saveButton.click();

    const personnelCountElement3 = await $(".personnelCount");
    await expect(personnelCountElement3).toBeExisting();
    const fullText3 = await personnelCountElement.getText();
    const countString3 = fullText3.replace("تعداد کل پرسنل:", "").trim();
    const totalEmployeesCount3 = parseInt(countString3);
    await expect(totalEmployeesCount3).toEqual(initialCount);
    await browser.pause(2000);
    const employeeFormModal3 = await $("#form");
    await expect(employeeFormModal3).toBeDisplayed();
  });
});
