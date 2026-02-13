<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->index('company_id', 'employees_company_id_index');
            $table->index('department_id', 'employees_department_id_index');
            $table->index('status', 'employees_status_index');
        });

        Schema::table('epi_deliveries', function (Blueprint $table) {
            $table->index('employee_id', 'epi_deliveries_employee_id_index');
            $table->index('status', 'epi_deliveries_status_index');
        });

        Schema::table('epi_delivery_items', function (Blueprint $table) {
            $table->index('epi_id', 'epi_delivery_items_epi_id_index');
        });

        Schema::table('department_epi_items', function (Blueprint $table) {
            $table->index('department_id', 'dept_epi_items_department_id_index');
            $table->index('epi_id', 'dept_epi_items_epi_id_index');
        });

        Schema::table('employee_termination_reports', function (Blueprint $table) {
            $table->index('employee_id', 'termination_reports_employee_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropIndex('employees_company_id_index');
            $table->dropIndex('employees_department_id_index');
            $table->dropIndex('employees_status_index');
        });

        Schema::table('epi_deliveries', function (Blueprint $table) {
            $table->dropIndex('epi_deliveries_employee_id_index');
            $table->dropIndex('epi_deliveries_status_index');
        });

        Schema::table('epi_delivery_items', function (Blueprint $table) {
            $table->dropIndex('epi_delivery_items_epi_id_index');
        });

        Schema::table('department_epi_items', function (Blueprint $table) {
            $table->dropIndex('dept_epi_items_department_id_index');
            $table->dropIndex('dept_epi_items_epi_id_index');
        });

        Schema::table('employee_termination_reports', function (Blueprint $table) {
            $table->dropIndex('termination_reports_employee_id_index');
        });
    }
};
