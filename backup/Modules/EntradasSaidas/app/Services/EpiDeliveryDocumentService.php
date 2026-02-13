<?php

namespace Modules\EntradasSaidas\Services;

use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Modules\Configuracoes\Models\SystemSetting;
use Modules\EntradasSaidas\Models\EpiDelivery;

class EpiDeliveryDocumentService
{
    public function generate(EpiDelivery $delivery): void
    {
        $delivery->loadMissing([
            'employee',
            'employee.position',
            'employee.department',
            'employee.company',
            'items.epi',
        ]);

        $declaration = $this->declarationText();

        $html = view('entradassaidas::pdf.ficha-entrega', [
            'delivery' => $delivery,
            'declaration' => $declaration,
        ])->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('defaultPaper', 'a4');

        $dompdf = new Dompdf($options);
        $dompdf->setPaper('a4');
        $dompdf->loadHtml($html);
        $dompdf->render();

        $nextVersion = $delivery->documents()->max('version') ?? 0;
        $version = $nextVersion + 1;

        $fileName = sprintf('ficha-entrega-v%s.pdf', str_pad((string) $version, 2, '0', STR_PAD_LEFT));
        $storagePath = sprintf('public/deliveries/%d/%s', $delivery->id, $fileName);

        Storage::put($storagePath, $dompdf->output());

        $delivery->documents()->create([
            'type' => 'generated',
            'version' => $version,
            'original_name' => $fileName,
            'mime_type' => 'application/pdf',
            'size' => Storage::size($storagePath),
            'storage_path' => $storagePath,
            'generated_by' => Auth::id(),
        ]);
    }

    public function storeSignedDocument(EpiDelivery $delivery, UploadedFile $file): void
    {
        $nextVersion = $delivery->documents()->max('version') ?? 0;
        $version = $nextVersion + 1;

        $fileName = sprintf('ficha-entrega-assinada-v%s.pdf', str_pad((string) $version, 2, '0', STR_PAD_LEFT));
        $storagePath = $file->storeAs(
            sprintf('public/deliveries/%d', $delivery->id),
            $fileName
        );

        $delivery->documents()->create([
            'type' => 'signed',
            'version' => $version,
            'original_name' => $file->getClientOriginalName() ?: $fileName,
            'mime_type' => 'application/pdf',
            'size' => $file->getSize(),
            'storage_path' => $storagePath,
            'signed_by' => Auth::id(),
        ]);
    }

    protected function declarationText(): string
    {
        $setting = SystemSetting::query()
            ->where('key', 'documents.epi_delivery_declaration')
            ->value('value');

        if ($setting !== null && $setting !== '') {
            return $setting;
        }

        return 'Recebi da empresa, para meu uso obrigatorio, os EPI(s) descritos nesta ficha, os quais me obrigo a utilizar corretamente e a zelar pela conservacao. Estou ciente de que devo devolve-los em perfeito estado quando solicitado ou no ato do meu desligamento.';
    }
}
