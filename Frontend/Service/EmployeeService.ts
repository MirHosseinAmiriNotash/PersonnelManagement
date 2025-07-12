import { request } from "../api/request";
import { getApiUrl } from "../api/endpoints";
import type { Employee } from "../types/employee";
import instance from "axios";

export const fetchEmployees = async (): Promise<Employee[]> => {
  const data = await request<Employee[]>(
    "get",
    getApiUrl("getAllEmployees_AndStore")
  );
  return data || [];
};

export const createEmployee = async (
  employee: Omit<Employee, "id">
): Promise<Employee | null> => {
  return await request<Employee>(
    "post",
    getApiUrl("getAllEmployees_AndStore"),
    employee
  );
};

export const updateEmployee = async (
  id: number,
  employee: Partial<Employee>
): Promise<Employee | null> => {
  return await request<Employee>(
    "put",
    getApiUrl("getOneEmpById_UpdateAndDeleteEMP").replace(
      "{id}",
      id.toString()
    ),
    employee
  );
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await request(
    "delete",
    getApiUrl("getOneEmpById_UpdateAndDeleteEMP").replace("{id}", id.toString())
  );
};

export const exportEmployees = async (): Promise<Blob> => {
  try {
    const response = await instance.get<Blob>( 
      getApiUrl("exportExcel"),
      { responseType: 'blob' } 
    );
    return response.data; 
  } catch (error) {
    console.error("خطا در تهیه خروجی اکسل:", error);
    throw error;
  }
};
