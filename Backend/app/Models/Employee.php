<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    
    use HasFactory;

    protected $table = 'Employee';
    protected $fillable = [
        'FirstName','LastName','department','personnel_code',
        'NationalId','phone','hire_date','birth_date','education_level'
    ];
}