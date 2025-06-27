<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
Route::get('/greet/{name}',function($name){
   return response()->json(['message' => "Hello , $name!"]); 
});

Route::get('/Employees' , [EmployeeController::class, 'index']);
Route::post('/Employees',[EmployeeController::class , 'store']);
Route::get('/Employees/{id}',[EmployeeController::class, 'show']);
Route::put('Employees/{id}', [EmployeeController::class, 'update']);
Route::delete('/Employees/{id}',[EmployeeController::class, 'destroy']);
Route::get('Employees/search/department/{department}',[EmployeeController::class,'searchByDepartment']);