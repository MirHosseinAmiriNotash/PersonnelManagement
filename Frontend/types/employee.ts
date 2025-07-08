export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  personnelCode: string;
  nationalId: string;
  phone: string;
  hireDate: Date; 
  birthDate: Date;
  educationLevel: 'middle_school' | 'diploma' | 'associate' | 'bachelor' | 'master' | 'phd';
  createdAt?: string;
  updatedAt?: string;
}