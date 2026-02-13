<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('department_epi_items', function (Blueprint $table) {
            $table->string('size')->nullable()->after('quantity');
            $table->unsignedInteger('validity_days')->nullable()->after('size');
            $table->boolean('is_required')->default(false)->after('validity_days');
        });
    }

    public function down(): void
    {
        Schema::table('department_epi_items', function (Blueprint $table) {
            $table->dropColumn(['size', 'validity_days', 'is_required']);
        });
    }
};
