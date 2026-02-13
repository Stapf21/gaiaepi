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
        Schema::create('accidents', function (Blueprint $table) {
            $table->id();
            $table->string('protocol')->nullable()->unique();
            $table->foreignId('accident_type_id')->constrained('accident_types')->cascadeOnDelete();
            $table->date('occurred_at');
            $table->time('occurred_time')->nullable();
            $table->string('location')->nullable();
            $table->enum('severity', ['leve', 'moderado', 'grave', 'fatal'])->default('leve');
            $table->text('description')->nullable();
            $table->text('root_cause')->nullable();
            $table->text('corrective_action')->nullable();
            $table->enum('status', ['aberto', 'em_investigacao', 'encerrado'])->default('aberto');
            $table->foreignId('reported_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};
