import { expect, browser } from "@wdio/globals";

describe("Employee Search Functionality", () => {
  beforeEach(async () => {
    await browser.url("http://localhost:5173/");
    await browser.pause(2000);
  });

  //FirstName
  it("should allow searching for an employee by first name", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("علی");
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");
    await expect(tableRows.length).toBeGreaterThan(0);
    for (const row of tableRows) {
      const firstName = await row.$("td:nth-child(1)").getText();
      const lastName = await row.$("td:nth-child(2)").getText();

      const isFirstNameMatch = firstName.includes("علی");
      const isLastNameMatch = lastName.includes("علی");
    }

    await searchInput.setValue(" ");
    await searchInput.clearValue();
    await browser.pause(2000);

    const allTableRows = await $$("table.MainTable tbody tr");
    await expect(allTableRows.length).toBeGreaterThan(0);
  });

  //LastName
  it("should allow searching for an employee by last name", async () => {
    const searchInput = await $("#searchinp");
    const searchItem = "پاکدامن";
    await searchInput.setValue(searchItem);
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");
    for (const row of tableRows) {
      const lastName = await row.$("td:nth-child(2)").getText();
      const isLastNameMatch = lastName.includes(searchItem);
    }

    await searchInput.setValue(" ");
    await searchInput.clearValue();
    await browser.pause(2000);

    const allTableRows = await $$("table.MainTable tbody tr");
    await expect(allTableRows.length).toBeGreaterThan(0);
  });

  //FirstName & LastName
  it("should allow searching for an employee by FirstName And LastName", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("حسین امیری");
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");

    for (const row of tableRows) {
      const fname = await row.$("td:nth-child(1)").getText();
      await expect(fname).toEqual("حسین");
      const lname = await row.$("td:nth-child(2)").getText();
      await expect(lname).toEqual("امیری");
      await browser.pause(2000);
    }
  });

  //Department
  it("should allow searching for an employee by Department", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("مالی");
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");

    for (const row of tableRows) {
      const Department = await row.$("td:nth-child(3)").getText();
      await expect(Department).toEqual("مالی");
      await browser.pause(2000);
    }
  });

  //personne_code
  it("should allow searching for an employee by Personne Code", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("1234567");
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");

    for (const row of tableRows) {
      const personne_code = await row.$("td:nth-child(4)").getText();
      await expect(personne_code).toEqual("1234567");
      await browser.pause(2000);
    }
  });

  //Nid
  it("should allow searching for an employee by national ID", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("1363526499");
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");

    for (const row of tableRows) {
      const nationalId = await row.$("td:nth-child(5)").getText();
      await expect(nationalId).toEqual("1363526499");
      await browser.pause(2000);
    }
  });

  //phone
  it("should allow searching for an employee by Phone Number", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("09308141122");
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");

    for (const row of tableRows) {
      const phone = await row.$("td:nth-child(6)").getText();
      await expect(phone).toEqual("09308141122");
      await browser.pause(2000);
    }
  });

  //education_level
  it("should allow searching for an employee by Education Level", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("لیسانس");
    await browser.pause(2000);

    const tableRows = await $$("table.MainTable tbody tr");

    for (const row of tableRows) {
      const education_level = await row.$("td:nth-child(9)").getText();
      await expect(education_level).toEqual("لیسانس");
      await browser.pause(2000);
    }
  });

  it("should display no results for a non-existent employee", async () => {
    const searchInput = await $("#searchinp");
    await searchInput.setValue("کارمند ناموجود");
    await browser.pause(2000);

    const noResultsText = await $(".mantine-Text-root");
    await expect(noResultsText).toBeExisting();
    await expect(noResultsText).toHaveText("هیچ پرسنلی یافت نشد");
  });
});
