<?php

namespace Database\Factories;

use App\Models\Employee; 
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use Faker\Factory as Faker; 

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
      protected function generateRandomNationalId(): string{
        $faker = Faker::create('fa_IR');
 
            return $faker->unique()->numerify('##########');
    
    }
    public function definition(): array
    {

        
        
        $educationLevels = ['middle_school', 'diploma', 'associate', 'bachelor', 'master', 'phd'];

        return [
            'FirstName' =>Faker::create('fa_IR')->firstName(),
            'LastName' => Faker::create('fa_IR')->lastName(),
            'department' => $this->faker->word(),
            'personnel_code' => (string) $this->faker->unique()->randomNumber(5), 
            'NationalId' => $this -> generateRandomNationalId(), 
            'phone' => $this->faker->unique()->numerify('091########'), 
            'hire_date' => Carbon::parse($this->faker->date())->format('Y-m-d'), 
            'birth_date' => Carbon::parse($this->faker->date())->format('Y-m-d'), 
            'education_level' => $this->faker->randomElement($educationLevels), 
        ];
    }
}