<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Employee;
use Carbon\Carbon;
use Faker\Factory as Faker; 
use Morilog\Jalali\Jalalian;
class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

     protected function generateRandomNationalId(): string{
        $faker = Faker::create('fa_IR');
            return $faker->unique()->numerify('##########');
       
    }
    
    /**
     * Test of successfully receiving a Employee list when there are no employees. -index()
     */
    public function test_employees_can_be_retrieved_when_no_employees_exist(): void {
        $response = $this->getJson('/api/Employees');

        $response->assertStatus(200);
        $response->assertJson([]);
        $response->assertJsonCount(0);
    }
    

     /**
     * Test successful retrieval of personnel list when employees exist. -index()
     */
    public function test_employees_can_be_retrieved_when_employees_exist() {
        Employee::factory()->count(3)->create();

        $response = $this->getJson('/api/Employees');
        
        $response->assertStatus(200);
        $response->assertJsonCount(3);
        
        
        $response->assertJsonFragment([
            'FirstName' => Employee::first()->FirstName,
        ]);
    }

    /**
     * Test an employee can be retrieved by their ID. -show()
     */
    public function test_employee_can_be_retrieved_by_id(): void{
        $employee = Employee::factory()->create(); 

        $response = $this->getJson('/api/Employees/' . $employee->id);

        $response->assertStatus(200);
        
        $response->assertJson([
            'FirstName' => $employee->FirstName,
            'LastName' => $employee->LastName,
            'department' => $employee->department,
            'personnel_code' => $employee->personnel_code,
            'NationalId' => $employee->NationalId,
            'phone' => $employee->phone,
            'hire_date' => Carbon::parse($employee->hire_date)->format('Y-m-d'),
            'birth_date' => Carbon::parse($employee->birth_date)->format('Y-m-d'),
            'education_level' => $employee->education_level,
        ]);
    }

    /**
     * Test a 404 is returned when an employee is not found by ID. -show()
     */
    public function test_employee_not_found_returns_404(): void{
        $nonExistentId = 1119999;

        $reponse = $this->getJson("/api/Employees/" . $nonExistentId);

        $reponse->assertStatus(404);
    }

    /**
     * Test a new employee can be created via API. - store()
     */
    public function test_employee_can_be_created(): void {

        $gregorianHireDate = $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d');
        $gregorianBirthDate = $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d');

        $shamsiHireDate = Jalalian::fromCarbon(Carbon::parse($gregorianHireDate))->format('Y-m-d');
        $shamsiBirthDate = Jalalian::fromCarbon(Carbon::parse($gregorianBirthDate))->format('Y-m-d');
        $employeeData = [
            'FirstName' => Faker::create('fa_IR')->firstName(),
            'LastName' => Faker::create('fa_IR')->lastName(),
            'department' =>  Faker::create('fa_IR')->word(),
            'personnel_code' => (string) Faker::create('fa_IR')->unique()->randomNumber(5),
            'NationalId' => $this -> generateRandomNationalId(),
            'phone' => $this->faker->unique()->numerify('091########'),
            'hire_date' => $shamsiHireDate,
            'birth_date' => $shamsiBirthDate,
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
        ];
        echo $employeeData['FirstName'];
        echo '  '.$employeeData['LastName'];
        echo '  '.$employeeData['department'];
        echo '  '.$employeeData['personnel_code'];
        echo 'NationalId:  '.$employeeData['NationalId'];
        echo 'phone:  '.$employeeData['phone'];
        echo 'hire_date:  '.$employeeData['hire_date'];
        echo 'birth_date:  '.$employeeData['birth_date'];
        echo 'education_level:  '.$employeeData['education_level'];
 
        $response = $this->postJson('/api/Employees',$employeeData);
        
        $response->assertStatus(201);
        $response->assertJsonFragment([
            'FirstName' => $employeeData['FirstName'],
            'LastName' => $employeeData['LastName'],
            'department' => $employeeData['department'],
            'personnel_code' => $employeeData['personnel_code'],
            'NationalId' => $employeeData['NationalId'],
            'phone' => $employeeData['phone'],
            'hire_date' => $shamsiHireDate,
            'birth_date' => $shamsiBirthDate,
            'education_level' => $employeeData['education_level'],
        ]);

        $this->assertDatabaseHas('Employee',[
            'FirstName' => $employeeData['FirstName'],
            'LastName' => $employeeData['LastName'],
            'department' => $employeeData['department'],
            'personnel_code' => $employeeData['personnel_code'],
            'NationalId' => $employeeData['NationalId'],
            'phone' => $employeeData['phone'],
            'hire_date' =>   $gregorianHireDate,
            'birth_date' =>  $gregorianBirthDate,
            'education_level' => $employeeData['education_level'],
        ]);

        $this->assertCount(1,Employee::all());
    }

    
    /**
     * Test employee creation fails with validation errors. - store()
     */
    public function test_employee_creation_fails_with_validation_errors(): void {
        $invalidEmployeeDataMissingFields = [
            'LastName' => Faker::create('fa_IR')->lastName(),
        ];

        $response = $this->postJson('/api/Employees', $invalidEmployeeDataMissingFields);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['FirstName']);


        //Invalid hire_date
        $gregorianBirthDate = $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d');
        $shamsiBirthDate = Jalalian::fromCarbon(Carbon::parse($gregorianBirthDate))->format('Y-m-d');

        $employeeDataInvalidDateFormat = [
            'FirstName' => Faker::create('fa_IR')->firstName(),
            'LastName' => Faker::create('fa_IR')->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5),
            'NationalId' =>  $this -> generateRandomNationalId(),
            'phone' => $this->faker->unique()->numerify('091########'),
            'hire_date' => 'invalid-date-format',
            'birth_date' => $shamsiBirthDate,
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
        ];

        $response = $this->postJson('/api/Employees', $employeeDataInvalidDateFormat);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['hire_date']);



        // duplicate personnel_code
        $gregorianHireDate2 = $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d');
        $gregorianBirthDate2 = $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d');

        $shamsiHireDate2 = Jalalian::fromCarbon(Carbon::parse($gregorianHireDate2))->format('Y-m-d');
        $shamsiBirthDate2 = Jalalian::fromCarbon(Carbon::parse($gregorianBirthDate2))->format('Y-m-d');
        
        $existingEmployee = Employee::factory()->create();
        $employeeDataDuplicateUnique =[
            'FirstName' => Faker::create('fa_IR')->firstName(),
            'LastName' => Faker::create('fa_IR')->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => $existingEmployee->personnel_code,
            'NationalId' => $this -> generateRandomNationalId(),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' => $shamsiHireDate2,
            'birth_date' =>$shamsiBirthDate2,
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
        ]; 

        $response = $this->postJson('/api/Employees' , $employeeDataDuplicateUnique);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['personnel_code']);

        


        $gregorianHireDate3 = $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d');
        $gregorianBirthDate3 = $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d');

        $shamsiHireDate3 = Jalalian::fromCarbon(Carbon::parse($gregorianHireDate3))->format('Y-m-d');
        $shamsiBirthDate3 = Jalalian::fromCarbon(Carbon::parse($gregorianBirthDate3))->format('Y-m-d');
        //invalid education_level
        $employeeDataInvalidEducationLevel  =[
            'FirstName' => Faker::create('fa_IR')->firstName(),
            'LastName' => Faker::create('fa_IR')->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5),
            'NationalId' => $this -> generateRandomNationalId(),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' =>  $shamsiHireDate3,
            'birth_date' =>  $shamsiBirthDate3,
            'education_level' => 'invalid_level',
        ];

        $response = $this->postJson('/api/Employees',$employeeDataInvalidEducationLevel);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['education_level']);




        $gregorianHireDate3 = $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d');
        $gregorianBirthDate3 = $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d');

        $shamsiHireDate3 = Jalalian::fromCarbon(Carbon::parse($gregorianHireDate3))->format('Y-m-d');
        $shamsiBirthDate3 = Jalalian::fromCarbon(Carbon::parse($gregorianBirthDate3))->format('Y-m-d');
        //invalid FirstName
         $invalidData = [
            'FirstName' => str_repeat('a',51),
            'LastName' => Faker::create('fa_IR')->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5),
            'NationalId' => $this -> generateRandomNationalId(),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' => $shamsiHireDate3,
            'birth_date' => $shamsiBirthDate3,
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
         ];
        $response = $this->postJson('/api/Employees',$invalidData);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['FirstName']);
        
    }

    /**
     * Test an existing employee can be updated via API. - update()
     */
    public function test_employee_can_be_updated(): void {
        $employee = Employee::factory()->create();
        
        $gregorianHireDate = $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d');
        $gregorianBirthDate = $this->faker->dateTimeBetween('-30 years', '-18 years')->format('Y-m-d');

        $shamsiHireDate = Jalalian::fromCarbon(Carbon::parse($gregorianHireDate))->format('Y-m-d');
        $shamsiBirthDate = Jalalian::fromCarbon(Carbon::parse($gregorianBirthDate))->format('Y-m-d');

        $updatedEmployeeData = [
             'FirstName' => 'Updated' . Faker::create('fa_IR')->firstName(),
            'LastName' => 'Updated' . Faker::create('fa_IR')->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string)$this->faker->unique()->numberBetween(100000, 999999),
            'NationalId' => (string)$this->faker->unique()->numberBetween(1000000000, 9999999999),
            'phone' => '09' . $this->faker->unique()->numberBetween(100000000, 999999999),
            'hire_date' => $shamsiHireDate,
            'birth_date' => $shamsiBirthDate, 
            'education_level' => $this->faker->randomElement(['bachelor', 'master', 'phd']), 
        ];

        $response = $this -> putJson('/api/Employees/' . $employee->id , $updatedEmployeeData);
        
        $response->assertStatus(200);
            
        $this->assertDatabaseHas('Employee',[
            'id' => $employee -> id,
            'FirstName' => $updatedEmployeeData['FirstName'],
            'LastName' => $updatedEmployeeData['LastName'],
            'department' => $updatedEmployeeData['department'],
            'personnel_code' => $updatedEmployeeData['personnel_code'],
            'phone' => $updatedEmployeeData['phone'],
            'hire_date' => $gregorianHireDate,
            'birth_date' => $gregorianBirthDate,
            'education_level' => $updatedEmployeeData['education_level'],
        ]);


        $response -> assertJsonFragment([
            'FirstName' => $updatedEmployeeData['FirstName'],
            'LastName' => $updatedEmployeeData['LastName'],
            'department' => $updatedEmployeeData['department'],
            'personnel_code' => $updatedEmployeeData['personnel_code'],
            'NationalId' => $updatedEmployeeData['NationalId'],
            'phone' => $updatedEmployeeData['phone'],
            'hire_date' => $updatedEmployeeData['hire_date'],
            'birth_date' => $updatedEmployeeData['birth_date'],
            'education_level' => $updatedEmployeeData['education_level'],
        ]);
        
        
    }

    

    /**
     * Test employee update fails with validation errors. - update()
     */
    public function test_employee_update_fails_with_validation_errors(): void {
        $employee = Employee::factory()->create();
        
        $invalidData1 = [
            'hire_date' => 'not-a-date',
        ];

        $response = $this->putJson('/api/Employees/' . $employee->id, $invalidData1);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['hire_date']);

        
        $invalidData2 = [
            'education_level' => 'unknowen-level'
        ];

        $response = $this->putJson('/api/Employees/' . $employee->id, $invalidData2);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['education_level']);
        
        $anotherEmployee = Employee::factory()->create();
        $duplicateData  = [
            'personnel_code' => $anotherEmployee->personnel_code,
        ];
        
        $response = $this->putJson('/api/Employees/' . $employee->id, $duplicateData);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['personnel_code']);

        $duplicateData = [
            'NationalId' => $anotherEmployee->NationalId,
        ];

        $response = $this->putJson('/api/Employees/' . $employee->id, $duplicateData);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['NationalId']);

        $duplicateData = [
            'phone' => $anotherEmployee->phone, 
        ];
        $response = $this->putJson('/api/Employees/' . $employee->id, $duplicateData);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['phone']);


        $invalidData3 = [
            'FirstName' => str_repeat('a',51),
        ];
        $response = $this->putJson('/api/Employees/' . $employee->id, $invalidData3);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['FirstName']);
        
    }

    

    /**
     * Test an employee can be deleted via API. - destroy()
     */
     public function test_employee_can_be_deleted(): void {
        $employee = Employee::factory()->create();

        $this->assertCount(1, Employee::all());

        $response = $this->deleteJson('/api/Employees/' . $employee->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('Employee',['id' => $employee->id]);
        $this->assertCount(0,Employee::all());
        $response->assertJson(['message' => 'کارمند با موفقیت حذف شد']);
     }

     
     
    /**
     * Test employee deletion fails when employee is not found. - destroy()
     */
    public function test_employee_deletion_fails_when_not_found(): void{
        
        $this->assertCount(0, Employee::all());
        
        $nonExistentId = 999; 
       
        $response = $this->deleteJson('/api/Employees/' . $nonExistentId);
        $response->assertStatus(404);        
        $response->assertJson(['message' => 'کارمند یافت نشد']);

        $this->assertCount(0, Employee::all());
    }


    /**
     * Test employees can be searched by First name. - search()
     */
    public function test_employees_can_be_searched_by_first_name(): void {
        Employee::factory()->create(['FirstName' => 'علی']);
        Employee::factory()->create(['FirstName' => 'حسین']);
        Employee::factory()->create(['FirstName' => 'عطا']);
        Employee::factory()->create(['FirstName' => 'حامد']);
    
        $response = $this -> getJson('/api/Employees/search?query=حسین');
        $response->assertStatus(200);
        
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['FirstName' => 'حسین']);
        $response->assertJsonMissing(['FirstName' => 'علی']);
        $response->assertJsonMissing(['FirstName' => 'عطا']);
        $response->assertJsonMissing(['FirstName' => 'حامد']);

    
    }




    /**
     * Test employees can be searched by Last name. - search()
     */
    public function test_employees_can_be_searched_by_last_name(): void {
        Employee::factory()->create(['LastName' => 'تفکری']);
        Employee::factory()->create(['LastName' => 'امیری نوتاش']);
        Employee::factory()->create(['LastName' => 'فرجی']);
        Employee::factory()->create(['LastName' => 'پاکدامن']);
    
        $response = $this -> getJson('/api/Employees/search?query=فرجی');
        $response->assertStatus(200);
        
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['LastName' => 'فرجی']);
        $response->assertJsonMissing(['LastName' => 'تفکری']);
        $response->assertJsonMissing(['LastName' => 'امیری نوتاش']);
        $response->assertJsonMissing(['LastName' => 'پاکدامن']);

    
    }


    

     /**
     * Test employees can be searched by First name & LastName. - search()
     */
      public function test_employees_can_be_searched_by_first_name_and_last_name():void {
        Employee::factory()->create(['FirstName' => 'میرحسین','LastName' => 'امیری نوتاش']);
        Employee::factory()->create(['FirstName' => 'امیرعطا','LastName' => 'فرجی']);
        Employee::factory()->create(['FirstName' => 'علی','LastName' => 'تفکری']);
        Employee::factory()->create(['FirstName' => 'حامد','LastName' => 'پاکدامن']);

        
        $response = $this -> getJson('/api/Employees/search?query=امیرعطا فرجی');
        $response -> assertStatus(200);

        $response -> assertJsonCount(1);
        $response -> assertJsonFragment(['FirstName' => 'امیرعطا','LastName' => 'فرجی']);
        $response -> assertJsonMissing(['FirstName' => 'میرحسین','LastName' => 'امیری نوتاش']);
        $response -> assertJsonMissing(['FirstName' => 'علی','LastName' => 'تفکری']);
        $response -> assertJsonMissing(['FirstName' => 'حامد','LastName' => 'پاکدامن']);
      }



     /**
     * Test employees can be searched by department. - search()
     */
    public function test_employees_can_be_searched_by_department() {
        Employee::factory()->create(['department' => 'فناوری اطلاعات']);
        Employee::factory()->create(['department' => 'مالی']);
        Employee::factory()->create(['department' => 'خدمات']);
        

        $response = $this -> getJson('/api/Employees/search?query=فناوری اطلاعات');
        $response->assertStatus(200);

        $response->assertJsonCount(1);
        $response->assertJsonFragment(['department' => 'فناوری اطلاعات']);
        $response->assertJsonMissing(['department' => 'مالی']);
        $response->assertJsonMissing(['department' => 'خدمات']);
    }


    /**
     * Test employees can be searched by personnel_code. - search()
     */
    public function test_employees_can_be_searched_by_personnel_code() {
        Employee::factory()->create(['personnel_code' => '40010241054013']);
        Employee::factory()->create(['personnel_code' => '40010241054014']);
        Employee::factory()->create(['personnel_code' => '40010241054015']);
        Employee::factory()->create(['personnel_code' => '40010241054016']);

        $response = $this -> getJson('/api/Employees/search?query= 40010241054013');
        $response->assertStatus(200);
        
        $response -> assertJsonCount(1);
        $response->assertJsonFragment(['personnel_code' => '40010241054013']);
        $response->assertJsonMissing(['personnel_code' => '40010241054014']);
        $response->assertJsonMissing(['personnel_code' => '40010241054015']);
        $response->assertJsonMissing(['personnel_code' => '40010241054016']);

    }


    /**
     * Test employees can be searched by NationalId. - search()
     */
    public function test_employees_can_be_searched_by_NationalId() {
        Employee::factory()->create(['NationalId' => '1363526499']);
        Employee::factory()->create(['NationalId' => '1365343145']);
        Employee::factory()->create(['NationalId' => '1376543876']);
        Employee::factory()->create(['NationalId' => '1379876239']);

        $response = $this -> getJson('/api/Employees/search?query=1376543876');
        $response->assertStatus(200);
        
        $response -> assertJsonCount(1);
        $response->assertJsonFragment(['NationalId' => '1376543876']);
        $response->assertJsonMissing(['NationalId' => '1363526499']);
        $response->assertJsonMissing(['NationalId' => '1365343145']);
        $response->assertJsonMissing(['NationalId' => '1379876239']);
    }



    /**
     * Test employees can be searched by phone. - search()
     */
    public function test_employees_can_be_searched_by_phone() {
        Employee::factory()->create(['phone' => '09308141122']);
        Employee::factory()->create(['phone' => '09145678342']);
        Employee::factory()->create(['phone' => '09145982345']);
        Employee::factory()->create(['phone' => '09302358975']);

        $response = $this -> getJson('/api/Employees/search?query=09308141122');
        $response->assertStatus(200);
        
        $response -> assertJsonCount(1);
        $response->assertJsonFragment(['phone' => '09308141122']);
        $response->assertJsonMissing(['phone' => '09145678342']);
        $response->assertJsonMissing(['phone' => '09145982345']);
        $response->assertJsonMissing(['phone' => '09302358975']);
    }


     /**
     * Test employees can be searched by education_level. - search()
     */
    public function test_employees_can_be_searched_by_education_level() {
        Employee::factory()->create(['education_level' => 'middle_school']);
        Employee::factory()->create(['education_level' => 'diploma']);
        Employee::factory()->create(['education_level' => 'associate']);
        Employee::factory()->create(['education_level' => 'bachelor']);
        Employee::factory()->create(['education_level' => 'master']);
        Employee::factory()->create(['education_level' => 'phd']);


        $response = $this -> getJson('/api/Employees/search?query=لیسانس');
        $response->assertStatus(200);
        
        $response -> assertJsonCount(1);
        $response->assertJsonFragment(['education_level' => 'bachelor',
        'education_level_fa' => 'لیسانس']);
        $response->assertJsonMissing(['education_level' => 'middle_school']);
        $response->assertJsonMissing(['education_level' => 'diploma']);
        $response->assertJsonMissing(['education_level' => 'associate']);
        $response->assertJsonMissing(['education_level' => 'master']);
        $response->assertJsonMissing(['education_level' => 'phd']);
        
    }



    /**
     * Test employees search returns empty when no matching results are found. - search()
     */
    public function test_employees_search_returns_empty_when_no_matches() {
        Employee::factory()->create([
            'FirstName' => 'میرحسین',
            'LastName' => 'امیری نوتاش',
            'department' => 'فناوری اطلاعات',
            'personnel_code' => '40010241054013',
            'NationalId' => '1363526499',
            'phone' => '09308141122',
            'hire_date' => '2020-01-01',
            'birth_date' => '1382-06-27',
            'education_level' => 'master',
        ]);
         Employee::factory()->create([
            'FirstName' => 'امیر عطا',
            'LastName' => 'فرجی',
            'department' => 'فناوری اطلاعات',
            'personnel_code' => '40010241054014',
            'NationalId' => '1363526433',
            'phone' => '09308141133',
            'hire_date' => '2020-01-03',
            'birth_date' => '1380-02-08',
            'education_level' => 'master',
        ]);

        $reponse = $this -> getJson('/api/Employees/search?query=علی');

        $reponse->assertStatus(200);
        $reponse->assertJson([]);
        $reponse->assertJsonCount(0);

    }





    /**
     * Test employees search returns all employees when query is empty or whitespace. - search()
     */
    public function test_employees_search_returns_all_employees_with_empty_query() {
        Employee::factory()->count(5)->create();

        $reponse = $this -> getJson('/api/Employees/search?query=');

        $reponse->assertStatus(200);
        $reponse->assertJsonCount(5);
        

        $response = $this->getJson('/api/Employees/search?query=%20%20%20'); 
        $response->assertStatus(200);
        $response->assertJsonCount(5);

    }



    
    /**
     * Test employees can be exported to Excel. - exportExcel()
     */
     public function test_employees_can_be_exported_to_excel() {
        Employee::factory()->count(3)->create();

        $response = $this -> get('/api/export-employees');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type' , 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->assertHeader('Content-Disposition' , 'attachment; filename="employees.xlsx"');
        $this->assertNotEmpty($response->getContent());
     }

     

     /**
     * test employees export empt when no employees exist. - exportExcel()
     */
     public function test_employees_export_empty_when_no_employees_exist() {
    
        Employee::query()->delete(); 

        $response = $this->get('/api/export-employees');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->assertHeader('Content-Disposition', 'attachment; filename="employees.xlsx"');
   

        $this->assertNotEmpty($response->getContent()); 
   
   
}

    
}