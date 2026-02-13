<?php

namespace Modules\EntradasSaidas\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Modules\EntradasSaidas\Http\Requests\StoreDeliveryDocumentRequest;
use Modules\EntradasSaidas\Models\EpiDelivery;
use Modules\EntradasSaidas\Models\EpiDeliveryDocument;
use Modules\EntradasSaidas\Services\EpiDeliveryDocumentService;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DeliveryDocumentController extends Controller
{
    public function show(EpiDelivery $entradassaida, EpiDeliveryDocument $document): BinaryFileResponse
    {
        $delivery = $entradassaida;
        abort_unless($document->delivery_id === $delivery->id, 404);

        if (!Storage::exists($document->storage_path)) {
            abort(404, 'Documento nao encontrado.');
        }

        $fileName = $document->original_name ?? basename($document->storage_path);

        return response()->file(Storage::path($document->storage_path), [
            'Content-Type' => $document->mime_type ?? 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$fileName.'"',
        ]);
    }

    public function store(
        StoreDeliveryDocumentRequest $request,
        EpiDelivery $entradassaida,
        EpiDeliveryDocumentService $service
    ): RedirectResponse {
        $delivery = $entradassaida;
        $service->storeSignedDocument($delivery, $request->file('document'));

        return redirect()
            ->route('entradassaidas.show', $delivery)
            ->with('success', 'Documento assinado enviado com sucesso.');
    }

    public function update(
        StoreDeliveryDocumentRequest $request,
        EpiDelivery $entradassaida,
        EpiDeliveryDocument $document
    ): RedirectResponse {
        $delivery = $entradassaida;
        abort_unless($document->delivery_id === $delivery->id, 404);

        if ($document->type !== 'signed') {
            return redirect()
                ->route('entradassaidas.show', $delivery)
                ->with('error', 'Somente documentos assinados podem ser atualizados.');
        }

        if (Storage::exists($document->storage_path)) {
            Storage::delete($document->storage_path);
        }

        $file = $request->file('document');
        $fileName = sprintf(
            'ficha-entrega-assinada-v%s.pdf',
            str_pad((string) $document->version, 2, '0', STR_PAD_LEFT)
        );

        $storagePath = $file->storeAs(
            sprintf('public/deliveries/%d', $delivery->id),
            $fileName
        );

        $document->update([
            'original_name' => $file->getClientOriginalName() ?: $fileName,
            'mime_type' => 'application/pdf',
            'size' => $file->getSize(),
            'storage_path' => $storagePath,
            'signed_by' => Auth::id(),
        ]);

        return redirect()
            ->route('entradassaidas.show', $delivery)
            ->with('success', 'Documento atualizado com sucesso.');
    }

    public function destroy(EpiDelivery $entradassaida, EpiDeliveryDocument $document): RedirectResponse
    {
        $delivery = $entradassaida;
        abort_unless($document->delivery_id === $delivery->id, 404);

        if ($document->type === 'generated') {
            return redirect()
                ->route('entradassaidas.show', $delivery)
                ->with('error', 'Nao e permitido excluir o documento gerado automaticamente.');
        }

        if (Storage::exists($document->storage_path)) {
            Storage::delete($document->storage_path);
        }

        $document->delete();

        return redirect()
            ->route('entradassaidas.show', $delivery)
            ->with('success', 'Documento excluido com sucesso.');
    }
}
