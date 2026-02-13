<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('epi_deliveries', function (Blueprint $table) {
            $table->string('signature_path')->nullable()->after('notes');
            $table->string('signature_signed_name')->nullable()->after('signature_path');
            $table->timestamp('signature_signed_at')->nullable()->after('signature_signed_name');
            $table->foreignId('signature_collected_by')
                ->nullable()
                ->after('signature_signed_at')
                ->constrained('users')
                ->nullOnDelete();
            $table->json('signature_metadata')->nullable()->after('signature_collected_by');
        });
    }

    public function down(): void
    {
        Schema::table('epi_deliveries', function (Blueprint $table) {
            if (Schema::hasColumn('epi_deliveries', 'signature_path')) {
                $table->dropColumn(['signature_path', 'signature_signed_name', 'signature_signed_at', 'signature_metadata']);
            }

            if (Schema::hasColumn('epi_deliveries', 'signature_collected_by')) {
                $table->dropForeign(['signature_collected_by']);
                $table->dropColumn('signature_collected_by');
            }
        });
    }
};
