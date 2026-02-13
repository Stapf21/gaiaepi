<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('accidents') || !Schema::hasColumn('accidents', 'reported_by')) {
            return;
        }

        Schema::table('accidents', function (Blueprint $table) {
            $table->dropForeign(['reported_by']);
            $table->foreign('reported_by')
                ->references('id')
                ->on('employees')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('accidents') || !Schema::hasColumn('accidents', 'reported_by')) {
            return;
        }

        Schema::table('accidents', function (Blueprint $table) {
            $table->dropForeign(['reported_by']);
            $table->foreign('reported_by')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }
};
