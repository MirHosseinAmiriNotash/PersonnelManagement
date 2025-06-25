<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/greet/{name}',function($name){
   return response()->json(['message' => "Hello , $name!"]); 
});