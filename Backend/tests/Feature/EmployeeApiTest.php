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
        
    }
}