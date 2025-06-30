<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Morilog\Jalali\Jalalian;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class EmployeeController extends Controller{


    /**
     * Normalize string by trimming and replacing multiple spaces with a single space
     */

     private function normalizeString($string){
        if(is_null($string) || !is_string($string)){
            return $string;
        }
        return preg_replace('/\s+/',' ',trim($string));
     }
    /**
     * return All Employees
     */
    public function index(){
        $employees = Employee::all()->map(function($employee){
           $employee->hire_date = Jalalian::fromCarbon(Carbon::parse($employee->hire_date))->format('Y-m-d');
           $employee->birth_date = Jalalian::fromCarbon(Carbon::parse($employee->birth_date))->format('Y-m-d');
           return $employee;
        });
        return response()->json($employees);
    }

    /**
     * Create a new employee
     */
    public function store(Request $request){
      $data =  $request->validate([
            'FirstName' => 'required|string|max:50',
            'LastName' => 'required|string|max:50',
            'department' => 'required|string|max:50',
            'personnel_code' => 'required|string|max:25|unique:Employee,personnel_code',
            'NationalId' => 'required|string|min:10|max:11|unique:Employee,NationalId',
            'phone' => 'required|string|min:11|max:15|unique:Employee,phone',
            'hire_date' => 'required|date_format:Y-m-d', 
            'birth_date' => 'required|date_format:Y-m-d',
            'education_level' => ['required', Rule::in(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd'])],
            
      ], [
            'FirstName.required' => 'نام الزامی است',
                    'FirstName.max' => 'نام نباید بیشتر از 5 کاراکتر باشد',
                    'LastName.required' => 'نام خانوادگی الزامی است',
                    'LastName.max' => 'نام خانوادگی نباید بیش از ۵۰ کاراکتر باشد',
                    'department.required' => 'دپارتمان الزامی است',
                    'department.max' => 'دپارتمان نباید بیش از ۵۰ کاراکتر باشد',
                    'personnel_code.required' => 'کد پرسنلی الزامی است',
                    'personnel_code.max' => 'کد پرسنلی نباید بیش از ۲۵ کاراکتر باشد',
                    'personnel_code.unique' => 'کد پرسنلی قبلاً استفاده شده است',
                    'NationalId.required' => 'کدملی الزامی است',
                    'NationalId.min' => 'کدملی باید حداقل ۱۰ رقم باشد',
                    'NationalId.max' => 'کدملی نباید بیش از ۱۱ رقم باشد',
                    'NationalId.unique' => 'کدملی قبلاً استفاده شده است',
                    'phone.required' => 'شماره تلفن الزامی است',
                    'phone.min' => 'شماره تلفن نبایدحداقل باید 11 رقم باشد',
                    'phone.max' => 'شماره تلفن نباید بیش از ۱۵ رقم باشد',
                    'phone.unique' => 'شماره تلفن قبلاً استفاده شده است',
                    'hire_date.required' => 'تاریخ استخدام الزامی است',
                    'hire_date.date_format' => 'فرمت تاریخ استخدام باید YYYY-MM-DD باشد',
                    'birth_date.required' => 'تاریخ تولد الزامی است',
                    'birth_date.date_format' => 'فرمت تاریخ تولد باید YYYY-MM-DD باشد',
                    'education_level.required' => 'سطح تحصیلات الزامی است',
                    'education_level.in' => 'سطح تحصیلات باید یکی از مقادیر مجاز باشد',
                ]);

                $data['FirstName'] = $this->normalizeString($data['FirstName']);
                $data['LastName'] = $this->normalizeString($data['LastName']);
                $data['department'] = $this->normalizeString($data['department']);

                $data['hire_date'] = Jalalian::fromformat('Y-m-d', $data['hire_date'])->toCarbon()
                ->toDateString();
                $data['birth_date'] = Jalalian::fromFormat('Y-m-d',$data['birth_date'])->toCarbon()
                ->toDateString();

                $employee = Employee::create($data);

                $employee->hire_date = Jalalian::fromCarbon(Carbon::parse($employee->hire_date))->format('Y-m-d');
                $employee->birth_date = Jalalian::fromCarbon(Carbon::parse($employee->birth_date))->format('Y-m-d');

                return response()->json([
                    'message' => 'اطلاعات کارمند با موفقیت ثبت شد',
                    'Employee' => $employee
                ],201);

     }

    /**
     * Show a specific employee
     */
    public function show($id){
        $employee = Employee::find($id);
        if($employee){
            $employee->hire_date = Jalalian::fromCarbon(Carbon::parse($employee->hire_date))->format('Y-m-d');
            $employee->birth_date = Jalalian::fromCarbon(Carbon::parse($employee->birth_date))->format('Y-m-d');
            return response()->json($employee);
        }   
        return response()->json(['message' => 'کارمند یافت نشد'],404);   
    }

    /**
     * Update an employee
     */
    public function update(Request $request, $id){
         $employee = Employee::find($id);
        if ($employee) {
            $data = $request->validate([
                'FirstName' => 'sometimes|required|string|max:50',
                'LastName' => 'sometimes|required|string|max:50',
                'department' => 'sometimes|required|string|max:50',
                'personnel_code' => 'sometimes|required|string|max:25|unique:Employee,personnel_code,' . $id,
                'NationalId' => 'sometimes|required|string|min:10|max:11|unique:Employee,NationalId,' .$id,
                'phone' => 'sometimes|required|string|min:11|max:15|unique:Employee,phone,' . $id,
                'hire_date' => 'sometimes|required|date_format:Y-m-d',
                'birth_date' => 'sometimes|required|date_format:Y-m-d',
                'education_level' => ['sometimes', 'required', Rule::in(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd'])],
            ], [
                'FirstName.required' => 'نام الزامی است',
                'FirstName.max' => 'نام نباید بیش از ۵۰ کاراکتر باشد',
                'LastName.required' => 'نام خانوادگی الزامی است',
                'LastName.max' => 'نام خانوادگی نباید بیش از ۵۰ کاراکتر باشد',
                'department.required' => 'دپارتمان الزامی است',
                'department.max' => 'دپارتمان نباید بیش از ۵۰ کاراکتر باشد',
                'personnel_code.required' => 'کد پرسنلی الزامی است',
                'personnel_code.max' => 'کد پرسنلی نباید بیش از ۲۵ کاراکتر باشد',
                'personnel_code.unique' => 'کد پرسنلی قبلاً استفاده شده است',
                'NationalId.required' => 'کدملی الزامی است',
                'NationalId.min' => 'کدملی باید حداقل ۱۰ رقم باشد',
                'NationalId.max' => 'کدملی نباید بیش از ۱۱ رقم باشد',
                'NationalId.unique' => 'کدملی قبلاً استفاده شده است',
                'phone.required' => 'شماره تلفن الزامی است',
                'phone.min' => 'شماره تلفن نبایدحداقل باید 11 رقم باشد',
                'phone.max' => 'شماره تلفن نباید بیش از ۱۵ کاراکتر باشد',
                'phone.unique' => 'شماره تلفن قبلاً استفاده شده است',
                'hire_date.required' => 'تاریخ استخدام الزامی است',
                'hire_date.date_format' => 'فرمت تاریخ استخدام باید YYYY-MM-DD باشد',
                'birth_date.required' => 'تاریخ تولد الزامی است',
                'birth_date.date_format' => 'فرمت تاریخ تولد باید YYYY-MM-DD باشد',
                'education_level.required' => 'سطح تحصیلات الزامی است',
                'education_level.in' => 'سطح تحصیلات باید یکی از مقادیر مجاز باشد',
            ]);

            if(isset($data['FirstName'])){
                $data['FirstName'] = $this->normalizeString($data['FirstName']);
            }
            if(isset($data['LastName'])){
                $data['LastName'] = $this->normalizeString($data['LastName']);
            }
            if(isset($data['department'])){
                $data['department'] = $this->normalizeString($data['department']);
            }

            
            if (isset($data['hire_date'])) {
                $data['hire_date'] = Jalalian::fromFormat('Y-m-d', $data['hire_date'])->toCarbon()->toDateString();
            }
            if (isset($data['birth_date'])) {
                $data['birth_date'] = Jalalian::fromFormat('Y-m-d', $data['birth_date'])->toCarbon()->toDateString();
            }

            $employee->update($data);

            $responseEmployee = $employee->fresh(); 
            $responseEmployee->hire_date = Jalalian::fromCarbon(Carbon::parse($responseEmployee->hire_date))->format('Y-m-d');
            $responseEmployee->birth_date = Jalalian::fromCarbon(Carbon::parse($responseEmployee->birth_date))->format('Y-m-d');
            
            return response()->json(data: [
                'message' => 'کارمند با موفقیت به روزرسانی شد',
                'employee'=> $responseEmployee 
            ]);
                
     
        }
        
    return response()->json(['message' => 'کارمند یافت نشد'],404);
}

    /**
     * Delete an employee
     */
    public function destroy($id){
        $employee = Employee::find($id);
        if($employee){
            $employee->delete();
            return response()->json([
                'message' => 'کارمند با موفقیت حذف شد',
                'employee' => $employee ]);
        }
        return response()->json(['message'=>'کارمند یافت نشد'],404);
    }


    public function searchByDepartment($department){
        $normalizedDepartment = $this->normalizeString($department);
        $employees = Employee::whereRaw("REGEXP_REPLACE(department,'\s+', ' ') LIKE ?",['%' . $normalizedDepartment . '%'])
        ->get()
        ->map(function($employee){
                $employee->hire_date = Jalalian::fromCarbon(Carbon::parse
                ($employee->hire_date))->format('Y-m-d');
                $employee->birth_date = Jalalian::fromCarbon(Carbon::parse
                ($employee->birth_date))->format('Y-m-d');
                return $employee;
            });
            return response()->json($employees);
    }

}