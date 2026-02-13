<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropUnique('employees_registration_number_unique');
            $table->unique(['company_id', 'registration_number'], 'employees_company_registration_unique');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropUnique('employees_company_registration_unique');
            $table->unique('registration_number');
        });
    }
};
