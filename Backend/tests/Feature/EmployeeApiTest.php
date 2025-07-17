<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Employee;
use Carbon\Carbon;
class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    
    /**
     * Test of successfully receiving a Employee list when there are no employees.
     */
    public function test_employees_can_be_retrieved_when_no_employees_exist(): void {
        $response = $this->getJson('/api/Employees');

        $response->assertStatus(200);
        $response->assertJson([]);
        $response->assertJsonCount(0);
    }
    

     /**
     * Test successful retrieval of personnel list when employees exist.
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
     * Test an employee can be retrieved by their ID.
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
     * Test a 404 is returned when an employee is not found by ID.
     */
    public function test_employee_not_found_returns_404(): void{
        $nonExistentId = 1119999;

        $reponse = $this->getJson("/api/Employees/" . $nonExistentId);

        $reponse->assertStatus(404);
    }

    /**
     * Test a new employee can be created via API.
     */
    public function test_employee_can_be_created(): void {
        $employeeData = [
            'FirstName' => $this->faker->firstName(),
            'LastName' => $this->faker->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5),
            'NationalId' => $this->faker->unique()->numerify('##########'),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' => $this->faker->dateTimeBetween('-5 years','now')->format('Y-m-d'),
            'birth_date' => $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
        ];
        
        $response = $this->postJson('/api/Employees',$employeeData);
        
        $response->assertStatus(201);
        $response->assertJsonFragment([
            'FirstName' => $employeeData['FirstName'],
            'LastName' => $employeeData['LastName'],
            'department' => $employeeData['department'],
            'personnel_code' => $employeeData['personnel_code'],
            'NationalId' => $employeeData['NationalId'],
            'phone' => $employeeData['phone'],
            'hire_date' => $employeeData['hire_date'],
            'birth_date' => $employeeData['birth_date'],
            'education_level' => $employeeData['education_level'],
        ]);

        $this->assertDatabaseHas('Employee',[
            'FirstName' => $employeeData['FirstName'],
            'LastName' => $employeeData['LastName'],
            'department' => $employeeData['department'],
            'personnel_code' => $employeeData['personnel_code'],
            'NationalId' => $employeeData['NationalId'],
            'phone' => $employeeData['phone'],
            'hire_date' => $employeeData['hire_date'],
            'birth_date' => $employeeData['birth_date'],
            'education_level' => $employeeData['education_level'],
        ]);

        $this->assertCount(1,Employee::all());
    }

    
    /**
     * Test employee creation fails with validation errors.
     */
    public function test_employee_creation_fails_with_validation_errors(): void {
        $invalidEmployeeDataMissingFields = [
            'LastName' => $this->faker->lastName(),
        ];

        $response = $this->postJson('/api/Employees', $invalidEmployeeDataMissingFields);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['FirstName']);


        $employeeDataInvalidDateFormat = [
            'FirstName' => $this->faker->firstName(),
            'LastName' => $this->faker->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5),
            'NationalId' => $this->faker->unique()->numerify('##########'),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' => 'invalid-date-format',
            'birth_date' => $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
        ];

        $response = $this->postJson('/api/Employees', $employeeDataInvalidDateFormat);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['hire_date']);


        $existingEmployee = Employee::factory()->create();
        $employeeDataDuplicateUnique =[
            'FirstName' => $this->faker->firstName(),
            'LastName' => $this->faker->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => $existingEmployee->personnel_code,
            'NationalId' => $this->faker->unique()->numerify('##########'),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' => $this->faker->dateTimeBetween('-5 years','now')->format('Y-m-d'),
            'birth_date' => $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
        ];

        $response = $this->postJson('/api/Employees' , $employeeDataDuplicateUnique);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['personnel_code']);

        
        $employeeDataInvalidEducationLevel  =[
            'FirstName' => $this->faker->firstName(),
            'LastName' => $this->faker->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5),
            'NationalId' => $this->faker->unique()->numerify('##########'),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' => $this->faker->dateTimeBetween('-5 years','now')->format('Y-m-d'),
            'birth_date' => $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'education_level' => 'invalid_level',
        ];

        $response = $this->postJson('/api/Employees',$employeeDataInvalidEducationLevel);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['education_level']);

         $invalidData = [
            'FirstName' => str_repeat('a',51),
            'LastName' => $this->faker->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5),
            'NationalId' => $this->faker->unique()->numerify('##########'),
            'phone' => $this->faker->numerify('091########'),
            'hire_date' => $this->faker->dateTimeBetween('-5 years','now')->format('Y-m-d'),
            'birth_date' => $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'education_level' => $this->faker->randomElement(['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd']),
         ];
        $response = $this->postJson('/api/Employees',$invalidData);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['FirstName']);
        
    }

    /**
     * Test an existing employee can be updated via API.
     */

    public function test_employee_can_be_updated(): void {
        $employee = Employee::factory()->create();
        
        $updatedEmployeeData = [
             'FirstName' => 'Updated' . $this->faker->firstName(),
            'LastName' => 'Updated' . $this->faker->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string)$this->faker->unique()->numberBetween(100000, 999999),
            'NationalId' => (string)$this->faker->unique()->numberBetween(1000000000, 9999999999),
            'phone' => '09' . $this->faker->unique()->numberBetween(100000000, 999999999),
            'hire_date' => Carbon::today()->subYears(5)->format('Y-m-d'), 
            'birth_date' => Carbon::today()->subYears(30)->format('Y-m-d'), 
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
            'hire_date' => $updatedEmployeeData['hire_date'],
            'birth_date' => $updatedEmployeeData['birth_date'],
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
     * Test employee update fails with validation errors.
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
     * Test an employee can be deleted via API.
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
     * Test employee deletion fails when employee is not found.
     */
    public function test_employee_deletion_fails_when_not_found(): void{
        
        $this->assertCount(0, Employee::all());
        
        $nonExistentId = 999; 
       
        $response = $this->deleteJson('/api/Employees/' . $nonExistentId);
        $response->assertStatus(404);        
        $response->assertJson(['message' => 'کارمند یافت نشد']);

        $this->assertCount(0, Employee::all());
    }
}