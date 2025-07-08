export interface Employee {
  id: number;
  FirstName: string;
  LastName: string;
  department: string;
  personnel_code: string;
  NationalId: string;
  phone: string;
  hire_date: Date; 
  birth_date: Date;
  education_level: 'middle_school' | 'diploma' | 'associate' | 'bachelor' | 'master' | 'phd';
  createdAt?: string;
  updatedAt?: string;
}

