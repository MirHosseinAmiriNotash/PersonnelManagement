import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Group,
  Text,
  Loader,
  Title,
  ScrollArea,
} from "@mantine/core";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import "../Styles/EmployeeTable.css";
import { notifications } from "@mantine/notifications";
import moment from "moment-jalaali";
import { fetchEmployees, deleteEmployee } from "../Service/EmployeeService";
import type { Employee } from "../types/employee";


const educationLevelMap: Record<Employee["education_level"], string> = {
  middle_school: "راهنمایی",
  diploma: "دیپلم",
  associate: "کاردانی",
  bachelor: "کارشناسی",
  master: "کارشناسی ارشد",
  phd: "دکتری",
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError("خطا در دریافت لیست پرسنل");
      notifications.show({
        title: "خطا",
        message: "نمی‌توان لیست پرسنل را دریافت کرد",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((employee) => employee.id !== id));
      notifications.show({
        title: "موفقیت",
        message: "کارمند با موفقیت حذف شد",
        color: "green",
      });
    } catch (err) {
      throw err; 
    }
  };


  useEffect(() => {
    loadEmployees();
  }, []); 


  const handleEdit = (employee: Employee) => {
 
    notifications.show({
      title: "ویرایش",
      message: `ویرایش کارمند: ${employee.FirstName} ${employee.LastName}`,
      color: "blue",
    });
  };


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
            color="blue"
            size="xs"
            onClick={() => handleEdit(employee)}
          >
            ویرایش
          </Button>
          <DeleteConfirmationModal
            onConfirm={() => handleDelete(employee.id)}
            message={`آیا از حذف ${employee.FirstName} ${employee.LastName} اطمینان دارید؟`}
          >
            {(open) => (
              <Button variant="outline" color="red" size="xs" onClick={open}>
                حذف
              </Button>
            )}
          </DeleteConfirmationModal>
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
          تعداد کل پرسنل: {employees.length}
        </span>
      </div>
      <Title className="titel" order={4} mb="lg">
        لیست پرسنل :
      </Title>
      {loading ? (
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      ) : error ? (
        <Text c="red">{error}</Text>
      ) : employees.length === 0 ? (
        <Text>هیچ پرسنلی یافت نشد</Text>
      ) : (
        <ScrollArea h={500}>
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
                <Table.Th>نام</Table.Th>
                <Table.Th>نام خانوادگی</Table.Th>
                <Table.Th>دپارتمان</Table.Th>
                <Table.Th>کد پرسنلی</Table.Th>
                <Table.Th>کدملی</Table.Th>
                <Table.Th>تلفن</Table.Th>
                <Table.Th>تاریخ استخدام</Table.Th>
                <Table.Th>تاریخ تولد</Table.Th>
                <Table.Th>سطح تحصیلات</Table.Th>
                <Table.Th>عملیات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody className="TableBody">{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
};

export default EmployeeList;
