<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;
use Morilog\Jalali\Jalalian;
class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Employee::create([
            'FirstName' => 'علی',
            'LastName' => 'محمدی',
            'department' => 'فناوری اطلاعات',
            'personnel_code' => '12345',
            'NationalId' => '1234567890',
            'phone' => '09123456789',
            'hire_date' => Jalalian::fromFormat('Y-m-d', '1401-10-11')->toCarbon()->toDateString(), // 2023-01-01
            'birth_date' => Jalalian::fromFormat('Y-m-d', '1368-10-11')->toCarbon()->toDateString(), // 1990-01-01
            'education_level' => 'bachelor'
        ]);

        Employee::create([
            'FirstName' => 'زهرا',
            'LastName' => 'احمدی',
            'department' => 'منابع انسانی',
            'personnel_code' => '67890',
            'NationalId' => '0987654321',
            'phone' => '09129876543',
            'hire_date' => Jalalian::fromFormat('Y-m-d', '1401-03-25')->toCarbon()->toDateString(), // 2022-06-15
            'birth_date' => Jalalian::fromFormat('Y-m-d', '1363-12-20')->toCarbon()->toDateString(), // 1985-03-10
            'education_level' => 'master'
        ]);

        Employee::create([
            'FirstName' => 'محمد',
            'LastName' => 'رضایی',
            'department' => 'مالی',
            'personnel_code' => '11223',
            'NationalId' => '1122334455',
            'phone' => '09121122334',
            'hire_date' => Jalalian::fromFormat('Y-m-d', '1400-06-10')->toCarbon()->toDateString(), // 2021-09-01
            'birth_date' => Jalalian::fromFormat('Y-m-d', '1367-04-30')->toCarbon()->toDateString(), // 1988-07-20
            'education_level' => 'diploma'
        ]);

        Employee::create([
            'FirstName' => 'فاطمه',
            'LastName' => 'کریمی',
            'department' => 'بازاریابی',
            'personnel_code' => '44556',
            'NationalId' => '2233445566',
            'phone' => '09134455667',
            'hire_date' => Jalalian::fromFormat('Y-m-d', '1401-12-10')->toCarbon()->toDateString(), // 2023-03-01
            'birth_date' => Jalalian::fromFormat('Y-m-d', '1371-08-14')->toCarbon()->toDateString(), // 1992-11-05
            'education_level' => 'phd'
        ]);

        Employee::create([
            'FirstName' => 'حسین',
            'LastName' => 'علوی',
            'department' => 'پشتیبانی',
            'personnel_code' => '77889',
            'NationalId' => '3344556677',
            'phone' => '09145566778',
            'hire_date' => Jalalian::fromFormat('Y-m-d', '1399-09-11')->toCarbon()->toDateString(), // 2020-12-01
            'birth_date' => Jalalian::fromFormat('Y-m-d', '1362-01-26')->toCarbon()->toDateString(), // 1983-04-15
            'education_level' => 'associate'
        ]);

        Employee::create([
            'FirstName' => 'رضا',
            'LastName' => 'حسینی',
            'department' => 'خدمات',
            'personnel_code' => '99001',
            'NationalId' => '4455667788',
            'phone' => '09156677889',
            'hire_date' => Jalalian::fromFormat('Y-m-d', '1399-10-12')->toCarbon()->toDateString(), // 2021-01-01
            'birth_date' => Jalalian::fromFormat('Y-m-d', '1359-02-12')->toCarbon()->toDateString(), // 1980-05-01
            'education_level' => 'middle_school' 
        ]);
    }
}