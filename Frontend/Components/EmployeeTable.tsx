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
import { openDeleteModal } from "./DeleteConfirmationModal";
import "../Styles/EmployeeTable.css";
import { notifications } from "@mantine/notifications";
import moment from "moment-jalaali";
import { fetchEmployees, deleteEmployee,createEmployee,updateEmployee,exportEmployees} from "../Service/EmployeeService";
import type { Employee } from "../types/employee";
import  EmployeeForm  from "./EmployeeForm";


const educationLevelMap: Record<Employee["education_level"], string> = {
  middle_school: "سیکل",
  diploma: "دیپلم",
  associate: "فوق دیپلم",
  bachelor: "لیسانس",
  master: "فوق لیسانس",
  phd: "دکتری",
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

const handleExportExcel = async () => {
  try {
    const blob = await exportEmployees(); 
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url;
    a.download = 'employees.xlsx';
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
      loadEmployees();
    } catch (error) {
      notifications.show({
        title: "خطا",
        message: "عملیات با خطا مواجه شد",
        color: "red",
      });
    }
  };

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
    await deleteEmployee(id);
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  useEffect(() => {
    loadEmployees();
  }, []);



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
           onClick={() => handleEdit(employee)}
          >
            ویرایش
          </Button>

          <Button variant="outline" color="red" size="xs" onClick={() => openDeleteModal({
            onConfirm : () => handleDelete(employee.id),
            itemName : `${employee.FirstName} ${employee.LastName}`
          })}>
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
          تعداد کل پرسنل: {employees.length}
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
       <div className="main">
      <Title className="titel" order={4} mb="lg">
        لیست پرسنل :
      </Title>
       <Button onClick={handleExportExcel} variant="light" color="green">
            خروجی اکسل
          </Button>
        <Button onClick={handleAddEmployee} variant="light">
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
          <ScrollArea h={400}>
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
