<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('Employee', function (Blueprint $table) {
            $table->id();
            $table->string('FirstName',50)->nullable(false);
            $table->string('LastName',50)->nullable(false);
            $table->string('department',50)->nullable(false);
            $table->string('personnel_code', 25)->unique()->nullable(false);
            $table->string('NationalId', 11)->unique()->nullable(false);   
            $table->string('phone', 15)->unique()->nullable(false);        
            $table->date('hire_date')->nullable(false);
            $table->date('birth_date')->nullable(false);
            $table->enum('education_level', ['middle_school','diploma','associate','bachelor','master','phd'])->nullable(false);
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Employee');
    }
};