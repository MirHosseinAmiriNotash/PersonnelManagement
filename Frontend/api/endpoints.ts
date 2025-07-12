const API_BASE_URL = "http://127.0.0.1:8000/api/";

const endpoints = {
    search : "Employees/search",
    getAllEmployees_AndStore : "Employees",
    getOneEmpById_UpdateAndDeleteEMP : "Employees/{id}",
    exportExcel : "export-employees"
};

export const getApiUrl = (key : keyof typeof endpoints) => {
    return `${API_BASE_URL}${endpoints[key]}`;
};