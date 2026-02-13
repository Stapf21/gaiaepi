<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_termination_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('terminated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->date('terminated_at');
            $table->json('report');
            $table->unsignedInteger('delivered_items_count')->default(0);
            $table->unsignedInteger('pending_items_count')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_termination_reports');
    }
};
