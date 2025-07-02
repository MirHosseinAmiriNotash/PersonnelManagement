<?php

namespace App\Exports;

use App\Models\Employee;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Morilog\Jalali\Jalalian;
use App\Enums\EducationLevelEnum;

class EmployeeExport
{
    public function export()
    {
        $employees = Employee::select(
   'FirstName',
            'LastName',
            'department',
            'personnel_code',
            'NationalId',
            'phone',
            'hire_date',
            'birth_date',
            'education_level'
        )->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        
        $sheet->setCellValue('A1', 'نام');
        $sheet->setCellValue('B1', 'نام خانوادگی');
        $sheet->setCellValue('C1', 'دپارتمان');
        $sheet->setCellValue('D1', 'کد پرسنلی');
        $sheet->setCellValue('E1', 'کد ملی');
        $sheet->setCellValue('F1', 'تلفن');
        $sheet->setCellValue('G1', 'تاریخ استخدام');
        $sheet->setCellValue('H1', 'تاریخ تولد');
        $sheet->setCellValue('I1', 'سطح تحصیلات');

        $row = 2;
        foreach ($employees as $emp) {

       
            $hireDateShamsi = $emp->hire_date ? Jalalian::fromDateTime($emp->hire_date)->format('Y/m/d') : '';
            $birthDateShamsi = $emp->birth_date ? Jalalian::fromDateTime($emp->birth_date)->format('Y/m/d') : '';

            $educationFarsi = '';
            if ($emp->education_level) {
            
                $enum = EducationLevelEnum::tryFrom($emp->education_level);
                $educationFarsi = $enum ? $enum->toFarsi() : $emp->education_level;
            }

           
            $sheet->setCellValue("A{$row}", $emp->FirstName);
            $sheet->setCellValue("B{$row}", $emp->LastName);
            $sheet->setCellValue("C{$row}", $emp->department);
            $sheet->setCellValue("D{$row}", $emp->personnel_code);
            $sheet->setCellValue("E{$row}", $emp->NationalId);
            $sheet->setCellValue("F{$row}", $emp->phone);
            $sheet->setCellValue("G{$row}", $hireDateShamsi);
            $sheet->setCellValue("H{$row}", $birthDateShamsi);
            $sheet->setCellValue("I{$row}", $educationFarsi);

            $row++;
        }

        $writer = new Xlsx($spreadsheet);

        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();

        return $content;
    }
}