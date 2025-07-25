import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Group,
  Text,
  Loader,
  Title,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import { openDeleteModal } from "./DeleteConfirmationModal";
import "../Styles/EmployeeTable.css";
import { notifications } from "@mantine/notifications";
import moment from "moment-jalaali";
import {
  fetchEmployees,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  exportEmployees,
  searchEmployees,
} from "../Service/EmployeeService";
import type { Employee } from "../types/employee";
import EmployeeForm from "./EmployeeForm";

const educationLevelMap: Record<Employee["education_level"], string> = {
  middle_school: "سیکل",
  diploma: "دیپلم",
  associate: "فوق دیپلم",
  bachelor: "لیسانس",
  master: "فوق لیسانس",
  phd: "دکترا",
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [searchItem, setSearchItem] = useState<string>("");
  const [totalEmployeesCount, setTotalEmployeesCount] = useState<number>(0);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);

  const handleExportExcel = async () => {
    try {
      const blob = await exportEmployees();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employees.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      notifications.show({
        title: "موفق",
        message: "خروجی اکسل با موفقیت آماده شد",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "خطا",
        message: "خطا در تهیه خروجی اکسل",
        color: "red",
      });
    }
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setShowForm(true);
  };

  const handleFormSubmit = async (values: Omit<Employee, "id">) => {
    try {
      if (currentEmployee) {
        await updateEmployee(currentEmployee.id, values);
        notifications.show({
          title: "موفق",
          message: "اطلاعات کارمند با موفقیت ویرایش شد",
          color: "green",
        });
      } else {
        await createEmployee(values);
        notifications.show({
          title: "موفق",
          message: "کارمند جدید با موفقیت افزوده شد",
          color: "green",
        });
      }
      setShowForm(false);
      await loadEmployees(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.errors &&
          Object.values(error.response.data.errors).flat().join(", ")) ||
        error.message ||
        "عملیات با خطا مواجه شد";
      notifications.show({
        title: "خطا",
        message: errorMessage,
        color: "red",
      });
      console.error("Form submission error:", error);
    }
  };

  const convertPersianToEnglishNumerals = (str: string): string => {
    const persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g,
    ];
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], englishNumbers[i]);
    }
    return str;
  };

  const loadEmployees = useCallback(
    async (updateTotalCount = false) => {
      setLoading(true);
      setError(null);
      try {
        let data: Employee[];
        if (searchItem.trim() !== "") {
          const cleanedSearchTerm = convertPersianToEnglishNumerals(
            searchItem.trim()
          );
          data = await searchEmployees(cleanedSearchTerm);
          setEmployees(data);
        } else {
          data = await fetchEmployees();
          setEmployees(data);

          if (updateTotalCount || !initialLoadDone) {
            setTotalEmployeesCount(data.length);
            if (!initialLoadDone) setInitialLoadDone(true);
          }
        }

        setEmployees(data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("خطا در بارگذاری اطلاعات کارمندان.");
        setTotalEmployeesCount(0);
        notifications.show({
          title: "خطا",
          message: "مشکلی در بارگذاری لیست کارمندان پیش آمد.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [searchItem, initialLoadDone]
  );

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    setEmployees(employees.filter((employee) => employee.id !== id));
    await loadEmployees(true);
  };

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const rows = employees.map((employee) => (
    <Table.Tr key={employee.id}>
      <Table.Td>{employee.FirstName}</Table.Td>
      <Table.Td>{employee.LastName}</Table.Td>
      <Table.Td>{employee.department}</Table.Td>
      <Table.Td>{employee.personnel_code}</Table.Td>
      <Table.Td>{employee.NationalId}</Table.Td>
      <Table.Td>{employee.phone}</Table.Td>
      <Table.Td>{moment(employee.hire_date).format("YYYY/MM/DD")}</Table.Td>
      <Table.Td>{moment(employee.birth_date).format("YYYY/MM/DD")}</Table.Td>
      <Table.Td>{educationLevelMap[employee.education_level]}</Table.Td>
      <Table.Td>
        <Group>
          <Button
            variant="outline"
            size="xs"
            className="EditButton"
            onClick={() => handleEdit(employee)}
          >
            ویرایش
          </Button>

          <Button
            variant="outline"
            color="red"
            size="xs"
            onClick={() =>
              openDeleteModal({
                onConfirm: () => handleDelete(employee.id),
                itemName: `${employee.FirstName} ${employee.LastName}`,
              })
            }
          >
            حذف
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <div className="Header">
        <Title className="AppTitle" order={3} mb="md">
          مدیریت پرسنل
        </Title>
        <span className="personnelCount">
          تعداد کل پرسنل: {totalEmployeesCount}
        </span>
      </div>

      {showForm ? (
        <EmployeeForm
          initialValues={currentEmployee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <TextInput
            id="searchinp"
            placeholder="جستجو"
            value={searchItem}
            onChange={(event) => setSearchItem(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loadEmployees();
              }
            }}
            leftSection={<FiSearch />}
            style={{ width: "50%", marginBottom: "20px", margin: "0px auto" }}
          />
          <div className="main">
            <Title className="titel" order={4} mb="lg">
              لیست پرسنل :
            </Title>
            <Button
              id="exportExcelBtn"
              onClick={handleExportExcel}
              variant="light"
              color="green"
            >
              خروجی اکسل
            </Button>
            <Button
              id="AddEmployeeBtn"
              onClick={handleAddEmployee}
              variant="light"
            >
              افزودن کارمند جدید
            </Button>
          </div>

          {loading ? (
            <Group justify="center">
              <Loader size="lg" />
            </Group>
          ) : error ? (
            <Text c="red">{error}</Text>
          ) : employees.length === 0 ? (
            <Text>هیچ پرسنلی یافت نشد</Text>
          ) : (
            <ScrollArea h={350}>
              <Table
                mx="auto"
                className="MainTable"
                striped
                highlightOnHoverColor="#69808C"
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead className="TableHead">
                  <Table.Tr>
                    <Table.Th className="TableHeader">نام</Table.Th>
                    <Table.Th className="TableHeader">نام خانوادگی</Table.Th>
                    <Table.Th className="TableHeader">دپارتمان</Table.Th>
                    <Table.Th className="TableHeader">کد پرسنلی</Table.Th>
                    <Table.Th className="TableHeader">کدملی</Table.Th>
                    <Table.Th className="TableHeader">تلفن</Table.Th>
                    <Table.Th className="TableHeader">تاریخ استخدام</Table.Th>
                    <Table.Th className="TableHeader">تاریخ تولد</Table.Th>
                    <Table.Th className="TableHeader">سطح تحصیلات</Table.Th>
                    <Table.Th className="TableHeader">عملیات</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="TableBody">{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeList;
