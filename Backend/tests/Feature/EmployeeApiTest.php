<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Employee;

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
}