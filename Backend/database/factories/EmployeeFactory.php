<?php

namespace Database\Factories;

use App\Models\Employee; 
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
// use Morilog\Jalali\Jalalian; 

class EmployeeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        
        $educationLevels = ['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd'];

        return [
            'FirstName' => $this->faker->firstName(),
            'LastName' => $this->faker->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => $this->faker->unique()->randomNumber(5), 
            'NationalId' => $this->faker->unique()->numerify('##########'), 
            'phone' => $this->faker->numerify('091########'), 
            'hire_date' => Carbon::parse($this->faker->date())->format('Y-m-d'), 
            'birth_date' => Carbon::parse($this->faker->date())->format('Y-m-d'), 
            'education_level' => $this->faker->randomElement($educationLevels), 
        ];
    }
}