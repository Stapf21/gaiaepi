<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('epi_delivery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->constrained('epi_deliveries')->cascadeOnDelete();
            $table->foreignId('epi_id')->constrained('epis')->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->date('delivered_at')->nullable();
            $table->date('expected_return_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('epi_delivery_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->constrained('epi_deliveries')->cascadeOnDelete();
            $table->enum('type', ['generated', 'signed']);
            $table->unsignedInteger('version')->default(1);
            $table->string('original_name')->nullable();
            $table->string('mime_type')->default('application/pdf');
            $table->unsignedBigInteger('size')->nullable();
            $table->string('storage_path');
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('signed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        if (!DB::table('system_settings')->where('key', 'documents.epi_delivery_declaration')->exists()) {
            DB::table('system_settings')->insert([
                'group' => 'documents',
                'key' => 'documents.epi_delivery_declaration',
                'label' => 'Declaracao da ficha de entrega de EPI',
                'value' => 'Recebi da empresa, para meu uso obrigatorio, os EPI(s) descritos nesta ficha, os quais me obrigo a utilizar corretamente e a zelar pela conservacao. Estou ciente de que devo devolve-los em perfeito estado quando solicitado ou no ato do meu desligamento.',
                'type' => 'text',
                'meta' => json_encode(['multiline' => true]),
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if (Schema::hasColumn('epi_deliveries', 'epi_id')) {
            $existingDeliveries = DB::table('epi_deliveries')
                ->select('id', 'epi_id', 'quantity', 'delivered_at', 'expected_return_at', 'notes')
                ->get();

            foreach ($existingDeliveries as $delivery) {
                if ($delivery->epi_id === null) {
                    continue;
                }

                DB::table('epi_delivery_items')->insert([
                    'delivery_id' => $delivery->id,
                    'epi_id' => $delivery->epi_id,
                    'quantity' => $delivery->quantity ?? 1,
                    'delivered_at' => $delivery->delivered_at,
                    'expected_return_at' => $delivery->expected_return_at,
                    'notes' => $delivery->notes,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            Schema::table('epi_deliveries', function (Blueprint $table) {
                $table->dropConstrainedForeignId('epi_id');
                $table->dropColumn('quantity');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasColumn('epi_deliveries', 'epi_id')) {
            Schema::table('epi_deliveries', function (Blueprint $table) {
                $table->foreignId('epi_id')->nullable()->constrained('epis')->nullOnDelete();
                $table->unsignedInteger('quantity')->default(1);
            });
        }

        Schema::dropIfExists('epi_delivery_documents');
        Schema::dropIfExists('epi_delivery_items');
    }
};
